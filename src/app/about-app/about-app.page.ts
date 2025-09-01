import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-app',
  templateUrl: './about-app.page.html',
  styleUrls: ['./about-app.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class AboutAppPage {
  appInfo = {
    name: 'VitaRing',
    version: '1.0.0',
    buildNumber: '100',
    releaseDate: '2024',
    description: 'Aplikasi monitoring kesehatan revolusioner yang mengintegrasikan teknologi IoT untuk memberikan pemantauan kesehatan real-time yang komprehensif.',
    platform: 'Ionic Angular',
    compatibility: 'iOS, Android, Web'
  };

  // Getter properties for template
  get appVersion() {
    return this.appInfo.version;
  }

  get buildNumber() {
    return this.appInfo.buildNumber;
  }

  get releaseDate() {
    return this.appInfo.releaseDate;
  }

  get appFeatures() {
    return this.features;
  }

  get appDetails() {
    return [
      { label: 'Versi Aplikasi', value: this.appInfo.version },
      { label: 'Build Number', value: this.appInfo.buildNumber },
      { label: 'Platform', value: this.appInfo.platform },
      { label: 'Kompatibilitas', value: this.appInfo.compatibility },
      { label: 'Tanggal Rilis', value: this.appInfo.releaseDate },
      { label: 'Ukuran Aplikasi', value: '15.2 MB' },
      { label: 'Bahasa', value: 'Indonesia, English' },
      { label: 'Lisensi', value: 'Proprietary' }
    ];
  }

  features = [
    {
      icon: 'heart',
      iconColor: 'heart-color',
      title: 'Heart Rate Monitor',
      description: 'Pemantauan detak jantung real-time dengan akurasi tinggi menggunakan sensor canggih.'
    },
    {
      icon: 'pulse',
      iconColor: 'activity-color',
      title: 'Activity Tracking',
      description: 'Pelacakan aktivitas harian seperti langkah kaki, kalori terbakar, dan jarak tempuh.'
    },
    {
      icon: 'analytics',
      iconColor: 'analytics-color',
      title: 'Health Analytics',
      description: 'Analisis mendalam data kesehatan dengan tren dan wawasan untuk gaya hidup sehat.'
    },
    {
      icon: 'battery-charging',
      iconColor: 'battery-color',
      title: 'Smart Battery',
      description: 'Manajemen baterai cerdas dengan daya tahan hingga 7 hari dalam sekali pengisian.'
    }
  ];

  techStack = [
    { name: 'Ionic', icon: 'phone-portrait', framework: true },
    { name: 'Angular', icon: 'logo-angular', framework: true },
    { name: 'TypeScript', icon: 'logo-javascript', language: true },
    { name: 'Capacitor', icon: 'hardware-chip', platform: true },
    { name: 'Firebase', icon: 'cloud', backend: true },
    { name: 'TailwindCSS', icon: 'color-palette', styling: true }
  ];

  appStats = [
    {
      icon: 'people',
      iconColor: 'users-color',
      number: '10K+',
      label: 'Active Users'
    },
    {
      icon: 'analytics',
      iconColor: 'monitoring-color',
      number: '24/7',
      label: 'Health Monitoring'
    },
    {
      icon: 'checkmark-circle',
      iconColor: 'uptime-color',
      number: '99.9%',
      label: 'System Uptime'
    }
  ];

  privacyFeatures = [
    {
      icon: 'shield-checkmark',
      iconColor: '#10b981',
      title: 'Data Encryption',
      description: 'Semua data kesehatan dienkripsi end-to-end untuk menjamin keamanan informasi pribadi Anda.'
    },
    {
      icon: 'lock-closed',
      iconColor: '#3b82f6',
      title: 'Privacy First',
      description: 'Kami tidak membagikan data pribadi Anda kepada pihak ketiga tanpa persetujuan eksplisit.'
    },
    {
      icon: 'server',
      iconColor: '#8b5cf6',
      title: 'Secure Storage',
      description: 'Data disimpan di server aman dengan standar keamanan tingkat enterprise.'
    },
    {
      icon: 'eye-off',
      iconColor: '#f59e0b',
      title: 'No Tracking',
      description: 'Aplikasi tidak melakukan tracking aktivitas di luar konteks kesehatan yang diperlukan.'
    }
  ];

  developerInfo = {
    name: 'Muhammad Abdillah Thoha',
    role: 'Fullstack Developer & UI/UX Designer',
    bio: 'Passionate developer yang berfokus pada inovasi teknologi kesehatan dan pengalaman pengguna yang optimal.',
    github: 'https://github.com/abdillahtop',
    portfolio: 'https://abdillah-portfolio.web.app'
  };

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }

  openDeveloperPage() {
    // Navigate to developer page if needed
    console.log('Opening developer page...');
  }

  openPrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
  }

  openTermsOfService() {
    // Navigate to terms of service page
    console.log('Opening terms of service...');
  }

  openTerms() {
    this.openTermsOfService();
  }

  contactDeveloper() {
    // Navigate to developer contact or open email
    console.log('Contacting developer...');
    // You can implement email opening or navigation to contact page
    const email = 'abdillah@vitaring.com';
    const subject = 'VitaRing App Inquiry';
    const body = 'Halo, saya ingin bertanya tentang aplikasi VitaRing...';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  }

  openFAQ() {
    this.router.navigate(['/faq']);
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getBuildDate(): string {
    const today = new Date();
    return today.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  shareApp() {
    if (navigator.share) {
      navigator.share({
        title: 'VitaRing - Health Monitoring App',
        text: 'Aplikasi monitoring kesehatan revolusioner dengan teknologi IoT',
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      console.log('Sharing VitaRing app...');
    }
  }
}
