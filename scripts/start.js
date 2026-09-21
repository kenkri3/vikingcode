const { execSync, spawn } = require('child_process');

console.log('🚀 [AIProgram] Starting deployment environment check...');

const dbUrl = process.env.DATABASE_URL;

if (dbUrl && dbUrl.trim() !== '') {
  console.log('📦 [AIProgram] DATABASE_URL detected. Executing prisma migrate deploy...');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ [AIProgram] Prisma migrations successfully applied.');
  } catch (err) {
    console.error('⚠️ [AIProgram] Prisma migration encountered an issue (continuing to start server):', err.message);
  }
} else {
  console.log('ℹ️ [AIProgram] No DATABASE_URL detected. Running in memory / mock storage mode. Skipping Prisma migrations.');
}

const port = process.env.PORT || '3000';
console.log('🌐 [AIProgram] Launching Next.js server on port', port);

const child = spawn('npx', ['next', 'start', '-p', port], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
