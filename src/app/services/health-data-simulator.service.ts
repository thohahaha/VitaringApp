import { Injectable } from '@angular/core';
import { HealthService, HealthMetrics } from './health.service';

@Injectable({
  providedIn: 'root'
})
export class HealthDataSimulator {

  private simulationInterval: any;
  private isRunning: boolean = false;

  constructor(private healthService: HealthService) {}

  /**
   * Start simulating health data updates every 5 seconds
   */
  startSimulation(): void {
    if (this.isRunning) {
      console.log('Simulation already running');
      return;
    }

    console.log('🏃‍♂️ Starting health data simulation...');
    this.isRunning = true;

    // Generate initial data
    this.generateAndUpdateHealthData();

    // Update every 5 seconds
    this.simulationInterval = setInterval(() => {
      this.generateAndUpdateHealthData();
    }, 5000);
  }

  /**
   * Stop the simulation
   */
  stopSimulation(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.isRunning = false;
    console.log('⏹️ Health data simulation stopped');
  }

  /**
   * Generate realistic sensor data and update the service
   */
  private generateAndUpdateHealthData(): void {
    const currentData = this.healthService.getCurrentHealthData();
    const DEVICE_ID = "ESP32C3-A83B29E9EF0"; // Hardcoded device ID for demo
    
    // Generate realistic variations for sensor data
    const baseAltitude = currentData?.altitude || 111.41;
    const baseAmbTemp = currentData?.ambTemp || 31.91;
    const baseBmpTemp = currentData?.bmpTemp || 31.3;
    const baseBpx = currentData?.bpx || 75;
    const baseIrValue = currentData?.irValue || 1250;
    const baseObjTemp = currentData?.objTemp || 33.41;
    const basePressure = currentData?.pressure || 999.94;

    const healthData: HealthMetrics = {
      altitude: Number((baseAltitude + (Math.random() - 0.5) * 20).toFixed(2)), // ±10m variation
      ambTemp: Number((baseAmbTemp + (Math.random() - 0.5) * 3).toFixed(2)), // ±1.5°C variation
      bmpTemp: Number((baseBmpTemp + (Math.random() - 0.5) * 4).toFixed(2)), // ±2°C variation
      bpx: Number((baseBpx + (Math.random() - 0.5) * 10).toFixed(0)), // ±5 bpm variation
      irValue: Number((baseIrValue + (Math.random() - 0.5) * 100).toFixed(0)), // ±50 IR value variation
      objTemp: Number((baseObjTemp + (Math.random() - 0.5) * 3).toFixed(2)), // ±1.5°C variation
      pressure: Number((basePressure + (Math.random() - 0.5) * 10).toFixed(2)), // ±5 hPa variation
      deviceID: DEVICE_ID,
      isDeviceOn: Math.random() > 0.1, // 90% chance device is on
      isOnline: Math.random() > 0.1, // 90% chance online
      timestamp: new Date().toISOString(),
      type: 'sensor_data'
    };

    console.log('📊 Generated sensor data:', healthData);
    this.healthService.updateHealthData(healthData);
  }

  /**
   * Check if simulation is running
   */
  isSimulationRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Generate specific test scenarios
   */
  simulateExercise(): void {
    const DEVICE_ID = "ESP32C3-A83B29E9EF0"; // Hardcoded device ID for demo
    const exerciseData: HealthMetrics = {
      altitude: 120.0, // Slightly higher altitude
      ambTemp: 35.8, // Higher ambient temperature
      bmpTemp: 35.2, // Higher ambient temperature during exercise
      bpx: 145, // High heart rate during exercise
      irValue: 1800, // Higher IR value during exercise
      objTemp: 38.5, // Higher object temperature
      pressure: 1005.5, // Different pressure
      deviceID: DEVICE_ID,
      isDeviceOn: true,
      isOnline: true,
      timestamp: new Date().toISOString(),
      type: 'exercise_data'
    };
    
    console.log('🏃‍♂️ Simulating exercise scenario');
    this.healthService.updateHealthData(exerciseData);
  }

  simulateRest(): void {
    const DEVICE_ID = "ESP32C3-A83B29E9EF0"; // Hardcoded device ID for demo
    const restData: HealthMetrics = {
      altitude: 110.0, // Base altitude
      ambTemp: 29.1, // Lower ambient temperature
      bmpTemp: 28.5, // Lower ambient temperature at rest
      bpx: 65, // Resting heart rate
      irValue: 1100, // Lower IR value at rest
      objTemp: 31.2, // Lower object temperature
      pressure: 998.2, // Different pressure
      deviceID: DEVICE_ID,
      isDeviceOn: true,
      isOnline: true,
      timestamp: new Date().toISOString(),
      type: 'rest_data'
    };
    
    console.log('😴 Simulating rest scenario');
    this.healthService.updateHealthData(restData);
  }

  simulateOutdoor(): void {
    const DEVICE_ID = "ESP32C3-A83B29E9EF0"; // Hardcoded device ID for demo
    const outdoorData: HealthMetrics = {
      altitude: 125.3, // Slightly higher altitude
      ambTemp: 33.2, // Outdoor ambient temperature
      bmpTemp: 32.8, // Outdoor temperature
      bpx: 85, // Moderate heart rate outdoors
      irValue: 1300, // Moderate IR value outdoors
      objTemp: 34.5, // Object temperature outdoors
      pressure: 1002.1, // Outdoor pressure
      deviceID: DEVICE_ID,
      isDeviceOn: true,
      isOnline: true,
      timestamp: new Date().toISOString(),
      type: 'outdoor_data'
    };
    
    console.log('🌤️ Simulating outdoor scenario');
    this.healthService.updateHealthData(outdoorData);
  }
}
