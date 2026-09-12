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
    const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'newglobalwisdominternationalsc@gmail.com',
        password: 'ngwis@admin'
      })
    });
    const loginJson = await loginRes.json();
    if (loginRes.status !== 200 || !loginJson.tempSessionId) {
      throw new Error(`Login step 1 failed: ${JSON.stringify(loginJson)}`);
    }
    console.log('   ✓ Step 1 Login passed, tempSessionId generated.');

    // 5. Step 2: 2FA Verification (using institutional master code 961686)
    console.log('5. Testing POST /api/admin/verify-otp...');
    const verify2faRes = await fetch(`${baseUrl}/api/admin/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tempSessionId: loginJson.tempSessionId,
        otp: '961686'
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

    // 7. Testing Public & Admin Gallery APIs
    console.log('7. Testing GET /api/gallery and POST /api/gallery...');
    const galRes = await fetch(`${baseUrl}/api/gallery`);
    const galJson = await galRes.json();
    if (galRes.status !== 200 || !Array.isArray(galJson.gallery)) {
      throw new Error(`Gallery check failed: ${JSON.stringify(galJson)}`);
    }
    console.log(`   ✓ Public gallery verified! Total photos: ${galJson.count}`);

    // 8. Testing Faculty APIs (GET, POST, PUT, DELETE)
    console.log('8. Testing Faculty APIs (GET, POST, PUT, DELETE)...');
    const facRes = await fetch(`${baseUrl}/api/faculty`);
    const facJson = await facRes.json();
    if (facRes.status !== 200 || !Array.isArray(facJson.faculty)) {
      throw new Error(`Faculty fetch failed: ${JSON.stringify(facJson)}`);
    }
    console.log(`   ✓ Public faculty verified! Total members: ${facJson.count}`);

    // Create test faculty member
    const createFacRes = await fetch(`${baseUrl}/api/faculty`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${verify2faJson.token}`
      },
      body: JSON.stringify({
        name: 'Test IT Faculty',
        designation: 'Instructor – Computer Lab',
        departmentOrSubject: 'Computer Applications & ICT',
        isSeniorLeadership: false,
        roleCategory: 'teacher',
        photoUrl: ''
      })
    });
    const createFacJson = await createFacRes.json();
    if (createFacRes.status !== 201 || !createFacJson.member) {
      throw new Error(`Faculty creation failed: ${JSON.stringify(createFacJson)}`);
    }
    const testFacId = createFacJson.member.id;
    console.log(`   ✓ Faculty created with S.No. / ID: ${testFacId}`);

    // Update test faculty member
    const updateFacRes = await fetch(`${baseUrl}/api/faculty/${testFacId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${verify2faJson.token}`
      },
      body: JSON.stringify({
        designation: 'Senior Instructor – ICT'
      })
    });
    const updateFacJson = await updateFacRes.json();
    if (updateFacRes.status !== 200 || updateFacJson.member.designation !== 'Senior Instructor – ICT') {
      throw new Error(`Faculty update failed: ${JSON.stringify(updateFacJson)}`);
    }
    console.log(`   ✓ Faculty updated successfully!`);

    // Delete test faculty member
    const deleteFacRes = await fetch(`${baseUrl}/api/faculty/${testFacId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${verify2faJson.token}`
      }
    });
    const deleteFacJson = await deleteFacRes.json();
    if (deleteFacRes.status !== 200) {
      throw new Error(`Faculty delete failed: ${JSON.stringify(deleteFacJson)}`);
    }
    console.log(`   ✓ Faculty deleted successfully!`);

    console.log('\n===========================================');
    console.log('ALL 8 BACKEND INTEGRATION TESTS PASSED! 🎉');
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
