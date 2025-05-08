import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FirebaseConnection:
    def __init__(self):
        try:
            # Initialize Firebase Admin SDK
            cred = credentials.Certificate('serviceAccountKey.json')
            firebase_admin.initialize_app(cred)
            
            # Initialize Firestore client
            self.db = firestore.client()
            logger.info("Successfully initialized Firebase connection")
        except Exception as e:
            logger.error(f"Error initializing Firebase: {str(e)}")
            raise
        
    def add_document(self, collection_name: str, document_id: str, data: dict):
        """Add a document to a collection"""
        try:
            doc_ref = self.db.collection(collection_name).document(document_id)
            doc_ref.set(data)
            logger.info(f"Document {document_id} added successfully")
            return True
        except Exception as e:
            logger.error(f"Error adding document: {str(e)}")
            return False

    def get_document(self, collection_name: str, document_id: str):
        """Get a document from a collection"""
        try:
            doc_ref = self.db.collection(collection_name).document(document_id)
            doc = doc_ref.get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            logger.error(f"Error getting document: {str(e)}")
            return None

    def update_document(self, collection_name: str, document_id: str, data: dict):
        """Update a document in a collection"""
        try:
            doc_ref = self.db.collection(collection_name).document(document_id)
            doc_ref.update(data)
            logger.info(f"Document {document_id} updated successfully")
            return True
        except Exception as e:
            logger.error(f"Error updating document: {str(e)}")
            return False

    def delete_document(self, collection_name: str, document_id: str):
        """Delete a document from a collection"""
        try:
            doc_ref = self.db.collection(collection_name).document(document_id)
            doc_ref.delete()
            logger.info(f"Document {document_id} deleted successfully")
            return True
        except Exception as e:
            logger.error(f"Error deleting document: {str(e)}")
            return False

    def query_collection(self, collection_name: str, field: str, operator: str, value):
        """Query documents in a collection"""
        try:
            query = self.db.collection(collection_name).where(field, operator, value)
            results = query.get()
            return [doc.to_dict() for doc in results]
        except Exception as e:
            logger.error(f"Error querying collection: {str(e)}")
            return []

# Example usage
if __name__ == "__main__":
    try:
        # Initialize Firebase connection
        firebase = FirebaseConnection()
        
        # Example: Add a document
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "age": 25
        }
        firebase.add_document("users", "test_user_1", test_data)
        
        # Example: Get a document
        user_data = firebase.get_document("users", "test_user_1")
        logger.info(f"Retrieved user data: {user_data}")
        
        # Example: Update a document
        update_data = {"age": 26}
        firebase.update_document("users", "test_user_1", update_data)
        
        # Example: Query documents
        users = firebase.query_collection("users", "age", ">=", 25)
        logger.info(f"Users with age >= 25: {users}")
        
        # Example: Delete a document
        firebase.delete_document("users", "test_user_1")
        
    except Exception as e:
        logger.error(f"Error in main: {str(e)}") 