import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, newspaper, chatbubbles, person, hardwareChip, analytics } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon
  ]
})
export class NavbarComponent {
  @Input() activeTab: string = '';

  constructor(private router: Router) {
    // Add icons
    addIcons({home,hardwareChip,analytics,chatbubbles,person,newspaper});
  }

  navigateToPage(route: string) {
    console.log('🔄 Navigating to:', route);
    console.log('🔄 Current URL:', this.router.url);
    
    this.router.navigate([route]).then(success => {
      if (success) {
        console.log('✅ Navigation successful to:', route);
        console.log('✅ New URL:', this.router.url);
      } else {
        console.log('❌ Navigation failed to:', route);
        console.log('❌ Current URL:', this.router.url);
      }
    }).catch(error => {
      console.error('❌ Navigation error:', error);
    });
  }

  isActive(tab: string): boolean {
    const active = this.activeTab === tab;
    console.log(`Tab ${tab} is ${active ? 'active' : 'inactive'}`);
    return active;
  }
}
