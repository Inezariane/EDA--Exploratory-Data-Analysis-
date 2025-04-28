from flask import Flask, request, jsonify
import os, joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

model = joblib.load(os.path.join(os.path.dirname(__file__), '..', 'weather_model.pkl'))

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    input_features = [
        data['temp_max'],
        data['temp_min'],
        data['precipitation'],
        data['wind']
    ]
    
    prediction = model.predict([input_features])
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
