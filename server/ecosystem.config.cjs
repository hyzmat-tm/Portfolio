module.exports = {
  apps: [{
    name: 'portfolio-api',
    script: './server.js',
    cwd: '/var/www/Portfolio/server',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
