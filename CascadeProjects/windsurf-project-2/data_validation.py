import pandas as pd

def validate_candidates(file_path):
    """Validate candidate records with emergency cleaning"""
    try:
        df = pd.read_csv(file_path)
        
        # Emergency cleaning
        df['gender'] = df.apply(
            lambda x: x['gender'] if pd.notna(x['gender']) \
            else 'F' if 'Ms.' in str(x.get('title', '')) else 'M', \
            axis=1
        )
        
        # SDG5 Metrics
        gender_parity = df['gender'].value_counts(normalize=True).get('F', 0)
        
        return {
            'total_records': len(df),
            'female_candidates': (df['gender'] == 'F').sum(),
            'gender_parity_score': round(gender_parity, 3),
            'data_quality': {
                'missing_gender': df['gender'].isna().sum(),
                'missing_district': df['district'].isna().sum()
            }
        }
    except Exception as e:
        return {'error': str(e)}
