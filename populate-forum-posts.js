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

// Helper function to create timestamps for comments
function createCommentTimestamp(baseDate, hourOffset = 0, minuteOffset = 0) {
  const date = new Date(baseDate);
  date.setHours(date.getHours() + hourOffset);
  date.setMinutes(date.getMinutes() + minuteOffset);
  return date;
}

// Sample forum posts data with the new field structure
const forumPostsData = [
  {
    title: 'Tips Memaksimalkan Battery Life VitaRing',
    content: 'Halo semua! Saya ingin berbagi beberapa tips untuk memaksimalkan battery life VitaRing kalian. Setelah menggunakan selama 6 bulan, saya menemukan beberapa cara yang efektif:\n\n1. Matikan fitur yang tidak perlu seperti continuous heart rate monitoring saat tidur\n2. Kurangi frekuensi sinkronisasi data\n3. Gunakan mode hemat daya saat traveling\n\nAda yang punya tips lain?',
    authorId: 'user-123',
    authorName: 'Ahmad Rizki',
    isDeleted: false,
    category: 'Tips & Tricks',
    comments: [
      {
        content: 'Terima kasih tipsnya! Saya juga biasanya mematikan GPS tracking saat di dalam ruangan.',
        authorId: 'user-456',
        authorName: 'Sarah Chen',
        createdAt: createCommentTimestamp(new Date(2025, 8, 1), 2, 30),
        isDeleted: false
      },
      {
        content: 'Battery saya bisa tahan sampai 5 hari dengan tips ini. Recommended!',
        authorId: 'user-789',
        authorName: 'Budi Santoso',
        createdAt: createCommentTimestamp(new Date(2025, 8, 1), 6, 45),
        isDeleted: false
      }
    ],
    likeCount: 24,
    commentCount: 2,
    tags: ['battery', 'tips', 'vitaring', 'optimization'],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'VitaRing Deteksi Aritmia Jantung Saya',
    content: 'Saya ingin berbagi pengalaman yang sangat berharga. Minggu lalu VitaRing saya memberikan notifikasi tentang irregular heartbeat yang persisten. Awalnya saya pikir ini false alarm, tapi setelah konsultasi dengan dokter ternyata saya memang mengalami atrial fibrillation.\n\nTerima kasih VitaRing! Deteksi dini ini sangat membantu untuk pengobatan.',
    authorId: 'user-101',
    authorName: 'Dr. Lisa Wang',
    isDeleted: false,
    category: 'Health Stories',
    comments: [
      {
        content: 'Wow, syukurlah terdeteksi lebih awal! Semoga lekas sembuh dok.',
        authorId: 'user-202',
        authorName: 'Maria Santos',
        createdAt: createCommentTimestamp(new Date(2025, 8, 1), 1, 15),
        isDeleted: false
      },
      {
        content: 'Ini membuktikan kalau VitaRing bukan cuma gadget biasa. Life saver!',
        authorId: 'user-303',
        authorName: 'John Mitchell',
        createdAt: createCommentTimestamp(new Date(2025, 8, 1), 3, 20),
        isDeleted: false
      },
      {
        content: 'Apakah ada setting khusus untuk deteksi aritmia yang perlu diaktifkan?',
        authorId: 'user-404',
        authorName: 'Alice Johnson',
        createdAt: createCommentTimestamp(new Date(2025, 8, 1), 5, 30),
        isDeleted: false
      }
    ],
    likeCount: 45,
    commentCount: 3,
    tags: ['health', 'arrhythmia', 'detection', 'medical', 'heart'],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'Integrasi VitaRing dengan Home Assistant',
    content: 'Berhasil mengintegrasikan VitaRing dengan Home Assistant! Sekarang data kesehatan saya bisa ditampilkan di dashboard smart home dan bahkan bisa trigger automasi berdasarkan heart rate atau sleep quality.\n\nContoh: Jika sleep score < 70, smart light akan otomatis dimmer untuk membantu tidur yang lebih baik.\n\nMau share tutorialnya kalau ada yang tertarik!',
    authorId: 'user-505',
    authorName: 'Tech Enthusiast',
    isDeleted: false,
    category: 'Tech Integration',
    comments: [
      {
        content: 'Keren banget! Boleh share tutorialnya dong. Saya juga pakai Home Assistant.',
        authorId: 'user-606',
        authorName: 'Smart Home Guy',
        createdAt: createCommentTimestamp(new Date(2025, 8, 31), 0, 30),
        isDeleted: false
      }
    ],
    likeCount: 18,
    commentCount: 1,
    tags: ['home-assistant', 'smart-home', 'integration', 'automation', 'iot'],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'Perbandingan VitaRing Gen 2 vs Gen 3',
    content: 'Setelah upgrade dari Gen 2 ke Gen 3, berikut perbandingan yang saya rasakan:\n\n**Gen 3 Advantages:**\n- Battery life 40% lebih lama\n- Sensor suhu lebih akurat\n- AI insights lebih personal\n- Design lebih premium\n\n**Yang Masih Sama:**\n- Akurasi heart rate\n- Water resistance\n- Charging time\n\nOverall, upgrade worth it kalau budget memungkinkan!',
    authorId: 'user-707',
    authorName: 'Early Adopter',
    isDeleted: false,
    category: 'Product Review',
    comments: [
      {
        content: 'Makasih reviewnya! Jadi makin yakin untuk upgrade.',
        authorId: 'user-808',
        authorName: 'Potential Buyer',
        createdAt: createCommentTimestamp(new Date(2025, 8, 30), 0, 45),
        isDeleted: false
      },
      {
        content: 'Harga Gen 2 sekarang gimana? Masih worth it buat pemula?',
        authorId: 'user-909',
        authorName: 'Budget Conscious',
        createdAt: createCommentTimestamp(new Date(2025, 8, 30), 2, 30),
        isDeleted: false
      }
    ],
    likeCount: 32,
    commentCount: 2,
    tags: ['comparison', 'gen2', 'gen3', 'review', 'upgrade'],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'VitaRing Community Meetup Jakarta',
    content: 'Hai VitaRing users di Jakarta! Kami planning untuk mengadakan meetup pertama di Jakarta. Agenda:\n\n📅 Sabtu, 15 September 2025\n📍 Coffee Shop di area Senayan\n⏰ 14:00 - 17:00 WIB\n\n**Agenda:**\n- Sharing tips & tricks\n- Demo fitur terbaru\n- Network dengan fellow users\n- Q&A dengan representative VitaRing\n\nYang minat comment di bawah ya!',
    authorId: 'community-manager',
    authorName: 'VitaRing Community',
    isDeleted: false,
    category: 'Community Events',
    comments: [
      {
        content: 'Interested! Boleh tau lokasi pastinya?',
        authorId: 'user-jakarta-1',
        authorName: 'Jakarta User 1',
        createdAt: createCommentTimestamp(new Date(2025, 8, 30), 0, 30),
        isDeleted: false
      },
      {
        content: 'Count me in! Finally bisa ketemu sesama VitaRing enthusiast.',
        authorId: 'user-jakarta-2',
        authorName: 'Jakarta User 2',
        createdAt: createCommentTimestamp(new Date(2025, 8, 30), 1, 45),
        isDeleted: false
      },
      {
        content: 'Apakah ada planning untuk meetup di kota lain juga?',
        authorId: 'user-bandung',
        authorName: 'Bandung User',
        createdAt: createCommentTimestamp(new Date(2025, 8, 30), 3, 20),
        isDeleted: false
      }
    ],
    likeCount: 67,
    commentCount: 3,
    tags: ['meetup', 'jakarta', 'community', 'event', 'networking'],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'Sleep Tracking Accuracy VitaRing vs Apple Watch',
    content: 'Sudah 2 minggu pakai VitaRing sambil tetap pakai Apple Watch untuk comparison. Berikut hasilnya:\n\n**VitaRing wins:**\n- Deep sleep detection lebih akurat\n- REM cycle tracking\n- Sleep onset time\n- Temperature variation\n\n**Apple Watch wins:**\n- Integration dengan ecosystem\n- UI/UX yang familiar\n\n**Verdict:** VitaRing khusus untuk sleep tracking jauh lebih superior!',
    authorId: 'sleep-researcher',
    authorName: 'Sleep Researcher',
    isDeleted: false,
    category: 'Comparison',
    comments: [
      {
        content: 'Interesting! Apakah VitaRing juga bisa detect sleep apnea?',
        authorId: 'health-conscious',
        authorName: 'Health Conscious',
        createdAt: createCommentTimestamp(new Date(2025, 8, 29), 1, 0),
        isDeleted: false
      },
      {
        content: 'Terima kasih perbandingannya! Jadi mantap pilih VitaRing.',
        authorId: 'decision-maker',
        authorName: 'Decision Maker',
        createdAt: createCommentTimestamp(new Date(2025, 8, 29), 3, 15),
        isDeleted: false
      }
    ],
    likeCount: 89,
    commentCount: 2,
    tags: ['sleep', 'comparison', 'apple-watch', 'accuracy', 'review'],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'VitaRing API Documentation Request',
    content: 'Sebagai developer, saya sangat tertarik untuk mengintegrasikan data VitaRing ke aplikasi health tracking yang saya kembangkan. Apakah ada rencana untuk merilis public API?\n\nFitur yang saya butuhkan:\n- Real-time heart rate data\n- Sleep quality metrics\n- Activity tracking data\n- Webhook for real-time notifications\n\nApakah tim VitaRing bisa memberikan update terkait ini?',
    authorId: 'dev-enthusiast',
    authorName: 'Developer Enthusiast',
    isDeleted: false,
    category: 'Feature Request',
    comments: [
      {
        content: 'Saya juga tertarik dengan API ini! Hopefully segera dirilis.',
        authorId: 'another-dev',
        authorName: 'Another Developer',
        createdAt: createCommentTimestamp(new Date(2025, 8, 28), 2, 0),
        isDeleted: false
      },
      {
        content: 'Great idea! Would love to build custom dashboards.',
        authorId: 'data-scientist',
        authorName: 'Data Scientist',
        createdAt: createCommentTimestamp(new Date(2025, 8, 28), 4, 30),
        isDeleted: false
      }
    ],
    likeCount: 156,
    commentCount: 2,
    tags: ['api', 'developer', 'integration', 'feature-request', 'webhook'],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'VitaRing for Athletes: My Marathon Training Experience',
    content: 'Sebagai runner yang sedang training untuk marathon, VitaRing telah menjadi game changer dalam monitoring performa saya. Berikut insight yang saya dapatkan:\n\n**Training Insights:**\n- Recovery time prediction sangat akurat\n- HRV trends membantu adjust training intensity\n- Sleep quality directly correlates dengan performance\n\n**Race Day:**\n- Real-time heart rate zones\n- Fatigue prediction\n- Pacing recommendations\n\n**Result:** Personal best di Jakarta Marathon 2025! 🏃‍♂️',
    authorId: 'marathon-runner',
    authorName: 'Marathon Runner',
    isDeleted: false,
    category: 'Sports & Fitness',
    comments: [
      {
        content: 'Congrats on your PB! Inspiring story, makes me want to get VitaRing.',
        authorId: 'aspiring-runner',
        authorName: 'Aspiring Runner',
        createdAt: createCommentTimestamp(new Date(2025, 8, 27), 1, 0),
        isDeleted: false
      },
      {
        content: 'Which training plan did you follow? And how did VitaRing help with recovery?',
        authorId: 'training-buddy',
        authorName: 'Training Buddy',
        createdAt: createCommentTimestamp(new Date(2025, 8, 27), 3, 15),
        isDeleted: false
      },
      {
        content: 'Amazing! Can you share your HRV trends during the training period?',
        authorId: 'coach-interested',
        authorName: 'Coach Interested',
        createdAt: createCommentTimestamp(new Date(2025, 8, 27), 5, 45),
        isDeleted: false
      }
    ],
    likeCount: 234,
    commentCount: 3,
    tags: ['marathon', 'running', 'training', 'athletics', 'performance', 'hrv'],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

// Function to populate forum posts data
async function populateForumPosts() {
  try {
    console.log('Starting to populate forum posts data...');
    
    for (const post of forumPostsData) {
      const docRef = await addDoc(collection(db, 'forum_posts'), post);
      console.log(`Added forum post: ${post.title} with ID: ${docRef.id}`);
    }
    
    console.log('Successfully populated all forum posts data!');
    console.log(`Total posts added: ${forumPostsData.length}`);
  } catch (error) {
    console.error('Error populating forum posts:', error);
  }
}

// Run the population
populateForumPosts();
