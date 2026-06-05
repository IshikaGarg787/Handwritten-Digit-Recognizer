from flask import Flask, request, jsonify

from flask_cors import CORS

import numpy as np

from PIL import Image

from tensorflow.keras.models import load_model


app = Flask(__name__)

CORS(app)


# Load trained CNN model
model = load_model('../../model/digit_recognizer_cnn.h5')


@app.route('/')
def home():
    return "Digit Recognizer Backend Running!"


@app.route('/predict', methods=['POST'])
def predict():

    file = request.files['image']

    
    # Open image
    image = Image.open(file).convert('L')

    
    # Resize image to 28x28
    image = image.resize((28,28))

    
    # Convert image to numpy array
    image = np.array(image)

    
    # Normalize
    image = image / 255.0

    
    # Reshape for CNN
    image = image.reshape(1,28,28,1)

    
    # Prediction
    prediction = model.predict(image)

    # Predicted digit
    digit = np.argmax(prediction)

    # Confidence score
    confidence = float(np.max(prediction)) * 100


    return jsonify({
        'prediction': int(digit),
        'confidence': round(confidence,2)
    })


if __name__ == '__main__':
    app.run(debug=True)