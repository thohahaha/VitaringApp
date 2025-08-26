import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { 
  arrowBack, 
  fitness,
  heart,
  moon,
  walk,
  thermometer,
  analytics,
  notifications,
  business,
  location as locationIcon,
  globe,
  shieldCheckmark,
  documentText,
  library,
  mail,
  chevronForward
} from 'ionicons/icons';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonText
  ]
})
export class AboutPage implements OnInit {

  appVersion: string = '1.0.0';

  constructor(private location: Location) {
  addIcons({arrowBack,walk,thermometer,analytics,notifications,business,globe,shieldCheckmark,chevronForward,documentText,library,mail,fitness,heart,moon,location: locationIcon});
  }

  ngOnInit() {
    // Get app version from config or package.json
    this.loadAppVersion();
  }

  loadAppVersion() {
    // In a real app, this would load from app config
    this.appVersion = '1.0.0';
  }

  openPrivacyPolicy() {
    // Navigate to privacy policy
    console.log('Opening privacy policy...');
  }

  openTermsOfService() {
    // Navigate to terms of service
    console.log('Opening terms of service...');
  }

  openLicenses() {
    // Show open source licenses
    console.log('Opening open source licenses...');
  }

  sendEmail() {
    window.open('mailto:support@vitaring.com');
  }

  openWebsite() {
    window.open('https://www.vitaring.com', '_blank');
  }

  goBack() {
    this.location.back();
  }
}
