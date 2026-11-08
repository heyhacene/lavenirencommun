import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.lavenirencommun.app',
  appName: "L'Avenir en commun",
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_aec',
      iconColor: '#9333EA'
    }
  }
};

export default config;
