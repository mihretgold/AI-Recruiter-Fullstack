import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class JobRepository:
    def __init__(self):
        try:
            # Initialize Firebase Admin SDK
            cred = credentials.Certificate('serviceAccountKey.json')
            firebase_admin.initialize_app(cred)
            
            # Initialize Firestore client
            self.db = firestore.client()
            self.collection_name = "jobs"
            logger.info("Successfully initialized Firebase connection")
        except Exception as e:
            logger.error(f"Error initializing Firebase: {str(e)}")
            raise

    def add_job(self, job_data: dict) -> str:
        """Add a new job to the collection"""
        try:
            # Add timestamp
            job_data['createdAt'] = datetime.now()
            
            # Add document to collection
            doc_ref = self.db.collection(self.collection_name).document()
            job_data['id'] = doc_ref.id  # Use Firestore's document ID
            doc_ref.set(job_data)
            
            logger.info(f"Job added successfully with ID: {doc_ref.id}")
            return doc_ref.id
        except Exception as e:
            logger.error(f"Error adding job: {str(e)}")
            raise

    def get_all_jobs(self) -> list:
        """Get all jobs from the collection"""
        try:
            jobs = []
            docs = self.db.collection(self.collection_name).stream()
            for doc in docs:
                job_data = doc.to_dict()
                jobs.append(job_data)
            return jobs
        except Exception as e:
            logger.error(f"Error getting jobs: {str(e)}")
            raise

    def search_jobs(self, query: str) -> list:
        """Search jobs by position name, company name, or location"""
        try:
            jobs = []
            docs = self.db.collection(self.collection_name).stream()
            query = query.lower()
            
            for doc in docs:
                job_data = doc.to_dict()
                if (query in job_data.get('positionName', '').lower() or
                    query in job_data.get('companyName', '').lower() or
                    query in job_data.get('location', '').lower()):
                    jobs.append(job_data)
            return jobs
        except Exception as e:
            logger.error(f"Error searching jobs: {str(e)}")
            raise 