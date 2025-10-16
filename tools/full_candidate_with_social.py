import sqlite3
import csv

def export_candidates_with_social():
    conn = sqlite3.connect('election.db')
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            c.candidate_id,
            c.full_name_ar,
            c.full_name_en,
            c.party_affiliation,
            c.governorate,
            c.gender,
            co.phone,
            co.email,
            co.twitter,
            co.facebook,
            co.instagram,
            co.verification_status
        FROM candidates c
        LEFT JOIN candidate_contacts co ON c.candidate_id = co.candidate_id
        ORDER BY c.governorate, c.candidate_id
    """)
    
    with open('complete_candidate_with_social.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'Candidate ID', 'Full Name (AR)', 'Full Name (EN)', 'Political Party', 
            'Governorate', 'Gender', 'Phone', 'Email', 
            'Twitter', 'Facebook', 'Instagram', 'Verification Status'
        ])
        writer.writerows(cursor.fetchall())
    
    print("Exported complete candidate list with social media to complete_candidate_with_social.csv")

export_candidates_with_social()
