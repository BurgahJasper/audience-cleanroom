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

class SegmentHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())
    total_a = db.Column(db.Integer)
    total_b = db.Column(db.Integer)
    overlap = db.Column(db.Integer)
