import json
import os
from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
import firebase_admin
from firebase_admin import credentials
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def test_firebase_connection():
    try:
        logger.info("Starting Firebase connection test...")
        
        # Check if service account file exists
        service_account_path = 'serviceAccountKey.json'
        logger.info(f"Checking for service account file at: {os.path.abspath(service_account_path)}")
        if not os.path.exists(service_account_path):
            raise FileNotFoundError(f"Service account file not found at: {service_account_path}")
        
        # Initialize Firebase Admin with service account
        logger.info("Initializing Firebase Admin SDK...")
        try:
            cred = credentials.Certificate(service_account_path)
            logger.info("Successfully loaded service account credentials")
        except Exception as e:
            logger.error(f"Failed to load service account credentials: {str(e)}")
            raise
        
        try:
            firebase_admin.initialize_app(cred)
            logger.info("Successfully initialized Firebase Admin SDK")
        except Exception as e:
            logger.error(f"Failed to initialize Firebase Admin SDK: {str(e)}")
            raise
        
        # Initialize Firestore client with credentials
        logger.info("Initializing Firestore client...")
        try:
            # Get the project ID from the credentials
            with open(service_account_path) as f:
                project_id = json.load(f)['project_id']
            
            # Initialize Firestore with explicit credentials and project
            db = firestore.Client(
                project=project_id,
                credentials=cred,
                database='agent-square'
            )
            logger.info("Successfully initialized Firestore client")
        except Exception as e:
            logger.error(f"Failed to initialize Firestore client: {str(e)}")
            raise
        
        # Try to access a collection
        logger.info("Attempting to access test collection...")
        test_collection = db.collection('test_collection')
        
        # Add a test document
        logger.info("Creating test document...")
        test_doc = test_collection.document('test_doc')
        test_doc.set({
            'message': 'Hello Firebase!',
            'timestamp': firestore.SERVER_TIMESTAMP
        })
        logger.info("Successfully created test document")
        
        # Read the document back
        logger.info("Reading test document...")
        doc = test_doc.get()
        if doc.exists:
            logger.info("Successfully connected to Firebase!")
            logger.info(f"Test document data: {doc.to_dict()}")
            
            # Clean up - delete the test document
            logger.info("Cleaning up test document...")
            test_doc.delete()
            logger.info("Test document cleaned up successfully")
        else:
            logger.error("Failed to create/read test document")
            
    except Exception as e:
        logger.error(f"Error connecting to Firebase: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    test_firebase_connection() 