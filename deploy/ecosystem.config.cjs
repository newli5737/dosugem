/**
 * PM2 — DOSU Gem production
 * Port API nội bộ: 5081 (không dùng 3001)
 *
 * pm2 start deploy/ecosystem.config.cjs
 * pm2 save && pm2 startup
 */
module.exports = {
  apps: [
    {
      name: 'dosugem-api',
      script: 'server/index.ts',
      interpreter: 'node',
      interpreter_args: '--import tsx',
      cwd: '/var/www/dosugem',
      env: {
        NODE_ENV: 'production',
        PORT: 5081,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '512M',
      error_file: '/var/log/dosugem/api-error.log',
      out_file: '/var/log/dosugem/api-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
