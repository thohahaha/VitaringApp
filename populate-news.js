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

// Sample news data with the new field structure
const newsData = [
  {
    title: 'VitaRing Gen 3 Diluncurkan dengan Fitur AI Terbaru',
    content: 'VitaRing generasi ketiga hadir dengan teknologi AI yang lebih canggih untuk monitoring kesehatan real-time. Cincin pintar ini mampu mendeteksi anomali kesehatan dengan akurasi 99.7% dan memberikan rekomendasi kesehatan personal yang dipersonalisasi berdasarkan data biometrik pengguna. Fitur machine learning terbaru memungkinkan perangkat untuk belajar dari pola kesehatan individual dan memberikan insight yang lebih mendalam tentang kondisi tubuh pengguna.',
    excerpt: 'VitaRing Gen 3 hadir dengan AI canggih untuk monitoring kesehatan real-time dengan akurasi 99.7%.',
    authorId: 'dr-sarah-chen',
    authorName: 'Dr. Sarah Chen',
    isPublished: true,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=450&fit=crop',
    tags: ['AI', 'Kesehatan', 'VitaRing', 'Teknologi'],
    category: 'Teknologi',
    viewCount: 1247,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'Studi Menunjukkan VitaRing Dapat Deteksi Dini Diabetes',
    content: 'Penelitian terbaru dari Harvard Medical School membuktikan bahwa VitaRing mampu mendeteksi tanda-tanda awal diabetes dengan akurasi 95%. Teknologi sensor glukosa non-invasif menjadi terobosan baru dalam dunia kesehatan. Studi yang melibatkan 10,000 partisipan selama 2 tahun menunjukkan bahwa VitaRing dapat mengidentifikasi perubahan metabolisme yang mengindikasikan pre-diabetes hingga 6 bulan sebelum diagnosis konvensional.',
    excerpt: 'Penelitian Harvard: VitaRing deteksi diabetes dengan akurasi 95% hingga 6 bulan lebih awal.',
    authorId: 'prof-michael-rodriguez',
    authorName: 'Prof. Michael Rodriguez',
    isPublished: true,
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=450&fit=crop',
    tags: ['Diabetes', 'Kesehatan', 'Penelitian', 'Harvard'],
    category: 'Penelitian',
    viewCount: 892,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'Tips Optimal Menggunakan VitaRing untuk Monitoring Kesehatan',
    content: 'Pelajari cara memaksimalkan semua fitur monitoring kesehatan pada VitaRing Anda. Dengan pengaturan yang tepat, Anda dapat meningkatkan awareness kesehatan hingga 40% dalam 30 hari. Artikel ini membahas pengaturan optimal untuk berbagai aktivitas, cara membaca data biometrik, dan strategi personalisasi yang dapat disesuaikan dengan gaya hidup masing-masing pengguna.',
    excerpt: 'Tips lengkap memaksimalkan fitur monitoring kesehatan VitaRing untuk hasil optimal.',
    authorId: 'dr-lisa-wang',
    authorName: 'Dr. Lisa Wang',
    isPublished: true,
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=450&fit=crop',
    tags: ['Tips', 'Monitoring', 'Kesehatan', 'Tutorial'],
    category: 'Tips',
    viewCount: 654,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'VitaRing Community Challenge: 30 Hari Hidup Sehat',
    content: 'Bergabunglah dengan tantangan komunitas VitaRing untuk mencapai gaya hidup sehat dalam 30 hari. Raih berbagai hadiah menarik dan tingkatkan skor kesehatan Anda bersama ribuan pengguna lainnya. Challenge ini dirancang oleh tim ahli nutrisi dan kebugaran untuk memberikan panduan harian yang mudah diikuti, dengan tracking otomatis melalui VitaRing Anda.',
    excerpt: 'Tantangan komunitas VitaRing: 30 hari hidup sehat dengan hadiah menarik.',
    authorId: 'vitaring-team',
    authorName: 'VitaRing Team',
    isPublished: true,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    tags: ['Challenge', 'Komunitas', 'Hidup Sehat', 'Reward'],
    category: 'Komunitas',
    viewCount: 1156,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'Update Firmware v2.5: Fitur Heart Rate Variability Terbaru',
    content: 'Pembaruan firmware terbaru membawa fitur Heart Rate Variability (HRV) yang lebih akurat. Dapatkan insight mendalam tentang tingkat stress dan recovery Anda dengan algoritma yang telah diperbaiki. Update ini juga menghadirkan fitur sleep stage detection yang lebih presisi dan battery life yang ditingkatkan hingga 7 hari.',
    excerpt: 'Update firmware v2.5 dengan fitur HRV yang lebih akurat dan battery life 7 hari.',
    authorId: 'engineering-team',
    authorName: 'Engineering Team',
    isPublished: true,
    imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=450&fit=crop',
    tags: ['Firmware', 'HRV', 'Update', 'Sleep Tracking'],
    category: 'Update',
    viewCount: 743,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'Integrasi VitaRing dengan Apple Health dan Google Fit',
    content: 'Kini VitaRing dapat terintegrasi dengan platform kesehatan populer seperti Apple Health dan Google Fit. Sinkronkan semua data kesehatan Anda dalam satu dashboard terpadu. Fitur sinkronisasi otomatis memastikan data Anda selalu up-to-date di semua platform, dengan enkripsi end-to-end untuk keamanan maksimal.',
    excerpt: 'VitaRing kini terintegrasi dengan Apple Health dan Google Fit dengan sinkronisasi otomatis.',
    authorId: 'product-team',
    authorName: 'Product Team',
    isPublished: true,
    imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=450&fit=crop',
    tags: ['Apple Health', 'Google Fit', 'Integrasi', 'Sinkronisasi'],
    category: 'Integrasi',
    viewCount: 892,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'Panduan Lengkap Merawat VitaRing Anda',
    content: 'VitaRing adalah investasi kesehatan jangka panjang yang memerlukan perawatan yang tepat. Artikel ini membahas cara membersihkan, menyimpan, dan merawat VitaRing agar tetap berfungsi optimal. Tips perawatan harian, mingguan, dan bulanan yang akan memperpanjang umur perangkat Anda hingga 5 tahun.',
    excerpt: 'Panduan lengkap merawat VitaRing untuk performa optimal dan umur panjang.',
    authorId: 'customer-support',
    authorName: 'Customer Support Team',
    isPublished: true,
    imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&h=450&fit=crop',
    tags: ['Perawatan', 'Maintenance', 'Tips', 'Durability'],
    category: 'Tips',
    viewCount: 445,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'VitaRing untuk Atlet: Optimalisasi Performa Olahraga',
    content: 'Pelajari bagaimana atlet profesional menggunakan VitaRing untuk mengoptimalkan performa mereka. Dari monitoring recovery hingga analisis training load, VitaRing memberikan data yang diperlukan untuk mencapai peak performance. Studi kasus dari atlet Olimpiade dan tips dari pelatih profesional.',
    excerpt: 'Panduan khusus penggunaan VitaRing untuk atlet profesional dan optimasi performa.',
    authorId: 'sports-scientist',
    authorName: 'Dr. James Mitchell',
    isPublished: true,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop',
    tags: ['Olahraga', 'Atlet', 'Performa', 'Training'],
    category: 'Olahraga',
    viewCount: 1089,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

// Function to populate news data
async function populateNews() {
  try {
    console.log('Starting to populate news data...');
    
    for (const news of newsData) {
      const docRef = await addDoc(collection(db, 'news'), news);
      console.log(`Added news: ${news.title} with ID: ${docRef.id}`);
    }
    
    console.log('Successfully populated all news data!');
  } catch (error) {
    console.error('Error populating news:', error);
  }
}

// Run the population
populateNews();
