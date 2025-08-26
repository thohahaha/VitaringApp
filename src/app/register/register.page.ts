import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonLabel, IonItem, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonToast, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, fitnessOutline, alertCircleOutline, hourglassOutline, logoGoogle } from 'ionicons/icons';
import { DynamicBackgroundComponent } from '../shared/dynamic-background/dynamic-background.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
export class RegisterPage {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  agreeToTerms = false;
  isLoading = false;
  errorMessage = '';
  showError = false;

  constructor(private authService: AuthService, private router: Router) {
    console.log('RegisterPage constructor called');
    console.log('AuthService instance:', this.authService);
    
    // Add icons
    addIcons({
      personOutline,
      mailOutline,
      lockClosedOutline,
      fitnessOutline,
      alertCircleOutline,
      hourglassOutline,
      logoGoogle
    });
  }

  goToLogin() {
    console.log('Navigating to login page...');
    this.router.navigate(['/login']);
  }

  onButtonClick() {
    console.log('Button clicked!');
  }

  onFormSubmit(event: any) {
    console.log('Form submit event triggered!', event);
  }

  async register() {
    console.log('Register method called');
    console.log('Full Name:', this.fullName);
    console.log('Email:', this.email);
    console.log('Password length:', this.password.length);
    console.log('Agree to terms:', this.agreeToTerms);
    
    // Validation
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      console.log('Validation failed: missing required fields');
      this.showErrorMessage('Harap lengkapi semua field yang diperlukan');
      return;
    }

    if (this.password !== this.confirmPassword) {
      console.log('Validation failed: passwords do not match');
      this.showErrorMessage('Password dan konfirmasi password tidak sama');
      return;
    }

    if (this.password.length < 6) {
      console.log('Validation failed: password too short');
      this.showErrorMessage('Password harus minimal 6 karakter');
      return;
    }

    if (!this.agreeToTerms) {
      console.log('Validation failed: terms not agreed');
      this.showErrorMessage('Harap setujui syarat dan ketentuan');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.showError = false;

    console.log('Starting registration process...');
    
    try {
      console.log('Calling AuthService.register...');
      const result = await this.authService.register(this.email, this.password).toPromise();
      console.log('Registration successful:', result);
      console.log('Navigating to home page...');
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Registration failed:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      this.showErrorMessage(error.message || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      this.isLoading = false;
      console.log('Registration process completed');
    }
  }

  async registerWithGoogle() {
    console.log('Register with Google clicked');
    
    this.isLoading = true;
    this.errorMessage = '';
    this.showError = false;

    try {
      console.log('Calling AuthService.googleLogin...');
      const result = await this.authService.googleLogin().toPromise();
      console.log('Google registration successful:', result);
      console.log('Navigating to home page...');
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Google registration failed:', error);
      console.error('Error message:', error.message);
      this.showErrorMessage(error.message || 'Login dengan Google gagal. Silakan coba lagi.');
    } finally {
      this.isLoading = false;
      console.log('Google registration process completed');
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
}
