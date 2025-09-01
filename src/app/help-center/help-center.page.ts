import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonList,
  IonLabel,
  IonText,
  IonInput,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
  arrowBack, 
  search,
  headset,
  bug,
  hardwareChip,
  build,
  chevronUp,
  chevronDown,
  mail,
  chatbubble
} from 'ionicons/icons';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  expanded: boolean;
}

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.page.html',
  styleUrls: ['./help-center.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonList,
    IonLabel,
    IonText,
    IonInput,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class HelpCenterPage implements OnInit {

  searchQuery: string = '';
  faqs: FAQ[] = [
    {
      id: 1,
      question: 'How do I set up my VitaRing device?',
      answer: 'To set up your VitaRing device, first download the VitaRing app and create an account. Then, place your ring on the charger and follow the pairing instructions in the app.',
      expanded: false
    },
    {
      id: 2,
      question: 'How accurate are the health measurements?',
      answer: 'VitaRing uses advanced sensors to provide highly accurate health measurements. Heart rate accuracy is ±1 bpm, and temperature measurements have 95% accuracy for continuous monitoring.',
      expanded: false
    },
    {
      id: 3,
      question: 'How long does the battery last?',
      answer: 'VitaRing has a battery life of up to 7 days with normal usage. Battery life may vary depending on usage patterns and enabled features.',
      expanded: false
    },
    {
      id: 4,
      question: 'Is VitaRing waterproof?',
      answer: 'Yes, VitaRing is waterproof up to 100 meters (10 ATM). You can wear it while swimming, showering, or during water sports.',
      expanded: false
    },
    {
      id: 5,
      question: 'How do I sync my data?',
      answer: 'Your VitaRing automatically syncs data when it\'s near your phone with Bluetooth enabled. You can also manually sync by opening the app and pulling down to refresh.',
      expanded: false
    },
    {
      id: 6,
      question: 'What sizes are available?',
      answer: 'VitaRing is available in sizes 6-13. Use our sizing kit to find your perfect fit before ordering.',
      expanded: false
    }
  ];

  filteredFAQs: FAQ[] = [];

  constructor(private location: Location) {
    addIcons({
      arrowBack,
      search,
      headset,
      bug,
      hardwareChip,
      build,
      chevronUp,
      chevronDown,
      mail,
      chatbubble
    });
  }

  ngOnInit() {
    this.filteredFAQs = [...this.faqs];
  }

  filterFAQs() {
    if (!this.searchQuery.trim()) {
      this.filteredFAQs = [...this.faqs];
    } else {
      this.filteredFAQs = this.faqs.filter(faq => 
        faq.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  toggleFAQ(faq: FAQ) {
    faq.expanded = !faq.expanded;
  }

  contactSupport() {
    console.log('Opening contact support...');
  }

  reportIssue() {
    console.log('Opening issue report...');
  }

  deviceSetup() {
    console.log('Opening device setup guide...');
  }

  troubleshooting() {
    console.log('Opening troubleshooting guide...');
  }

  sendEmail() {
    window.open('mailto:support@vitaring.com');
  }

  openChat() {
    console.log('Opening live chat...');
  }

  goBack() {
    this.location.back();
  }
}
