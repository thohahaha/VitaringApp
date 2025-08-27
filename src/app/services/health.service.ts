import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Firestore, 
  doc, 
  onSnapshot,
  DocumentSnapshot
} from '@angular/fire/firestore';

export interface HealthMetrics {
  heartRate: number;
  steps: number;
  temperature: number;
  batteryLevel: number;
  isDeviceOn: boolean;  // For internal use
  isOnline?: boolean;   // For Firestore compatibility
  timestamp?: Date | any; // Optional timestamp for data freshness
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
  private heartRateInterval: any = null;
  private enableFirestoreListener: boolean = true; // Toggle untuk debugging

  constructor(private firestore: Firestore) {
    if (this.enableFirestoreListener) {
      this.listenForHealthData();
    } else {
      console.log('🚫 Firestore listener DISABLED for debugging');
    }
    this.startHeartRateSimulation();
  }

  /**
   * Start heart rate simulation - updates every 10 seconds
   */
  private startHeartRateSimulation(): void {
    this.heartRateInterval = setInterval(() => {
      const currentData = this.healthDataSubject.value;
      
      // Only simulate if device is online and we have data
      if (currentData?.isDeviceOn) {
        // Generate realistic heart rate: 60-100 BPM with small variations
        const baseHeartRate = 75;
        const variation = Math.floor(Math.random() * 25) - 12; // -12 to +12
        const newHeartRate = Math.max(60, Math.min(100, baseHeartRate + variation));
        
        const updatedData: HealthMetrics = {
          ...currentData,
          heartRate: newHeartRate,
          timestamp: new Date()
        };
        
        console.log(`💓 Heart rate simulation: ${newHeartRate} BPM`);
        this.healthDataSubject.next(updatedData);
      }
    }, 10000); // Every 10 seconds
    
    console.log('💓 Heart rate simulation started (every 10 seconds)');
  }

  /**
   * Stop heart rate simulation
   */
  private stopHeartRateSimulation(): void {
    if (this.heartRateInterval) {
      clearInterval(this.heartRateInterval);
      this.heartRateInterval = null;
      console.log('💓 Heart rate simulation stopped');
    }
  }

  /**
   * Listen for real-time health data changes from Firestore
   */
  private listenForHealthData(): void {
    try {
      const deviceDocRef = doc(this.firestore, 'device_data/cincin-1');
      
      this.unsubscribe = onSnapshot(
        deviceDocRef,
        (docSnapshot: DocumentSnapshot) => {
          if (docSnapshot.exists()) {
            const rawData = docSnapshot.data();
            const timestamp = new Date().toLocaleTimeString();
            
            // Safe parsing with multiple field name checks
            const isDeviceOnValue = rawData?.['isOnline'] ?? 
                                   rawData?.['isDeviceOn'] ?? 
                                   rawData?.['deviceOn'] ?? 
                                   rawData?.['online'] ?? 
                                   rawData?.['status'] ?? 
                                   false;
                                   
            const data: HealthMetrics = {
              heartRate: Number(rawData?.['heartRate']) || 0,
              steps: Number(rawData?.['steps']) || 0,
              temperature: Number(rawData?.['temperature']) || 0,
              batteryLevel: Number(rawData?.['batteryLevel']) || 0,
              isDeviceOn: Boolean(isDeviceOnValue),
              timestamp: rawData?.['timestamp']
            };
            
            console.log(`🔄 [${timestamp}] Firestore data parsing:`, {
              rawFirestoreData: rawData,
              rawIsOnline: rawData?.['isOnline'],
              rawIsDeviceOn: rawData?.['isDeviceOn'],
              rawDeviceOn: rawData?.['deviceOn'],
              rawOnline: rawData?.['online'],
              rawStatus: rawData?.['status'],
              selectedValue: isDeviceOnValue,
              selectedValueType: typeof isDeviceOnValue,
              parsedIsDeviceOn: data.isDeviceOn,
              booleanConversion: Boolean(isDeviceOnValue),
              allRawKeys: Object.keys(rawData || {}),
              source: 'FIRESTORE_LISTENER'
            });
            
            // Control heart rate simulation based on device status
            if (data.isDeviceOn) {
              if (!this.heartRateInterval) {
                this.startHeartRateSimulation();
              }
            } else {
              this.stopHeartRateSimulation();
            }
            
            this.healthDataSubject.next(data);
          } else {
            console.log('❌ Device document does not exist');
            this.healthDataSubject.next(null);
          }
        },
        (error) => {
          console.error('Error listening to health data:', error);
          this.healthDataSubject.next(null);
        }
      );
    } catch (error) {
      console.error('Error setting up health data listener:', error);
      this.healthDataSubject.next(null);
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
    console.log('🔄 Updating health data locally:', {
      isDeviceOn: data.isDeviceOn,
      heartRate: data.heartRate,
      batteryLevel: data.batteryLevel,
      source: 'Manual Update',
      timestamp: new Date().toLocaleTimeString()
    });
    
    // Make sure isOnline field matches isDeviceOn for Firestore compatibility
    const dataWithCompatibility = {
      ...data,
      isOnline: data.isDeviceOn  // Sync with Firestore field name
    };
    
    // Control heart rate simulation based on device status
    if (data.isDeviceOn) {
      if (!this.heartRateInterval) {
        this.startHeartRateSimulation();
      }
    } else {
      this.stopHeartRateSimulation();
    }
    
    this.healthDataSubject.next(dataWithCompatibility);
  }

  /**
   * Restart listening for health data
   */
  restartListener(): void {
    this.stopListener();
    this.listenForHealthData();
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
    this.stopHeartRateSimulation();
  }
}
