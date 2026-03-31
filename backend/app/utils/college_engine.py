import pandas as pd
import os

_df = None

def get_college_df():
    global _df
    if _df is None:
        base_dir = os.path.dirname(__file__)  # ← this line was missing
        csv_path = os.path.abspath(
            os.path.join(base_dir, "..", "..", "..", "mlmodel", "colleges.csv")
        )
        print(f"Loading colleges CSV from: {csv_path}")
        _df = pd.read_csv(csv_path)
        _df["state"] = _df["state"].str.strip().str.title()
        _df["city"]  = _df["city"].str.strip().str.title()
    return _df

def suggest_colleges(
    state: str,
    percentage: float,
    dominant_category: str,
    level: str
) -> list[dict]:
    df = get_college_df().copy()

    category_map = {
        "Technology": ["Engineering"],
        "Business":   ["Management", "Law", "Colleges"],
        "Healthcare": ["Medical", "Pharmacy"],
        "Creative":   ["Colleges"],
        "Science":    ["Engineering", "Pharmacy", "Colleges"],
    }
    nirf_cats = category_map.get(dominant_category, ["Colleges"])

    filtered = df[df["category"].isin(nirf_cats)].copy()

    state_df = filtered[filtered["state"].str.lower() == state.strip().lower()]
    if len(state_df) < 5:
        state_df = filtered

    eligible = state_df[state_df["min_cutoff"] <= percentage].copy()
    if eligible.empty:
        eligible = state_df.copy()

    def score(row):
        s = 0
        try:
            rank = float(row["nirf_rank"])
            if rank <= 10:    s += 50
            elif rank <= 50:  s += 35
            elif rank <= 100: s += 20
            elif rank <= 200: s += 10
            else:             s += 5
        except:
            s += 1
        try:
            s += float(row["nirf_score"]) * 0.3
        except:
            pass
        try:
            gap = percentage - float(row["min_cutoff"])
            if 0 <= gap <= 10:  s += 20
            elif gap > 10:      s += 10
        except:
            pass
        return s

    eligible["relevance_score"] = eligible.apply(score, axis=1)

    result = (
        eligible
        .sort_values("relevance_score", ascending=False)
        .drop(columns=["relevance_score"])
        .fillna("")
        .to_dict(orient="records")
    )

    return result