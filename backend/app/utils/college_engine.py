# backend/app/utils/college_engine.py
# Replace your entire file with this

import pandas as pd
import os

_df = None

def get_college_df():
    global _df
    if _df is not None:
        return _df

    base_dir = os.path.dirname(__file__)
    csv_path = os.path.abspath(
        os.path.join(base_dir, "..", "..", "..", "mlmodel", "colleges.csv")
    )
    print(f"Loading colleges CSV from: {csv_path}")

    _df = pd.read_csv(csv_path)
    _df["state"] = _df["state"].str.strip().str.title()
    _df["city"]  = _df["city"].str.strip().str.title()

    # ── Dynamic cutoff based on NIRF rank ────────────────────
    # NIRF doesn't publish cutoffs, so we compute them from rank
    def compute_cutoff(row):
        try:
            rank = float(row["nirf_rank"])
            if rank <= 10:   return 90
            if rank <= 50:   return 80
            if rank <= 100:  return 75
            if rank <= 200:  return 70
            if rank <= 500:  return 65
            return 55
        except Exception:
            return 55

    # Only overwrite rows where min_cutoff is missing or zero
    _df["min_cutoff"] = _df.apply(
        lambda row: compute_cutoff(row)
        if (pd.isna(row.get("min_cutoff")) or str(row.get("min_cutoff", "0")).strip() in ["", "0", "0.0"])
        else row["min_cutoff"],
        axis=1
    )

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

    # State filter with fallback to all India
    state_df = filtered[filtered["state"].str.lower() == state.strip().lower()]
    if len(state_df) < 5:
        state_df = filtered

    # Eligibility filter — fallback to all if none qualify
    eligible = state_df[state_df["min_cutoff"] <= percentage].copy()
    if eligible.empty:
        eligible = state_df.copy()

    # ── ML relevance scoring ──────────────────────────────────
    def score(row):
        s = 0
        try:
            rank = float(row["nirf_rank"])
            if rank <= 10:    s += 50
            elif rank <= 50:  s += 35
            elif rank <= 100: s += 20
            elif rank <= 200: s += 10
            else:             s += 5
        except Exception:
            s += 1
        try:
            s += float(row["nirf_score"]) * 0.3
        except Exception:
            pass
        try:
            gap = percentage - float(row["min_cutoff"])
            if 0 <= gap <= 10:  s += 20
            elif gap > 10:      s += 10
        except Exception:
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