import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Firestore,
  doc,
  onSnapshot,
  DocumentSnapshot
} from '@angular/fire/firestore';

export interface HealthMetrics {
  bmpTemp: number;       // Suhu udara dari sensor BMP
  objTemp: number;       // Suhu objek
  altitude: number;      // Ketinggian
  pressure: number;      // Tekanan udara
  amgTemp: number;       // Suhu ambient
  batteryLevel: number;  // Level baterai (0-100)
  heartRate: number;     // Detak jantung (untuk kompatibilitas UI)
  isDeviceOn: boolean;   // Status perangkat aktif
  isOnline?: boolean;    // Status online untuk kompatibilitas
  timestamp?: Date | any; // Timestamp data
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
  private sensorDataInterval: any = null;
  private enableFirestoreListener: boolean = true; // Toggle untuk debugging

  constructor(private firestore: Firestore) {
    if (this.enableFirestoreListener) {
      this.listenForSensorData();
    } else {
      console.log('🚫 Firestore listener DISABLED for debugging');
    }
    this.startSensorDataSimulation();
  }

  /**
   * Start sensor data simulation - updates every 10 seconds
   */
  private startSensorDataSimulation(): void {
    this.sensorDataInterval = setInterval(() => {
      const currentData = this.healthDataSubject.value;
      
      // Only simulate if device is online and we have data
      if (currentData?.isDeviceOn) {
        // Generate realistic sensor values
        const newBmpTemp = 28 + Math.random() * 8; // 28-36°C
        const newObjTemp = newBmpTemp + Math.random() * 4; // Slightly higher than ambient
        const newAltitude = 100 + Math.random() * 50; // 100-150m
        const newPressure = 995 + Math.random() * 15; // 995-1010 hPa
        const newAmgTemp = newBmpTemp + (Math.random() - 0.5) * 2; // Close to bmpTemp
        const newHeartRate = 70 + Math.random() * 20; // 70-90 bpm
        const newBatteryLevel = Math.max(0, (currentData.batteryLevel || 85) - Math.random() * 0.1); // Slow drain
        
        const updatedData: HealthMetrics = {
          ...currentData,
          bmpTemp: Number(newBmpTemp.toFixed(2)),
          objTemp: Number(newObjTemp.toFixed(2)),
          altitude: Number(newAltitude.toFixed(2)),
          pressure: Number(newPressure.toFixed(2)),
          amgTemp: Number(newAmgTemp.toFixed(2)),
          heartRate: Number(newHeartRate.toFixed(0)),
          batteryLevel: Number(newBatteryLevel.toFixed(1)),
          timestamp: new Date()
        };
        
        console.log(`🌡️ Sensor data: BMP:${updatedData.bmpTemp}°C, OBJ:${updatedData.objTemp}°C, HR:${updatedData.heartRate}bpm, BAT:${updatedData.batteryLevel}%`);
        this.healthDataSubject.next(updatedData);
      }
    }, 10000); // Every 10 seconds
    
    console.log('🌡️ Sensor data simulation started (every 10 seconds)');
  }

  /**
   * Stop sensor data simulation
   */
  private stopSensorDataSimulation(): void {
    if (this.sensorDataInterval) {
      clearInterval(this.sensorDataInterval);
      this.sensorDataInterval = null;
      console.log('🌡️ Sensor data simulation stopped');
    }
  }

  /**
   * Listen for real-time sensor data changes from Firestore
   */
  private listenForSensorData(): void {
    try {
      const deviceDocRef = doc(this.firestore, 'device_data', 'cincin-1');
      
      const unsubscribeFunction = onSnapshot(deviceDocRef, (docSnapshot: DocumentSnapshot) => {
        if (docSnapshot.exists()) {
          const rawData = docSnapshot.data();
          const timestamp = new Date().toLocaleTimeString();
          
          console.log(`📡 [${timestamp}] Raw sensor data from Firestore:`, rawData);
          
          try {
            // Parse sensor data from Firestore
            const data: HealthMetrics = {
              bmpTemp: Number(rawData?.['bmpTemp']) || 31.3,
              objTemp: Number(rawData?.['objTemp']) || 33.41,
              altitude: Number(rawData?.['altitude']) || 111.41,
              pressure: Number(rawData?.['pressure']) || 999.94,
              amgTemp: Number(rawData?.['amgTemp']) || 31.91,
              batteryLevel: Number(rawData?.['batteryLevel']) || 85,
              heartRate: Number(rawData?.['heartRate']) || 75,
              isDeviceOn: Boolean(rawData?.['isOnline'] ?? rawData?.['isDeviceOn'] ?? true),
              isOnline: Boolean(rawData?.['isOnline'] ?? rawData?.['isDeviceOn'] ?? true),
              timestamp: rawData?.['timestamp'] || new Date()
            };
            
            console.log(`📊 [${timestamp}] Parsed sensor data:`, {
              bmpTemp: data.bmpTemp,
              objTemp: data.objTemp,
              altitude: data.altitude,
              pressure: data.pressure,
              amgTemp: data.amgTemp,
              batteryLevel: data.batteryLevel,
              heartRate: data.heartRate,
              isDeviceOn: data.isDeviceOn,
              source: 'FIRESTORE_LISTENER'
            });
            
            // Control sensor simulation based on device status
            if (data.isDeviceOn) {
              if (!this.sensorDataInterval) {
                this.startSensorDataSimulation();
              }
            } else {
              this.stopSensorDataSimulation();
            }
            
            this.healthDataSubject.next(data);
            this.connectionStatusSubject.next(true);
            
          } catch (parseError) {
            console.error('❌ Error parsing sensor data:', parseError);
          }
        } else {
          console.log('❌ Sensor data document does not exist');
          this.healthDataSubject.next(null);
          this.connectionStatusSubject.next(false);
        }
      }, (error) => {
        console.error('❌ Firestore listener error:', error);
        this.healthDataSubject.next(null);
        this.connectionStatusSubject.next(false);
      });

      // Store the unsubscribe function
      this.unsubscribe = unsubscribeFunction;
      
    } catch (error) {
      console.error('❌ Error setting up Firestore listener:', error);
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
      bmpTemp: data.bmpTemp,
      objTemp: data.objTemp,
      altitude: data.altitude,
      pressure: data.pressure,
      amgTemp: data.amgTemp,
      heartRate: data.heartRate,
      batteryLevel: data.batteryLevel,
      source: 'Manual Update',
      timestamp: new Date().toLocaleTimeString()
    });
    
    // Make sure isOnline field matches isDeviceOn for compatibility
    const dataWithCompatibility = {
      ...data,
      isOnline: data.isDeviceOn  // Sync with Firestore field name
    };
    
    // Control sensor simulation based on device status
    if (data.isDeviceOn) {
      if (!this.sensorDataInterval) {
        this.startSensorDataSimulation();
      }
    } else {
      this.stopSensorDataSimulation();
    }
    
    this.healthDataSubject.next(dataWithCompatibility);
  }

  /**
   * Restart listening for sensor data
   */
  restartListener(): void {
    this.stopListener();
    this.listenForSensorData();
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
   * Clean up when service is destroyed
   */
  ngOnDestroy(): void {
    this.stopListener();
    this.stopSensorDataSimulation();
  }
}
