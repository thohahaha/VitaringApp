import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonButton, 
  IonIcon,
  IonItem,
  IonTextarea,
  IonSpinner,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  ToastController
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ForumService } from '../services/forum.service';
import { AuthService } from '../auth/auth.service';
import { addIcons } from 'ionicons';
import { 
  refresh,
  logIn,
  arrowBack,
  heart,
  heartOutline,
  share,
  chatbubble,
  send, alertCircle, personCircle, chatbubbleOutline, shareOutline, eyeOutline, reload } from 'ionicons/icons';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  likesCount: number;
  userLiked: boolean;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  likesCount: number;
  viewsCount: number;
  shareCount?: number;
  userLiked: boolean;
}

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonTextarea,
    IonSpinner,
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge
  ]
})
export class PostDetailPage implements OnInit, AfterViewInit {
  postId: string = '';
  currentPost: Post | null = null;
  comments: Comment[] = [];
  newComment: string = '';
  isSubmitting: boolean = false;
  isLoading: boolean = true;
  loadingError: string | null = null;
  
  // User and interaction properties
  currentUserId: string | null = null;
  isLoggedIn: boolean = false;
  
  // Comments loading state
  isLoadingComments: boolean = false;
  commentsError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private forumService: ForumService,
    private authService: AuthService
  ) {
    // Register icons
    addIcons({arrowBack,alertCircle,personCircle,heart,chatbubbleOutline,shareOutline,eyeOutline,refresh,reload,send,logIn,heartOutline,share,chatbubble});
  }

  async ngOnInit() {
    console.log('PostDetailPage ngOnInit started');
    
    // Get post ID from route
    this.postId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Post ID from route:', this.postId);
    
    if (!this.postId) {
      console.error('No post ID found in route');
      this.loadingError = 'ID Post tidak ditemukan';
      this.isLoading = false;
      return;
    }

    // Initialize authentication
    await this.initializeAuth();
    
    // Load post and comments
    await this.loadPostFromFirestore();
    await this.loadCommentsFromFirestore();
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit - Comments loaded:', this.comments.length);
    
    // Force load dummy comments if no real comments after view init
    setTimeout(() => {
      if (this.comments.length === 0 && !this.isLoadingComments) {
        console.log('No comments found, loading dummy data for testing...');
        this.loadDummyComments();
      }
    }, 2000);
  }

  private async initializeAuth() {
    try {
      console.log('Initializing authentication...');
      this.isLoggedIn = await this.authService.isLoggedIn();
      
      if (this.isLoggedIn) {
        const user = this.authService.getCurrentUser();
        this.currentUserId = user?.uid || null;
        console.log('User authenticated:', this.currentUserId);
      } else {
        console.log('User not authenticated');
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }

  async loadPostFromFirestore() {
    try {
      this.isLoading = true;
      this.loadingError = null;
      
      console.log('Loading post from Firestore...');
      
      this.forumService.getForumPostDetail(this.postId).subscribe({
        next: (forumPost) => {
          console.log('Post loaded:', forumPost);
          
          if (forumPost) {
            this.currentPost = {
              id: forumPost.id,
              title: forumPost.title,
              content: forumPost.content,
              author: forumPost.authorName,
              createdAt: forumPost.createdAt,
              likesCount: forumPost.likeCount,
              viewsCount: 0,
              shareCount: forumPost.shareCount || 0,
              userLiked: false
            };
            
            this.checkUserLikeStatus();
            this.trackPostView();
            
          } else {
            this.loadingError = 'Post tidak ditemukan';
          }
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading post:', error);
          this.loadingError = `Gagal memuat post. Penyebab: ${error.message}`;
          this.isLoading = false;
        }
      });

    } catch (error) {
      console.error('Error in loadPostFromFirestore:', error);
      this.loadingError = 'Terjadi kesalahan';
      this.isLoading = false;
    }
  }

  async loadCommentsFromFirestore() {
    try {
      this.isLoadingComments = true;
      this.commentsError = null;
      console.log('🔍 LOADING COMMENTS FROM FIRESTORE');
      console.log('Post ID:', this.postId);
      
      // Import Firestore functions
      const { collection, query, where, getDocs, getFirestore, orderBy } = await import('firebase/firestore');
      
      // Get Firestore instance
      const firestore = (this.forumService as any).firestore || getFirestore();
      console.log('✅ Firestore connected');

      // Query post_comments collection
      const commentsRef = collection(firestore, 'post_comments');
      
      // Create query with exact match for your data
      const commentsQuery = query(
        commentsRef,
        where('postId', '==', this.postId),
        where('isDeleted', '==', false),
        orderBy('createdAt', 'desc')
      );
      
      console.log('🔄 Executing query...');
      const querySnapshot = await getDocs(commentsQuery);
      
      console.log('📊 Query results:', {
        size: querySnapshot.size,
        empty: querySnapshot.empty
      });

      if (!querySnapshot.empty) {
        const comments: Comment[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('📄 Comment document:', {
            id: doc.id,
            data: data
          });
          
          comments.push({
            id: doc.id,
            author: data.authorName || 'Anonymous',
            content: data.content || '',
            createdAt: data.createdAt?.toDate() || new Date(),
            likesCount: data.likeCount || 0,
            userLiked: false
          });
        });
        
        this.comments = comments;
        console.log('✅ Comments loaded successfully:', this.comments);
        await this.showToast(`${this.comments.length} komentar berhasil dimuat!`, 'success');
        
      } else {
        console.log('❌ No comments found');
        
        // Fallback: Try without isDeleted filter
        console.log('🔄 Trying without isDeleted filter...');
        const fallbackQuery = query(
          commentsRef,
          where('postId', '==', this.postId)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        console.log('📊 Fallback query results:', {
          size: fallbackSnapshot.size,
          empty: fallbackSnapshot.empty
        });
        
        if (!fallbackSnapshot.empty) {
          const comments: Comment[] = [];
          
          fallbackSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('📄 Fallback comment:', { id: doc.id, data: data });
            
            comments.push({
              id: doc.id,
              author: data.authorName || 'Anonymous',
              content: data.content || '',
              createdAt: data.createdAt?.toDate() || new Date(),
              likesCount: data.likeCount || 0,
              userLiked: false
            });
          });
          
          this.comments = comments;
          console.log('✅ Comments loaded via fallback:', this.comments);
          await this.showToast(`${this.comments.length} komentar dimuat (fallback)!`, 'success');
        } else {
          this.comments = [];
          console.log('❌ No comments found even with fallback');
        }
      }
      
    } catch (error: any) {
      console.error('❌ Error loading comments:', error);
      this.commentsError = `Gagal memuat komentar. Penyebab: ${error.message}`;
      this.comments = [];
      
      // Load dummy as final fallback
      console.log('Loading dummy comments as fallback...');
      this.loadDummyComments();
      
    } finally {
      this.isLoadingComments = false;
    }
  }

  // Also make sure you have this method
  loadDummyComments() {
    console.log('Loading dummy comments...');
    this.comments = [
      {
        id: 'real_test_1',
        author: 'Current User',
        content: 'tes', // Same as your Firestore data
        createdAt: new Date(),
        likesCount: 0,
        userLiked: false
      },
      {
        id: 'dummy_1',
        author: 'Test User',
        content: 'Ini komentar test untuk memastikan UI berfungsi dengan baik.',
        createdAt: new Date(Date.now() - 3600000),
        likesCount: 2,
        userLiked: false
      }
    ];
    
    console.log('Dummy comments loaded:', this.comments);
    this.showToast(`${this.comments.length} dummy comments loaded`, 'warning');
  }

  // Method untuk reload comments secara manual
  async reloadComments() {
    console.log('🔄 Manual reload comments triggered');
    this.isLoadingComments = true;
    this.commentsError = null;
    
    try {
      await this.loadCommentsFromFirestore();
      await this.showToast('Reload komentar selesai', 'success');
    } catch (error) {
      console.error('Error in manual reload:', error);
      await this.showToast('Gagal reload komentar', 'danger');
    } finally {
      this.isLoadingComments = false;
    }
  }

  private async checkUserLikeStatus() {
    if (!this.currentPost || !this.isLoggedIn || !this.currentUserId) {
      return;
    }

    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const firestore = (this.forumService as any).firestore;
      const likesCollection = collection(firestore, 'post_likes');
      const likesQuery = query(
        likesCollection,
        where('postId', '==', this.postId),
        where('userId', '==', this.currentUserId)
      );
      
      const querySnapshot = await getDocs(likesQuery);
      if (this.currentPost) {
        this.currentPost.userLiked = !querySnapshot.empty;
      }
    } catch (error) {
      console.error('Error checking user like status:', error);
    }
  }

  private async trackPostView() {
    try {
      if (this.currentPost && this.currentUserId) {
        await this.forumService.trackPostView(
          this.postId, 
          this.currentUserId,
          this.authService.getCurrentUser()?.displayName || 'Anonymous',
          'session-' + Date.now()
        );
      }
    } catch (error) {
      console.error('Error tracking post view:', error);
    }
  }

  async submitComment() {
    if (!this.newComment?.trim()) {
      await this.showToast('Komentar tidak boleh kosong!', 'warning');
      return;
    }

    if (!this.isLoggedIn) {
      await this.showToast('Silakan login terlebih dahulu', 'warning');
      this.router.navigate(['/login']);
      return;
    }

    this.isSubmitting = true;
    
    try {
      console.log('Submitting comment...');
      
      const user = this.authService.getCurrentUser();
      const commentData = {
        content: this.newComment.trim(),
        authorId: this.currentUserId!,
        authorName: user?.displayName || user?.email || 'Anonymous',
        isDeleted: false,
        postId: this.postId // Explicitly include postId
      };

      // Add to Firestore directly
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const firestore = (this.forumService as any).firestore;
      
      const docData = {
        ...commentData,
        createdAt: serverTimestamp(),
        likeCount: 0,
        likedBy: []
      };

      await addDoc(collection(firestore, 'post_comments'), docData);
      
      // Add comment locally for instant feedback
      const newComment: Comment = {
        id: 'temp_' + Date.now(),
        author: commentData.authorName,
        content: commentData.content,
        createdAt: new Date(),
        likesCount: 0,
        userLiked: false
      };
      
      this.comments.unshift(newComment);
      this.newComment = '';
      
      await this.showToast('Komentar berhasil dikirim!', 'success');
      
      // Reload comments after delay to get the real data
      setTimeout(() => {
        this.loadCommentsFromFirestore();
      }, 1000);

    } catch (error) {
      console.error('Error submitting comment:', error);
      await this.showToast('Gagal mengirim komentar', 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  async toggleLike() {
    if (!this.currentPost) return;

    if (!this.isLoggedIn || !this.currentUserId) {
      await this.showToast('Silakan login terlebih dahulu', 'warning');
      this.router.navigate(['/login']);
      return;
    }

    try {
      const user = this.authService.getCurrentUser();
      const result = await this.forumService.togglePostLikeDetailed(
        this.postId,
        this.currentUserId,
        user?.displayName || user?.email || 'Anonymous User',
        user?.photoURL || ''
      );

      if (this.currentPost) {
        this.currentPost.likesCount = result.newLikeCount;
        this.currentPost.userLiked = result.liked;
        
        await this.showToast(
          result.liked ? 'Post disukai!' : 'Like dibatalkan', 
          result.liked ? 'success' : 'medium'
        );
      }
      
    } catch (error) {
      console.error('Error toggling post like:', error);
      await this.showToast('Gagal mengubah like post', 'danger');
    }
  }

  async toggleCommentLike(comment: Comment) {
    if (!this.isLoggedIn) {
      await this.showToast('Silakan login terlebih dahulu', 'warning');
      return;
    }

    // Update local state immediately for better UX
    if (comment.userLiked) {
      comment.likesCount--;
      comment.userLiked = false;
      await this.showToast('Like komentar dibatalkan', 'medium');
    } else {
      comment.likesCount++;
      comment.userLiked = true;
      await this.showToast('Komentar disukai!', 'success');
    }
  }

  async sharePost() {
    if (!this.currentPost) return;

    // Track sharing activity
    if (this.isLoggedIn && this.currentUserId) {
      try {
        const user = this.authService.getCurrentUser();
        await this.forumService.trackPostShare(
          this.postId,
          this.currentUserId,
          user?.displayName || user?.email || 'Anonymous User',
          'copy_link',
          'web'
        );
        
        this.currentPost.shareCount = (this.currentPost.shareCount || 0) + 1;
      } catch (error) {
        console.error('Error tracking post share:', error);
      }
    }

    const shareData = {
      title: this.currentPost.title,
      text: this.currentPost.content.substring(0, 100) + '...',
      url: `${window.location.origin}/post-detail/${this.currentPost.id}`
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        await this.showToast('Post berhasil dibagikan!', 'success');
      } catch (error) {
        this.fallbackShare();
      }
    } else {
      this.fallbackShare();
    }
  }

  private fallbackShare() {
    if (!this.currentPost) return;
    
    const url = `${window.location.origin}/post-detail/${this.currentPost.id}`;
    navigator.clipboard.writeText(url).then(() => {
      this.showToast('Link post disalin ke clipboard!', 'success');
    }).catch(() => {
      this.showToast('Gagal menyalin link post', 'danger');
    });
  }

  trackByCommentId(index: number, comment: Comment): string {
    return comment.id;
  }

  goBack() {
    this.router.navigate(['/forum']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}