from flask_cors import CORS
from models import db, UserTableA, UserTableB, SegmentHistory
from data_fetcher import fetch_and_update
from config import Config
from flask import Flask, jsonify

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
CORS(app)

# ✅ Initialize DB + Sample Data at App Startup
with app.app_context():
    db.create_all()
    fetch_and_update()

@app.route("/")
def home():
    return "Audience Targeting Clean Room API is running!"

@app.route("/segment", methods=["GET"])
def segment_overlap():
    a_ids = {u.hashed_id for u in UserTableA.query.all()}
    b_ids = {u.hashed_id for u in UserTableB.query.all()}
    overlap = a_ids & b_ids
    return jsonify({
        "overlap_count": len(overlap),
        "total_a": len(a_ids),
        "total_b": len(b_ids),
        "percent_overlap": round(len(overlap) / max(len(a_ids | b_ids), 1) * 100, 2)
    })

@app.route("/refresh", methods=["POST"])
def refresh_data():
    fetch_and_update()

    a_ids = {u.hashed_id for u in UserTableA.query.all()}
    b_ids = {u.hashed_id for u in UserTableB.query.all()}
    overlap = a_ids & b_ids

    history_entry = SegmentHistory(
        total_a=len(a_ids),
        total_b=len(b_ids),
        overlap=len(overlap)
    )
    db.session.add(history_entry)
    db.session.commit()

    return jsonify({"status": "data refreshed"})

@app.route("/history", methods=["GET"])
def get_history():
    history = SegmentHistory.query.order_by(SegmentHistory.timestamp).all()
    return jsonify([
        {
            "timestamp": h.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "total_a": h.total_a,
            "total_b": h.total_b,
            "overlap": h.overlap
        } for h in history
    ])

if __name__ == "__main__":
    app.run(debug=True)
