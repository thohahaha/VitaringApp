import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NewsService } from '../services/news.service';
import { HealthService, HealthMetrics } from '../services/health.service';
import { HealthDataSimulator } from '../services/health-data-simulator.service';
import { Subscription, Observable } from 'rxjs';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonSelect, IonSelectOption, IonFooter, IonTabBar, IonTabButton, IonLabel, IonRouterOutlet, IonToggle, IonApp } from '@ionic/angular/standalone';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { News } from '../models/news.model';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { NavbarComponent } from '../shared/navbar/navbar.component';

interface Device {
  id: string;
  name: string;
  heartRate: number;
  batteryLevel: number;
  temperature: number;
  hydration: number;
  sleepGoalAchieved: boolean;
  model: string;
  serial: string;
  firmware: string;
  isConnected: boolean;
  ledStatus: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AsyncPipe,
    TimeAgoPipe,
    NavbarComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonFooter,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonRouterOutlet,
    IonApp,
    IonToggle,
  ]
})
export class HomePage implements OnInit, OnDestroy {
  devices: Device[] = [
    {
      id: 'ring-1',
      name: 'Vita Ring Alpha',
      heartRate: 72,
      batteryLevel: 85,
      temperature: 36.8,
      hydration: 75,
      sleepGoalAchieved: true,
      model: 'Vita Ring Pro',
      serial: 'VR-2024-A1B2C3',
      firmware: 'v2.1.4',
      isConnected: true,
      ledStatus: true,
    },
    {
      id: 'ring-2',
      name: 'Vita Ring Beta',
      heartRate: 68,
      batteryLevel: 92,
      temperature: 37.0,
      hydration: 80,
      sleepGoalAchieved: false,
      model: 'Vita Ring Lite',
      serial: 'VR-2024-D4E5F6',
      firmware: 'v1.5.0',
      isConnected: true,
      ledStatus: false,
    },
    {
      id: 'ring-3',
      name: 'Vita Ring Gamma',
      heartRate: 75,
      batteryLevel: 60,
      temperature: 36.5,
      hydration: 70,
      sleepGoalAchieved: true,
      model: 'Vita Ring Pro',
      serial: 'VR-2024-G7H8I9',
      firmware: 'v2.1.4',
      isConnected: false,
      ledStatus: true,
    },
  ];
  selectedDeviceId: string;
  selectedDevice: Device;
  activeTab: string = 'dashboard';
  findRingActive: boolean = false;
  isLoggedIn: boolean = false;
  currentUserEmail: string | null = null;
  private authStateSubscription: Subscription | undefined;
  private healthDataSubscription: Subscription | undefined;
  isAdmin: boolean = false;

  // Health data from real-time service
  healthData: HealthMetrics | null = null;

  // News related properties
  latestNews$!: Observable<News[]>;

