from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class UserTableA(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120))
    hashed_id = db.Column(db.String(256))
    interests = db.Column(db.String(120))

class UserTableB(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120))
    hashed_id = db.Column(db.String(256))
    interests = db.Column(db.String(120))
