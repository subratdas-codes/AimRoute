import pandas as pd

def load_data():
    data = pd.read_csv("dataset.csv")
    X = data.drop("Career", axis=1)
    y = data["Career"]
    return X, y