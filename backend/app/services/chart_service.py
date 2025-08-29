

import pandas as pd

def suggest_charts(df : pd.DataFrame):
    suggestions = []

    numeric_cols = df.select_dtypes(include = ["int64", "float64"]).columns.tolist()
    categorical_cols = df.select_dtypes(exclude = ["int64", "float64"]).columns.tolist()

    # numeric columns ----> HISTOGRAM

    for col in numeric_cols:
        suggestions.append({
            "type": "histogram",
            "x": col,
            "title": f"Distribution of {col}"
        })


    # categorical + numeric ----> BAR CHART
    for cat in categorical_cols:
        for num in numeric_cols:
            suggestions.append({
                "type": "bar",
                "x": cat,
                "y": num,
                "title": f"{num} by {cat}"
            })
        
    # numeric vs numeric ----> SCATTER PLOT
    if len(numeric_cols) > 1:
        for i in range(len(numeric_cols)):
            for j in range( i + 1, len(numeric_cols)):
                suggestions.append({
                    "type" : "scatter",
                    "x" : numeric_cols[i],
                    "y" : numeric_cols[j],
                    "title": f"{numeric_cols[i]} vs {numeric_cols[j]}"
                })

        
    return suggestions