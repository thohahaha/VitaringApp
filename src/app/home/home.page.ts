import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NewsService } from '../services/news.service';
import { HealthService, HealthMetrics } from '../services/health.service';
import { HealthDataSimulator } from '../services/health-data-simulator.service';
import { Subscription, Observable } from 'rxjs';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonSelect, IonSelectOption, IonFooter, IonTabBar, IonTabButton, IonLabel, IonRouterOutlet, IonToggle, IonApp } from '@ionic/angular/standalone';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { News } from '../models/news.interface';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { NavbarComponent } from '../shared/navbar/navbar.component';

interface Device {
  id: string;
  name: string;
  heartRate: number;
  batteryLevel: number;
  temperature: number;
  hydration: number;
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
      model: 'Vita Ring Pro',
      serial: 'VR-2024-G7H8I9',
      firmware: 'v2.1.4',
      isConnected: false,
      ledStatus: true,
    },
  ];
  selectedDeviceId: string;
  selectedDevice: Device;
  lastDeviceActiveState: boolean | undefined;
  lastConnectionStatus: boolean | undefined;
  deviceStatus: string = 'Offline'; // Property instead of getter to prevent excessive calls
  activeTab: string = 'dashboard';
  findRingActive: boolean = false;
  isLoggedIn: boolean = false;
  currentUserEmail: string | null = null;
  private authStateSubscription: Subscription | undefined;
  private healthDataSubscription: Subscription | undefined;
  private connectionStatusSubscription: Subscription | undefined;
  isAdmin: boolean = false;

  // Health data from real-time service
  healthData: HealthMetrics | null = null;
  isFirestoreConnected: boolean = true;

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

  private healthSimulator: HealthDataSimulator; // Created manually to avoid circular dependency

  constructor(
    private authService: AuthService,
    private newsService: NewsService,
    private healthService: HealthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.selectedDeviceId = this.devices[0].id;
    this.selectedDevice = this.devices[0];
    
    // Create simulator manually to avoid circular dependency
    this.healthSimulator = new HealthDataSimulator(this.healthService);
  }

  ngOnInit() {
    console.log('🚀 HomePage ngOnInit started');
    
    // Initialize user profile from auth service
    this.initializeUserProfile();
    
    // Load latest news
    this.loadLatestNews();
    
    // Subscribe to real-time health data
    this.subscribeToHealthData();
    
    // Initialize device status
    this.updateDeviceStatus();
    
    // DON'T start health data simulation automatically - causes conflicts
    // setTimeout(() => {
    //   this.healthSimulator.startSimulation();
    // }, 2000);
    
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
    // Subscribe to health data
    this.healthDataSubscription = this.healthService.healthData$.subscribe(
      (data: HealthMetrics | null) => {
        this.healthData = data;
        if (data) {
          // Update the first device with real health data
          this.updateDeviceWithHealthData(data);
          console.log('📊 Sensor data received in component:', {
            originalData: data,
            isDeviceOn: data.isDeviceOn,
            isDeviceOnType: typeof data.isDeviceOn,
            isDeviceOnString: String(data.isDeviceOn),
            isDeviceOnBoolean: Boolean(data.isDeviceOn),
            bmpTemp: data.bmpTemp,
            objTemp: data.objTemp,
            altitude: data.altitude,
            pressure: data.pressure,
            ambTemp: data.ambTemp,
            timestamp: new Date().toLocaleTimeString(),
            healthDataAssigned: !!this.healthData,
            healthDataIsDeviceOn: this.healthData?.isDeviceOn
          });
          
          // Force change detection to update UI
          this.cdr.detectChanges();
        } else {
          console.log('❌ No health data available');
        }
      }
    );

    // Subscribe to connection status
    // this.connectionStatusSubscription = this.healthService.connectionStatus$.subscribe(
    //   (isConnected: boolean) => {
    //     this.isFirestoreConnected = isConnected;
    //     console.log('🔗 Firestore connection status:', isConnected ? 'Connected' : 'Disconnected');
    //     if (!isConnected) {
    //       // Clear health data when disconnected
    //       this.healthData = null;
    //     }
    //   }
    // );
  }

  /**
   * Update device data with real health metrics
   */
  updateDeviceWithHealthData(healthData: HealthMetrics) {
    if (this.devices.length > 0) {
      this.devices[0] = {
        ...this.devices[0],
        temperature: healthData.bmpTemp, // Use bmpTemp as main temperature
        batteryLevel: 85, // Keep static for now since we don't have battery in sensor data
        isConnected: healthData.isDeviceOn,
        // Map altitude to hydration percentage for demo purposes
        hydration: Math.min(99, Math.max(50, Math.round(healthData.altitude / 2)))
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
    this.connectionStatusSubscription?.unsubscribe();
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

  openAiChat() {
    console.log('Navigating to AI Chat page...');
    this.router.navigate(['/ai-chat']);
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

  simulateOutdoor() {
    this.healthSimulator.simulateOutdoor();
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

  // Helper methods for device page
  getBatteryLevel(): number {
    // Use static battery level since HealthMetrics no longer includes battery data
    return this.selectedDevice.batteryLevel;
  }

  // Update device status property - called when connection status changes
  updateDeviceStatus(): void {
    const isOnline = this.getDeviceConnectionStatus();
    const newStatus = isOnline ? 'Online' : 'Offline';
    
    // Only update if status actually changed
    if (this.deviceStatus !== newStatus) {
      this.deviceStatus = newStatus;
      console.log('🎯 Device status updated:', this.deviceStatus);
    }
  }

  getDeviceConnectionStatus(): boolean {
    const result = this.healthData?.isDeviceOn !== undefined 
      ? this.healthData.isDeviceOn 
      : this.selectedDevice?.isConnected || false;
    
    // Reduced logging - only log on state change
    if (this.lastConnectionStatus !== result) {
      console.log('🔗 Connection status changed:', {
        from: this.lastConnectionStatus,
        to: result,
        source: this.healthData?.isDeviceOn !== undefined ? 'FIRESTORE' : 'LOCAL_DEVICE'
      });
      this.lastConnectionStatus = result;
      // Update device status when connection changes
      this.updateDeviceStatus();
    }
    
    return result;
  }

  // Check if device is active based on Firestore data
  isDeviceActive(): boolean {
    const result = this.healthData?.isDeviceOn !== undefined 
      ? this.healthData.isDeviceOn 
      : this.selectedDevice?.isConnected || false;
      
    // Reduced logging - only log on state change
    if (this.lastDeviceActiveState !== result) {
      console.log('✅ Device state changed:', {
        from: this.lastDeviceActiveState,
        to: result,
        timestamp: new Date().toLocaleTimeString()
      });
      this.lastDeviceActiveState = result;
    }
    
    return result;
  }

  // Manual offline testing
  toggleOfflineMode(): void {
    this.isFirestoreConnected = !this.isFirestoreConnected;
    this.healthService.setOfflineMode(!this.isFirestoreConnected);
  }

  getOfflineModeText(): string {
    return this.isFirestoreConnected ? 'Simulasi Offline' : 'Kembali Online';
  }

  // Helper methods for better data display
  getHeartRateZone(heartRate: number): string {
    if (heartRate < 60) return 'Istirahat';
    if (heartRate < 100) return 'Normal';
    if (heartRate < 150) return 'Aerobik';
    if (heartRate < 180) return 'Anaerobik';
    return 'Maksimal';
  }

  getTemperatureStatus(temperature: number): string {
    if (temperature < 20.0) return 'Dingin';
    if (temperature <= 25.0) return 'Sejuk';
    if (temperature <= 30.0) return 'Normal';
    if (temperature <= 35.0) return 'Hangat';
    return 'Panas';
  }

  getPressureStatus(pressure: number): string {
    if (pressure < 980) return 'Rendah';
    if (pressure <= 1020) return 'Normal';
    return 'Tinggi';
  }

  getAltitudeStatus(altitude: number): string {
    if (altitude < 50) return 'Pantai';
    if (altitude <= 200) return 'Dataran';
    if (altitude <= 500) return 'Perbukitan';
    return 'Pegunungan';
  }

  getHeartRateStatus(bpm: number): string {
    if (bpm < 60) return 'Rendah';
    if (bpm <= 100) return 'Normal';
    if (bpm <= 120) return 'Tinggi';
    return 'Sangat Tinggi';
  }

  getStepsChange(steps: number): string {
    const target = 10000; // Daily target
    const percentage = Math.round((steps / target) * 100);
    if (percentage >= 100) return '+' + (percentage - 100) + '%';
    return percentage + '%';
  }

  formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }

  // Device status testing methods (simplified)
  async demoSetOnline() {
    try {
      // Simulate device going online by updating local sensor data
      this.healthService.updateHealthData({
        altitude: 111.41,
        ambTemp: 31.91,
        bmpTemp: 31.3,
        bpx: 75,
        irValue: 1250,
        objTemp: 33.41,
        pressure: 999.94,
        deviceID: "ESP32C3-A8358206CF8",
        deviceName: "VitaRing Pro Max", // Add device name
        isDeviceOn: true,
        isOnline: true,
        timestamp: new Date().toISOString(),
        type: 'demo_data'
      });
      console.log('✅ Device set to ONLINE via local simulation');
    } catch (error) {
      console.error('❌ Error setting device online:', error);
    }
  }

  async demoSetOffline() {
    try {
      // Simulate device going offline by updating local sensor data
      this.healthService.updateHealthData({
        altitude: this.healthData?.altitude || 111.41,
        ambTemp: this.healthData?.ambTemp || 31.91,
        bmpTemp: this.healthData?.bmpTemp || 31.3,
        bpx: this.healthData?.bpx || 75,
        irValue: this.healthData?.irValue || 1250,
        objTemp: this.healthData?.objTemp || 33.41,
        pressure: this.healthData?.pressure || 999.94,
        deviceID: this.healthData?.deviceID || "ESP32C3-A8358206CF8",
        deviceName: this.healthData?.deviceName || "VitaRing Pro Max", // Add device name
        isDeviceOn: false,
        isOnline: false,
        timestamp: new Date().toISOString(),
        type: 'demo_data'
      });
      console.log('✅ Device set to OFFLINE via local simulation');
    } catch (error) {
      console.error('❌ Error setting device offline:', error);
    }
  }

  async demoUpdateSensorData(sensorType: string, value: number) {
    try {
      // Update specific sensor data while maintaining other data
      const updatedData: any = {
        altitude: this.healthData?.altitude || 111.41,
        ambTemp: this.healthData?.ambTemp || 31.91,
        bmpTemp: this.healthData?.bmpTemp || 31.3,
        bpx: this.healthData?.bpx || 75,
        irValue: this.healthData?.irValue || 1250,
        objTemp: this.healthData?.objTemp || 33.41,
        pressure: this.healthData?.pressure || 999.94,
        deviceID: this.healthData?.deviceID || "ESP32C3-A8358206CF8",
        isDeviceOn: this.healthData?.isDeviceOn ?? true,
        isOnline: this.healthData?.isOnline ?? true,
        timestamp: new Date().toISOString(),
        type: this.healthData?.type || 'sensor_data'
      };
      
      // Update specific sensor
      if (sensorType === 'altitude') updatedData.altitude = value;
      else if (sensorType === 'ambTemp') updatedData.ambTemp = value;
      else if (sensorType === 'bmpTemp') updatedData.bmpTemp = value;
      else if (sensorType === 'bpx') updatedData.bpx = value;
      else if (sensorType === 'irValue') updatedData.irValue = value;
      else if (sensorType === 'objTemp') updatedData.objTemp = value;
      else if (sensorType === 'pressure') updatedData.pressure = value;
      
      this.healthService.updateHealthData(updatedData);
      console.log(`✅ ${sensorType} updated to ${value} via local simulation`);
    } catch (error) {
      console.error(`❌ Error updating ${sensorType}:`, error);
    }
  }

  async demoUpdateTemperature(temp: number) {
    try {
      await this.demoUpdateSensorData('bmpTemp', temp);
    } catch (error) {
      console.error('❌ Error updating temperature:', error);
    }
  }

  async demoUpdateHeartRate(hr: number) {
    try {
      await this.demoUpdateSensorData('bpx', hr);
    } catch (error) {
      console.error('❌ Error updating heart rate:', error);
    }
  }

  // Battery update removed - not part of new HealthMetrics interface
  // async demoUpdateBattery(level: number) {
  //   try {
  //     await this.demoUpdateSensorData('batteryLevel', level);
  //   } catch (error) {
  //     console.error('❌ Error updating battery:', error);
  //   }
  // }

  /**
   * Start listening for data from a specific device ID
   */
  startListeningForDevice(deviceId: string): void {
    console.log(`🔄 Starting to listen for device: ${deviceId}`);
    this.healthService.startListeningForDevice(deviceId);
  }

  /**
   * Debug current health data
   */
  debugHealthData(): void {
    console.log('🔍 [HOME] Current health data:', this.healthData);
    console.log('🔍 [HOME] Device connection status:', this.getDeviceConnectionStatus());
    console.log('🔍 [HOME] Device status text:', this.deviceStatus);
    this.healthService.debugCurrentData();
    
    // Force change detection
    this.cdr.detectChanges();
  }

  /**
   * Force restart realtime listener
   */
  restartRealtimeListener(): void {
    console.log('🔄 [HOME] Forcing restart of realtime listener...');
    this.healthService.forceRestartListener();
    
    // Force change detection after a delay
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 2000);
  }

  /**
   * Force refresh data display
   */
  forceRefreshData(): void {
    console.log('🔄 [HOME] Force refreshing data display...');
    
    // Get current data from service
    const currentData = this.healthService.getCurrentHealthData();
    if (currentData) {
      this.healthData = { ...currentData };
      console.log('✅ [HOME] Data refreshed:', this.healthData);
    }
    
    // Force change detection
    this.cdr.detectChanges();
  }

  /**
   * Force restart listener with correct device ID
   */
  forceRestartWithCorrectDevice(): void {
    console.log('🔄 [HOME] Force restarting with correct device ID ESP32C3-A835B29E9EF0...');
    
    // Stop current listener
    this.healthService.stopListener();
    
    // Clear current data
    this.healthData = null;
    
    // Wait and restart with correct device ID
    setTimeout(() => {
      this.healthService.startListeningForDevice('ESP32C3-A835B29E9EF0');
      console.log('✅ [HOME] Restarted listener for ESP32C3-A835B29E9EF0');
    }, 2000);
    
    // Force change detection
    this.cdr.detectChanges();
  }

  /**
   * Clear cache and force reload
   */
  clearCacheAndReload(): void {
    console.log('🧹 [HOME] Clearing cache and reloading...');
    
    // Clear localStorage
    localStorage.clear();
    
    // Clear session storage
    sessionStorage.clear();
    
    // Force restart health service
    this.forceRestartWithCorrectDevice();
    
    // Show notification
    console.log('✅ [HOME] Cache cleared, listener restarted with correct device ID');
  }
}