import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons } from '@ionic/angular/standalone';
import { News } from '../../models/news.model';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    TimeAgoPipe
  ],
})
export class NewsDetailComponent {
  @Input() news: News | null = null;
  @Input() isLiked: boolean = false;
  @Output() back = new EventEmitter<void>();
  @Output() like = new EventEmitter<string>();
  @Output() share = new EventEmitter<News>();

  onBack() {
    this.back.emit();
  }

  onLike() {
    if (this.news) {
      this.like.emit(this.news.id);
    }
  }

  async onShare() {
    if (this.news) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: this.news.title,
            text: this.news.content.substring(0, 100) + '...',
            url: window.location.href,
          });
          this.share.emit(this.news);
        } catch (error) {
          console.error('Error sharing:', error);
        }
      } else {
        // Fallback untuk browser yang tidak mendukung Web Share API
        alert('Share feature is not supported on this browser.');
      }
    }
  }
}
