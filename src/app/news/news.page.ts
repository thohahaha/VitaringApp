import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonFooter, IonTabBar, IonTabButton, IonSpinner, IonText } from '@ionic/angular/standalone';
import { NewsService } from '../services/news.service';
import { News } from '../models/news.model';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { addIcons } from 'ionicons';
import { 
  arrowBack, 
  searchOutline,
  eyeOutline, 
  heartOutline,
  newspaperOutline,
  heartHalfOutline,
  statsChartOutline,
  wifiOutline,
  personCircleOutline, people } from 'ionicons/icons';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
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
    CommonModule, 
    FormsModule,
    TimeAgoPipe,
    AsyncPipe,
    NavbarComponent
  ]
})
export class NewsPage implements OnInit {
  newsList$!: Observable<News[]>;

  constructor(
    private newsService: NewsService,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) { 
    // Register icons
    addIcons({
      arrowBack,
      searchOutline,
      eyeOutline,
      heartOutline,
      newspaperOutline,
      heartHalfOutline,
      statsChartOutline,
      people,
      wifiOutline,
      personCircleOutline
    });
  }

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.newsList$ = this.newsService.getLatestNews();
  }

  navigateToDetail(newsId: string) {
    if (newsId) {
      this.router.navigate(['/news', newsId]);
    }
  }

  // Navigation methods
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToForum() {
    this.router.navigate(['/forum']);
  }

  goBack() {
    this.location.back();
  }

  trackByNewsId(index: number, news: News): string {
    return news.id || index.toString();
  }

  // Handle image loading errors
  onImageError(event: any) {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTAwSDIyNVYxNTBIMTc1VjEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMTI1IiByPSI1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiLz4KPHRleHQgeD0iMjAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VmlkZW8gUGxhY2Vob2xkZXI8L3RleHQ+Cjwvc3ZnPgo=';
  }
}