import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Bubble {
  id: number;
  size: number;
  opacity: number;
  animation: number;
  left: number;
  delay: number;
}

@Component({
  selector: 'app-dynamic-background',
  template: `
    <div class="dynamic-background">
      <div class="floating-bubbles">
        <div 
          *ngFor="let bubble of bubbles" 
          class="bubble size-{{bubble.size}} opacity-{{bubble.opacity}} anim-{{bubble.animation}}"
          [style.left.%]="bubble.left"
          [style.animation-delay.s]="bubble.delay">
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class DynamicBackgroundComponent implements OnInit, OnDestroy {
  bubbles: Bubble[] = [];
  private animationFrame: any;

  ngOnInit() {
    this.generateBubbles();
  }

  ngOnDestroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private generateBubbles() {
    const bubbleCount = this.getBubbleCount();
    
    for (let i = 0; i < bubbleCount; i++) {
      this.bubbles.push({
        id: i,
        size: this.getRandomInt(1, 5),
        opacity: this.getRandomInt(1, 5),
        animation: this.getRandomInt(1, 10),
        left: this.getRandomInt(0, 100),
        delay: -this.getRandomInt(0, 30)
      });
    }
  }

  private getBubbleCount(): number {
    // Adjust bubble count based on screen size for performance
    const width = window.innerWidth;
    if (width < 480) return 8;  // Mobile
    if (width < 768) return 12; // Tablet
    return 15; // Desktop
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
