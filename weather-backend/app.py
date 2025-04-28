from flask import Flask, request, jsonify, send_from_directory
import os, joblib
from flask_cors import CORS
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import uuid

app = Flask(__name__)
CORS(app)

# Load the model
model = joblib.load(os.path.join(os.path.dirname(__file__), 'models', 'weather_model.pkl'))

# Load dataset once
dataset_path = os.path.join(os.path.dirname(__file__), 'data', 'seattle-weather.csv')
df = pd.read_csv(dataset_path)

# Convert 'date' column to datetime if exists
if 'date' in df.columns:
    df['date'] = pd.to_datetime(df['date'])

# Folder to save plots
PLOTS_FOLDER = os.path.join(os.path.dirname(__file__), 'plots')
os.makedirs(PLOTS_FOLDER, exist_ok=True)

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

@app.route('/generate-graph', methods=['POST'])
def generate_graph():
    data = request.get_json()
    feature = data['feature']   
    plot_type = data.get('plot_type', 'box')  # box or hist
    group_by_month = data.get('group_by_month', False)  # NEW

    plt.figure(figsize=(10, 6))

    plot_df = df.copy()

    if group_by_month and 'date' in plot_df.columns:
        plot_df['month'] = plot_df['date'].dt.month_name()

    if group_by_month and 'month' in plot_df.columns:
        if plot_type == 'box':
            sns.boxplot(x='month', y=feature, data=plot_df, order=[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ])
            
        elif plot_type == 'hist':
            sns.histplot(data=plot_df, x='month', hue=feature, multiple='stack', bins=12)
        else:
            return jsonify({'error': 'Invalid plot type'}), 400
    else:
        if plot_type == 'box':
            sns.boxplot(x='weather', y=feature, data=plot_df, order=[
                'drizzle', 'rain', 'sun', 'snow', 'fog'
            ])
        elif plot_type == 'hist':
            sns.histplot(plot_df[feature], kde=True)
        else:
            return jsonify({'error': 'Invalid plot type'}), 400

    plt.title(f"{feature.capitalize()} {'Grouped by Month' if group_by_month else 'Distribution'}")
    plt.xticks(rotation=45)
    plt.tight_layout()

    # Unique filename
    filename = f"{uuid.uuid4().hex}.png"
    filepath = os.path.join(PLOTS_FOLDER, filename)
    plt.savefig(filepath)
    plt.close()

    return jsonify({'filename': filename})

@app.route('/graphs/<filename>')
def get_graph(filename):
    return send_from_directory(PLOTS_FOLDER, filename)

@app.route('/delete-graph/<filename>', methods=['DELETE'])
def delete_graph(filename):
    file_path = os.path.join(PLOTS_FOLDER, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        return jsonify({"message": "File deleted successfully."}), 200
    else:
        return jsonify({"message": "File not found."}), 404

if __name__ == '__main__':
    app.run(debug=True)
