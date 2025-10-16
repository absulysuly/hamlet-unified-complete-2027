import sqlite3
import csv
from urllib.parse import quote

def generate_search_links(governorates=['بغداد', 'أربيل']):
    """Generate CSV with direct search links for manual verification"""
    conn = sqlite3.connect('election.db')
    cursor = conn.cursor()
    cursor.execute("""
        SELECT candidate_id, full_name_ar, full_name_en 
        FROM candidates 
        WHERE governorate IN (?, ?)
    """, governorates)
    
    with open('social_media_links.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['ID', 'Name (AR)', 'Name (EN)', 'Twitter', 'Facebook', 'Instagram', 'LinkedIn', 'Verified Profile', 'Notes'])
        
        for row in cursor.fetchall():
            id, name_ar, name_en = row
            writer.writerow([
                id,
                name_ar,
                name_en,
                f"https://twitter.com/search?q={quote(name_en)}%20Iraq",
                f"https://www.facebook.com/search/top?q={quote(name_ar)}",
                f"https://www.instagram.com/explore/tags/{quote(name_en)}/",
                f"https://www.linkedin.com/search/results/all/?keywords={quote(name_en)}%20Iraq",
                "",  # Empty column for verification mark
                ""   # Empty column for notes
            ])
    print(f"Generated social_media_links.csv with {cursor.rowcount} candidates")

if __name__ == "__main__":
    generate_search_links()
