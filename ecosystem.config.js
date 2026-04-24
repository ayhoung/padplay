module.exports = {
  apps: [
    {
      name: 'padplay-backend',
      script: 'pnpm',
      args: 'start',
      cwd: '/home/ubuntu/padplay/backend',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'padplay-frontend',
      script: 'pnpm',
      args: 'start --port 6003',
      cwd: '/home/ubuntu/padplay/frontend',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
