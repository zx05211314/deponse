import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c106a358eb394ba8b59bf2a350671d26',
  appName: 'scene-sentinel-watchdog',
  webDir: 'dist',
  server: {
    url: 'https://c106a358-eb39-4ba8-b59b-f2a350671d26.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    Camera: {
      permissions: {
        camera: "Camera access is required for scene monitoring"
      }
    }
  }
};

export default config;