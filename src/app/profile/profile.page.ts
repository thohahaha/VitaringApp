import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonIcon 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AuthService, AppUser } from '../auth/auth.service';
import { UserProfileService, UserProfile } from '../services/user-profile.service';
import { addIcons } from 'ionicons';
import { 
  personCircle, 
  personOutline, 
  notificationsOutline, 
  shieldOutline, 
  helpCircleOutline, 
  informationCircleOutline, 
  logOutOutline, 
  chevronForwardOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    NavbarComponent
  ]
})
export class ProfilePage implements OnInit {

  currentUser: AppUser | null = null;
  userProfile: UserProfile | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userProfileService: UserProfileService
  ) {
    // Add icons
    addIcons({
      personCircle,
      personOutline,
      notificationsOutline,
      shieldOutline,
      helpCircleOutline,
      informationCircleOutline,
      logOutOutline,
      chevronForwardOutline
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  ionViewWillEnter() {
    // Refresh data when returning to this page
    this.loadUserProfile();
  }

  async loadUserProfile() {
    try {
      // Get current user from auth service
      this.currentUser = this.authService.getCurrentUser();
      
      // Get detailed profile from Firestore
      if (this.currentUser) {
        this.userProfile = await this.userProfileService.getCurrentUserProfile();
      }
      
      console.log('Current user:', this.currentUser);
      console.log('User profile:', this.userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  getUserDisplayName(): string {
    // Priority: profile fullName > profile displayName > auth displayName > email prefix
    if (this.userProfile?.fullName) {
      return this.userProfile.fullName;
    }
    if (this.userProfile?.displayName) {
      return this.userProfile.displayName;
    }
    if (this.currentUser?.displayName) {
      return this.currentUser.displayName;
    }
    if (this.currentUser?.email) {
      // Extract name from email if displayName is not available
      return this.currentUser.email.split('@')[0];
    }
    return 'User Profile';
  }

  getUserEmail(): string {
    return this.currentUser?.email || 'user@vitaring.com';
  }

  getUserAvatar(): string {
    // Priority: profile photoURL > auth photoURL
    return this.userProfile?.photoURL || this.currentUser?.photoURL || '';
  }

  navigateToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  navigateToPrivacy() {
    this.router.navigate(['/privacy']);
  }

  navigateToHelpCenter() {
    this.router.navigate(['/help-center']);
  }

  navigateToAbout() {
    this.router.navigate(['/about']);
  }

  async logout() {
    try {
      await this.authService.logout().toPromise();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}
