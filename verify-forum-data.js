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

// Simple verification of forum posts
async function verifyForumPosts() {
  try {
    console.log('🔍 Verifying forum posts collection...\n');
    
    const forumCollection = collection(db, 'forum_posts');
    const querySnapshot = await getDocs(forumCollection);
    
    console.log(`📊 Total forum posts: ${querySnapshot.size}\n`);
    
    if (querySnapshot.size > 0) {
      console.log('📄 Forum posts summary:');
      console.log('='.repeat(70));
      
      let categoryCount = {};
      let tagCount = {};
      let totalLikes = 0;
      let totalComments = 0;
      
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        console.log(`\n📰 ID: ${doc.id}`);
        console.log(`   Title: ${post.title}`);
        console.log(`   Author: ${post.authorName} (${post.authorId})`);
        console.log(`   Category: ${post.category}`);
        console.log(`   Likes: ${post.likeCount}`);
        console.log(`   Comments: ${post.commentCount}`);
        // Handle tags field (may be array or string)
        let tagsDisplay = 'None';
        if (post.tags) {
          if (Array.isArray(post.tags)) {
            tagsDisplay = post.tags.join(', ');
          } else if (typeof post.tags === 'string') {
            tagsDisplay = post.tags;
          }
        }
        console.log(`   Tags: ${tagsDisplay}`);
        console.log(`   Deleted: ${post.isDeleted}`);
        
        // Count statistics
        if (post.category) {
          categoryCount[post.category] = (categoryCount[post.category] || 0) + 1;
        }
        
        if (post.tags) {
          if (Array.isArray(post.tags)) {
            post.tags.forEach(tag => {
              tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
          } else if (typeof post.tags === 'string') {
            tagCount[post.tags] = (tagCount[post.tags] || 0) + 1;
          }
        }
        
        totalLikes += post.likeCount || 0;
        totalComments += post.commentCount || 0;
        
        // Verify required fields
        const requiredFields = [
          'title', 'content', 'authorId', 'authorName', 'createdAt', 
          'updatedAt', 'isDeleted', 'category', 'comments', 
          'likeCount', 'commentCount', 'tags'
        ];
        
        const missingFields = requiredFields.filter(field => !post.hasOwnProperty(field));
        if (missingFields.length > 0) {
          console.log(`   ❌ Missing fields: ${missingFields.join(', ')}`);
        } else {
          console.log(`   ✅ All required fields present`);
        }
        
        // Verify comments structure
        if (post.comments && post.comments.length > 0) {
          console.log(`   💬 Comments (${post.comments.length}):`);
          post.comments.forEach((comment, index) => {
            console.log(`      ${index + 1}. ${comment.authorName}: ${comment.content.substring(0, 50)}...`);
            
            const commentRequiredFields = ['content', 'authorId', 'authorName', 'createdAt', 'isDeleted'];
            const missingCommentFields = commentRequiredFields.filter(field => !comment.hasOwnProperty(field));
            if (missingCommentFields.length > 0) {
              console.log(`         ❌ Missing comment fields: ${missingCommentFields.join(', ')}`);
            }
          });
        }
      });
      
      console.log('\n' + '='.repeat(70));
      console.log('📊 Forum Statistics:');
      console.log(`   Total Posts: ${querySnapshot.size}`);
      console.log(`   Total Likes: ${totalLikes}`);
      console.log(`   Total Comments: ${totalComments}`);
      console.log(`   Total Categories: ${Object.keys(categoryCount).length}`);
      console.log(`   Total Unique Tags: ${Object.keys(tagCount).length}`);
      
      console.log('\n📂 Categories:');
      Object.entries(categoryCount).forEach(([category, count]) => {
        console.log(`   ${category}: ${count} posts`);
      });
      
      console.log('\n🏷️  Most Popular Tags:');
      const sortedTags = Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      
      sortedTags.forEach(([tag, count]) => {
        console.log(`   ${tag}: ${count} posts`);
      });
      
      console.log('\n✅ Forum data verification complete!');
      console.log('Your forum system is ready to use with Firestore integration.');
      
    } else {
      console.log('❌ No forum posts found in Firestore');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyForumPosts();
