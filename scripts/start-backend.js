import { spawn } from 'child_process';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, '../../backend');

function isPortInUse(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}

async function start() {
  const inUse = await isPortInUse(8080);
  if (inUse) {
    console.log('\x1b[36m%s\x1b[0m', '➜ Backend is already active on http://localhost:8080');
    console.log('\x1b[36m%s\x1b[0m', '➜ Swagger UI available at http://localhost:8080/swagger-ui.html');
    // Keep alive so concurrently doesn't exit
    setInterval(() => {}, 60000);
    return;
  }

  console.log('\x1b[36m%s\x1b[0m', '➜ Launching Spring Boot Backend...');
  console.log('\x1b[36m%s\x1b[0m', '➜ Backend URL: http://localhost:8080');
  console.log('\x1b[36m%s\x1b[0m', '➜ Swagger Docs: http://localhost:8080/swagger-ui.html');

  const isWindows = process.platform === 'win32';
  const mvnCmd = isWindows ? 'mvn.cmd' : 'mvn';

  const child = spawn(mvnCmd, ['-f', path.join(backendDir, 'pom.xml'), 'spring-boot:run'], {
    cwd: backendDir,
    stdio: 'inherit',
    shell: true,
  });

  child.on('error', (err) => {
    console.error('\x1b[31m%s\x1b[0m', `Failed to start backend: ${err.message}`);
  });

  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.log(`Backend process exited with code ${code}`);
    }
  });

  process.on('SIGINT', () => child.kill());
  process.on('SIGTERM', () => child.kill());
}

start();
