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
   * Generate realistic health data and update the service
   */
  private generateAndUpdateHealthData(): void {
    const currentData = this.healthService.getCurrentHealthData();
    
    // Generate realistic variations
    const baseHeartRate = 72;
    const baseBattery = currentData?.batteryLevel || 85;
    const baseTemp = 36.8;
    const baseSteps = currentData?.steps || 0;

    const healthData: HealthMetrics = {
      heartRate: Math.round(baseHeartRate + (Math.random() - 0.5) * 20), // 62-82 range
      steps: baseSteps + Math.round(Math.random() * 50), // Incremental steps
      temperature: Number((baseTemp + (Math.random() - 0.5) * 0.8).toFixed(1)), // 36.4-37.2 range
      batteryLevel: Math.max(10, baseBattery - Math.random() * 0.5), // Slow battery drain
      isDeviceOn: Math.random() > 0.1 // 90% chance device is on
    };

    console.log('📊 Generated health data:', healthData);
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
    const exerciseData: HealthMetrics = {
      heartRate: 120,
      steps: 5000,
      temperature: 37.5,
      batteryLevel: 75,
      isDeviceOn: true
    };
    
    console.log('🏃‍♂️ Simulating exercise scenario');
    this.healthService.updateHealthData(exerciseData);
  }

  simulateRest(): void {
    const restData: HealthMetrics = {
      heartRate: 60,
      steps: 1000,
      temperature: 36.5,
      batteryLevel: 90,
      isDeviceOn: true
    };
    
    console.log('😴 Simulating rest scenario');
    this.healthService.updateHealthData(restData);
  }

  simulateLowBattery(): void {
    const currentData = this.healthService.getCurrentHealthData();
    const lowBatteryData: HealthMetrics = {
      heartRate: currentData?.heartRate || 72,
      steps: currentData?.steps || 2000,
      temperature: currentData?.temperature || 36.8,
      batteryLevel: 15,
      isDeviceOn: true
    };
    
    console.log('🔋 Simulating low battery scenario');
    this.healthService.updateHealthData(lowBatteryData);
  }
}
