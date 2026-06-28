from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.preprocessing import StandardScaler, LabelEncoder
import numpy as np
import pandas as pd
import pickle
import tensorflow as tf

app = Flask(__name__)
CORS(app)

# Model build karo
model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu', input_shape=(47,)),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

# Weights
with open('model_weights_list.pkl', 'rb') as f:
    weights_list = pickle.load(f)
weights = [np.array(w) for w in weights_list]
model.set_weights(weights)

# Scaler
with open('scaler_params.pkl', 'rb') as f:
    scaler_params = pickle.load(f)
scaler = StandardScaler()
scaler.mean_ = np.array(scaler_params['mean'])
scaler.scale_ = np.array(scaler_params['scale'])
scaler.var_ = np.array(scaler_params['var'])
scaler.n_features_in_ = scaler_params['n_features']

# Model columns
with open('model_columns_list.pkl', 'rb') as f:
    model_columns = pickle.load(f)

# Label encoder
with open('le_classes.pkl', 'rb') as f:
    le_classes = pickle.load(f)
label_encoder = LabelEncoder()
label_encoder.classes_ = np.array(le_classes)

numerical_cols = [
    'Age', 'DailyRate', 'DistanceFromHome', 'Education',
    'EmployeeCount', 'EmployeeNumber', 'EnvironmentSatisfaction',
    'HourlyRate', 'JobInvolvement', 'JobLevel', 'JobSatisfaction',
    'MonthlyIncome', 'MonthlyRate', 'NumCompaniesWorked',
    'PercentSalaryHike', 'PerformanceRating', 'RelationshipSatisfaction',
    'StandardHours', 'StockOptionLevel', 'TotalWorkingYears',
    'TrainingTimesLastYear', 'WorkLifeBalance', 'YearsAtCompany',
    'YearsInCurrentRole', 'YearsSinceLastPromotion', 'YearsWithCurrManager'
]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        data['EmployeeCount']  = 1
        data['Over18']         = 'Y'
        data['StandardHours']  = 80
        data['EmployeeNumber'] = 1000
        data['DailyRate']      = int(data.get('MonthlyIncome', 4000)) // 26
        data['HourlyRate']     = int(data.get('MonthlyIncome', 4000)) // 208
        data['MonthlyRate']    = int(data.get('MonthlyIncome', 4000)) * 13 // 10

        new_df = pd.DataFrame([data])
        categorical_cols = new_df.select_dtypes(include='object').columns
        new_df_encoded = pd.get_dummies(new_df, columns=categorical_cols, drop_first=True)
        new_df_aligned = new_df_encoded.reindex(columns=model_columns, fill_value=0)

        new_df_num = new_df_aligned[numerical_cols]
        new_df_cat = new_df_aligned.drop(columns=numerical_cols)
        new_df_scaled = pd.DataFrame(scaler.transform(new_df_num), columns=numerical_cols)

        final_input = pd.concat([new_df_cat, new_df_scaled], axis=1)
        final_input = final_input[model_columns]

        prob = float(model.predict(final_input)[0][0])
        result = 'Yes' if prob > 0.5 else 'No'

        return jsonify({'attrition': result, 'probability': round(prob, 4)})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)