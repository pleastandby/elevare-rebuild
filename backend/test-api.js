import axios from 'axios';

console.log('Testing API endpoints...');

const backendUrl = 'http://localhost:4000';

async function testAPI() {
  try {
    // Test without auth first
    console.log('\n1️⃣ Testing GET /api/assignment without auth...');
    try {
      const response = await axios.get(`${backendUrl}/api/assignment`);
      console.log('❌ Should have failed but got:', response.status);
    } catch (error) {
      console.log('✅ Correctly failed without auth:', error.response?.status || error.message);
    }

    // Test with a fake token
    console.log('\n2️⃣ Testing GET /api/assignment with fake token...');
    try {
      const response = await axios.get(`${backendUrl}/api/assignment`, {
        headers: {
          Authorization: 'Bearer fake-token-here'
        }
      });
      console.log('❌ Should have failed but got:', response.status);
    } catch (error) {
      console.log('✅ Correctly failed with fake token:', error.response?.status || error.message);
    }

    // Test if server is running
    console.log('\n3️⃣ Testing server health...');
    try {
      const response = await axios.get(`${backendUrl}/`);
      console.log('✅ Server is running:', response.status);
    } catch (error) {
      console.log('❌ Server not accessible:', error.message);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAPI();
