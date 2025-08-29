

import pandas as pd

def train_model(df: pd.DataFrame, target: str):
    X = df.drop(columns=[target])
    y = df[target]

    # X has only numeric data

    X_numeric = X.select_dtypes(include = ["int64", "float64"])
    feature_cols = list(X_numeric.columns)

    if X_numeric.empty:
        raise ValueError("No numeric features are found for training")

    if y.dtype == "Object" or y.nunique() < 20:
        task_type = "classification"
    else:
        task_type = "regression"

    from sklearn.model_selection import train_test_split
    from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
    from sklearn.metrics import accuracy_score, r2_score
    from sklearn.metrics import classification_report, mean_squared_error

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 42)


    if task_type == "classification":
        model = RandomForestClassifier(n_estimators = 100, random_state = 42)
        model.fit(X_train, y_train)
        pred = model.predict(X_test)
        
        metrics = {
            "accuracy": accuracy_score(y_test, pred),
            "report": classification_report(y_test, pred, output_dict = True)
        }
    
    else:
        model = RandomForestRegressor(n_estimators = 100, random_state = 42)
        model.fit(X_train, y_train)
        pred = model.predict(X_test)

        metrics = {
            "mean square error": mean_squared_error(y_test, pred),
            "r2_score": r2_score(y_test, pred),
        }

        return {
            "model" : model,
            "task" : task_type,
            "metrics" : metrics,
            "feature_cols": feature_cols,
            "predictions" : pred.tolist(),
        }
    
    
   
    