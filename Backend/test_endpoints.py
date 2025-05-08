import requests
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:5000/api"

def test_add_job():
    """Test adding a new job"""
    logger.info("Testing POST /api/jobs - Add Job")
    
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
    
    try:
        response = requests.post(f"{BASE_URL}/jobs", json=test_job)
        response.raise_for_status()
        data = response.json()
        logger.info(f"✅ Add Job Test Passed: {data}")
        return data.get('id')
    except Exception as e:
        logger.error(f"❌ Add Job Test Failed: {str(e)}")
        return None

def test_get_all_jobs():
    """Test getting all jobs"""
    logger.info("Testing GET /api/jobs - Get All Jobs")
    
    try:
        response = requests.get(f"{BASE_URL}/jobs")
        response.raise_for_status()
        data = response.json()
        logger.info(f"✅ Get All Jobs Test Passed: Found {len(data.get('jobs', []))} jobs")
        return data.get('jobs', [])
    except Exception as e:
        logger.error(f"❌ Get All Jobs Test Failed: {str(e)}")
        return []

def test_search_jobs(query):
    """Test searching jobs"""
    logger.info(f"Testing GET /api/jobs?search={query} - Search Jobs")
    
    try:
        response = requests.get(f"{BASE_URL}/jobs", params={'search': query})
        response.raise_for_status()
        data = response.json()
        logger.info(f"✅ Search Jobs Test Passed: Found {len(data.get('jobs', []))} jobs matching '{query}'")
        return data.get('jobs', [])
    except Exception as e:
        logger.error(f"❌ Search Jobs Test Failed: {str(e)}")
        return []

def run_all_tests():
    """Run all endpoint tests"""
    logger.info("Starting API Endpoint Tests...")
    
    # Test 1: Add a job
    job_id = test_add_job()
    if not job_id:
        logger.error("❌ Add Job test failed, stopping further tests")
        return
    
    # Test 2: Get all jobs
    all_jobs = test_get_all_jobs()
    if not all_jobs:
        logger.error("❌ Get All Jobs test failed")
    
    # Test 3: Search jobs
    search_results = test_search_jobs("Software")
    if not search_results:
        logger.error("❌ Search Jobs test failed")
    
    logger.info("API Endpoint Tests Completed!")

if __name__ == "__main__":
    run_all_tests() 