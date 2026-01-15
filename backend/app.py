from encryption import encrypt_password, decrypt_password
from database import create_table
from database import create_table, add_password
from database import get_all_passwords
from database import delete_password
from flask import Flask, request, jsonify
from flask_cors import CORS


from database import (
    create_table,
    add_password,
    get_all_passwords,
    delete_password,
    search_password
)
app = Flask(__name__)
CORS(app)

# Create DB table at startup
create_table()

@app.route("/")
def home():
    return "Password Manager API is running"

@app.route("/add", methods=["POST"])
def add():
    data = request.json
    add_password(
        website=data["website"],
        username=data["username"],
        password=data["password"],
        notes=data.get("notes", "")
    )
    return jsonify({"message": "Password added successfully"})

@app.route("/passwords", methods=["GET"])
def get_passwords():
    return jsonify(get_all_passwords())

@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("query", "")
    return jsonify(search_password(query))

@app.route("/delete/<int:password_id>", methods=["DELETE"])
def delete(password_id):
    delete_password(password_id)
    return jsonify({"message": "Password deleted successfully"})
@app.route("/update/<int:password_id>", methods=["PUT"])
def update(password_id):
    data = request.json
    update_password(
        password_id,
        data["website"],
        data["username"],
        data["password"],
        data.get("notes", "")
    )
    return jsonify({"message": "Password updated successfully"})

if __name__ == "__main__":
    app.run()




