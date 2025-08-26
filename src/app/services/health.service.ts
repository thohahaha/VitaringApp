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
  isDeviceOn: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  
  private healthDataSubject = new BehaviorSubject<HealthMetrics | null>(null);
  public healthData$: Observable<HealthMetrics | null> = this.healthDataSubject.asObservable();
  
  private unsubscribe: (() => void) | null = null;

  constructor(private firestore: Firestore) {
    this.listenForHealthData();
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
            const data = docSnapshot.data() as HealthMetrics;
            console.log('Health data updated:', data);
            this.healthDataSubject.next(data);
          } else {
            console.log('Device document does not exist');
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
    this.healthDataSubject.next(data);
  }

  /**
   * Restart listening for health data
   */
  restartListener(): void {
    this.stopListener();
    this.listenForHealthData();
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
  }
}
