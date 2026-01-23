import unittest
import requests
import time
import os

class TestVikunjaAPI(unittest.TestCase):
    """Tests pour vérifier que l'API Vikunja fonctionne"""
    
    def setUp(self):
        """Configuration avant chaque test"""
        # Attendre que Vikunja soit prêt
        time.sleep(5)
        self.base_url = "http://vikunja:3456/api/v1"
    
    def test_api_health_check(self):
        """Test que l'API répond avec un health check"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=5)
            self.assertEqual(response.status_code, 200)
            print("✅ Health check passed")
        except requests.exceptions.ConnectionError:
            self.fail("Vikunja API not accessible at http://vikunja:3456")
    
    def test_api_root_endpoint(self):
        """Test que le endpoint racine répond"""
        try:
            response = requests.get(self.base_url, timeout=5)
            # 200 ou 404 sont acceptables, l'important c'est que l'API répond
            self.assertIn(response.status_code, [200, 404, 401])
            print("✅ Root endpoint responded")
        except requests.exceptions.ConnectionError:
            self.fail("Vikunja API not accessible")
    
    def test_docker_environment(self):
        """Test que nous sommes dans Docker"""
        self.assertTrue(os.path.exists("/.dockerenv"), 
                       "Tests doivent s'exécuter dans Docker")
        print("✅ Running inside Docker container")

if __name__ == '__main__':
    # Exécuter les tests avec verbosité
    unittest.main(verbosity=2)
