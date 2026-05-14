module.exports = {
  apps: [
    {
      name: 'home-portfolio',
      script: './server.js',
      cwd: __dirname,
      watch: false,
      env: {
        PORT: 1001,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'backend-qris',
      script: './backend-qris/index.js',
      cwd: __dirname,
      watch: false,
      env_file: './backend-qris/.env',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
