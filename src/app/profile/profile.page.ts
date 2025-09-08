import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonButton,
  IonSpinner
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AuthService, AppUser } from '../auth/auth.service';
import { UserProfileService, UserProfile } from '../services/user-profile.service';
import { ForumService } from '../services/forum.service';
import { ForumPost } from '../models/forum.model';
import { Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import { 
  personCircle, 
  personOutline, 
  notificationsOutline, 
  shieldOutline, 
  helpCircleOutline, 
  informationCircleOutline, 
  logOutOutline, 
  chevronForwardOutline,
  chatbubbleOutline,
  heartOutline,
  eyeOutline,
  timeOutline,
  documentTextOutline, 
  pricetag, 
  shareOutline, 
  bookmarkOutline, 
  openOutline,
  medical,
  hardwareChip,
  flower,
  fitness,
  nutrition,
  happy,
  bulb,
  star,
  chatbubbles,
  helpCircle,
  heart,
  chatbubble,
  eye
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    IonButton,
    IonSpinner,
    NavbarComponent
  ]
})
export class ProfilePage implements OnInit {

  currentUser: AppUser | null = null;
  userProfile: UserProfile | null = null;
  activeTab: string = 'posts';
  userPosts$: Observable<ForumPost[]> | null = null;
  isLoadingPosts: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private forumService: ForumService
  ) {
    // Add icons
    addIcons({
      personCircle,
      documentTextOutline,
      timeOutline,
      pricetag,
      heart,
      chatbubble,
      eye,
      shareOutline,
      bookmarkOutline,
      openOutline,
      personOutline,
      chevronForwardOutline,
      notificationsOutline,
      shieldOutline,
      helpCircleOutline,
      informationCircleOutline,
      logOutOutline,
      chatbubbleOutline,
      heartOutline,
      eyeOutline,
      medical,
      hardwareChip,
      flower,
      fitness,
      nutrition,
      happy,
      bulb,
      star,
      chatbubbles,
      helpCircle
    });
  }

  ngOnInit() {
    this.loadUserProfile();
    this.loadUserPosts();
  }

  ionViewWillEnter() {
    // Refresh data when returning to this page
    this.loadUserProfile();
    this.loadUserPosts();
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

  loadUserPosts() {
    if (this.currentUser) {
      this.isLoadingPosts = true;
      const userId = this.currentUser.uid || this.currentUser.email || '';
      this.userPosts$ = this.forumService.getPostsByAuthor(userId);
      this.isLoadingPosts = false;
    }
  }

  onSegmentChange(event: any) {
    this.activeTab = event.detail.value;
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 hari yang lalu';
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} minggu yang lalu`;
    return date.toLocaleDateString('id-ID');
  }

  getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'Kesehatan': 'medical',
      'Teknologi': 'hardware-chip',
      'Lifestyle': 'flower',
      'Fitness': 'fitness',
      'Nutrisi': 'nutrition',
      'Mental Health': 'happy',
      'Tips': 'bulb',
      'Review': 'star',
      'Diskusi': 'chatbubbles',
      'Pertanyaan': 'help-circle'
    };
    return iconMap[category] || 'document-text';
  }

  navigateToPost(postId: string) {
    this.router.navigate(['/forum', postId]);
  }

  navigateToCreatePost() {
    this.router.navigate(['/create-post']);
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
