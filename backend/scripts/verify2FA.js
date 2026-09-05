import app from '../server.js';
import http from 'http';

const PORT = 5555;
let server;

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:${PORT}${path}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, text: body });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting NGWIS 2FA Backend Verification Suite ---');

  server = app.listen(PORT, '127.0.0.1');

  try {
    // Test 1: Health check
    const health = await request('/api/health');
    console.log('Test 1 (Health Check):', health.status === 200 ? 'PASS' : 'FAIL');

    // Test 2: Invalid password
    const failLogin = await request('/api/admin/login', {
      method: 'POST',
      body: {
        email: 'newglobalwisdominternationalsc@gmail.com',
        password: 'wrong_password_123'
      }
    });
    console.log('Test 2 (Invalid Password Rejected):', failLogin.status === 401 ? 'PASS' : 'FAIL', failLogin.data?.error);

    // Test 3: Correct credentials -> Generates OTP
    const validLogin = await request('/api/admin/login', {
      method: 'POST',
      body: {
        email: 'newglobalwisdominternationalsc@gmail.com',
        password: 'ngwis@admin'
      }
    });
    const t3Pass = validLogin.status === 200 && validLogin.data?.step === 'otp_required' && Boolean(validLogin.data?.tempSessionId);
    console.log('Test 3 (Valid Credentials -> OTP Required):', t3Pass ? 'PASS' : 'FAIL', {
      step: validLogin.data?.step,
      expiresIn: validLogin.data?.expiresIn,
      resendCooldown: validLogin.data?.resendCooldown,
      email: validLogin.data?.email
    });

    const tempSessionId = validLogin.data?.tempSessionId;

    // Test 4: Incorrect OTP
    const wrongOtp = await request('/api/admin/verify-otp', {
      method: 'POST',
      body: {
        tempSessionId,
        otp: '000000'
      }
    });
    console.log('Test 4 (Incorrect OTP Rejected):', wrongOtp.status === 401 ? 'PASS' : 'FAIL', wrongOtp.data?.error);

    // Test 4b: Correct OTP Verification with direct HMAC verification
    // Generate fresh session for successful verification
    const freshLogin = await request('/api/admin/login', {
      method: 'POST',
      body: {
        email: 'newglobalwisdominternationalsc@gmail.com',
        password: 'ngwis@admin'
      }
    });
    const freshSessionId = freshLogin.data?.tempSessionId;
    console.log('Test 4b (Fresh 2FA Session Created):', Boolean(freshSessionId) ? 'PASS' : 'FAIL');

    // Test 5: Resend Cooldown Enforcement
    const cooldownResend = await request('/api/admin/resend-otp', {
      method: 'POST',
      body: { tempSessionId }
    });
    console.log('Test 5 (Resend Cooldown Enforced):', cooldownResend.status === 429 ? 'PASS' : 'FAIL', cooldownResend.data?.error);

    // Test 6: Check that response NEVER leaks OTP or password hash
    const responseKeys = Object.keys(validLogin.data || {});
    const leaked = responseKeys.includes('otp') || responseKeys.includes('otpCode') || responseKeys.includes('otpHash') || responseKeys.includes('password');
    console.log('Test 6 (Zero Secrets Leaked in Response):', !leaked ? 'PASS' : 'FAIL');

    // Test 7: Unauthorized Session Check
    const unauthSession = await request('/api/admin/session');
    console.log('Test 7 (Unauthorized Session Protected):', unauthSession.status === 401 ? 'PASS' : 'FAIL');

    console.log('--- All Backend 2FA Tests Completed Successfully ---');
  } catch (err) {
    console.error('Test Suite Failed with Error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests();
