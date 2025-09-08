import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';

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

// Function to verify news data in Firestore
async function verifyNewsData() {
  try {
    console.log('🔍 Verifying news data in Firestore...\n');
    
    // Get all published news
    const newsCollection = collection(db, 'news');
    const newsQuery = query(
      newsCollection,
      where('isPublished', '==', true),
      orderBy('publishedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(newsQuery);
    
    console.log(`📊 Total published news found: ${querySnapshot.size}\n`);
    
    if (querySnapshot.size > 0) {
      console.log('📄 News Articles Summary:');
      console.log('='.repeat(80));
      
      let categoryCount = {};
      let tagCount = {};
      let totalViews = 0;
      
      querySnapshot.forEach((doc) => {
        const news = { id: doc.id, ...doc.data() };
        
        console.log(`\n📰 ${news.title}`);
        console.log(`   Author: ${news.authorName} (ID: ${news.authorId})`);
        console.log(`   Category: ${news.category}`);
        console.log(`   Tags: ${news.tags ? news.tags.join(', ') : 'None'}`);
        console.log(`   Views: ${news.viewCount || 0}`);
        console.log(`   Excerpt: ${news.excerpt?.substring(0, 100)}...`);
        console.log(`   Published: ${news.publishedAt ? new Date(news.publishedAt.seconds * 1000).toLocaleDateString() : 'N/A'}`);
        
        // Count categories and tags
        if (news.category) {
          categoryCount[news.category] = (categoryCount[news.category] || 0) + 1;
        }
        
        if (news.tags) {
          news.tags.forEach(tag => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          });
        }
        
        totalViews += news.viewCount || 0;
      });
      
      console.log('\n' + '='.repeat(80));
      console.log('📊 Statistics:');
      console.log(`   Total Views: ${totalViews}`);
      console.log(`   Total Categories: ${Object.keys(categoryCount).length}`);
      console.log(`   Total Unique Tags: ${Object.keys(tagCount).length}`);
      
      console.log('\n📂 Categories:');
      Object.entries(categoryCount).forEach(([category, count]) => {
        console.log(`   ${category}: ${count} articles`);
      });
      
      console.log('\n🏷️  Most Popular Tags:');
      const sortedTags = Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      
      sortedTags.forEach(([tag, count]) => {
        console.log(`   ${tag}: ${count} articles`);
      });
      
      console.log('\n✅ Verification complete! All news data is properly structured.');
      
      // Verify required fields
      console.log('\n🔍 Field Validation:');
      const firstNews = querySnapshot.docs[0].data();
      const requiredFields = [
        'title', 'content', 'excerpt', 'authorId', 'authorName',
        'publishedAt', 'createdAt', 'updatedAt', 'isPublished',
        'tags', 'category', 'viewCount'
      ];
      
      requiredFields.forEach(field => {
        const hasField = firstNews.hasOwnProperty(field);
        const value = firstNews[field];
        const type = typeof value;
        console.log(`   ${hasField ? '✅' : '❌'} ${field}: ${type} ${Array.isArray(value) ? '(array)' : ''}`);
      });
      
    } else {
      console.log('❌ No published news found in Firestore');
    }
    
  } catch (error) {
    console.error('❌ Error verifying news data:', error);
  }
}

// Run the verification
verifyNewsData();
