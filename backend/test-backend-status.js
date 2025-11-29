const http = require('http');

console.log('🔍 Checking backend server status...');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log('✅ Server responded with status:', res.statusCode);
  
  if (res.statusCode === 200) {
    console.log('🚀 Backend server is running and accessible');
  } else {
    console.log('⚠️ Server responded but with unexpected status:', res.statusCode);
  }
});

req.on('error', (err) => {
  console.log('❌ Server error:', err.message);
  console.log('❌ Make sure the backend server is running on port 4000');
});

req.end();
