const https = require('https');

function request(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'backend-orcin-delta-64.vercel.app',
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`[${res.statusCode}] ${path}:`, body);
        resolve({ status: res.statusCode, body });
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('\n--- Step 1: Register Customer ---');
  await request('/api/auth/customer/register', {
    name: 'Ramcharan',
    phone: '9848223681',
    email: 'kunchaparthiramcharan@gmail.com',
    password: 'testpass123'
  });

  console.log('\n--- Step 2: Trigger Forgot Password OTP ---');
  await request('/api/auth/forgot-password', {
    email: 'kunchaparthiramcharan@gmail.com'
  });
}

main().catch(console.error);
