import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, CommonModule]
})
export class AppComponent implements OnInit {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    console.log('AppComponent initialized - checking auth state');
    
    // Subscribe to auth state changes
    this.authService.authState$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        const user = this.authService.getCurrentUser();
        console.log('User is authenticated:', user?.email);
        // User is logged in, redirect to home
        this.router.navigate(['/home']);
      } else {
        console.log('User is not authenticated, will show get-started page');
        // User is not logged in, they will see get-started page (default route)
      }
    });
  }
}