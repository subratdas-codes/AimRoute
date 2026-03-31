import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

CATEGORIES = {
    "Engineering": "https://www.nirfindia.org/Rankings/2024/EngineeringRankingALL.html",
    "Management":  "https://www.nirfindia.org/Rankings/2024/ManagementRankingALL.html",
    "Medical":     "https://www.nirfindia.org/Rankings/2024/MedicalRankingALL.html",
    "Colleges":    "https://www.nirfindia.org/Rankings/2024/CollegeRankingALL.html",
    "Law":         "https://www.nirfindia.org/Rankings/2024/LawRankingALL.html",
    "Pharmacy":    "https://www.nirfindia.org/Rankings/2024/PharmacyRankingALL.html",
}

CAREER_MAP = {
    "Engineering": "Technology,Science",
    "Management":  "Business",
    "Medical":     "Healthcare",
    "Colleges":    "Creative,Business,Science",
    "Law":         "Business",
    "Pharmacy":    "Healthcare,Science",
}

HEADERS = {"User-Agent": "Mozilla/5.0"}

all_data = []

for category, url in CATEGORIES.items():
    print(f"\nScraping {category}...")
    res = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(res.text, "html.parser")
    table = soup.find("table")

    if not table:
        print(f"  ❌ No table found for {category}")
        continue

    rows = table.find_all("tr")
    count = 0
    for row in rows[1:]:
        cols = [td.get_text(strip=True) for td in row.find_all("td")]
        if len(cols) >= 3:
            all_data.append({
                "college_name":      cols[0],
                "city":              cols[1] if len(cols) > 1 else "",
                "state":             cols[2] if len(cols) > 2 else "",
                "nirf_rank":         cols[3] if len(cols) > 3 else "",
                "nirf_score":        cols[4] if len(cols) > 4 else "",
                "category":          category,
                "careers":           CAREER_MAP[category],
                "min_cutoff":        60,
                "fees_lpa":          1.0,
                "avg_package_lpa":   5.0,
            })
            count += 1
    print(f"  ✅ {count} colleges scraped")
    time.sleep(1)  # be polite to the server

df = pd.DataFrame(all_data)
df.to_csv("colleges.csv", index=False)
print(f"\n✅ DONE! Total {len(df)} colleges saved to mlmodel/colleges.csv")
print(df.head())