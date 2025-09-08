// Script untuk mengisi Firebase Realtime Database dengan data sensor ESP32
// Jalankan dengan: node fill-realtime-simple.js

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

// Konfigurasi Firebase - sesuaikan dengan project Anda
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

// Device ID untuk testing
const DEVICE_ID = "ESP32C3-A8358206CF8";

// Data sensor dummy yang sesuai dengan interface HealthMetrics
const generateSensorData = () => {
  return {
    altitude: Number((100 + Math.random() * 50).toFixed(2)),           // 100-150 meter
    ambTemp: Number((28 + Math.random() * 8).toFixed(2)),              // 28-36°C  
    bmpTemp: Number((30 + Math.random() * 6).toFixed(2)),              // 30-36°C
    bpx: Number((70 + Math.random() * 30).toFixed(0)),                 // 70-100 BPM
    irValue: Number((1000 + Math.random() * 500).toFixed(0)),          // 1000-1500
    objTemp: Number((32 + Math.random() * 6).toFixed(2)),              // 32-38°C
    pressure: Number((995 + Math.random() * 20).toFixed(2)),           // 995-1015 hPa
    deviceID: DEVICE_ID,
    deviceName: "VitaRing Pro Max ESP32",                               // Nama perangkat yang mudah dibaca
    isDeviceOn: true,
    isOnline: true,
    timestamp: new Date().toISOString(),
    type: "sensor_data"
  };
};

// Fungsi untuk mengisi data ke Realtime Database
async function fillSensorData() {
  try {
    console.log('🔥 Mengisi data sensor ke Firebase Realtime Database...');
    
    // Generate data sensor
    const sensorData = generateSensorData();
    
    // Path di Realtime Database: /realtimeSensorData/{deviceId}
    const deviceRef = ref(database, `realtimeSensorData/${DEVICE_ID}`);
    
    // Set data ke Realtime Database
    await set(deviceRef, sensorData);
    
    console.log('✅ Data sensor berhasil ditambahkan:');
    console.log(JSON.stringify(sensorData, null, 2));
    
    console.log('\n📱 Data ini akan muncul di aplikasi Ionic Angular Anda');
    console.log(`📍 Path: /realtimeSensorData/${DEVICE_ID}`);
    
  } catch (error) {
    console.error('❌ Error mengisi data:', error);
  }
}

// Fungsi untuk mensimulasi data secara berkala
function startDataSimulation(intervalSeconds = 30) {
  console.log(`🔄 Memulai simulasi data setiap ${intervalSeconds} detik...`);
  
  // Fill initial data
  fillSensorData();
  
  // Set interval untuk update data berkala
  setInterval(() => {
    fillSensorData();
  }, intervalSeconds * 1000);
}

// Fungsi untuk testing device status
async function toggleDeviceStatus(isOn = true) {
  try {
    const deviceRef = ref(database, `realtimeSensorData/${DEVICE_ID}`);
    const currentData = generateSensorData();
    
    // Update device status
    currentData.isDeviceOn = isOn;
    currentData.isOnline = isOn;
    
    await set(deviceRef, currentData);
    
    console.log(`🔧 Device status diubah ke: ${isOn ? 'ON' : 'OFF'}`);
    
  } catch (error) {
    console.error('❌ Error mengubah status device:', error);
  }
}

// Export functions untuk testing
export {
  fillSensorData,
  startDataSimulation,
  toggleDeviceStatus,
  generateSensorData
};

// Jika dijalankan langsung
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Memulai pengisian data Firebase Realtime Database...');
  console.log('⚠️  Pastikan untuk mengganti firebaseConfig dengan konfigurasi Anda!');
  
  // Uncomment untuk menjalankan:
  // fillSensorData();
  // 
  // Atau untuk simulasi berkala:
  // startDataSimulation(30); // Update setiap 30 detik
  
  console.log('📝 Edit firebaseConfig di atas dan uncomment baris yang diinginkan');
}
