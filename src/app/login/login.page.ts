import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { FirebaseDebugService } from '../auth/firebase-debug.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonLabel, IonItem, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonToast, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, fitnessOutline, alertCircleOutline, hourglassOutline, logoGoogle, logoFacebook, openOutline } from 'ionicons/icons';
import { DynamicBackgroundComponent } from '../shared/dynamic-background/dynamic-background.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonInput,
    IonLabel,
    IonItem,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonToast,
    IonIcon,
    DynamicBackgroundComponent
  ]
})
export class LoginPage {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  showError = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private firebaseDebug: FirebaseDebugService
  ) {
    console.log('LoginPage constructor called');
    console.log('AuthService instance:', this.authService);
    
    // Add icons
    addIcons({fitnessOutline,mailOutline,lockClosedOutline,alertCircleOutline,hourglassOutline,logoGoogle,openOutline,logoFacebook});
    
    // Debug Firebase configuration
    this.firebaseDebug.debugFirebaseConfig();
    this.firebaseDebug.printTroubleshootingSteps();
    this.firebaseDebug.testAuthConnection();
  }

  goToRegister() {
    console.log('Navigating to register page...');
    this.router.navigate(['/register']);
  }

  async login() {
    console.log('Login method called');
    console.log('Email:', this.email);
    console.log('Password length:', this.password.length);
    
    if (!this.email || !this.password) {
      console.log('Validation failed: missing email or password');
      this.showErrorMessage('Harap masukkan email dan password');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.showError = false;

    console.log('Starting login process...');
    
    try {
      console.log('Calling AuthService.login...');
      const result = await this.authService.login(this.email, this.password).toPromise();
      console.log('Login successful:', result);
      console.log('Navigating to home page...');
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Login failed:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      this.showErrorMessage(error.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      this.isLoading = false;
      console.log('Login process completed');
    }
  }

  /**
   * Login dengan Google
   */
  async loginWithGoogle() {
    console.log('Google login method called');
    
    this.isLoading = true;
    this.errorMessage = '';
    this.showError = false;

    console.log('Starting Google login process...');
    
    try {
      console.log('Calling AuthService.googleLogin...');
      const result = await this.authService.googleLogin().toPromise();
      console.log('Google login successful:', result);
      console.log('User info:', {
        email: result?.user?.email,
        displayName: result?.user?.displayName,
        photoURL: result?.user?.photoURL
      });
      console.log('Navigating to home page...');
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Google login failed:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      
      // Handle specific error messages
      let errorMessage = 'Login Google gagal. Silakan coba lagi.';
      
      if (error.message) {
        if (error.message.includes('popup')) {
          errorMessage = 'Popup login diblokir browser. Silakan izinkan popup untuk situs ini atau coba refresh halaman.';
        } else if (error.message.includes('unauthorized-domain')) {
          errorMessage = 'Domain tidak diotorisasi. Aplikasi sedang dalam pengembangan.';
        } else if (error.message.includes('operation-not-allowed')) {
          errorMessage = 'Google Sign-In belum dikonfigurasi. Silakan hubungi administrator.';
        } else {
          errorMessage = error.message;
        }
      }
      
      this.showErrorMessage(errorMessage);
    } finally {
      this.isLoading = false;
      console.log('Google login process completed');
    }
  }

  /**
   * Alternative Google login with redirect method
   */
  async loginWithGoogleRedirect() {
    console.log('Google redirect login method called');
    
    this.isLoading = true;
    this.errorMessage = '';
    this.showError = false;

    try {
      // Call the redirect method directly from auth service
      await this.authService.googleLoginRedirect().toPromise();
      // Note: After redirect, user will come back to this page and 
      // auth service will handle the result in checkForRedirectResult()
    } catch (error: any) {
      console.error('Google redirect login failed:', error);
      this.showErrorMessage(error.message || 'Login Google redirect gagal. Silakan coba lagi.');
      this.isLoading = false;
    }
  }

  private showErrorMessage(message: string) {
    console.log('Showing error message:', message);
    this.errorMessage = message;
    this.showError = true;
    setTimeout(() => {
      this.showError = false;
    }, 5000);
  }

  /**
   * Show debug information for troubleshooting
   */
  showDebugInfo() {
    console.log('='.repeat(60));
    console.log('🔧 DEBUGGING GOOGLE SIGN-IN ISSUE');
    console.log('='.repeat(60));
    
    this.firebaseDebug.debugFirebaseConfig();
    this.firebaseDebug.testAuthConnection();
    this.firebaseDebug.printTroubleshootingSteps();
    
    // Show alert with key information
    const currentDomain = window.location.origin;
    const message = `
🔧 DEBUG INFO:

Current Domain: ${currentDomain}
Port: ${window.location.port}

LANGKAH PERBAIKAN:
1. Buka Firebase Console
2. Masuk ke Authentication > Settings
3. Scroll ke "Authorized domains"
4. Tambahkan: localhost dan ${window.location.host}

Setelah itu, refresh halaman dan coba lagi.

Lihat console browser (F12) untuk detail lengkap.
    `;
    
    alert(message);
  }
}
