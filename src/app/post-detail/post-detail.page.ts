import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  IonTextarea,
  IonItem,
  IonLabel,
  IonBadge,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { ForumService } from '../services/forum.service';
import { AuthService } from '../auth/auth.service';
import { Post, Comment } from '../models/forum.model';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { addIcons } from 'ionicons';
import { 
  arrowBack,
  shareOutline,
  heartOutline,
  heart,
  chatbubbleOutline,
  eyeOutline,
  personCircleOutline,
  sendOutline,
  ellipsisVertical,
  heartHalfOutline,
  statsChartOutline,
  newspaperOutline,
  wifiOutline,
  people, pin } from 'ionicons/icons';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
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
    IonTextarea,
    IonItem,
    IonLabel,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
    TimeAgoPipe,
    AsyncPipe
  ]
})
export class PostDetailPage implements OnInit, OnDestroy {
  post$!: Observable<Post | undefined>;
  comments$!: Observable<Comment[]>;
  postId: string = '';
  newComment: string = '';
  isLoggedIn: boolean = false;
  currentUserId: string | null = null;
  private subscription: Subscription = new Subscription();
  isSubmittingComment: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private forumService: ForumService,
    private authService: AuthService
  ) {
    // Register icons
    addIcons({
      arrowBack,
      shareOutline,
      ellipsisVertical,
      pin,
      eyeOutline,
      chatbubbleOutline,
      sendOutline,
      personCircleOutline,
      heartHalfOutline,
      statsChartOutline,
      newspaperOutline,
      people,
      wifiOutline,
      heartOutline,
      heart
    });
  }

  ngOnInit() {
    // Get post ID from route params
    this.postId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.postId) {
      this.loadPostDetail();
      this.loadComments();
    }

    this.checkAuthStatus();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private checkAuthStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUser();
      this.currentUserId = user?.email || null;
    }
  }

  loadPostDetail() {
    this.post$ = this.forumService.getPostDetail(this.postId);
  }

  loadComments() {
    this.comments$ = this.forumService.getComments(this.postId);
  }

  async onLikePost(post: Post) {
    if (!this.isLoggedIn || !this.currentUserId) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      await this.forumService.togglePostLike(post.id!, this.currentUserId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  }

  async onLikeComment(comment: Comment) {
    if (!this.isLoggedIn || !this.currentUserId) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      await this.forumService.toggleCommentLike(this.postId, comment.id!, this.currentUserId);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  }

  async onSubmitComment() {
    if (!this.isLoggedIn || !this.currentUserId) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.newComment.trim() === '' || this.isSubmittingComment) {
      return;
    }

    this.isSubmittingComment = true;

    try {
      const user = this.authService.getCurrentUser();
      await this.forumService.addComment(this.postId, {
        postId: this.postId,
        authorId: this.currentUserId,
        authorName: user?.email || 'Anonymous',
        content: this.newComment.trim()
      });

      this.newComment = '';
      // Comments will automatically update via Observable
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      this.isSubmittingComment = false;
    }
  }

  isPostLikedByUser(post: Post): boolean {
    if (!this.currentUserId || !post.likes) return false;
    return post.likes.includes(this.currentUserId);
  }

  isCommentLikedByUser(comment: Comment): boolean {
    if (!this.currentUserId || !comment.likes) return false;
    return comment.likes.includes(this.currentUserId);
  }

  async onSharePost(post: Post) {
    const shareData = {
      title: post.title,
      text: post.content.substring(0, 100) + '...',
      url: window.location.href
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

  private fallbackShare(post: Post) {
    const shareText = `${post.title}\n\n${post.content.substring(0, 100)}...\n\n${window.location.href}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        console.log('Link copied to clipboard');
      });
    } else {
      console.log('Share not supported');
    }
  }

  doRefresh(event: any) {
    this.loadPostDetail();
    this.loadComments();
    
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  goBack() {
    this.location.back();
  }

  // Navigation methods
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToNews() {
    this.router.navigate(['/news']);
  }

  navigateToForum() {
    this.router.navigate(['/forum']);
  }

  // Handle image loading errors
  onImageError(event: any) {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNGM0Y0RjYiLz4KPHA+PHBhdGggZD0iTTI1IDEwQzMwLjUyMjggMTAgMzUgMTQuNDc3MiAzNSAyMEM0MCAyNS41MjI4IDMwLjUyMjggMzAgMjUgMzBDMTkuNDc3MiAzMCAxNSAyNS41MjI4IDE1IDIwQzE1IDE0LjQ3NzIgMTkuNDc3MiAxMCAyNSAxMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI1IDIyQzI2LjEwNDYgMjIgMjcgMjEuMTA0NiAyNyAyMEMyNyAxOC44OTU0IDI2LjEwNDYgMTggMjUgMThDMjMuODk1NCAxOCAyMyAxOC44OTU0IDIzIDIwQzIzIDIxLjEwNDYgMjMuODk1NCAyMiAyNSAyMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMCAzNUwyNSAzMEwzMCAzNUgyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==';
  }
}
