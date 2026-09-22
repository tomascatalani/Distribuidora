module.exports = {
  apps: [
    {
      name: 'puesto-de-palta',
      script: 'npx',
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        NOTION_TOKEN: 'SET_IN_CLOUDFLARE_ENV',
        NOTION_DB_ID: '3233fd35-c857-8076-8608-f97f0cbf9873',
        BREVO_API_KEY: 'SET_IN_CLOUDFLARE_ENV',
        ONESIGNAL_APP_ID: 'f79c1b7e-b2fc-4f3f-a7eb-fb0ba3dec26e',
        ONESIGNAL_API_KEY: 'SET_IN_CLOUDFLARE_ENV'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
