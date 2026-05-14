module.exports = {
  apps: [
    {
      name: 'home-portfolio',
      script: './server.js',
      cwd: __dirname,
      watch: false,
      env_file: './.env',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
