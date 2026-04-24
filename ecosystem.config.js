module.exports = {
  apps: [
    {
      name: 'home-portfolio',
      script: './server.js',
      cwd: '/home/adan/Project/Home',
      watch: false,
      env: {
        PORT: 3005,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'backend-qris',
      script: './backend-qris/index.js',
      cwd: '/home/adan/Project/Home',
      watch: false,
      env_file: './backend-qris/.env',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
