import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.susie0306.xiji',
  appName: 'Xiji',
  webDir: 'public',
  server: {
    url: 'https://note-platform-seven.vercel.app',
    cleartext: true, // 允许 http 连接 (非 https)
    allowNavigation: [
      '*.clerk.accounts.dev',
      '*.clerk.com',
      'clerk.com',
      'accounts.google.com', // 如果你用了 Google 登录，也需要加上这个
    ],
  },
}

export default config
