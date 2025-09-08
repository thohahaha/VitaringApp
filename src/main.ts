import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

// Register Ionicons
import { addIcons } from 'ionicons';
import { 
  heartHalfOutline, 
  statsChartOutline, 
  newspaperOutline, 
  wifiOutline, 
  personCircleOutline,
  personCircle,
  batteryHalfOutline,
  heart,
  heartOutline,
  thermometerOutline,
  thermometer,
  waterOutline,
  walkOutline,
  flameOutline,
  moonOutline,
  radioButtonOnOutline,
  arrowBack,
  arrowForward,
  searchOutline,
  homeOutline,
  shareOutline,
  ellipsisVertical,
  chevronDownCircleOutline,
  eyeOutline,
  chatbubbleOutline,
  sendOutline,
  send,
  pin,
  people,
  // Newly added icons to silence warnings
  speedometerOutline,
  trendingUpOutline,
  sunnyOutline,
  radioOutline,
  serverOutline,
  hardwareChipOutline,
  documentTextOutline,
  powerOutline,
  timeOutline,
  fitnessOutline
} from 'ionicons/icons';

addIcons({
  // Existing icons
  'heart-half-outline': heartHalfOutline,
  'stats-chart-outline': statsChartOutline,
  'newspaper-outline': newspaperOutline,
  'wifi-outline': wifiOutline,
  'person-circle-outline': personCircleOutline,
  'person-circle': personCircle,
  'battery-half-outline': batteryHalfOutline,
  'heart': heart,
  'heart-outline': heartOutline,
  'thermometer-outline': thermometerOutline,
  'thermometer': thermometer,
  'water-outline': waterOutline,
  'walk-outline': walkOutline,
  'flame-outline': flameOutline,
  'moon-outline': moonOutline,
  'target-outline': radioButtonOnOutline,
  'arrow-back': arrowBack,
  'arrow-forward': arrowForward,
  'search-outline': searchOutline,
  'home-outline': homeOutline,
  'share-outline': shareOutline,
  'ellipsis-vertical': ellipsisVertical,
  'chevron-down-circle-outline': chevronDownCircleOutline,
  'eye-outline': eyeOutline,
  'chatbubble-outline': chatbubbleOutline,
  'send-outline': sendOutline,
  'send': send,
  'pin': pin,
  'people': people,
  // New global registrations to remove warnings
  'speedometer-outline': speedometerOutline,
  'trending-up-outline': trendingUpOutline,
  'sunny-outline': sunnyOutline,
  'radio-outline': radioOutline,
  'server-outline': serverOutline,
  'hardware-chip-outline': hardwareChipOutline,
  'document-text-outline': documentTextOutline,
  'power-outline': powerOutline,
  'time-outline': timeOutline,
  'fitness-outline': fitnessOutline,
  // Alias: some templates still use database-outline, map to server icon
  'database-outline': serverOutline
});

if (environment.production) {
  enableProdMode();
  
  // Clear service worker cache to ensure fresh app load
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        console.log('Unregistering service worker:', registration);
        registration.unregister();
      }
    });
  }
}

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error('Error bootstrapping application:', err));
