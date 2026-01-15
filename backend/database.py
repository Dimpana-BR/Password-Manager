import sqlite3
from encryption import decrypt_password, encrypt_password

DB_NAME = "passwords.db"

def get_connection():
    return sqlite3.connect(DB_NAME)

def create_table():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS passwords (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            website TEXT NOT NULL,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()
    
def add_password(website, username, password, notes=""):
    encrypted_pwd = encrypt_password(password)

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO passwords (website, username, password, notes)
        VALUES (?, ?, ?, ?)
    """, (website, username, encrypted_pwd, notes))

    conn.commit()
    conn.close()

def get_all_passwords():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, website, username, password, notes FROM passwords")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for row in rows:
        result.append({
            "id": row[0],
            "website": row[1],
            "username": row[2],
            "password": decrypt_password(row[3]),
            "notes": row[4]
        })

    return result

def delete_password(password_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM passwords WHERE id = ?", (password_id,))

    conn.commit()
    conn.close()

def search_password(keyword):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, website, username, password, notes
        FROM passwords
        WHERE website LIKE ?
    """, (f"%{keyword}%",))

    rows = cursor.fetchall()
    conn.close()

    results = []
    for row in rows:
        results.append({
            "id": row[0],
            "website": row[1],
            "username": row[2],
            "password": decrypt_password(row[3]),
            "notes": row[4]
        })
def update_password(id, website, username, password, notes):
    encrypted_pwd = encrypt_password(password)

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE passwords
        SET website = ?, username = ?, password = ?, notes = ?
        WHERE id = ?
    """, (website, username, encrypted_pwd, notes, id))

    conn.commit()
    conn.close()

    return results
