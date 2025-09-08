import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, get } from 'firebase/database';

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

const OLD_DEVICE_ID = "ESP32C3-A835629EDEF8";
const NEW_DEVICE_ID = "ESP32C3-A835B29E9EF0";

console.log('🔍 Checking for data in both device paths...');

// Check old device
const oldDeviceRef = ref(database, `realtimeSensorData/${OLD_DEVICE_ID}`);
get(oldDeviceRef).then((snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    console.log(`⚠️  OLD DEVICE (${OLD_DEVICE_ID}) STILL HAS DATA:`, {
      deviceID: data.deviceID,
      bmpTemp: data.bmpTemp,
      pressure: data.pressure,
      timestamp: data.timestamp,
      lastUpdate: new Date(data.timestamp).toLocaleString()
    });
    console.log('❗ This might explain why old ID keeps appearing!');
  } else {
    console.log(`✅ No data found for old device (${OLD_DEVICE_ID})`);
  }
}).catch((error) => {
  console.log(`✅ Old device path does not exist: ${error.message}`);
});

// Check new device  
const newDeviceRef = ref(database, `realtimeSensorData/${NEW_DEVICE_ID}`);
get(newDeviceRef).then((snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    console.log(`✅ NEW DEVICE (${NEW_DEVICE_ID}) HAS DATA:`, {
      deviceID: data.deviceID,
      bmpTemp: data.bmpTemp,
      pressure: data.pressure,
      timestamp: data.timestamp,
      lastUpdate: new Date(data.timestamp).toLocaleString()
    });
  } else {
    console.log(`❌ No data found for new device (${NEW_DEVICE_ID})`);
  }
}).catch((error) => {
  console.log(`❌ New device path error: ${error.message}`);
});
