import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

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

async function testConnection() {
  try {
    console.log('🔍 Testing Firebase Realtime Database connection...');
    
    // Test reading from the new path
    const deviceRef = ref(database, 'realtimeSensorData/ESP32C3-A8358206CF8');
    const snapshot = await get(deviceRef);
    
    if (snapshot.exists()) {
      console.log('✅ Found existing data in realtimeSensorData path');
      console.log('📊 Data:', snapshot.val());
    } else {
      console.log('ℹ️ No data found in realtimeSensorData path (this is expected if not populated yet)');
    }
    
    console.log('✅ Firebase connection successful!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Firebase connection error:', error.message);
    process.exit(1);
  }
}

testConnection();
