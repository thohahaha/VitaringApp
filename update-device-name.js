// Firebase configuration
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, update, get } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyAW5Dzu8k7cVVeZlzm_S2jKpqNt6SJIbz0",
  authDomain: "vitaringapp-5b07b.firebaseapp.com",
  databaseURL: "https://vitaringapp-5b07b-default-rtdb.firebaseio.com",
  projectId: "vitaringapp-5b07b",
  storageBucket: "vitaringapp-5b07b.appspot.com",
  messagingSenderId: "997876623983",
  appId: "1:997876623983:web:ef1dcf5fb4a4e48cf18b4a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function updateDeviceName() {
  const deviceId = 'ESP32C3-A835B29E9EF0';
  const deviceName = 'VitaRing Pro Gen 3'; // Custom device name
  
  try {
    console.log(`🔧 Updating deviceName for ${deviceId}...`);
    
    // Check current data first
    const deviceRef = ref(database, `realtimeSensorData/${deviceId}`);
    const snapshot = await get(deviceRef);
    
    if (snapshot.exists()) {
      const currentData = snapshot.val();
      console.log('📊 Current device data:', {
        deviceID: currentData.deviceID,
        deviceName: currentData.deviceName,
        bmpTemp: currentData.bmpTemp,
        pressure: currentData.pressure
      });
      
      // Update deviceName
      const updates = {
        deviceName: deviceName
      };
      
      await update(deviceRef, updates);
      console.log(`✅ Successfully updated deviceName to: ${deviceName}`);
      
      // Verify update
      const verifySnapshot = await get(deviceRef);
      const updatedData = verifySnapshot.val();
      console.log('✅ Verified updated data:', {
        deviceID: updatedData.deviceID,
        deviceName: updatedData.deviceName,
        bmpTemp: updatedData.bmpTemp,
        pressure: updatedData.pressure
      });
      
    } else {
      console.log('❌ Device data not found');
    }
    
  } catch (error) {
    console.error('❌ Error updating deviceName:', error);
  }
  
  process.exit(0);
}

updateDeviceName();
