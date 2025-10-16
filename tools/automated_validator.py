import sqlite3
import csv
import requests
from urllib.parse import urlparse
from datetime import datetime
import os

# Configuration
VALID_DOMAINS = {
    'twitter.com': 'Twitter',
    'facebook.com': 'Facebook',
    'instagram.com': 'Instagram',
    'linkedin.com': 'LinkedIn'
}
TIMEOUT = 3  # seconds

# Facebook API configuration (add your access token)
FACEBOOK_ACCESS_TOKEN = 'EAAaZAsjYjABsBPmRrEPcLRBJ6bNNikKirkRHZATet5feGVIEHLOIsXojRz8jPQivionljINxfjZBSwvgZBAvq1Y2YWPe47PaOwxzeL4unXvw7qoOwi0w3tPBvZB3a0MLqvKnlDvnygQBvjZB7TdxeBhZBiyEn072Q419MpkW7qRnWSehd2YgnZAQyfZBjG2j9xxZBnOuZBf4rqe7wx0fEyc0cELyTjSZBJ51l83aEc24ow4VOAZDZD'

def search_facebook_profile(name_ar, name_en):
    """Use Facebook Graph API to search for profiles"""
    if not FACEBOOK_ACCESS_TOKEN or FACEBOOK_ACCESS_TOKEN == 'YOUR_ACCESS_TOKEN_HERE':
        return None
    
    try:
        # Search for pages/profiles
        search_url = f"https://graph.facebook.com/v18.0/search?q={name_ar}&type=page&access_token={FACEBOOK_ACCESS_TOKEN}&fields=id,name,link"
        response = requests.get(search_url, timeout=TIMEOUT)
        if response.status_code == 200:
            data = response.json()
            if 'data' in data and len(data['data']) > 0:
                return data['data'][0]['link']  # Return first match
    except:
        pass
    return None

def validate_and_update():
    conn = sqlite3.connect('../data/election.db')
    cursor = conn.cursor()
    
    # Create validation report
    with open('../data/validation_report.csv', 'w', newline='', encoding='utf-8') as report_file:
        writer = csv.writer(report_file)
        writer.writerow([
            'ID', 'Name', 'Platform', 'URL', 'Status', 
            'HTTP Code', 'Valid Domain', 'Timestamp'
        ])
        
        # Get all candidates with contacts
        cursor.execute("""
        SELECT c.candidate_id, c.full_name_ar, c.full_name_en, 
               co.twitter, co.facebook, co.instagram
        FROM candidates c
        LEFT JOIN candidate_contacts co ON c.candidate_id = co.candidate_id
        WHERE c.governorate IN ('بغداد', 'أربيل')
        """)
        
        for row in cursor.fetchall():
            candidate_id, name_ar, name_en, twitter, facebook, instagram = row
            
            # Try to find missing Facebook profiles
            if not facebook:
                facebook = search_facebook_profile(name_ar, name_en)
            
            platforms = [
                ('Twitter', twitter),
                ('Facebook', facebook),
                ('Instagram', instagram)
            ]
            
            for platform_name, url in platforms:
                if not url:
                    continue
                    
                # Validate domain
                domain = urlparse(url).netloc
                valid_domain = any(d in domain for d in VALID_DOMAINS)
                
                # Validate URL
                http_status = 'N/A'
                try:
                    response = requests.head(url, timeout=TIMEOUT, allow_redirects=True)
                    http_status = response.status_code
                    status = 'VALID' if response.status_code == 200 else 'INVALID'
                except:
                    status = 'ERROR'
                
                # Write to report
                writer.writerow([
                    candidate_id, name_en, platform_name, url, status,
                    http_status, valid_domain, datetime.now()
                ])
                
                # Update database if contact exists
                if any(row[3:6]):  # If any social media exists
                    cursor.execute("""
                    INSERT OR REPLACE INTO candidate_contacts 
                    (candidate_id, twitter, facebook, instagram, 
                     verification_status, last_contact_attempt)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """, (candidate_id, twitter, facebook, instagram, status, datetime.now()))
    
    conn.commit()
    conn.close()
    print("Validation complete. Report saved to validation_report.csv")

if __name__ == "__main__":
    validate_and_update()
