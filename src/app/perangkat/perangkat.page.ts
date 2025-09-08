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
  wifiOutline, 
  settingsOutline, 
  refreshOutline, thermometerOutline } from 'ionicons/icons';

interface DeviceSensors {
  heartRate: boolean;
  temperature: boolean;
  motion: boolean;
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
    serial: 'ESP32C3-A8358206CF8', // Default, will be updated from HealthMetrics
    firmware: 'v2.1.3',
    batteryLevel: 78,
    isConnected: true
  };
  
  sensors: DeviceSensors = {
    heartRate: true,
    temperature: true,
    motion: true
  };

  constructor(private healthService: HealthService) {
    // Add icons
    addIcons({hardwareChip,alertCircle,batteryHalfOutline,wifiOutline,wifi,settingsOutline,refreshOutline,informationCircle,heart,thermometer,sunny,fitness,walk,thermometerOutline,moon,batteryHalf,notifications,chevronForward,refresh,sync,checkmarkCircle,barcode,construct,bluetooth,settings,locate,download});
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
          // Update device status with real sensor data from Realtime Database
          this.selectedDevice.isConnected = data.isDeviceOn;
          this.deviceConnected = data.isDeviceOn;
          this.batteryLevel = 85; // Keep static since sensor doesn't provide battery
          
          // Update device name and serial number from sensor data
          if (data.deviceName) {
            this.selectedDevice.name = data.deviceName;
            this.selectedDevice.model = data.deviceName; // Update model to use deviceName from realtime data
          }
          if (data.deviceID) {
            this.selectedDevice.serial = data.deviceID;
          }
          
          console.log('📱 Perangkat page - Sensor data received:', {
            deviceName: data.deviceName,
            deviceID: data.deviceID,
            model: this.selectedDevice.model, // Log the updated model
            bmpTemp: data.bmpTemp,
            objTemp: data.objTemp,
            altitude: data.altitude,
            pressure: data.pressure,
            ambTemp: data.ambTemp,
            isDeviceOn: data.isDeviceOn,
            isConnected: this.selectedDevice.isConnected,
            serial: this.selectedDevice.serial,
            timestamp: new Date().toLocaleTimeString()
          });
        } else {
          console.log('❌ Perangkat page - No sensor data available');
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
    // Since sensor data doesn't include battery, use device default
    return this.selectedDevice.batteryLevel;
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

  /**
   * Open WiFi settings to connect to ESP32 device
   * This will open the system WiFi settings page
   */
  openWiFiSettings() {
    console.log('🔧 Opening WiFi settings to connect to ESP32...');
    
    try {
      // Check if running on mobile device
      if (window.navigator && 'userAgent' in window.navigator) {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        
        if (isMobile) {
          // For mobile devices, try to open WiFi settings
          if (userAgent.includes('android')) {
            // Android WiFi settings
            window.open('android-app://com.android.settings/.wifi.WifiSettings', '_system');
          } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
            // iOS WiFi settings
            window.open('App-Prefs:root=WIFI', '_system');
          }
        } else {
          // For desktop/web, show instructions
          this.showWiFiInstructions();
        }
      } else {
        this.showWiFiInstructions();
      }
    } catch (error) {
      console.error('❌ Error opening WiFi settings:', error);
      this.showWiFiInstructions();
    }
  }

  /**
   * Show WiFi connection instructions for desktop users
   */
  private showWiFiInstructions() {
    const instructions = `
Untuk menghubungkan ke ESP32 VitaRing:

1. Buka pengaturan WiFi komputer Anda
2. Cari jaringan "VitaRing_ESP32" atau "ESP32-AP"
3. Hubungkan ke jaringan tersebut
4. Masukkan password jika diminta (biasanya: "vitaring123")
5. Kembali ke aplikasi ini

Jika menggunakan Windows:
- Klik ikon WiFi di system tray
- Pilih jaringan ESP32

Jika menggunakan Mac:
- Klik ikon WiFi di menu bar
- Pilih jaringan ESP32
    `;
    
    alert(instructions);
  }

  /**
   * Disconnect from ESP32 device
   * This will simulate disconnecting from the device
   */
  disconnectDevice() {
    console.log('🔌 Disconnecting from ESP32 device...');
    
    if (confirm('Apakah Anda yakin ingin memutus koneksi dari perangkat ESP32?')) {
      try {
        // Stop the health service listener
        this.healthService.stopListener();
        
        // Set device as offline
        this.healthService.setOfflineMode(true);
        
        // Update local device status
        this.selectedDevice.isConnected = false;
        
        // Show success message
        console.log('✅ Successfully disconnected from ESP32');
        
        // Show user-friendly notification
        setTimeout(() => {
          alert('Berhasil memutus koneksi dari ESP32. Untuk menghubungkan kembali, gunakan tombol "Buka Pengaturan WiFi".');
        }, 500);
        
      } catch (error) {
        console.error('❌ Error disconnecting from device:', error);
        alert('Gagal memutus koneksi. Silakan coba lagi.');
      }
    }
  }

  /**
   * Reconnect to ESP32 device
   * This will restart the connection to the device
   */
  reconnectDevice() {
    console.log('🔄 Reconnecting to ESP32 device...');
    
    try {
      // Restart the health service listener
      this.healthService.restartListener();
      
      // Set device as online
      this.healthService.setOfflineMode(false);
      
      // Update local device status
      this.selectedDevice.isConnected = true;
      
      console.log('✅ Attempting to reconnect to ESP32');
      
      // Show user-friendly notification
      setTimeout(() => {
        alert('Mencoba menghubungkan kembali ke ESP32. Pastikan perangkat dalam jangkauan dan WiFi aktif.');
      }, 500);
      
    } catch (error) {
      console.error('❌ Error reconnecting to device:', error);
      alert('Gagal menghubungkan kembali. Silakan periksa koneksi WiFi Anda.');
    }
  }

  resetDevice() {
    if (confirm('Apakah Anda yakin ingin mereset perangkat? Semua data akan dihapus.')) {
      console.log('Resetting device...');
      // Reset device to factory settings
    }
  }
}
