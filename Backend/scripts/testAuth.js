const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAuthentication() {
  console.log('🧪 Testing Email OTP Authentication System\n');

  try {
    // Test 1: Send OTP
    console.log('1. Testing OTP sending...');
    const testEmail = 'test@example.com';
    
    const otpResponse = await axios.post(`${API_BASE}/auth/send-otp`, {
      email: testEmail
    });
    
    if (otpResponse.data.success) {
      console.log('✅ OTP sent successfully');
      console.log(`   Message: ${otpResponse.data.message}`);
    } else {
      console.log('❌ Failed to send OTP');
      return;
    }

    // Test 2: Verify session endpoint
    console.log('\n2. Testing session verification (should fail without token)...');
    try {
      await axios.get(`${API_BASE}/auth/verify-session`);
      console.log('❌ Session verification should have failed');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Session verification correctly rejected unauthorized request');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Test 3: Test protected school route
    console.log('\n3. Testing protected school route (should fail without auth)...');
    try {
      await axios.post(`${API_BASE}/schools/add`, {
        name: 'Test School',
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        contact: '1234567890',
        email_id: 'school@test.com'
      });
      console.log('❌ Protected route should have failed');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Protected route correctly rejected unauthorized request');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Test 4: Test public school route
    console.log('\n4. Testing public school route...');
    try {
      const schoolsResponse = await axios.get(`${API_BASE}/schools/all`);
      console.log('✅ Public route accessible');
      console.log(`   Found ${schoolsResponse.data.data?.length || 0} schools`);
    } catch (error) {
      console.log('❌ Public route failed:', error.message);
    }

    console.log('\n🎉 Authentication system tests completed!');
    console.log('\nNote: To test OTP verification, you would need to:');
    console.log('1. Set up Gmail credentials in .env file');
    console.log('2. Use a real email address');
    console.log('3. Check email for the OTP code');
    console.log('4. Use the OTP to complete authentication');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
  }
}

// Run the test
testAuthentication();
