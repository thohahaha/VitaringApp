import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtKiS7NYzXguZc0RqrtiuhLhQzoMyd4v8",
  authDomain: "vitaring-49c16.firebaseapp.com",
  databaseURL: "https://vitaring-49c16-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "vitaring-49c16",
  storageBucket: "vitaring-49c16.firebasestorage.app",
  messagingSenderId: "988321571107",
  appId: "1:988321571107:web:e7f4780f1bfbd03e196c96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const DEVICE_ID = "ESP32C3-A835B29E9EF0";

// Function to generate realistic sensor data
function generateSensorData() {
  const baseTemp = 30 + Math.random() * 8; // 30-38°C
  
  return {
    altitude: 111.41 + (Math.random() - 0.5) * 10, // 106-116m
    ambTemp: baseTemp + (Math.random() - 0.5) * 2, // Ambient temperature
    bmpTemp: baseTemp, // BMP sensor temperature
    bpx: 70 + Math.random() * 25, // 70-95 BPM
    irValue: 1000 + Math.random() * 800, // IR sensor value
    objTemp: baseTemp + Math.random() * 4, // Object temperature (slightly higher)
    pressure: 999.94 + (Math.random() - 0.5) * 20, // 990-1010 hPa
    deviceID: DEVICE_ID,
    deviceName: "VitaRing Pro Max",
    isDeviceOn: true,
    isOnline: true,
    timestamp: new Date().toISOString(),
    type: "sensor_data"
  };
}

// Function to add data to Realtime Database
async function populateRealtimeData() {
  try {
    console.log('🔥 Adding sensor data to Firebase Realtime Database...');
    
    // Generate sensor data
    const sensorData = generateSensorData();
    
    // Path in Realtime Database: /realtimeSensorData/{deviceId}
    const deviceRef = ref(database, `realtimeSensorData/${DEVICE_ID}`);
    
    // Set data to Realtime Database
    await set(deviceRef, sensorData);
    
    console.log('✅ Sensor data successfully added:');
    console.log(JSON.stringify(sensorData, null, 2));
    console.log(`📍 Path: /realtimeSensorData/${DEVICE_ID}`);
    console.log(`🌍 Device: ${sensorData.deviceName} (${DEVICE_ID})`);
    console.log(`📊 Key metrics:`);
    console.log(`   - BMP Temperature: ${sensorData.bmpTemp.toFixed(2)}°C`);
    console.log(`   - Object Temperature: ${sensorData.objTemp.toFixed(2)}°C`);
    console.log(`   - Pressure: ${sensorData.pressure.toFixed(2)} hPa`);
    console.log(`   - Heart Rate: ${sensorData.bpx.toFixed(0)} BPM`);
    console.log(`   - Altitude: ${sensorData.altitude.toFixed(2)} m`);
    
  } catch (error) {
    console.error('❌ Error adding data:', error.message);
  }
}

// Function to continuously update data (for live simulation)
async function startLiveSimulation() {
  console.log('🚀 Starting live data simulation...');
  
  setInterval(async () => {
    try {
      const deviceRef = ref(database, `realtimeSensorData/${DEVICE_ID}`);
      const newData = generateSensorData();
      
      await set(deviceRef, newData);
      
      const timestamp = new Date().toLocaleTimeString();
      console.log(`📡 [${timestamp}] Updated: Temp=${newData.bmpTemp.toFixed(1)}°C, Pressure=${newData.pressure.toFixed(1)}hPa, BPM=${newData.bpx.toFixed(0)}`);
      
    } catch (error) {
      console.error('❌ Error updating data:', error.message);
    }
  }, 5000); // Update every 5 seconds
}

// Function to listen for data changes
function listenForChanges() {
  const deviceRef = ref(database, `realtimeSensorData/${DEVICE_ID}`);
  
  onValue(deviceRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('📱 Data received by listener:', {
        bmpTemp: data.bmpTemp,
        pressure: data.pressure,
        bpx: data.bpx,
        timestamp: data.timestamp
      });
    }
  });
}

// Main execution
async function main() {
  console.log('🚀 Starting Firebase Realtime Database population...');
  console.log(`📍 Target path: /realtimeSensorData/${DEVICE_ID}`);
  console.log(`🔧 Using: ${firebaseConfig.databaseURL}`);
  
  // Add initial data
  await populateRealtimeData();
  
  // Wait a bit
  console.log('\n⏳ Waiting 3 seconds...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Start listening
  console.log('👂 Setting up listener...');
  listenForChanges();
  
  // Start live simulation
  await startLiveSimulation();
}

main();
