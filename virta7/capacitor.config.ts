import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.virta7.app',
  appName: 'Virta7',
  webDir: 'dist',
  // Serves the app itself over http://localhost instead of https://localhost, so it can call
  // the plain-http dev backend without tripping the WebView's mixed-content block. Once the
  // backend is deployed behind HTTPS, this can go back to the default ('https').
  server: {
    androidScheme: 'http',
  },
};

export default config;
