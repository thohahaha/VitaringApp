// Test Firebase connection and update deviceName
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyAtKiS7NYzXguZc0RqrtiuhLhQzoMyd4v8",
  authDomain: "vitaring-49c16.firebaseapp.com",
  databaseURL: "https://vitaring-49c16-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "vitaring-49c16",
  storageBucket: "vitaring-49c16.firebasestorage.app",
  messagingSenderId: "988321571107",
  appId: "1:988321571107:web:e7f4780f1bfbd03e196c96"
};

async function testAndUpdate() {
  try {
    console.log('🔧 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    
    const deviceId = 'ESP32C3-A835B29E9EF0';
    
    // Test read first
    console.log('📖 Reading current data...');
    const deviceRef = ref(database, `realtimeSensorData/${deviceId}`);
    const snapshot = await get(deviceRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('✅ Current data found:', {
        deviceID: data.deviceID,
        deviceName: data.deviceName,
        bmpTemp: data.bmpTemp
      });
      
      // Update with deviceName if not present
      if (!data.deviceName) {
        console.log('🔧 Adding deviceName...');
        const updatedData = {
          ...data,
          deviceName: 'VitaRing Pro Gen 3'
        };
        
        await set(deviceRef, updatedData);
        console.log('✅ DeviceName added successfully');
      } else {
        console.log('✅ DeviceName already exists:', data.deviceName);
      }
      
    } else {
      console.log('❌ No data found for device');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

testAndUpdate();
