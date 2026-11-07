import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.lavenirencommun.app',
  appName: "L'Avenir en commun",
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#4C0297',
      sound: 'beep.wav'
    }
  }
};

export default config;
