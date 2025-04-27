from flask import Flask, request, jsonify, render_template
import os, joblib

app = Flask(__name__)
model = joblib.load(os.path.join(os.path.dirname(__file__), '..', 'weather_model.pkl'))

# Route to render the index.html form
@app.route('/')
def index():
    return render_template('index.html')

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
