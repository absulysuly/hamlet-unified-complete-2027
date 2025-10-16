import psycopg2
import pandas as pd
import os
from typing import Dict, List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def create_database_schema():
    """Create the database schema for storing candidate data."""

    # Database connection parameters
    db_config = {
        'host': 'localhost',
        'database': 'election_db',
        'user': 'postgres',  # Change this to your PostgreSQL username
        'password': 'your_password'  # Change this to your PostgreSQL password
    }

    try:
        # Connect to PostgreSQL
        conn = psycopg2.connect(**db_config)
        conn.autocommit = True
        cursor = conn.cursor()

        # Create database if it doesn't exist
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (db_config['database'],))
        if not cursor.fetchone():
            cursor.execute(f"CREATE DATABASE {db_config['database']}")
            logger.info(f"Created database: {db_config['database']}")

        # Close connection and reconnect to the new database
        conn.close()
        db_config['database'] = 'election_db'
        conn = psycopg2.connect(**db_config)
        conn.autocommit = True
        cursor = conn.cursor()

        # Create candidates table
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS candidates (
            id SERIAL PRIMARY KEY,
            candidate_id VARCHAR(50) UNIQUE NOT NULL,
            candidate_number VARCHAR(20),
            full_name_ar VARCHAR(255) NOT NULL,
            full_name_en VARCHAR(255),
            governorate VARCHAR(100),
            electoral_district VARCHAR(100),
            party_affiliation VARCHAR(255),
            coalition VARCHAR(255),
            gender VARCHAR(20),
            incumbent BOOLEAN DEFAULT FALSE,
            photo_url TEXT,
            biography TEXT,
            email VARCHAR(255),
            phone VARCHAR(50),
            election_year INTEGER NOT NULL DEFAULT 2025,
            data_source TEXT DEFAULT 'PDF',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        );
        """

        cursor.execute(create_table_sql)
        logger.info("Created candidates table")

        # Create indexes for better performance
        indexes = [
            "CREATE INDEX IF NOT EXISTS idx_candidate_name_ar ON candidates(full_name_ar);",
            "CREATE INDEX IF NOT EXISTS idx_candidate_name_en ON candidates(full_name_en);",
            "CREATE INDEX IF NOT EXISTS idx_candidate_number ON candidates(candidate_number);",
            "CREATE INDEX IF NOT EXISTS idx_governorate ON candidates(governorate);",
            "CREATE INDEX IF NOT EXISTS idx_party_affiliation ON candidates(party_affiliation);",
            "CREATE INDEX IF NOT EXISTS idx_election_year ON candidates(election_year);",
            "CREATE INDEX IF NOT EXISTS idx_gender ON candidates(gender);"
        ]

        for index_sql in indexes:
            cursor.execute(index_sql)

        logger.info("Created database indexes")

        # Create a view for active candidates
        cursor.execute("""
            CREATE OR REPLACE VIEW active_candidates AS
            SELECT * FROM candidates
            WHERE is_active = true AND election_year = 2025;
        """)

        logger.info("Created active_candidates view")

        conn.close()
        logger.info("Database schema created successfully")

    except Exception as e:
        logger.error(f"Error creating database schema: {e}")
        raise

def load_candidates_to_database(excel_file: str, csv_file: str):
    """Load candidate data from Excel/CSV files to PostgreSQL database."""

    db_config = {
        'host': 'localhost',
        'database': 'election_db',
        'user': 'postgres',  # Change this to your PostgreSQL username
        'password': 'your_password'  # Change this to your PostgreSQL password
    }

    try:
        # Read data from files
        if os.path.exists(excel_file):
            df = pd.read_excel(excel_file)
            logger.info(f"Loaded {len(df)} candidates from {excel_file}")
        elif os.path.exists(csv_file):
            df = pd.read_csv(csv_file, encoding='utf-8-sig')
            logger.info(f"Loaded {len(df)} candidates from {csv_file}")
        else:
            logger.error("No data file found")
            return

        # Connect to database
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()

        # Insert candidates
        inserted_count = 0
        updated_count = 0

        for _, row in df.iterrows():
            # Generate a unique candidate_id
            candidate_id = f"2025_{row.get('candidate_number', '')}_{row.get('governorate', 'UNKNOWN')}"

            # Check if candidate exists
            cursor.execute("""
                SELECT id FROM candidates WHERE candidate_id = %s
            """, (candidate_id,))

            if cursor.fetchone():
                # Update existing candidate
                cursor.execute("""
                    UPDATE candidates SET
                        candidate_number = %s,
                        full_name_ar = %s,
                        full_name_en = %s,
                        governorate = %s,
                        party_affiliation = %s,
                        gender = %s,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE candidate_id = %s
                """, (
                    row.get('candidate_number', ''),
                    row.get('name_ar', ''),
                    row.get('name_en', ''),
                    row.get('governorate', ''),
                    row.get('party', ''),
                    row.get('gender', ''),
                    candidate_id
                ))
                updated_count += 1
            else:
                # Insert new candidate
                cursor.execute("""
                    INSERT INTO candidates (
                        candidate_id, candidate_number, full_name_ar, full_name_en,
                        governorate, party_affiliation, gender, election_year
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    candidate_id,
                    row.get('candidate_number', ''),
                    row.get('name_ar', ''),
                    row.get('name_en', ''),
                    row.get('governorate', ''),
                    row.get('party', ''),
                    row.get('gender', ''),
                    2025
                ))
                inserted_count += 1

        conn.commit()
        conn.close()

        logger.info(f"Data loaded successfully: {inserted_count} inserted, {updated_count} updated")

        return inserted_count + updated_count

    except Exception as e:
        logger.error(f"Error loading data to database: {e}")
        raise

