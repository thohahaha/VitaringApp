import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { News } from '../../models/news.model';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TimeAgoPipe],
})
export class NewsListComponent {
  @Input() news: News[] = [];
  @Output() newsClicked = new EventEmitter<News>();

  onNewsClick(newsItem: News) {
    this.newsClicked.emit(newsItem);
  }
}
