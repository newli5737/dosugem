/**
 * PM2 — DOSU Gem
 * Chạy từ /home/dosugem (giống dosubook, dosutech-api, ...)
 *
 *   cd /home/dosugem
 *   pm2 start deploy/ecosystem.config.cjs
 *   pm2 save
 */
module.exports = {
  apps: [
    {
      name: 'dosugem-api',
      script: 'server/index.ts',
      interpreter: './node_modules/.bin/tsx',
      cwd: '/home/dosugem',
      exec_mode: 'fork',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 5081,
      },
      autorestart: true,
      max_memory_restart: '512M',
      error_file: '/home/logs/dosugem/api-error.log',
      out_file: '/home/logs/dosugem/api-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
