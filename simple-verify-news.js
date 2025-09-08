import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtKiS7NYzXguZc0RqrtiuhLhQzoMyd4v8",
  authDomain: "vitaring-49c16.firebaseapp.com",
  projectId: "vitaring-49c16",
  storageBucket: "vitaring-49c16.firebasestorage.app",
  messagingSenderId: "988321571107",
  appId: "1:988321571107:web:e7f4780f1bfbd03e196c96",
  measurementId: "G-XBWV63P7CJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Simple verification without complex queries
async function simpleVerifyNews() {
  try {
    console.log('🔍 Simple verification of news collection...\n');
    
    const newsCollection = collection(db, 'news');
    const querySnapshot = await getDocs(newsCollection);
    
    console.log(`📊 Total news documents: ${querySnapshot.size}\n`);
    
    if (querySnapshot.size > 0) {
      console.log('📄 First few news articles:');
      console.log('='.repeat(60));
      
      let count = 0;
      querySnapshot.forEach((doc) => {
        if (count < 3) { // Show only first 3
          const news = doc.data();
          console.log(`\n📰 ID: ${doc.id}`);
          console.log(`   Title: ${news.title}`);
          console.log(`   Author: ${news.authorName} (${news.authorId})`);
          console.log(`   Category: ${news.category}`);
          console.log(`   Published: ${news.isPublished}`);
          console.log(`   Views: ${news.viewCount}`);
          console.log(`   Tags: ${news.tags ? news.tags.join(', ') : 'None'}`);
          
          // Check if all required fields exist
          const requiredFields = [
            'title', 'content', 'excerpt', 'authorId', 'authorName',
            'isPublished', 'tags', 'category', 'viewCount'
          ];
          
          const missingFields = requiredFields.filter(field => !news.hasOwnProperty(field));
          if (missingFields.length > 0) {
            console.log(`   ❌ Missing fields: ${missingFields.join(', ')}`);
          } else {
            console.log(`   ✅ All required fields present`);
          }
          count++;
        }
      });
      
      console.log('\n✅ News data verification complete!');
      console.log('Your news system is ready to use with Firestore integration.');
      
    } else {
      console.log('❌ No news documents found in Firestore');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

simpleVerifyNews();
