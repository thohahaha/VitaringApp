import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

// Additional news data to showcase all fields
const additionalNews = [
  {
    title: 'Breakthrough: VitaRing Detects COVID-19 Before Symptoms Appear',
    content: 'A groundbreaking study published in Nature Medicine reveals that VitaRing can detect COVID-19 infection up to 3 days before symptoms appear. The research, conducted across 15 countries with 50,000 participants, shows that subtle changes in heart rate variability, skin temperature, and sleep patterns can indicate viral infection with 94% accuracy. This discovery could revolutionize early detection and prevention of infectious diseases.',
    excerpt: 'VitaRing can detect COVID-19 infection 3 days before symptoms with 94% accuracy.',
    authorId: 'dr-maria-santos',
    authorName: 'Dr. Maria Santos',
    isPublished: true,
    imageUrl: 'https://images.unsplash.com/photo-1584118624012-df056829fbd0?w=800&h=450&fit=crop',
    tags: ['COVID-19', 'Early Detection', 'Research', 'Health'],
    category: 'Breaking News',
    viewCount: 2847,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'VitaRing Partners with WHO for Global Health Initiative',
    content: 'VitaRing has announced a strategic partnership with the World Health Organization (WHO) to deploy 1 million devices in developing countries as part of a global health monitoring initiative. The program aims to provide early warning systems for disease outbreaks and improve healthcare access in remote areas. Each device will be equipped with cellular connectivity for real-time data transmission to WHO health centers.',
    excerpt: 'VitaRing partners with WHO to deploy 1 million devices in developing countries.',
    authorId: 'vitaring-ceo',
    authorName: 'CEO VitaRing',
    isPublished: true,
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=450&fit=crop',
    tags: ['WHO', 'Partnership', 'Global Health', 'Initiative'],
    category: 'Company News',
    viewCount: 1923,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'New Sleep Score Algorithm Achieves 99.2% Accuracy',
    content: 'VitaRing introduces a revolutionary sleep analysis algorithm that achieves 99.2% accuracy compared to clinical polysomnography. The new algorithm uses advanced machine learning to analyze over 100 biometric parameters during sleep, providing users with detailed insights into sleep efficiency, REM cycles, and recovery quality. The update also includes personalized sleep recommendations based on individual circadian rhythms.',
    excerpt: 'Revolutionary sleep analysis algorithm achieves 99.2% clinical accuracy.',
    authorId: 'sleep-research-team',
    authorName: 'Sleep Research Team',
    isPublished: true,
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=450&fit=crop',
    tags: ['Sleep Analysis', 'Algorithm', 'Machine Learning', 'Accuracy'],
    category: 'Technology',
    viewCount: 1456,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'User Story: How VitaRing Saved My Life',
    content: 'Jessica Thompson from Seattle shares her incredible story of how VitaRing detected early signs of a heart condition that doctors had missed. The device alerted her to irregular heart patterns during sleep, leading to a diagnosis of atrial fibrillation and potentially life-saving treatment. "Without VitaRing, I might never have known about my condition until it was too late," says Jessica. Her story highlights the importance of continuous health monitoring.',
    excerpt: 'User shares how VitaRing detected a life-threatening heart condition doctors missed.',
    authorId: 'user-stories',
    authorName: 'Community Team',
    isPublished: true,
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=450&fit=crop',
    tags: ['User Story', 'Heart Health', 'Early Detection', 'Testimonial'],
    category: 'User Stories',
    viewCount: 3421,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'Environmental Impact Report: VitaRing Goes Carbon Neutral',
    content: 'VitaRing announces its commitment to becoming carbon neutral by 2025. The comprehensive environmental report details the company\'s initiatives including sustainable manufacturing, recycling programs, and renewable energy adoption. VitaRing also introduces a device trade-in program where users can exchange old devices for credit towards new models, ensuring proper recycling of electronic components.',
    excerpt: 'VitaRing commits to carbon neutrality by 2025 with comprehensive sustainability initiatives.',
    authorId: 'sustainability-team',
    authorName: 'Sustainability Team',
    isPublished: true,
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=450&fit=crop',
    tags: ['Sustainability', 'Environment', 'Carbon Neutral', 'Recycling'],
    category: 'Sustainability',
    viewCount: 892,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

// Function to populate additional news data
async function populateAdditionalNews() {
  try {
    console.log('Starting to populate additional news data...');
    
    for (const news of additionalNews) {
      const docRef = await addDoc(collection(db, 'news'), news);
      console.log(`Added news: ${news.title} with ID: ${docRef.id}`);
    }
    
    console.log('Successfully populated additional news data!');
    console.log(`Total news added: ${additionalNews.length}`);
  } catch (error) {
    console.error('Error populating additional news:', error);
  }
}

// Run the population
populateAdditionalNews();
