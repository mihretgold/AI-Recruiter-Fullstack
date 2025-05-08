from flask import Flask, request, jsonify
from flask_cors import CORS
from repositories.job_repository import JobRepository
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize repository
job_repo = JobRepository()

@app.route('/api/jobs', methods=['POST'])
def add_job():
    try:
        job_data = request.json
        job_id = job_repo.add_job(job_data)
        return jsonify({"success": True, "id": job_id}), 201
    except Exception as e:
        logger.error(f"Error adding job: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    try:
        query = request.args.get('search', '')
        if query:
            jobs = job_repo.search_jobs(query)
        else:
            jobs = job_repo.get_all_jobs()
        return jsonify({"success": True, "jobs": jobs}), 200
    except Exception as e:
        logger.error(f"Error getting jobs: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 