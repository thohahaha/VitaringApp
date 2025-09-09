import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'nl2br',
  standalone: true
})
export class Nl2brPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';
    
    // Convert newlines to <br> tags and sanitize
    const htmlContent = value
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/•/g, '•') // Bullet points
      .replace(/\d+\./g, (match) => `<strong>${match}</strong>`); // Numbered lists
    
    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }
}
