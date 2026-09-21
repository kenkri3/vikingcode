const { execSync, spawn } = require('child_process');

console.log('🚀 [VikingCode] Starting deployment environment check...');

const dbUrl = process.env.DATABASE_URL;

if (dbUrl && dbUrl.trim() !== '') {
  console.log('📦 [VikingCode] DATABASE_URL detected. Executing prisma migrate deploy...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ [VikingCode] Prisma migrations successfully applied.');
  } catch (err) {
    console.error('⚠️ [VikingCode] Prisma migration encountered an issue (continuing to start server):', err.message);
  }
} else {
  console.log('ℹ️ [VikingCode] No DATABASE_URL detected. Running in memory / mock storage mode. Skipping Prisma migrations.');
}

const port = process.env.PORT || '3000';
console.log('🌐 [VikingCode] Launching Next.js server on port', port);

const child = spawn('npx', ['next', 'start', '-p', port], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
