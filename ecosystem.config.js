module.exports = {
  apps: [
    {
      name: 'tabletgaming-backend',
      script: 'pnpm',
      args: 'start',
      cwd: '/home/ubuntu/tabletgaming/backend',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'tabletgaming-frontend',
      script: 'pnpm',
      args: 'start --port 6003',
      cwd: '/home/ubuntu/tabletgaming/frontend',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
