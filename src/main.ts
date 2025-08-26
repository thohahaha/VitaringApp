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
  batteryHalfOutline,
  heart,
  heartOutline,
  thermometerOutline,
  waterOutline,
  walkOutline,
  flameOutline,
  moonOutline,
  radioButtonOnOutline,
  arrowBack,
  searchOutline,
  homeOutline,
  shareOutline,
  ellipsisVertical,
  chevronDownCircleOutline,
  eyeOutline,
  chatbubbleOutline,
  sendOutline,
  pin,
  people
} from 'ionicons/icons';

addIcons({
  'heart-half-outline': heartHalfOutline,
  'stats-chart-outline': statsChartOutline,
  'newspaper-outline': newspaperOutline,
  'wifi-outline': wifiOutline,
  'person-circle-outline': personCircleOutline,
  'battery-half-outline': batteryHalfOutline,
  'heart': heart,
  'heart-outline': heartOutline,
  'thermometer-outline': thermometerOutline,
  'water-outline': waterOutline,
  'walk-outline': walkOutline,
  'flame-outline': flameOutline,
  'moon-outline': moonOutline,
  'target-outline': radioButtonOnOutline,
  'arrow-back': arrowBack,
  'search-outline': searchOutline,
  'home-outline': homeOutline,
  'share-outline': shareOutline,
  'ellipsis-vertical': ellipsisVertical,
  'chevron-down-circle-outline': chevronDownCircleOutline,
  'eye-outline': eyeOutline,
  'chatbubble-outline': chatbubbleOutline,
  'send-outline': sendOutline,
  'pin': pin,
  'people': people
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
