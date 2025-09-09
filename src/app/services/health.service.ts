import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Database,
  ref,
  onValue,
  off
} from '@angular/fire/database';
import { environment } from '../../environments/environment';

export interface HealthMetrics {
  altitude: number;      // Ketinggian
  ambTemp: number;       // Suhu ambient
  bmpTemp: number;       // Suhu udara dari sensor BMP
  bpx: number;           // Detak jantung/pulse dari sensor
  irValue: number;       // Nilai IR dari sensor
  objTemp: number;       // Suhu objek
  pressure: number;      // Tekanan udara
  deviceID: string;      // ID perangkat unik
  deviceName: string;    // Nama perangkat yang mudah dibaca
  isDeviceOn: boolean;   // Status perangkat aktif
  isOnline: boolean;     // Status online perangkat
  timestamp: string;     // Waktu data (string format)
  type: string;          // Tipe data
}

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  
  private healthDataSubject = new BehaviorSubject<HealthMetrics | null>(null);
  private connectionStatusSubject = new BehaviorSubject<boolean>(true);
  public healthData$: Observable<HealthMetrics | null> = this.healthDataSubject.asObservable();
  public connectionStatus$: Observable<boolean> = this.connectionStatusSubject.asObservable();
  
  private unsubscribe: (() => void) | null = null;
  private isManuallyOffline: boolean = false;

  constructor(private database: Database) {
    console.log('🏥 HealthService constructor - Database instance:', this.database);
    console.log('🌍 Environment check:', {
      production: environment.production,
      databaseURL: environment.firebase.databaseURL
    });
    
    // Start with default device ID for Realtime Database connection
    const defaultDeviceId = "ESP32C3-A835B29E9EF0";
    console.log('🔌 Starting Realtime Database listener for device:', defaultDeviceId);
    this.listenForSensorData(defaultDeviceId);
  }

  /**
   * Listen for real-time sensor data changes from Firebase Realtime Database
   * Accepts deviceId as parameter to listen for specific device data
   */
  private listenForSensorData(deviceId: string = "ESP32C3-A835B29E9EF0"): void {
    try {
      console.log('🔄 listenForSensorData - Starting listener for deviceId:', deviceId);
      console.log('🔄 Database instance check:', {
        database: this.database,
        databaseExists: !!this.database,
        databaseType: typeof this.database
      });
      
      // Create reference to specific device path in Realtime Database
      const deviceRef = ref(this.database, `realtimeSensorData/${deviceId}`);
      console.log('📍 Database path:', `realtimeSensorData/${deviceId}`);
      console.log('📍 Reference created:', deviceRef);
      
      // Listen for data changes
      const unsubscribeFunction = onValue(deviceRef, (snapshot) => {
        console.log('📡 onValue callback triggered');
        console.log('📡 Snapshot exists:', snapshot.exists());
        
        if (snapshot.exists()) {
          const rawData = snapshot.val();
          const timestamp = new Date().toLocaleTimeString();
          
          console.log(`📡 [${timestamp}] Raw sensor data from Realtime Database:`, rawData);
          
          try {
            // Parse sensor data from Realtime Database
            const data: HealthMetrics = {
              altitude: Number(rawData?.altitude) || 111.41,
              ambTemp: Number(rawData?.ambTemp) || 31.91,
              bmpTemp: Number(rawData?.bmpTemp) || 31.3,
              bpx: Number(rawData?.bpx) || 75,
              irValue: Number(rawData?.irValue) || 1250,
              objTemp: Number(rawData?.objTemp) || 33.41,
              pressure: Number(rawData?.pressure) || 999.94,
              deviceID: rawData?.deviceID || deviceId,
              deviceName: rawData?.deviceName || `VitaRing ${deviceId.slice(-6)}`,
              isDeviceOn: rawData?.isDeviceOn !== undefined ? Boolean(rawData.isDeviceOn) : true,
              isOnline: rawData?.isOnline !== undefined ? Boolean(rawData.isOnline) : true,
              timestamp: rawData?.timestamp || new Date().toISOString(),
              type: rawData?.type || 'sensor_data'
            };
            
            console.log(`📊 [${timestamp}] Parsed sensor data:`, {
              bmpTemp: data.bmpTemp,
              objTemp: data.objTemp,
              altitude: data.altitude,
              pressure: data.pressure,
              ambTemp: data.ambTemp,
              bpx: data.bpx,
              irValue: data.irValue,
              deviceID: data.deviceID,
              isDeviceOn: data.isDeviceOn,
              isOnline: data.isOnline,
              type: data.type,
              source: 'REALTIME_DATABASE'
            });
            
            // Update subjects with realtime data
            console.log('🔄 Updating BehaviorSubject with realtime data...');
            this.healthDataSubject.next(data);
            this.connectionStatusSubject.next(true);
            
            console.log('✅ Current BehaviorSubject value after update:', {
              bmpTemp: data.bmpTemp,
              pressure: data.pressure,
              bpx: data.bpx,
              timestamp: data.timestamp
            });
            
          } catch (parseError) {
            console.error('❌ Error parsing sensor data:', parseError);
          }
        } else {
          const timestamp = new Date().toLocaleTimeString();
          console.log(`❌ [${timestamp}] Sensor data for device ${deviceId} does not exist`);
          console.log('❌ Snapshot details:', {
            exists: snapshot.exists(),
            hasChildren: snapshot.hasChildren(),
            key: snapshot.key,
            ref: snapshot.ref.toString()
          });
          
          this.healthDataSubject.next(null);
          this.connectionStatusSubject.next(false);
        }
      }, (error) => {
        console.error('❌ Realtime Database listener error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        this.healthDataSubject.next(null);
        this.connectionStatusSubject.next(false);
      });

      // Store the unsubscribe function
      this.unsubscribe = () => off(deviceRef);
      
    } catch (error) {
      console.error('❌ Error setting up Realtime Database listener:', error);
      console.error('❌ Setup error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      console.error('❌ Database configuration:', environment.firebase);
      this.healthDataSubject.next(null);
      this.connectionStatusSubject.next(false);
    }
  }

  /**
   * Get current health data snapshot
   */
  getCurrentHealthData(): HealthMetrics | null {
    return this.healthDataSubject.value;
  }

  /**
   * Update health data manually (for testing purposes)
   */
  updateHealthData(data: HealthMetrics): void {
    console.log('🔄 Updating sensor data locally:', {
      isDeviceOn: data.isDeviceOn,
      isOnline: data.isOnline,
      bmpTemp: data.bmpTemp,
      objTemp: data.objTemp,
      altitude: data.altitude,
      pressure: data.pressure,
      ambTemp: data.ambTemp,
      bpx: data.bpx,
      irValue: data.irValue,
      deviceID: data.deviceID,
      type: data.type,
      source: 'Manual Update',
      timestamp: data.timestamp
    });
    
    // Make sure isOnline field matches isDeviceOn for compatibility
    const dataWithCompatibility = {
      ...data,
      isOnline: data.isOnline || data.isDeviceOn
    };
    
    this.healthDataSubject.next(dataWithCompatibility);
  }

  /**
   * Start listening for sensor data from a specific device
   */
  startListeningForDevice(deviceId: string): void {
    console.log(`🔄 Starting listener for device: ${deviceId}`);
    this.stopListener();
    this.listenForSensorData(deviceId);
  }

  /**
   * Restart listening for sensor data with default device
   */
  restartListener(): void {
    const defaultDeviceId = "ESP32C3-A835B29E9EF0";
    this.stopListener();
    this.listenForSensorData(defaultDeviceId);
  }

  /**
   * Set manual offline mode for testing
   */
  setOfflineMode(offline: boolean): void {
    console.log('🎮 Manual offline mode:', offline);
    this.isManuallyOffline = offline;
    if (offline) {
      this.connectionStatusSubject.next(false);
    } else {
      this.connectionStatusSubject.next(true);
    }
  }

  /**
   * Stop listening for health data
   */
  stopListener(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  /**
   * Debug method to check current health data
   */
  debugCurrentData(): void {
    const current = this.healthDataSubject.value;
    console.log('🔍 Debug - Current health data:', current);
    console.log('🔍 Debug - Connection status:', this.connectionStatusSubject.value);
  }

  /**
   * Force restart realtime listener
   */
  forceRestartListener(): void {
    const defaultDeviceId = "ESP32C3-A835B29E9EF0";
    console.log('🔄 Force restarting realtime listener...');
    this.stopListener();
    
    // Wait a bit before restarting
    setTimeout(() => {
      this.listenForSensorData(defaultDeviceId);
    }, 1000);
  }

  /**
   * Clean up when service is destroyed
   */
  ngOnDestroy(): void {
    this.stopListener();
  }
}
