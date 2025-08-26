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
  IonToggle
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
  arrowBack, 
  download, 
  trash 
} from 'ionicons/icons';

interface PrivacySettings {
  healthDataCollection: boolean;
  activityTracking: boolean;
  locationServices: boolean;
  analytics: boolean;
  thirdPartyIntegration: boolean;
  healthAlerts: boolean;
  marketingCommunications: boolean;
}

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonToggle
  ]
})
export class PrivacyPage implements OnInit {

  privacySettings: PrivacySettings = {
    healthDataCollection: true,
    activityTracking: true,
    locationServices: false,
    analytics: true,
    thirdPartyIntegration: false,
    healthAlerts: true,
    marketingCommunications: false
  };

  constructor(private location: Location) {
    addIcons({
      arrowBack,
      download,
      trash
    });
  }

  ngOnInit() {
    this.loadPrivacySettings();
  }

  loadPrivacySettings() {
    // Load privacy settings from storage
    const saved = localStorage.getItem('privacySettings');
    if (saved) {
      this.privacySettings = JSON.parse(saved);
    }
  }

  savePrivacySettings() {
    localStorage.setItem('privacySettings', JSON.stringify(this.privacySettings));
  }

  exportData() {
    // Export user data functionality
    console.log('Exporting user data...');
    // In a real app, this would generate and download a data export
  }

  deleteAccount() {
    // Delete account functionality
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account...');
      // In a real app, this would delete the user account
    }
  }

  goBack() {
    this.savePrivacySettings();
    this.location.back();
  }
}
