import random
import hashlib
from models import db, UserTableA, UserTableB

def hash_email(email):
    return hashlib.sha256(email.encode()).hexdigest()

def fetch_and_update():
    for _ in range(10):
        email = f"user{random.randint(1000, 9999)}@example.com"
        interests = random.choice(["sports", "tech", "music", "finance", "health"])
        hashed_id = hash_email(email)

        db.session.add(UserTableA(email=email, hashed_id=hashed_id, interests=interests))
        if random.random() < 0.5:  # simulate some overlap
            db.session.add(UserTableB(email=email, hashed_id=hashed_id, interests=interests))
        else:
            other_email = f"user{random.randint(1000, 9999)}@example.com"
            other_hashed = hash_email(other_email)
            db.session.add(UserTableB(email=other_email, hashed_id=other_hashed, interests=interests))
    db.session.commit()
