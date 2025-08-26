import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-developer',
  templateUrl: './about-developer.page.html',
  styleUrls: ['./about-developer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class AboutDeveloperPage implements OnInit {
  
  // Developer Info
  showAvatarFallback = false;
  appVersion = '1.0.0';
  lastUpdated = 'Agustus 2025';

  // Developer Skills
  developerSkills = [
    { name: 'Angular', icon: 'logo-angular' },
    { name: 'Ionic', icon: 'phone-portrait-outline' },
    { name: 'TypeScript', icon: 'code-outline' },
    { name: 'JavaScript', icon: 'logo-javascript' },
    { name: 'React Native', icon: 'logo-react' },
    { name: 'Node.js', icon: 'logo-nodejs' },
    { name: 'Firebase', icon: 'flame-outline' },
    { name: 'UI/UX Design', icon: 'color-palette-outline' }
  ];

  // Professional Experience
  professionalExperience = [
    {
      position: 'Senior Mobile App Developer',
      company: 'VitaRing Technology',
      duration: '2023 - Sekarang',
      description: 'Memimpin pengembangan aplikasi VitaRing menggunakan Ionic Angular, menciptakan solusi inovatif untuk monitoring kesehatan dan kebugaran dengan teknologi wearable.'
    },
    {
      position: 'Full Stack Developer',
      company: 'HealthTech Solutions',
      duration: '2021 - 2023',
      description: 'Mengembangkan aplikasi kesehatan digital terintegrasi dengan IoT devices, menggunakan Angular, Firebase, dan teknologi cloud computing.'
    },
    {
      position: 'Mobile Developer',
      company: 'Digital Innovation Labs',
      duration: '2020 - 2021',
      description: 'Fokus pada pengembangan aplikasi mobile native dan hybrid untuk sektor kesehatan dan lifestyle dengan emphasis pada user experience yang optimal.'
    }
  ];

  // Social Links
  socialLinks = [
    {
      platform: 'GitHub',
      handle: 'muhammad-abdillah-thoha',
      url: 'https://github.com/muhammad-abdillah-thoha',
      icon: 'logo-github',
      colorClass: 'github-color'
    },
    {
      platform: 'LinkedIn',
      handle: 'Muhammad Abdillah Thoha',
      url: 'https://linkedin.com/in/muhammad-abdillah-thoha',
      icon: 'logo-linkedin',
      colorClass: 'linkedin-color'
    },
    {
      platform: 'Email',
      handle: 'm.abdillah.thoha@gmail.com',
      url: 'mailto:m.abdillah.thoha@gmail.com',
      icon: 'mail-outline',
      colorClass: 'email-color'
    },
    {
      platform: 'Portfolio',
      handle: 'abdillah-thoha.dev',
      url: 'https://abdillah-thoha.dev',
      icon: 'globe-outline',
      colorClass: 'portfolio-color'
    },
    {
      platform: 'Twitter',
      handle: '@AbdillahThoha',
      url: 'https://twitter.com/AbdillahThoha',
      icon: 'logo-twitter',
      colorClass: 'twitter-color'
    },
    {
      platform: 'Instagram',
      handle: '@abdillah_thoha_dev',
      url: 'https://instagram.com/abdillah_thoha_dev',
      icon: 'logo-instagram',
      colorClass: 'instagram-color'
    }
  ];

  // Project Statistics
  projectStats = [
    {
      value: '50+',
      label: 'Proyek Selesai',
      icon: 'checkmark-circle-outline',
      colorClass: 'projects-color'
    },
    {
      value: '5+',
      label: 'Tahun Pengalaman',
      icon: 'calendar-outline',
      colorClass: 'experience-color'
    },
    {
      value: '30+',
      label: 'Klien Puas',
      icon: 'people-outline',
      colorClass: 'clients-color'
    },
    {
      value: '15+',
      label: 'Teknologi',
      icon: 'code-slash-outline',
      colorClass: 'technologies-color'
    }
  ];

  // Technology Categories
  techCategories = [
    {
      name: 'Frontend Development',
      technologies: [
        { name: 'Angular', icon: 'logo-angular', proficiency: 95, level: 'Expert' },
        { name: 'React', icon: 'logo-react', proficiency: 90, level: 'Advanced' },
        { name: 'Vue.js', icon: 'logo-vue', proficiency: 80, level: 'Advanced' },
        { name: 'TypeScript', icon: 'code-outline', proficiency: 93, level: 'Expert' },
        { name: 'JavaScript', icon: 'logo-javascript', proficiency: 95, level: 'Expert' }
      ]
    },
    {
      name: 'Mobile Development',
      technologies: [
        { name: 'Ionic', icon: 'phone-portrait-outline', proficiency: 95, level: 'Expert' },
        { name: 'React Native', icon: 'logo-react', proficiency: 88, level: 'Advanced' },
        { name: 'Flutter', icon: 'phone-portrait-outline', proficiency: 75, level: 'Intermediate' },
        { name: 'Capacitor', icon: 'layers-outline', proficiency: 90, level: 'Advanced' }
      ]
    },
    {
      name: 'Backend & Database',
      technologies: [
        { name: 'Node.js', icon: 'logo-nodejs', proficiency: 85, level: 'Advanced' },
        { name: 'Firebase', icon: 'flame-outline', proficiency: 90, level: 'Advanced' },
        { name: 'MongoDB', icon: 'server-outline', proficiency: 80, level: 'Advanced' },
        { name: 'PostgreSQL', icon: 'server-outline', proficiency: 75, level: 'Intermediate' }
      ]
    },
    {
      name: 'Design & Tools',
      technologies: [
        { name: 'Figma', icon: 'color-palette-outline', proficiency: 85, level: 'Advanced' },
        { name: 'Adobe XD', icon: 'color-palette-outline', proficiency: 80, level: 'Advanced' },
        { name: 'Git', icon: 'git-branch-outline', proficiency: 90, level: 'Advanced' },
        { name: 'Docker', icon: 'cube-outline', proficiency: 70, level: 'Intermediate' }
      ]
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('AboutDeveloperPage initialized');
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  onAvatarError(event: any) {
    this.showAvatarFallback = true;
    console.log('Avatar image failed to load, showing fallback');
  }

  trackSocialClick(platform: string) {
    console.log(`Clicked on ${platform} link`);
    // Analytics tracking could be implemented here
  }

  sendEmail() {
    const email = 'm.abdillah.thoha@gmail.com';
    const subject = 'Halo dari VitaRing App - Kolaborasi';
    const body = 'Halo Muhammad Abdillah Thoha, saya tertarik untuk berkolaborasi dengan Anda terkait pengembangan aplikasi VitaRing...';
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  openLinkedIn() {
    window.open('https://linkedin.com/in/muhammad-abdillah-thoha', '_blank');
  }
}
