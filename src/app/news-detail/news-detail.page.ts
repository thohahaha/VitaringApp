import { Component, OnInit, OnDestroy, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NewsService } from '../services/news.service';
import { AuthService } from '../auth/auth.service';
import { News } from '../models/news.model';
import { Observable, Subscription } from 'rxjs';
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
  IonText
} from '@ionic/angular/standalone';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { addIcons } from 'ionicons';
import { 
  arrowBack, 
  shareOutline, 
  personCircleOutline, 
  eyeOutline, 
  heart, 
  heartOutline, 
  shareSocialOutline,
  heartHalfOutline,
  statsChartOutline,
  newspaperOutline,
  wifiOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
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
    TimeAgoPipe,
    AsyncPipe,
  ]
})
export class NewsDetailPage implements OnInit, OnDestroy, AfterViewInit {
  news$!: Observable<News | undefined>;
  newsId: string = '';
  isLoggedIn: boolean = false;
  currentUserEmail: string | null = null;
  private subscription: Subscription = new Subscription();
  isLiking: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private newsService: NewsService,
    private authService: AuthService
  ) {
    // Register icons
    addIcons({
      'arrow-back': arrowBack,
      'share-outline': shareOutline,
      'person-circle-outline': personCircleOutline,
      'eye-outline': eyeOutline,
      'heart': heart,
      'heart-outline': heartOutline,
      'share-social-outline': shareSocialOutline,
      'heart-half-outline': heartHalfOutline,
      'stats-chart-outline': statsChartOutline,
      'newspaper-outline': newspaperOutline,
      'wifi-outline': wifiOutline
    });
  }

  ngOnInit() {
    // Get news ID from route params
    this.newsId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.newsId) {
      // Load news detail
      this.news$ = this.newsService.getNewsDetail(this.newsId);
      
      // Update views count
      this.newsService.updateNewsViews(this.newsId);
    }

    // Check auth status
    this.checkAuthStatus();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    // Simple method to ensure icons are visible
    console.log('AfterViewInit called for news detail');
  }

  private checkAuthStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUser();
      this.currentUserEmail = user?.email || null;
    }
  }

  async onLike() {
    if (!this.isLoggedIn || !this.currentUserEmail || this.isLiking) {
      console.log('User not logged in or already liking');
      return;
    }

    this.isLiking = true;
    try {
      await this.newsService.updateNewsLikes(this.newsId, this.currentUserEmail);
    } catch (error) {
      console.error('Error liking news:', error);
    } finally {
      this.isLiking = false;
    }
  }

  async onShare(news: News) {
    const shareData = {
      title: news.title,
      text: news.content.substring(0, 100) + '...',
      url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        console.log('News shared successfully');
      } catch (error) {
        console.error('Error sharing news:', error);
        this.fallbackShare(news);
      }
    } else {
      this.fallbackShare(news);
    }
  }

  private fallbackShare(news: News) {
    // Fallback sharing method
    const shareText = `${news.title}\n\n${news.content.substring(0, 100)}...\n\n${window.location.href}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Link berita telah disalin ke clipboard!');
      });
    } else {
      alert('Fitur share tidak didukung di browser ini.');
    }
  }

  isNewsLikedByUser(news: News): boolean {
    if (!this.currentUserEmail || !news.likes) return false;
    return news.likes.includes(this.currentUserEmail);
  }

  goBack() {
    this.location.back();
  }

  // Navigation methods for footer
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToNews() {
    this.router.navigate(['/news']);
  }

  // Handle image loading errors
  onImageError(event: any) {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDQwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTIwSDIyNVYxNjBIMTc1VjEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMTQwIiByPSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiLz4KPHRleHQgeD0iMjAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TmV3cyBJbWFnZTwvdGV4dD4KPC9zdmc+Cg==';
  }
}
