import { Component, OnInit, OnDestroy } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonIcon
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { HealthService, HealthMetrics } from '../services/health.service';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { 
  hardwareChip,
  checkmarkCircle,
  alertCircle,
  informationCircle,
  barcode,
  construct,
  bluetooth,
  sync,
  settings,
  locate,
  download,
  heart,
  thermometer,
  walk,
  moon,
  notifications,
  sunny,
  fitness,
  refresh,
  chevronForward, 
  batteryHalf, 
  wifi, 
  batteryHalfOutline, 
  wifiOutline } from 'ionicons/icons';

interface DeviceSensors {
  heartRate: boolean;
  temperature: boolean;
  motion: boolean;
  sleep: boolean;
}

interface Device {
  name: string;
  model: string;
  serial: string;
  firmware: string;
  batteryLevel: number;
  isConnected: boolean;
}

@Component({
  selector: 'app-perangkat',
  templateUrl: './perangkat.page.html',
  styleUrls: ['./perangkat.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    NavbarComponent
  ]
})
export class PerangkatPage implements OnInit, OnDestroy {

  deviceConnected: boolean = true;
  batteryLevel: number = 78;
  healthData: HealthMetrics | null = null;
  private healthSubscription: Subscription = new Subscription();
  
  selectedDevice: Device = {
    name: 'VitaRing Pro',
    model: 'VitaRing Pro Gen 3',
    serial: 'VR-2024-001234',
    firmware: 'v2.1.3',
    batteryLevel: 78,
    isConnected: true
  };
  
  sensors: DeviceSensors = {
    heartRate: true,
    temperature: true,
    motion: true,
    sleep: false
  };

  constructor(private healthService: HealthService) {
    // Add icons
    addIcons({batteryHalfOutline,wifiOutline,batteryHalf,wifi,notifications,heart,thermometer,walk,moon,chevronForward,sunny,fitness,refresh,sync,hardwareChip,checkmarkCircle,alertCircle,informationCircle,barcode,construct,bluetooth,settings,locate,download});
  }

  ngOnInit() {
    this.loadDeviceStatus();
    this.subscribeToHealthData();
  }

  ngOnDestroy() {
    // Unsubscribe from health data to prevent memory leaks
    if (this.healthSubscription) {
      this.healthSubscription.unsubscribe();
    }
  }

  subscribeToHealthData() {
    this.healthSubscription = this.healthService.healthData$.subscribe(
      (data) => {
        this.healthData = data;
        if (data) {
          // Update device status with real data from Firestore
          this.selectedDevice.batteryLevel = data.batteryLevel || this.selectedDevice.batteryLevel;
          this.selectedDevice.isConnected = data.isDeviceOn;
          this.deviceConnected = data.isDeviceOn;
          this.batteryLevel = data.batteryLevel || this.batteryLevel;
          
          console.log('📱 Perangkat page - Health data received:', {
            batteryLevel: data.batteryLevel,
            isDeviceOn: data.isDeviceOn,
            isConnected: this.selectedDevice.isConnected,
            timestamp: new Date().toLocaleTimeString()
          });
        } else {
          console.log('❌ Perangkat page - No health data available');
        }
      }
    );
  }

  loadDeviceStatus() {
    // Simulate loading device status
    // In a real app, this would connect to the actual device
    console.log('Loading device status...');
  }

  // Reactive getters for real-time data
  get currentBatteryLevel(): number {
    return this.healthData?.batteryLevel || this.selectedDevice.batteryLevel;
  }

  get currentConnectionStatus(): boolean {
    return this.healthData?.isDeviceOn ?? this.selectedDevice.isConnected;
  }

  get batteryStatusText(): string {
    const battery = this.currentBatteryLevel;
    if (battery > 50) return `${Math.ceil((battery - 50) / 10)} hari tersisa`;
    if (battery > 20) return `${Math.ceil((battery - 20) / 5)} hari tersisa`;
    return 'Segera isi daya!';
  }

  syncDevice() {
    console.log('Syncing device...');
    // Show loading and sync data
  }

  calibrateDevice() {
    console.log('Calibrating device...');
    // Open calibration process
  }

  findDevice() {
    console.log('Finding device...');
    // Make device vibrate or beep
  }

  updateFirmware() {
    console.log('Checking for firmware updates...');
    // Check and download firmware updates
  }

  openNotificationSettings() {
    console.log('Opening notification settings...');
  }

  openDisplaySettings() {
    console.log('Opening display settings...');
  }

  openHealthSettings() {
    console.log('Opening health settings...');
  }

  resetDevice() {
    if (confirm('Apakah Anda yakin ingin mereset perangkat? Semua data akan dihapus.')) {
      console.log('Resetting device...');
      // Reset device to factory settings
    }
  }
}
