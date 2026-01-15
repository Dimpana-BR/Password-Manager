from cryptography.fernet import Fernet
key=Fernet.generate_key()

with open("secret.key", "wb") as key_file:
    key_file.write(key)
    
print("secret.key generated and saved.")

def load_key():
    return open("secret.key", "rb").read()

def encrypt_password(password):
    key = load_key()
    fernet = Fernet(key)
    return fernet.encrypt(password.encode()).decode()

def decrypt_password(encrypted_password):
    key = load_key()
    fernet = Fernet(key)
    return fernet.decrypt(encrypted_password.encode()).decode()