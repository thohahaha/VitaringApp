import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// Firebase configuration - sama dengan environment.ts
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

console.log('🔍 Testing realtime database connection...');
console.log(`📍 Path: realtimeSensorData/${DEVICE_ID}`);
console.log(`🌐 URL: ${firebaseConfig.databaseURL}`);

// Test listener seperti di health service
const deviceRef = ref(database, `realtimeSensorData/${DEVICE_ID}`);

onValue(deviceRef, (snapshot) => {
  const timestamp = new Date().toLocaleTimeString();
  
  if (snapshot.exists()) {
    const rawData = snapshot.val();
    console.log(`✅ [${timestamp}] Data received:`, {
      bmpTemp: rawData?.bmpTemp,
      pressure: rawData?.pressure,  
      bpx: rawData?.bpx,
      objTemp: rawData?.objTemp,
      timestamp: rawData?.timestamp
    });
    
    // Test parsing seperti di health service
    const parsedData = {
      altitude: Number(rawData?.altitude) || 111.41,
      ambTemp: Number(rawData?.ambTemp) || 31.91,
      bmpTemp: Number(rawData?.bmpTemp) || 31.3,
      bpx: Number(rawData?.bpx) || 75,
      irValue: Number(rawData?.irValue) || 1250,
      objTemp: Number(rawData?.objTemp) || 33.41,
      pressure: Number(rawData?.pressure) || 999.94,
      deviceID: rawData?.deviceID || DEVICE_ID,
      isDeviceOn: rawData?.isDeviceOn !== undefined ? Boolean(rawData.isDeviceOn) : true,
      isOnline: rawData?.isOnline !== undefined ? Boolean(rawData.isOnline) : true,
      timestamp: rawData?.timestamp || new Date().toISOString()
    };
    
    console.log(`📊 [${timestamp}] Parsed data:`, parsedData);
    
  } else {
    console.log(`❌ [${timestamp}] No data found at path: realtimeSensorData/${DEVICE_ID}`);
  }
}, (error) => {
  console.error('❌ Listener error:', error);
});
