import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons,
  IonButton,
  IonIcon,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  ToastController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, AppUser } from '../auth/auth.service';
import { UserProfileService, UserProfile as FirestoreUserProfile } from '../services/user-profile.service';
import { addIcons } from 'ionicons';
import { 
  arrowBack, 
  personCircle, 
  camera, 
  checkmark, 
  close 
} from 'ionicons/icons';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bio: string;
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
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
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonCard,
    IonCardContent,
    IonList,
    IonItem
  ]
})
export class EditProfilePage implements OnInit {

  userProfile: UserProfile = {
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bio: ''
  };

  currentUser: AppUser | null = null;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private toastController: ToastController
  ) {
    // Add icons
    addIcons({
      arrowBack,
      personCircle,
      camera,
      checkmark,
      close
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    this.isLoading = true;
    
    try {
      // Get current user from auth service
      this.currentUser = this.authService.getCurrentUser();
      
      if (this.currentUser) {
        // Get detailed profile from Firestore
        const firestoreProfile = await this.userProfileService.getCurrentUserProfile();
        
        // Map data to form
        this.userProfile = {
          fullName: firestoreProfile?.fullName || firestoreProfile?.displayName || this.currentUser.displayName || '',
          email: this.currentUser.email || '',
          phone: firestoreProfile?.phoneNumber || this.currentUser.phoneNumber || '',
          dateOfBirth: firestoreProfile?.dateOfBirth || '',
          gender: firestoreProfile?.gender || '',
          bio: firestoreProfile?.bio || ''
        };
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      await this.showToast('Error loading profile data', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  getUserAvatar(): string {
    return this.currentUser?.photoURL || '';
  }

  async saveProfile() {
    if (!this.currentUser) {
      await this.showToast('No user logged in', 'danger');
      return;
    }

    this.isLoading = true;

    try {
      // Prepare profile data for Firestore
      const profileData: Partial<FirestoreUserProfile> = {
        fullName: this.userProfile.fullName,
        displayName: this.userProfile.fullName, // Also update displayName
        phoneNumber: this.userProfile.phone,
        dateOfBirth: this.userProfile.dateOfBirth,
        gender: this.userProfile.gender,
        bio: this.userProfile.bio
      };

      // Save to Firestore
      await this.userProfileService.updateUserProfile(profileData).toPromise();
      
      await this.showToast('Profile updated successfully!', 'success');
      this.goBack();
      
    } catch (error) {
      console.error('Error saving profile:', error);
      await this.showToast('Error saving profile. Please try again.', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  goBack() {
    this.location.back();
  }
}
