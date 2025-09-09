import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonItem,
  IonInput,
  IonSpinner,
  IonText,
  IonCard,
  IonCardContent,
  IonAvatar
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  arrowBack, 
  send, 
  micOutline, 
  refreshOutline,
  personCircle,
  sparkles,
  chatbubbleEllipses,
  helpCircleOutline,
  heartOutline,
  bulbOutline,
  shieldCheckmarkOutline,
  analyticsOutline,
  chatbubbleOutline,
  person
} from 'ionicons/icons';
import { Nl2brPipe } from '../shared/pipes/nl2br.pipe';
import { environment } from '../../environments/environment';
import { NavbarComponent } from '../shared/navbar/navbar.component';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.page.html',
  styleUrls: ['./ai-chat.page.scss'],
  standalone: true,
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
    IonItem,
    IonInput,
    IonSpinner,
    IonText,
    IonCard,
    IonCardContent,
    IonAvatar,
    Nl2brPipe,
    NavbarComponent
  ]
})
export class AiChatPage implements OnInit {
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;
  @ViewChild('messageInput', { static: false }) messageInput!: ElementRef;

  messages: ChatMessage[] = [];
  currentMessage: string = '';
  isLoading: boolean = false;
  isTyping: boolean = false;

  // Gemini AI Configuration
  private readonly GEMINI_API_KEY = environment.geminiApiKey;
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  constructor(private router: Router) {
        addIcons({
      arrowBack,
      send,
      micOutline,
      refreshOutline,
      personCircle,
      sparkles,
      chatbubbleEllipses,
      helpCircleOutline,
      heartOutline,
      bulbOutline,
      shieldCheckmarkOutline,
      analyticsOutline,
      chatbubbleOutline,
      person
    });
  }

  ngOnInit() {
    this.initializeChat();
  }

  initializeChat() {
    // Welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome-' + Date.now(),
      content: '👋 Halo! Saya adalah AI Assistant VitaRing. Saya dapat membantu Anda dengan:\n\n• Informasi kesehatan dan fitness\n• Tips penggunaan VitaRing\n• Analisis data sensor\n• Rekomendasi gaya hidup sehat\n\nApa yang ingin Anda tanyakan?',
      isUser: false,
      timestamp: new Date()
    };

    this.messages.push(welcomeMessage);
    setTimeout(() => this.scrollToBottom(), 100);
  }

  async sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      content: this.currentMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const messageToSend = this.currentMessage.trim();
    this.currentMessage = '';

    // Show typing indicator
    this.showTypingIndicator();
    this.scrollToBottom();

    try {
      const aiResponse = await this.callGeminiAPI(messageToSend);
      this.hideTypingIndicator();
      
      const aiMessage: ChatMessage = {
        id: 'ai-' + Date.now(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      this.messages.push(aiMessage);
      this.scrollToBottom();

    } catch (error: any) {
      console.error('Error in sendMessage:', error);
      this.hideTypingIndicator();
      
      // Since callGeminiAPI now returns user-friendly messages instead of throwing,
      // this catch block should rarely be triggered
      const errorMessage: ChatMessage = {
        id: 'error-' + Date.now(),
        content: '🚫 Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.',
        isUser: false,
        timestamp: new Date()
      };

      this.messages.push(errorMessage);
      this.scrollToBottom();
    }
  }

  private async callGeminiAPI(message: string): Promise<string> {
    this.isLoading = true;

    // Simplified and more reliable request
    const requestBody = {
      contents: [{
        parts: [{
          text: `Anda adalah AI Assistant VitaRing yang membantu pengguna tentang kesehatan dan penggunaan perangkat VitaRing. Jawab dengan ramah dan informatif: ${message}`
        }]
      }]
    };

    try {
      console.log('Testing API Key...');
      
      const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        // Try to parse error details
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            throw new Error(`API Error: ${errorData.error.message || errorData.error.status}`);
          }
        } catch (parseError) {
          // If can't parse, use the raw error text
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('API Response received:', !!data.candidates);
      
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
        return data.candidates[0].content.parts[0].text;
      } else if (data.error) {
        throw new Error(`Gemini API Error: ${data.error.message}`);
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Format respons tidak valid dari Gemini API');
      }

    } catch (error: any) {
      console.error('Gemini API Error Details:', error);
      
      // Provide user-friendly error messages
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('403')) {
        return 'Maaf, terjadi masalah dengan konfigurasi AI. Tim teknis sedang menangani masalah ini.';
      } else if (error.message.includes('404')) {
        return 'Service AI sedang dalam maintenance. Silakan coba lagi dalam beberapa menit.';
      } else if (error.message.includes('429')) {
        return 'Terlalu banyak permintaan. Silakan tunggu sebentar dan coba lagi.';
      } else if (error.message.includes('fetch')) {
        return 'Tidak dapat terhubung ke server AI. Periksa koneksi internet Anda.';
      } else {
        return 'Maaf, saya sedang mengalami gangguan teknis. Silakan coba lagi nanti.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  showTypingIndicator() {
    const typingMessage: ChatMessage = {
      id: 'typing-' + Date.now(),
      content: '💭 AI sedang mengetik...',
      isUser: false,
      timestamp: new Date(),
      isTyping: true
    };

    this.messages.push(typingMessage);
    this.isTyping = true;
  }

  hideTypingIndicator() {
    this.messages = this.messages.filter(msg => !msg.isTyping);
    this.isTyping = false;
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 100);
  }

  clearChat() {
    this.messages = [];
    this.initializeChat();
  }

  onKeyPress(event: any) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  // Quick suggestion buttons
  sendQuickMessage(message: string) {
    this.currentMessage = message;
    this.sendMessage();
  }

  getQuickSuggestions(): string[] {
    return [
      'Bagaimana cara menggunakan VitaRing?',
      'Apa arti nilai detak jantung saya?',
      'Tips untuk hidup sehat',
      'Cara merawat VitaRing',
      'Analisis data kesehatan saya'
    ];
  }

  getQuickSuggestionIcon(suggestion: string): string {
    if (suggestion.includes('menggunakan')) return 'help-circle-outline';
    if (suggestion.includes('detak jantung')) return 'heart-outline';
    if (suggestion.includes('Tips')) return 'bulb-outline';
    if (suggestion.includes('merawat')) return 'shield-checkmark-outline';
    if (suggestion.includes('Analisis')) return 'analytics-outline';
    return 'chatbubble-outline';
  }

  formatTimestamp(date: Date): string {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
