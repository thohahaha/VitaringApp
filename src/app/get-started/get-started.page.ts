import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DynamicBackgroundComponent } from '../shared/dynamic-background/dynamic-background.component';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.page.html',
  styleUrls: ['./get-started.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, DynamicBackgroundComponent]
})
export class GetStartedPage {

  constructor(private router: Router) { }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
