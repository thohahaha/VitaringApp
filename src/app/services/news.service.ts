import { Injectable } from '@angular/core';
import { Observable, map, of, catchError } from 'rxjs';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  addDoc, 
  updateDoc, 
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  orderBy,
  query
} from '@angular/fire/firestore';
import { 
  Storage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from '@angular/fire/storage';
import { News } from '../models/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  
  // Data dummy untuk development testing
  private dummyNews: News[] = [
    {
      id: '1',
      title: 'VitaRing Gen 3 Diluncurkan dengan Fitur AI Terbaru',
      content: 'VitaRing generasi ketiga hadir dengan teknologi AI yang lebih canggih untuk monitoring kesehatan real-time. Cincin pintar ini mampu mendeteksi anomali kesehatan dengan akurasi 99.7% dan memberikan rekomendasi kesehatan personal.',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
      author: 'Dr. Sarah Chen',
      date: new Date(2025, 7, 20), // 20 Agustus 2025
      likes: ['user1', 'user2', 'user3'],
      views: 1247
    },
    {
      id: '2',
      title: 'Studi Menunjukkan VitaRing Dapat Deteksi Dini Diabetes',
      content: 'Penelitian terbaru dari Harvard Medical School membuktikan bahwa VitaRing mampu mendeteksi tanda-tanda awal diabetes dengan akurasi 95%. Teknologi sensor glukosa non-invasif menjadi terobosan baru dalam dunia kesehatan.',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
      author: 'Prof. Michael Rodriguez',
      date: new Date(2025, 7, 19), // 19 Agustus 2025
      likes: ['user1', 'user4'],
      views: 892
    },
    {
      id: '3',
      title: 'Tips Optimal Menggunakan VitaRing untuk Monitoring Tidur',
      content: 'Pelajari cara memaksimalkan fitur sleep tracking pada VitaRing Anda. Dengan pengaturan yang tepat, Anda dapat meningkatkan kualitas tidur hingga 40% dalam 30 hari.',
      imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop',
      author: 'Dr. Lisa Wang',
      date: new Date(2025, 7, 18), // 18 Agustus 2025
      likes: ['user2', 'user3', 'user5', 'user6'],
      views: 654
    },
    {
      id: '4',
      title: 'VitaRing Community Challenge: 30 Hari Hidup Sehat',
      content: 'Bergabunglah dengan tantangan komunitas VitaRing untuk mencapai gaya hidup sehat dalam 30 hari. Raih berbagai hadiah menarik dan tingkatkan skor kesehatan Anda bersama ribuan pengguna lainnya.',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
      author: 'VitaRing Team',
      date: new Date(2025, 7, 17), // 17 Agustus 2025
      likes: ['user1', 'user3', 'user7'],
      views: 1156
    },
    {
      id: '5',
      title: 'Update Firmware v2.5: Fitur Heart Rate Variability Terbaru',
      content: 'Pembaruan firmware terbaru membawa fitur Heart Rate Variability (HRV) yang lebih akurat. Dapatkan insight mendalam tentang tingkat stress dan recovery Anda dengan algoritma yang telah diperbaiki.',
      imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop',
      author: 'Engineering Team',
      date: new Date(2025, 7, 16), // 16 Agustus 2025
      likes: ['user2', 'user4', 'user5'],
      views: 743
    },
    {
      id: '6',
      title: 'Integrasi VitaRing dengan Apple Health dan Google Fit',
      content: 'Kini VitaRing dapat terintegrasi dengan platform kesehatan populer seperti Apple Health dan Google Fit. Sinkronkan semua data kesehatan Anda dalam satu dashboard terpadu.',
      imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=250&fit=crop',
      author: 'Product Team',
      date: new Date(2025, 7, 15), // 15 Agustus 2025
      likes: ['user1', 'user6'],
      views: 892
    }
  ];

  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {}

  /**
   * Mengambil daftar berita terbaru dari koleksi 'news' di Firestore secara real-time
   */
  getLatestNews(): Observable<News[]> {
    // Menggunakan Firebase Firestore
    const newsCollection = collection(this.firestore, 'news');
    const newsQuery = query(newsCollection, orderBy('date', 'desc'));
    
    return collectionData(newsQuery, { idField: 'id' }).pipe(
      map((newsList: any[]) => {
        // Jika tidak ada data di Firestore, return dummy data
        if (newsList.length === 0) {
          console.log('No news found in Firestore, returning dummy data');
          return this.dummyNews.map(news => ({
            ...news,
            likesCount: news.likes?.length || 0
          })).sort((a, b) => b.date.getTime() - a.date.getTime());
        }
        
        return newsList.map(news => ({
          ...news,
          date: news.date?.toDate() || new Date(),
          likesCount: news.likes?.length || 0
        }));
      }),
      catchError(error => {
        console.error('Error fetching news from Firebase:', error);
        console.log('Falling back to dummy data');
        return of(this.dummyNews.map(news => ({
          ...news,
          likesCount: news.likes?.length || 0
        })).sort((a, b) => b.date.getTime() - a.date.getTime()));
      })
    );
  }

  /**
   * Mengambil detail satu berita berdasarkan ID-nya
   */
  getNewsDetail(newsId: string): Observable<News | undefined> {
    // Menggunakan Firebase Firestore
    const newsDoc = doc(this.firestore, `news/${newsId}`);
    return docData(newsDoc, { idField: 'id' }).pipe(
      map((news: any) => {
        if (!news) {
          // Jika tidak ada di Firestore, cari di dummy data
          const foundNews = this.dummyNews.find(n => n.id === newsId);
          return foundNews ? {
            ...foundNews,
            likesCount: foundNews.likes?.length || 0
          } : undefined;
        }
        
        return {
          ...news,
          date: news.date?.toDate() || new Date(),
          likesCount: news.likes?.length || 0
        };
      }),
      catchError(error => {
        console.error('Error fetching news detail from Firebase:', error);
        console.log('Falling back to dummy data');
        const foundNews = this.dummyNews.find(news => news.id === newsId);
        return of(foundNews ? {
          ...foundNews,
          likesCount: foundNews.likes?.length || 0
        } : undefined);
      })
    );
  }

  /**
   * Menambahkan berita baru ke koleksi 'news'
   */
  async addNews(news: Omit<News, 'id' | 'likes' | 'views' | 'likesCount'>, imageFile?: File): Promise<string> {
    try {
      let imageUrl = news.imageUrl || '';
      
      // Upload image to Firebase Storage if provided
      if (imageFile) {
        imageUrl = await this.uploadImage(imageFile);
      }

      const newsData = {
        title: news.title,
        content: news.content,
        imageUrl,
        author: news.author,
        date: serverTimestamp(),
        likes: [],
        views: 0
      };

      const newsCollection = collection(this.firestore, 'news');
      const docRef = await addDoc(newsCollection, newsData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding news:', error);
      throw error;
    }
  }

  /**
   * Menambahkan/menghapus ID pengguna dari array 'likes'
   */
  async updateNewsLikes(newsId: string, userId: string): Promise<void> {
    try {
      const newsDoc = doc(this.firestore, `news/${newsId}`);
      
      // Get current news to check if user already liked
      const currentNews = await this.getNewsDetail(newsId).pipe(
        map(news => news)
      ).toPromise();

      if (currentNews?.likes?.includes(userId)) {
        // User already liked, so remove the like
        await updateDoc(newsDoc, {
          likes: arrayRemove(userId)
        });
      } else {
        // User hasn't liked, so add the like
        await updateDoc(newsDoc, {
          likes: arrayUnion(userId)
        });
      }
    } catch (error) {
      console.error('Error updating news likes:', error);
      throw error;
    }
  }

  /**
   * Meningkatkan jumlah 'views' saat berita dibuka
   */
  async updateNewsViews(newsId: string): Promise<void> {
    try {
      const newsDoc = doc(this.firestore, `news/${newsId}`);
      await updateDoc(newsDoc, {
        views: increment(1)
      });
    } catch (error) {
      console.error('Error updating news views:', error);
      throw error;
    }
  }

  /**
   * Upload image to Firebase Storage
   */
  private async uploadImage(file: File): Promise<string> {
    try {
      const timestamp = new Date().getTime();
      const fileName = `news/${timestamp}_${file.name}`;
      const storageRef = ref(this.storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}
