import threading
import pandas as pd
import os

_df = None
_lock = threading.Lock()
_csv_path = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "mlmodel", "colleges.csv")
)


def get_college_df():
    global _df
    if _df is not None:
        return _df
    with _lock:
        if _df is not None:
            return _df

        print(f"[Colleges] Loading CSV from: {_csv_path}")
        try:
            frame = pd.read_csv(
                _csv_path,
                usecols=["college_name", "city", "state", "nirf_rank",
                         "nirf_score", "category", "min_cutoff", "medium", "gender"],
                engine="c",
            )
        except Exception as e:
            print(f"[Colleges] Could not load CSV, using curated fallback: {e}")
            frame = _fallback_frame()

        if "college_name" in frame and "Address:" in str(frame["college_name"].iloc[0] if len(frame) else ""):
            frame["college_name"] = frame["college_name"].astype(str).str.split("Address:", n=1).str[0].str.strip()

        frame["state"] = frame["state"].astype(str).str.strip().str.title()
        frame["city"]  = frame["city"].astype(str).str.strip().str.title()

        frame["nirf_rank"] = pd.to_numeric(frame.get("nirf_rank"), errors="coerce")

        rank = frame["nirf_rank"]
        derived_cutoff = pd.cut(
            rank,
            bins=[-1, 10, 50, 100, 200, 500, float("inf")],
            labels=[90, 80, 75, 70, 65, 55],
        ).astype(float)

        explicit = pd.to_numeric(frame["min_cutoff"], errors="coerce") if "min_cutoff" in frame else None
        if explicit is None:
            frame["min_cutoff"] = derived_cutoff
        else:
            frame["min_cutoff"] = explicit.where((explicit.notna()) & (explicit != 0), derived_cutoff)

        _df = frame
        print(f"[Colleges] Loaded {len(_df)} colleges")
        return _df


def warm_colleges():
    """Preload the CSV in a background thread so the first user request is fast."""
    def _go():
        try:
            get_college_df()
        except Exception as e:
            print(f"[Colleges] warm-up failed: {e}")
    threading.Thread(target=_go, daemon=True).start()


def _fallback_frame():
    raw = [
        ("Indian Institute of Technology, Delhi", "New Delhi", "Delhi", 1, 90.0, "Engineering", 95),
        ("Indian Institute of Technology, Bombay", "Mumbai", "Maharashtra", 2, 88.0, "Engineering", 95),
        ("National Institute of Technology, Trichy", "Tiruchirappalli", "Tamil Nadu", 12, 75.0, "Engineering", 85),
        ("BITS Pilani, Pilani Campus", "Pilani", "Rajasthan", 20, 72.0, "Engineering", 90),
        ("All India Institute of Medical Sciences, Delhi", "New Delhi", "Delhi", 3, 92.0, "Medical", 98),
        ("Christian Medical College, Vellore", "Vellore", "Tamil Nadu", 5, 88.0, "Medical", 95),
        ("JIPMER, Puducherry", "Puducherry", "Puducherry", 18, 70.0, "Medical", 92),
        ("Indian Institute of Management, Ahmedabad", "Ahmedabad", "Gujarat", 1, 90.0, "Management", 90),
        ("Indian Institute of Management, Bangalore", "Bengaluru", "Karnataka", 2, 88.0, "Management", 90),
        ("National Law School of India University", "Bengaluru", "Karnataka", 1, 90.0, "Law", 92),
        ("St. Stephen's College, Delhi", "New Delhi", "Delhi", 15, 75.0, "Colleges", 92),
        ("Presidency College, Chennai", "Chennai", "Tamil Nadu", 25, 72.0, "Colleges", 85),
    ]
    return pd.DataFrame(
        raw, columns=["college_name", "city", "state", "nirf_rank",
                      "nirf_score", "category", "min_cutoff"]
    )


def score_college(row, percentage):
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


def suggest_colleges(
    state: str,
    percentage: float,
    dominant_category: str,
    level: str,
    medium: str = None,
    gender: str = None,
) -> list[dict]:
    df = get_college_df()

    category_map = {
        "Technology": ["Engineering"],
        "Business":   ["Management", "Law", "Colleges"],
        "Healthcare": ["Medical", "Pharmacy"],
        "Creative":   ["Colleges"],
        "Science":    ["Engineering", "Pharmacy", "Colleges"],
    }
    nirf_cats = category_map.get(dominant_category, ["Colleges"])
    filtered = df[df["category"].isin(nirf_cats)]

    # Medium / gender filters (frontend can send these)
    if medium and medium != "All Languages" and "medium" in filtered.columns:
        cap = medium.title()
        hits = filtered[filtered["medium"].str.title() == cap]
        if len(hits) > 0:
            filtered = hits
    if gender and gender != "All Types" and "gender" in filtered.columns:
        hits = filtered[filtered["gender"].str.title() == gender.title()]
        if len(hits) > 0:
            filtered = hits

    # State filter with fallback to all India
    state_q = "" if (not state or state.strip().lower() in ("all states", "all", "india")) else state.strip()
    if state_q:
        state_df = filtered[filtered["state"].str.lower() == state_q.lower()]
        if len(state_df) < 5:
            state_df = filtered
    else:
        state_df = filtered

    # Split into eligible and aspirational
    eligible     = state_df[state_df["min_cutoff"] <= percentage]
    aspirational = state_df[state_df["min_cutoff"] > percentage]

    # Score both groups separately
    if not eligible.empty:
        eligible["relevance_score"] = eligible.apply(
            lambda row: score_college(row, percentage), axis=1
        )
        eligible = eligible.sort_values("relevance_score", ascending=False)
        eligible["eligibility"] = "eligible"

    if not aspirational.empty:
        aspirational["relevance_score"] = aspirational.apply(
            lambda row: score_college(row, percentage), axis=1
        )
        aspirational = aspirational.sort_values("relevance_score", ascending=False)
        aspirational["eligibility"] = "aspirational"

    # Combine — eligible first, then aspirational
    if eligible.empty and aspirational.empty:
        combined = pd.DataFrame()
    elif eligible.empty:
        combined = aspirational
    elif aspirational.empty:
        combined = eligible
    else:
        combined = pd.concat([eligible, aspirational], ignore_index=True)

    if combined.empty:
        return []

    keep = ["college_name", "city", "state", "category", "min_cutoff", "eligibility"]
    if "medium" in combined.columns:
        keep.append("medium")
    if "gender" in combined.columns:
        keep.append("gender")
    if "fees_lpa" in combined.columns:
        keep.append("fees_lpa")
    if "avg_package_lpa" in combined.columns:
        keep.append("avg_package_lpa")

    result = combined[keep].fillna("").to_dict(orient="records")
    return result