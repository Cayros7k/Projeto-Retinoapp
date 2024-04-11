from flask import Flask, request, jsonify
import os
from keras.preprocessing import image
import numpy as np
import tensorflow as tf

app = Flask(__name__)

@app.route("/")
def home():
    return {"message": "Hello from backend"}

model = tf.keras.models.load_model("./model/modelo_treinado.keras")

img_height = 180
img_width = 180

target_img = os.path.join(os.getcwd(), 'images')

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

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = file.filename
            file_path = os.path.join(target_img, filename)
            file.save(file_path)
            img = read_image(file_path)
            predictions = model.predict(img)
            class_index = np.argmax(predictions, axis=1)[0]
            class_names = ['leuko', 'normal']  # Substitua pelos seus nomes de classe
            predicted_class = class_names[class_index]
            confidence = predictions[0][class_index]
            os.remove(file_path)
            return jsonify({
                "predicted_class": predicted_class,
                "confidence": float(confidence),
                "user_image": file_path
            })
        else:
            return jsonify({"error": "Unable to read the file. Please check file extension"})

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False, port=8000)