  // Profile related properties
  showEditProfile: boolean = false;
  userProfile = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    username: '@johndoe',
    password: '',
    phone: '+1234567890'
  };

  trainingZones = [
    { zone: 'Pembakaran Lemak', time: '45menit', percentage: 35, colorClass: 'bg-orange-400' },
    { zone: 'Aerobik', time: '32menit', percentage: 60, colorClass: 'bg-orange-500' },
    { zone: 'Anaerobik', time: '18menit', percentage: 25, colorClass: 'bg-indigo-500' },
    { zone: 'VO2 Max', time: '8menit', percentage: 15, colorClass: 'bg-emerald-500' }
  ];

  historicalDays = [
    { name: 'Sen', height: Math.random() * 80 + 20 },
    { name: 'Sel', height: Math.random() * 80 + 20 },
    { name: 'Rab', height: Math.random() * 80 + 20 },
    { name: 'Kam', height: Math.random() * 80 + 20 },
    { name: 'Jum', height: Math.random() * 80 + 20 },
    { name: 'Sab', height: Math.random() * 80 + 20 },
    { name: 'Min', height: Math.random() * 80 + 20 },
  ];

  constructor(
    private authService: AuthService,
    private newsService: NewsService,
    private healthService: HealthService,
    private healthSimulator: HealthDataSimulator,
    private router: Router,
  ) {
    this.selectedDeviceId = this.devices[0].id;
    this.selectedDevice = this.devices[0];
  }

  ngOnInit() {
    console.log('🚀 HomePage ngOnInit started');
    
    // Initialize user profile from auth service
    this.initializeUserProfile();
    
    // Load latest news
    this.loadLatestNews();
    
    // Subscribe to real-time health data
    this.subscribeToHealthData();
    
    // Start health data simulation for demo
    setTimeout(() => {
      this.healthSimulator.startSimulation();
    }, 2000);
    
    // Check auth status periodically
    setInterval(() => {
      const isLoggedIn = this.authService.isLoggedIn();
      if (isLoggedIn !== this.isLoggedIn) {
        console.log('🔐 Auth status changed:', isLoggedIn);
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn) {
          const user = this.authService.getCurrentUser();
          console.log('👤 Current user loaded:', user);
          this.currentUserEmail = user?.email || '';
          this.initializeUserProfile();
        }
      }
    }, 1000);
  }

  /**
   * Subscribe to real-time health data from Firebase
   */
  subscribeToHealthData() {
    this.healthDataSubscription = this.healthService.healthData$.subscribe(
      (data: HealthMetrics | null) => {
        this.healthData = data;
        if (data) {
          // Update the first device with real health data
          this.updateDeviceWithHealthData(data);
          console.log('📊 Health data received:', data);
        } else {
          console.log('❌ No health data available');
        }
      }
    );
  }

  /**
   * Update device data with real health metrics
   */
  updateDeviceWithHealthData(healthData: HealthMetrics) {
    if (this.devices.length > 0) {
      this.devices[0] = {
        ...this.devices[0],
        heartRate: healthData.heartRate,
        batteryLevel: healthData.batteryLevel,
        temperature: healthData.temperature,
        isConnected: healthData.isDeviceOn,
        // Map steps to hydration percentage for demo purposes
        hydration: Math.min(99, Math.max(50, Math.round(healthData.steps / 100)))
      };
      
      // Update selected device if it's the first one
      if (this.selectedDeviceId === this.devices[0].id) {
        this.selectedDevice = this.devices[0];
      }
    }
  }

  initializeUserProfile() {
    const user = this.authService.getCurrentUser();
    if (user && user.email) {
      this.userProfile.email = user.email;
      this.userProfile.name = user.email.split('@')[0] || 'User';
      this.userProfile.username = '@' + (user.email.split('@')[0] || 'user');
      this.currentUserEmail = user.email;
      
      // Check admin role
      this.isAdmin = user.role === 'admin';
      console.log('User role:', user.role, 'isAdmin:', this.isAdmin);
    }
  }

  ngOnDestroy() {
    this.authStateSubscription?.unsubscribe();
    this.healthDataSubscription?.unsubscribe();
    // Stop simulation and clean up health service listener
    this.healthSimulator.stopSimulation();
    this.healthService.stopListener();
  }

  updateDevices() {
    this.devices = this.devices.map(device => ({
      ...device,
      heartRate: Math.max(60, Math.min(120, device.heartRate + (Math.random() - 0.5) * 4)),
      batteryLevel: Math.max(10, Math.min(100, device.batteryLevel + (Math.random() - 0.5) * 2)),
      temperature: parseFloat((device.temperature + (Math.random() - 0.5) * 0.1).toFixed(1)),
      hydration: Math.max(50, Math.min(99, device.hydration + (Math.random() - 0.5) * 5)),
      isConnected: Math.random() > 0.1,
    }));
    this.selectedDevice = this.devices.find(d => d.id === this.selectedDeviceId)!;
  }

  setActiveTab(tab: string) {
    console.log('setActiveTab called with:', tab);
    this.activeTab = tab;
  }

  navigateToNews() {
    console.log('🔥 navigateToNews() called - navigating to /news');
    this.router.navigate(['/news']).then(success => {
      if (success) {
        console.log('✅ Navigation to /news successful');
      } else {
        console.log('❌ Navigation to /news failed');
      }
    }).catch(error => {
      console.error('❌ Navigation error:', error);
    });
  }

  navigateToForum() {
    console.log('🔥 navigateToForum() called - navigating to /forum');
    this.router.navigate(['/forum']).then(success => {
      if (success) {
        console.log('✅ Navigation to /forum successful');
      } else {
        console.log('❌ Navigation to /forum failed');
      }
    }).catch(error => {
      console.error('❌ Navigation error:', error);
    });
  }

  handleFindRing(device: Device) {
    this.findRingActive = true;
    setTimeout(() => {
      this.findRingActive = false;
      console.log(`Cincin ${device.name} telah ditemukan!`);
    }, 3000);
  }

  handleRingReset(device: Device) {
    if (window.confirm(`Apakah Anda yakin ingin mengatur ulang Vita Ring ${device.name} Anda?`)) {
      console.log(`Vita Ring ${device.name} telah diatur ulang.`);
    }
  }

  handleToggleLed(device: Device) {
    this.devices = this.devices.map(d =>
      d.id === device.id ? { ...d, ledStatus: !d.ledStatus } : d
    );
    this.selectedDevice = this.devices.find(d => d.id === this.selectedDeviceId)!;
    console.log(`LED cincin ${device.name} sekarang ${device.ledStatus ? 'mati' : 'menyala'}.`);
  }

  handleTestNotification(device: Device) {
    console.log(`Mengirim notifikasi tes ke ${device.name}.`);
  }
  
  logout() {
    console.log('Logging out user...');
    this.authService.logout().subscribe(() => {
      console.log('User logged out successfully');
      this.router.navigate(['/login']);
    });
  }

  // Profile methods
  openEditProfile() {
    this.showEditProfile = true;
  }

  closeEditProfile() {
    this.showEditProfile = false;
  }

  saveProfile() {
    console.log('Saving profile:', this.userProfile);
    
    // Create profile data excluding email (since it's disabled)
    const profileData = {
      name: this.userProfile.name,
      username: this.userProfile.username,
      phone: this.userProfile.phone
    };
    
    // Only include password if it's provided
    if (this.userProfile.password && this.userProfile.password.trim()) {
      profileData['password'] = this.userProfile.password;
    }
    
    console.log('Profile data to save (excluding email):', profileData);
    
    // Here you would typically call a service to save the profile
    // this.profileService.updateProfile(profileData).subscribe(...);
    
    this.showEditProfile = false;
    this.userProfile.password = ''; // Clear password field after save
    alert('Profil berhasil disimpan!');
  }

  handleAddDevice() {
    console.log('Adding new device from profile...');
    alert('Fitur tambah perangkat akan segera tersedia!');
  }

  handleRemoveDevice() {
    console.log('Removing device from profile...');
    if (confirm('Apakah Anda yakin ingin menghapus perangkat ini?')) {
      alert('Perangkat berhasil dihapus!');
    }
  }

  openPrivacyPolicy() {
    console.log('Navigating to Privacy Policy page...');
    this.router.navigate(['/privacy-policy']);
  }

  openFaq() {
    console.log('Navigating to FAQ page...');
    this.router.navigate(['/faq']);
  }

  openAboutApp() {
    console.log('Navigating to About App page...');
    this.router.navigate(['/about-app']);
  }

  // News related methods
  loadLatestNews() {
    this.latestNews$ = this.newsService.getLatestNews();
  }

  navigateToNewsDetail(newsId: string) {
    if (newsId) {
      this.router.navigate(['/news', newsId]);
    }
  }

  trackByNewsId(index: number, news: News): string {
    return news.id || index.toString();
  }

  // Handle image loading errors for news thumbnails
  onImageError(event: any) {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yOCAyNEgzNlYzMkgyOFYyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+PGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=';
  }

  // Health data simulation methods for testing
  simulateExercise() {
    this.healthSimulator.simulateExercise();
  }

  simulateRest() {
    this.healthSimulator.simulateRest();
  }

  simulateLowBattery() {
    this.healthSimulator.simulateLowBattery();
  }

  toggleSimulation() {
    if (this.healthSimulator.isSimulationRunning()) {
      this.healthSimulator.stopSimulation();
    } else {
      this.healthSimulator.startSimulation();
    }
  }

  getSimulationStatus(): string {
    return this.healthSimulator.isSimulationRunning() ? 'Stop Simulation' : 'Start Simulation';
  }

  
  
  
}