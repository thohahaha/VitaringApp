import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { 
  Firestore, 
  doc, 
  updateDoc,
  getDoc,
  setDoc
} from '@angular/fire/firestore';
import { AuthService, AppUser } from '../auth/auth.service';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  /**
   * Get current user profile from Firestore
   */
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return null;
    }

    try {
      const userDoc = doc(this.firestore, 'users', currentUser.uid);
      const userSnap = await getDoc(userDoc);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile in Firestore
   */
  updateUserProfile(profileData: Partial<UserProfile>): Observable<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    const userDoc = doc(this.firestore, 'users', currentUser.uid);
    const updateData = {
      ...profileData,
      updatedAt: new Date()
    };

    return from(updateDoc(userDoc, updateData));
  }

  /**
   * Create or update complete user profile
   */
  saveUserProfile(profileData: UserProfile): Observable<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    const userDoc = doc(this.firestore, 'users', currentUser.uid);
    const saveData = {
      ...profileData,
      uid: currentUser.uid,
      updatedAt: new Date()
    };

    return from(setDoc(userDoc, saveData, { merge: true }));
  }

  /**
   * Update user display name in both Firestore and Auth
   */
  async updateDisplayName(displayName: string): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      // Update in Firestore
      await this.updateUserProfile({ displayName }).toPromise();
      console.log('Display name updated in Firestore');
    } catch (error) {
      console.error('Error updating display name:', error);
      throw error;
    }
  }

  /**
   * Update user photo URL
   */
  async updatePhotoURL(photoURL: string): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    try {
      // Update in Firestore
      await this.updateUserProfile({ photoURL }).toPromise();
      console.log('Photo URL updated in Firestore');
    } catch (error) {
      console.error('Error updating photo URL:', error);
      throw error;
    }
  }
}
