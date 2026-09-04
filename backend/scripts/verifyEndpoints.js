import app from '../server.js';

async function runTests() {
  const PORT = 5055;
  const server = app.listen(PORT, '127.0.0.1');

  try {
    const baseUrl = `http://127.0.0.1:${PORT}`;

    // 1. Health check
    console.log('1. Testing /api/health...');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthJson = await healthRes.json();
    if (healthRes.status !== 200 || healthJson.status !== 'ok') {
      throw new Error(`Health check failed: ${JSON.stringify(healthJson)}`);
    }
    console.log('   ✓ Health check passed:', healthJson.status);

    // 2. Public Notices
    console.log('2. Testing GET /api/notices...');
    const noticesRes = await fetch(`${baseUrl}/api/notices`);
    const noticesJson = await noticesRes.json();
    if (noticesRes.status !== 200 || !Array.isArray(noticesJson.notices)) {
      throw new Error(`Notices check failed: ${JSON.stringify(noticesJson)}`);
    }
    console.log(`   ✓ Notices count: ${noticesJson.count}`);

    // 3. Submit Enquiry
    console.log('3. Testing POST /api/enquiries...');
    const enquiryRes = await fetch(`${baseUrl}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: 'Aarav Sharma',
        parentName: 'Ramesh Sharma',
        classApplying: 'Class 6',
        mobile: '9876543210',
        email: 'ramesh@example.com',
        message: 'Looking for admission for academic session 2025-26'
      })
    });
    const enquiryJson = await enquiryRes.json();
    if (enquiryRes.status !== 201 || !enquiryJson.trackingId) {
      throw new Error(`Enquiry submission failed: ${JSON.stringify(enquiryJson)}`);
    }
    console.log(`   ✓ Enquiry created with tracking ID: ${enquiryJson.trackingId}`);

    // 4. Step 1: Admin Login
    console.log('4. Testing POST /api/auth/login...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ngwimail@gmail.com',
        password: 'admin@ngwi123'
      })
    });
    const loginJson = await loginRes.json();
    if (loginRes.status !== 200 || loginJson.step !== '2fa_required') {
      throw new Error(`Login step 1 failed: ${JSON.stringify(loginJson)}`);
    }
    console.log('   ✓ Step 1 Login passed, tempSessionId generated.');

    // 5. Step 2: 2FA Verification (using master fallback code 201608)
    console.log('5. Testing POST /api/auth/verify-2fa...');
    const verify2faRes = await fetch(`${baseUrl}/api/auth/verify-2fa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tempSessionId: loginJson.tempSessionId,
        code: '201608'
      })
    });
    const verify2faJson = await verify2faRes.json();
    if (verify2faRes.status !== 200 || !verify2faJson.token) {
      throw new Error(`2FA verification failed: ${JSON.stringify(verify2faJson)}`);
    }
    console.log('   ✓ 2FA verification passed, JWT session token received.');

    // 6. Access protected enquiries with JWT Bearer token
    console.log('6. Testing GET /api/enquiries (Protected)...');
    const protectedRes = await fetch(`${baseUrl}/api/enquiries`, {
      headers: {
        'Authorization': `Bearer ${verify2faJson.token}`
      }
    });
    const protectedJson = await protectedRes.json();
    if (protectedRes.status !== 200 || !Array.isArray(protectedJson.enquiries)) {
      throw new Error(`Protected enquiries access failed: ${JSON.stringify(protectedJson)}`);
    }
    console.log(`   ✓ Protected access verified! Total enquiries retrieved: ${protectedJson.count}`);

    console.log('\n===========================================');
    console.log('ALL 6 BACKEND INTEGRATION TESTS PASSED! 🎉');
    console.log('===========================================');
    process.exit(0);
  } finally {
    server.close();
  }
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
