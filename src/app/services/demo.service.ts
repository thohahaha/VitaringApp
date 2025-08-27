import { Injectable } from '@angular/core';
import { 
  Firestore, 
  doc, 
  getDoc, 
  setDoc 
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DemoService {
  private deviceId = 'test-device-001';

  constructor(private firestore: Firestore) {
    console.log('🎮 DemoService initialized for Firestore testing');
  }

  /**
   * Simulate device going online (isDeviceOn = true)
   */
  async simulateOnline(): Promise<void> {
    try {
      const deviceRef = doc(this.firestore, 'health-data', this.deviceId);
      
      // Get existing data first
      const docSnap = await getDoc(deviceRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      const newData = {
        ...existingData,
        isDeviceOn: true,
        lastUpdatedBy: 'DemoService',
        forceRefresh: Date.now(),
        timestamp: new Date()
      };

      await setDoc(deviceRef, newData, { merge: true });
      console.log('✅ Device set to ONLINE via DemoService');
    } catch (error) {
      console.error('❌ Error setting device online:', error);
      throw error;
    }
  }

  /**
   * Simulate device going offline (isDeviceOn = false)
   */
  async simulateOffline(): Promise<void> {
    try {
      const deviceRef = doc(this.firestore, 'health-data', this.deviceId);
      
      // Get existing data first
      const docSnap = await getDoc(deviceRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      const newData = {
        ...existingData,
        isDeviceOn: false,
        lastUpdatedBy: 'DemoService',
        forceRefresh: Date.now(),
        timestamp: new Date()
      };

      await setDoc(deviceRef, newData, { merge: true });
      console.log('✅ Device set to OFFLINE via DemoService');
    } catch (error) {
      console.error('❌ Error setting device offline:', error);
      throw error;
    }
  }

  /**
   * Update battery level
   */
  async updateBatteryLevel(level: number): Promise<void> {
    try {
      const deviceRef = doc(this.firestore, 'health-data', this.deviceId);
      
      // Get existing data first
      const docSnap = await getDoc(deviceRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      const newData = {
        ...existingData,
        batteryLevel: level,
        lastUpdatedBy: 'DemoService',
        forceRefresh: Date.now(),
        timestamp: new Date()
      };

      await setDoc(deviceRef, newData, { merge: true });
      console.log(`✅ Battery level updated to ${level}% via DemoService`);
    } catch (error) {
      console.error('❌ Error updating battery level:', error);
      throw error;
    }
  }

  /**
   * Update heart rate
   */
  async updateHeartRate(heartRate: number): Promise<void> {
    try {
      const deviceRef = doc(this.firestore, 'health-data', this.deviceId);
      
      // Get existing data first
      const docSnap = await getDoc(deviceRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      const newData = {
        ...existingData,
        heartRate: heartRate,
        lastUpdatedBy: 'DemoService',
        forceRefresh: Date.now(),
        timestamp: new Date()
      };

      await setDoc(deviceRef, newData, { merge: true });
      console.log(`✅ Heart rate updated to ${heartRate} BPM via DemoService`);
    } catch (error) {
      console.error('❌ Error updating heart rate:', error);
      throw error;
    }
  }

  /**
   * Get current device data
   */
  async getCurrentData(): Promise<any> {
    try {
      const deviceRef = doc(this.firestore, 'health-data', this.deviceId);
      const docSnap = await getDoc(deviceRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log('📄 No device data found');
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting device data:', error);
      throw error;
    }
  }
}
