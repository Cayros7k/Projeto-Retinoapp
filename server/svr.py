from flask import Flask, request, jsonify
import os
from keras.preprocessing import image
import numpy as np
import tensorflow as tf

# Cria uma instância da aplicação Flask.
app = Flask(__name__)

# Define a rota ("/") que retorna uma mensagem JSON dizendo "Hello from backend".
@app.route("/")
def home():
    return {"message": "Hello from backend"}

# Carrega o modelo treinado a partir do diretório especificado.
model = tf.keras.models.load_model("./model/modelo_treinado.keras")

# Define a altura e largura das imagens que serão processadas.
img_height = 180
img_width = 180

# Define o diretório onde as imagens enviadas serão salvas.
target_img = os.path.join(os.getcwd(), 'images')

# Cria o diretório para salvar as imagens caso ele não exista.
if not os.path.exists(target_img):
    os.makedirs(target_img)

# Permite arquivos com extensão png, jpg e jpeg
ALLOWED_EXT = set(['jpg', 'jpeg', 'png'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXT

# Função para carregar e preparar a imagem no formato correto
def read_image(filename):
    img = image.load_img(filename, target_size=(img_height, img_width))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    return x

# Função para calcular a softmax das predições, transformando-as em probabilidades.
def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=1, keepdims=True)


@app.route('/predict', methods=['POST'])
def predict():

    # Se a requisição for POST, verifica se um arquivo foi enviado e se possui uma extensão permitida.
    if request.method == 'POST':
        file = request.files['image']
        if file and allowed_file(file.filename):
            filename = file.filename
            file_path = os.path.join(target_img, filename)

            # Salva o arquivo no diretório especificado.
            file.save(file_path)

            # Lê a imagem e faz a predição
            img = read_image(file_path)
            predictions = model.predict(img)

            # Calcula a softmax das predições.
            predictions = softmax(predictions)

            # Obtém o índice da classe com a maior probabilidade.
            class_index = np.argmax(predictions, axis=1)[0]

            # Define os nomes das classes.
            class_names = ['Leucocoria', 'Normal']
            predicted_class = class_names[class_index]

             # Obtém a confiança da classe prevista.
            confidence = predictions[0][class_index] * 10

            # Remove a imagem salva no servidor após a predição.
            os.remove(file_path)

            # Retorna a classe prevista, a confiança da predição e o caminho da imagem como uma resposta JSON.
            return jsonify({
                "predicted_class": predicted_class,
                "confidence": f"{confidence * 10:.2f}%",
                "user_image": file_path
            })
        # Retorna um erro caso o arquivo não possa ser lido ou a extensão não seja permitida.
        else:
            return jsonify({"error": "Unable to read the file. Please check file extension"})

# Inicia a aplicação Flask em modo debug na porta 8000.
if __name__ == '__main__':
    app.run(debug=True, use_reloader=False, port=8000)
