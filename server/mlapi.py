from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import tensorflow as tf
from PIL import Image
import numpy as np
import io

app = FastAPI()

class PatientInfo(BaseModel):
    image: str

# Habilitando CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carregando o modelo de detecção de câncer apenas uma vez ao iniciar a aplicação
model = tf.keras.models.load_model("./model/modelo_treinado.keras")

# Função para processar a imagem
def process_image(image_data):
    try:
        img = Image.open(io.BytesIO(image_data))
        img = img.resize((224, 224))  # Redimensionando a imagem para as dimensões esperadas pelo modelo
        img_array = np.array(img)
        img_array = img_array / 255.0  # Normalizando os valores de pixel entre 0 e 1
        img_input = np.expand_dims(img_array, axis=0)  # Adicionando uma dimensão extra para o batch
        return img_input
    except Exception as e:
        print(f"Erro ao processar a imagem: {e}")
        return None

@app.post('/predict')
async def predict_retino(patient_info: PatientInfo):
    image_data = patient_info.image.encode()
    processed_image = process_image(image_data)

    if processed_image is None:
        return JSONResponse(content={"error": "Imagem inválida"}, status_code=400)

    try:
        prediction = model.predict(processed_image)
        return {"prediction": int(prediction[0])}
    except Exception as e:
        return JSONResponse(content={"error": f"Erro durante a predição: {e}"}, status_code=500)

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    processed_image = process_image(contents)
    if processed_image is None:
        return JSONResponse(content={"error": "Imagem inválida"}, status_code=400)

    try:
        prediction = model.predict(processed_image)
        return {"prediction": int(prediction[0])}
    except Exception as e:
        return JSONResponse(content={"error": f"Erro durante a predição: {e}"}, status_code=500)

@app.get('/')
def index():
    return {'message': 'Amenelibockura'} 