def verify_data_count():
    """Verify that all 7769 candidates are in the database."""

    db_config = {
        'host': 'localhost',
        'database': 'election_db',
        'user': 'postgres',
        'password': 'your_password'
    }

    try:
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor()

        # Count total candidates for 2025
        cursor.execute("SELECT COUNT(*) FROM candidates WHERE election_year = 2025")
        total_count = cursor.fetchone()[0]

        # Count active candidates
        cursor.execute("SELECT COUNT(*) FROM active_candidates")
        active_count = cursor.fetchone()[0]

        conn.close()

        logger.info(f"Total candidates in database: {total_count}")
        logger.info(f"Active candidates: {active_count}")

        if total_count >= 7769:
            logger.info("SUCCESS: All expected candidates are in the database!")
            return True
        else:
            logger.warning(f"WARNING: Only {total_count} candidates found, expected 7769")
            return False

    except Exception as e:
        logger.error(f"Error verifying data: {e}")
        return False

def main():
    """Main function to set up database and load data."""

    print("Setting up Iraqi Election 2025 Database...")

    try:
        # Step 1: Create database schema
        print("\n1. Creating database schema...")
        create_database_schema()

        # Step 2: Load data from files
        excel_file = "candidates_2025.xlsx"
        csv_file = "candidates_2025.csv"

        if os.path.exists(excel_file) or os.path.exists(csv_file):
            print("\n2. Loading candidate data...")
            total_loaded = load_candidates_to_database(excel_file, csv_file)
            print(f"Loaded {total_loaded} candidates into database")
        else:
            print("\n2. No data files found. Please run pdf_extractor.py first.")

        # Step 3: Verify data count
        print("\n3. Verifying data...")
        if verify_data_count():
            print("✅ Database setup completed successfully!")
        else:
            print("⚠️  Database setup completed with warnings.")

    except Exception as e:
        print(f"❌ Error during database setup: {e}")
        logger.error(f"Database setup failed: {e}")

if __name__ == "__main__":
    main()
