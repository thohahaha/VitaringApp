import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAtKiS7NYzXguZc0RqrtiuhLhQzoMyd4v8",
  authDomain: "vitaring-49c16.firebaseapp.com", 
  databaseURL: "https://vitaring-49c16-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "vitaring-49c16",
  storageBucket: "vitaring-49c16.firebasestorage.app",
  messagingSenderId: "988321571107",
  appId: "1:988321571107:web:e7f4780f1bfbd03e196c96"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function checkDevices() {
  console.log('🔍 Checking device data in Firebase...\n');
  
  // Check old device
  const oldRef = ref(database, 'realtimeSensorData/ESP32C3-A835629EDEF8');
  try {
    const oldSnapshot = await get(oldRef);
    if (oldSnapshot.exists()) {
      console.log('⚠️  OLD DEVICE (ESP32C3-A835629EDEF8) FOUND:');
      console.log('   Device ID:', oldSnapshot.val().deviceID);
      console.log('   Last timestamp:', oldSnapshot.val().timestamp);
      console.log('   This explains why old ID keeps appearing!\n');
    } else {
      console.log('✅ OLD DEVICE (ESP32C3-A835629EDEF8): No data\n');
    }
  } catch (e) {
    console.log('✅ OLD DEVICE: Path does not exist\n');
  }
  
  // Check new device
  const newRef = ref(database, 'realtimeSensorData/ESP32C3-A835B29E9EF0'); 
  try {
    const newSnapshot = await get(newRef);
    if (newSnapshot.exists()) {
      console.log('✅ NEW DEVICE (ESP32C3-A835B29E9EF0) FOUND:');
      console.log('   Device ID:', newSnapshot.val().deviceID);
      console.log('   Last timestamp:', newSnapshot.val().timestamp);
      console.log('   BMP Temp:', newSnapshot.val().bmpTemp);
      console.log('   Pressure:', newSnapshot.val().pressure);
    } else {
      console.log('❌ NEW DEVICE (ESP32C3-A835B29E9EF0): No data');
    }
  } catch (e) {
    console.log('❌ NEW DEVICE: Error -', e.message);
  }
  
  process.exit(0);
}

checkDevices();
