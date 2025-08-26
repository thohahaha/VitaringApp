import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  IonFooter, 
  IonTabBar, 
  IonTabButton,
  IonSpinner,
  IonText,
  IonFab,
  IonFabButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar
} from '@ionic/angular/standalone';
import { ForumService } from '../services/forum.service';
import { AuthService } from '../auth/auth.service';
import { Post, ForumStats } from '../models/forum.model';
import { Observable } from 'rxjs';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { addIcons } from 'ionicons';
import { 
  arrowBack,
  searchOutline,
  menuOutline,
  addOutline,
  heartOutline,
  heart,
  chatbubbleOutline,
  eyeOutline,
  personCircleOutline,
  heartHalfOutline,
  statsChartOutline,
  newspaperOutline,
  wifiOutline,
  people,
  trendingUp,
  filterOutline, pin } from 'ionicons/icons';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.page.html',
  styleUrls: ['./forum.page.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonFooter,
    IonTabBar,
    IonTabButton,
    IonSpinner,
    IonText,
    IonFab,
    IonFabButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
    IonSearchbar,
    TimeAgoPipe,
    AsyncPipe,
    NavbarComponent
  ]
})
export class ForumPage implements OnInit {
  posts$!: Observable<Post[]>;
  forumStats$!: Observable<ForumStats>;
  selectedFilter: 'newest' | 'featured' | 'popular' = 'newest';
  searchTerm: string = '';
  isLoggedIn: boolean = false;
  currentUserId: string | null = null;

  constructor(
    private forumService: ForumService,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {
    // Register icons
    addIcons({
      arrowBack,
      searchOutline,
      menuOutline,
      trendingUp,
      heart,
      people,
      chatbubbleOutline,
      pin,
      eyeOutline,
      addOutline,
      heartOutline,
      heartHalfOutline,
      statsChartOutline,
      newspaperOutline,
      wifiOutline,
      personCircleOutline,
      filterOutline
    });
  }

  ngOnInit() {
    this.checkAuthStatus();
    this.loadPosts();
    this.loadForumStats();
  }

  private checkAuthStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUser();
      this.currentUserId = user?.email || null;
    }
  }

  loadPosts() {
    this.posts$ = this.forumService.getPosts(this.selectedFilter);
  }

  loadForumStats() {
    this.forumStats$ = this.forumService.getForumStats();
  }

  onFilterChange(event: any) {
    this.selectedFilter = event.detail.value;
    this.loadPosts();
  }

  onSearchChange(event: any) {
    const query = event.detail.value;
    this.searchTerm = query;
    
    if (query.trim() === '') {
      this.loadPosts();
    } else {
      this.posts$ = this.forumService.searchPosts(query);
    }
  }

  navigateToPostDetail(postId: string) {
    if (postId) {
      this.router.navigate(['/forum', postId]);
    }
  }

  async onLike(post: Post, event: Event) {
    event.stopPropagation();
    
    if (!this.isLoggedIn || !this.currentUserId) {
      // Redirect to login or show login modal
      this.router.navigate(['/login']);
      return;
    }

    try {
      await this.forumService.togglePostLike(post.id!, this.currentUserId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  }

  isPostLikedByUser(post: Post): boolean {
    if (!this.currentUserId || !post.likes) return false;
    return post.likes.includes(this.currentUserId);
  }

  onCreatePost() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    
    // TODO: Navigate to create post page or open modal
    console.log('Create new post');
  }

  doRefresh(event: any) {
    this.loadPosts();
    this.loadForumStats();
    
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  // Navigation methods
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToNews() {
    this.router.navigate(['/news']);
  }

  goBack() {
    this.location.back();
  }

  // Handle image loading errors
  onImageError(event: any) {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNGM0Y0RjYiLz4KPHA+PHBhdGggZD0iTTI1IDEwQzMwLjUyMjggMTAgMzUgMTQuNDc3MiAzNSAyMEM0MCAyNS41MjI4IDMwLjUyMjggMzAgMjUgMzBDMTkuNDc3MiAzMCAxNSAyNS41MjI4IDE1IDIwQzE1IDE0LjQ3NzIgMTkuNDc3MiAxMCAyNSAxMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI1IDIyQzI2LjEwNDYgMjIgMjcgMjEuMTA0NiAyNyAyMEMyNyAxOC44OTU0IDI2LjEwNDYgMTggMjUgMThDMjMuODk1NCAxOCAyMyAxOC44OTU0IDIzIDIwQzIzIDIxLjEwNDYgMjMuODk1NCAyMiAyNSAyMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMCAzNUwyNSAzMEwzMCAzNUgyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==';
  }

  // Track by function for ngFor performance
  trackByPostId(index: number, post: Post): string {
    return post.id || index.toString();
  }
}
