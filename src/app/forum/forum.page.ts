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
import { ForumPost, Post, ForumStats } from '../models/forum.model';
import { Observable } from 'rxjs';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { addIcons } from 'ionicons';
import { 
  arrowBack,
  add,
  searchOutline,
  menuOutline,
  addOutline,
  heartOutline,
  heart,
  chatbubbleOutline,
  eyeOutline,
  personCircleOutline,
  personCircle,
  heartHalfOutline,
  statsChartOutline,
  newspaperOutline,
  wifiOutline,
  people,
  trendingUp,
  filterOutline, 
  pin, shareOutline } from 'ionicons/icons';

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
  forumPosts$!: Observable<ForumPost[]>;
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
    addIcons({arrowBack,add,searchOutline,menuOutline,trendingUp,heart,people,chatbubbleOutline,pin,personCircle,eyeOutline,shareOutline,addOutline,heartOutline,heartHalfOutline,statsChartOutline,newspaperOutline,wifiOutline,personCircleOutline,filterOutline});
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
    this.forumPosts$ = this.forumService.getForumPosts();
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
      this.forumPosts$ = this.forumService.searchForumPosts(query);
    }
  }

  async navigateToPostDetail(postId: string) {
    console.log('🔍 navigateToPostDetail called with postId:', postId);
    console.log('🔍 PostId type:', typeof postId);
    console.log('🔍 PostId truthy:', !!postId);
    
    if (postId) {
      console.log('✅ PostId is valid, proceeding with navigation...');
      
      // Track view if user is logged in
      if (this.isLoggedIn && this.currentUserId) {
        try {
          console.log('👤 User is logged in, tracking view...');
          const user = this.authService.getCurrentUser();
          await this.forumService.trackPostView(
            postId,
            this.currentUserId,
            user?.displayName || user?.email || 'Anonymous User'
          );
          console.log('✅ View tracked successfully');
        } catch (error) {
          console.error('❌ Error tracking post view:', error);
        }
      } else {
        console.log('🔓 User not logged in, skipping view tracking');
      }
      
      console.log('🚀 About to navigate to:', ['/post-detail', postId]);
      
      try {
        await this.router.navigate(['/post-detail', postId]);
        console.log('✅ Navigation completed successfully');
      } catch (navError) {
        console.error('❌ Navigation failed:', navError);
      }
    } else {
      console.error('❌ PostId is null/undefined/empty, cannot navigate. Received:', postId);
    }
  }

  navigateToCreatePost() {
    this.router.navigate(['/create-post']);
  }

  async onShareForumPost(post: ForumPost, event: Event) {
    event.stopPropagation();
    
    // Track sharing activity
    if (this.currentUserId) {
      try {
        const user = this.authService.getCurrentUser();
        await this.forumService.trackPostShare(
          post.id!,
          this.currentUserId,
          user?.displayName || user?.email || 'Anonymous User',
          'copy_link',
          'web'
        );
        
        // Update local share count
        post.shareCount = (post.shareCount || 0) + 1;
      } catch (error) {
        console.error('Error tracking post share:', error);
      }
    }

    const shareData = {
      title: post.title,
      text: post.content.substring(0, 100) + '...',
      url: `${window.location.origin}/post-detail/${post.id}`
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        console.log('Post shared successfully');
      } catch (error) {
        console.error('Error sharing post:', error);
        this.fallbackShare(post);
      }
    } else {
      this.fallbackShare(post);
    }
  }

  private fallbackShare(post: ForumPost) {
    const url = `${window.location.origin}/post-detail/${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      console.log('URL copied to clipboard');
      // You might want to show a toast notification here
    }).catch(err => {
      console.error('Failed to copy URL: ', err);
    });
  }

  async onLike(post: Post, event: Event) {
    event.stopPropagation();
    
    if (!this.isLoggedIn || !this.currentUserId) {
      // Redirect to login or show login modal
      this.router.navigate(['/login']);
      return;
    }

    try {
      // For legacy Post interface, we increment like count
      await this.forumService.updatePostLikeCount(post.id!, 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  }

  async onLikeForumPost(post: ForumPost, event: Event) {
    event.stopPropagation();
    
    if (!this.isLoggedIn || !this.currentUserId) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const user = this.authService.getCurrentUser();
      const result = await this.forumService.togglePostLikeDetailed(
        post.id!, 
        this.currentUserId,
        user?.displayName || user?.email || 'Anonymous User',
        user?.photoURL || ''
      );
      
      // Update local post data immediately for better UX
      post.likeCount = result.newLikeCount;
      post.likedBy = result.liked 
        ? [...(post.likedBy || []), this.currentUserId]
        : (post.likedBy || []).filter(id => id !== this.currentUserId);
      
      console.log(`Post ${result.liked ? 'liked' : 'unliked'}. New count: ${result.newLikeCount}`);
    } catch (error) {
      console.error('Error toggling forum post like:', error);
    }
  }

  isPostLikedByUser(post: Post): boolean {
    if (!this.currentUserId || !post.likes) return false;
    return post.likes.includes(this.currentUserId);
  }

  isForumPostLikedByUser(post: ForumPost): boolean {
    if (!this.currentUserId || !post.likedBy) return false;
    return this.forumService.isPostLikedByUser(post, this.currentUserId);
  }

  onCreatePost() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.router.navigate(['/create-post']);
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
  trackByPostId(index: number, post: Post | ForumPost): string {
    return post.id || index.toString();
  }
}
