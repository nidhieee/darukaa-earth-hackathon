import sys
sys.path.append('.')
from api.database import engine
from api.models import Base
from sqlalchemy import text

db_columns = {}
with engine.connect() as conn:
    result = conn.execute(text("SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public'"))
    for row in result:
        table, col = row[0], row[1]
        db_columns.setdefault(table, set()).add(col)

mismatches = []
for table_name, table in Base.metadata.tables.items():
    model_cols = {col.name for col in table.columns}
    db_cols = db_columns.get(table_name, set())
    
    missing_in_db = model_cols - db_cols
    missing_in_model = db_cols - model_cols
    
    if missing_in_db:
        mismatches.append(f'Table {table_name} missing in DB: {missing_in_db}')

if not mismatches:
    print('SUCCESS: No missing columns in database.')
else:
    for m in mismatches:
        print(m)
