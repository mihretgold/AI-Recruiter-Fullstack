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

# Example usage
if __name__ == "__main__":
    try:
        # Initialize repository
        job_repo = JobRepository()
        
        # Example job data
        test_job = {
            "positionName": "Senior Software Engineer",
            "companyName": "Tech Corp",
            "location": "New York",
            "workType": "Remote",
            "contractDetail": "Fulltime",
            "salaryMin": 100000,
            "salaryMax": 150000,
            "currency": "USD",
            "jobDescription": "Looking for an experienced software engineer..."
        }
        
        # Test adding a job
        job_id = job_repo.add_job(test_job)
        logger.info(f"Added test job with ID: {job_id}")
        
        # Test getting all jobs
        all_jobs = job_repo.get_all_jobs()
        logger.info(f"Retrieved {len(all_jobs)} jobs")
        
        # Test searching jobs
        search_results = job_repo.search_jobs("Software")
        logger.info(f"Found {len(search_results)} jobs matching 'Software'")
        
        # Print the results
        for job in all_jobs:
            logger.info(f"Job: {job['positionName']} at {job['companyName']}")
            
    except Exception as e:
        logger.error(f"Error in main: {str(e)}") 