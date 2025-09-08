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
  query,
  where,
  Timestamp
} from '@angular/fire/firestore';
import { 
  Storage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from '@angular/fire/storage';
import { News, NewsComment } from '../models/news.interface';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  
  // Data dummy untuk development testing - now matching new interface
  private dummyNews: News[] = [
    {
      id: '1',
      title: 'VitaRing Gen 3 Diluncurkan dengan Fitur AI Terbaru',
      content: 'VitaRing generasi ketiga hadir dengan teknologi AI yang lebih canggih untuk monitoring kesehatan real-time. Cincin pintar ini mampu mendeteksi anomali kesehatan dengan akurasi 99.7% dan memberikan rekomendasi kesehatan personal.',
      excerpt: 'VitaRing Gen 3 hadir dengan AI canggih untuk monitoring kesehatan real-time.',
      authorId: 'dr-sarah-chen',
      authorName: 'Dr. Sarah Chen',
      publishedAt: new Date(2025, 7, 20), // 20 Agustus 2025
      createdAt: new Date(2025, 7, 20),
      updatedAt: new Date(2025, 7, 20),
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
      tags: ['AI', 'Kesehatan', 'VitaRing'],
      category: 'Teknologi',
      viewCount: 1247,
      
      // Backward compatibility fields
      likes: ['user1', 'user2', 'user3'],
      likesCount: 3,
      author: 'Dr. Sarah Chen',
      date: new Date(2025, 7, 20),
      views: 1247
    },
    {
      id: '2',
      title: 'Studi Menunjukkan VitaRing Dapat Deteksi Dini Diabetes',
      content: 'Penelitian terbaru dari Harvard Medical School membuktikan bahwa VitaRing mampu mendeteksi tanda-tanda awal diabetes dengan akurasi 95%. Teknologi sensor glukosa non-invasif menjadi terobosan baru dalam dunia kesehatan.',
      excerpt: 'Penelitian Harvard: VitaRing deteksi diabetes dengan akurasi 95%.',
      authorId: 'prof-michael-rodriguez',
      authorName: 'Prof. Michael Rodriguez',
      publishedAt: new Date(2025, 7, 19), // 19 Agustus 2025
      createdAt: new Date(2025, 7, 19),
      updatedAt: new Date(2025, 7, 19),
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
      tags: ['Diabetes', 'Kesehatan', 'Penelitian'],
      category: 'Penelitian',
      viewCount: 892,
      
      // Backward compatibility fields
      likes: ['user1', 'user4'],
      likesCount: 2,
      author: 'Prof. Michael Rodriguez',
      date: new Date(2025, 7, 19),
      views: 892
    },
    {
      id: '3',
      title: 'Tips Optimal Menggunakan VitaRing untuk Monitoring Kesehatan',
      content: 'Pelajari cara memaksimalkan semua fitur monitoring kesehatan pada VitaRing Anda. Dengan pengaturan yang tepat, Anda dapat meningkatkan awareness kesehatan hingga 40% dalam 30 hari.',
      excerpt: 'Tips memaksimalkan fitur monitoring kesehatan VitaRing.',
      authorId: 'dr-lisa-wang',
      authorName: 'Dr. Lisa Wang',
      publishedAt: new Date(2025, 7, 18), // 18 Agustus 2025
      createdAt: new Date(2025, 7, 18),
      updatedAt: new Date(2025, 7, 18),
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop',
      tags: ['Tips', 'Monitoring', 'Kesehatan'],
      category: 'Tips',
      viewCount: 654,
      
      // Backward compatibility fields
      likes: ['user2', 'user3', 'user5', 'user6'],
      likesCount: 4,
      author: 'Dr. Lisa Wang',
      date: new Date(2025, 7, 18),
      views: 654
    },
    {
      id: '4',
      title: 'VitaRing Community Challenge: 30 Hari Hidup Sehat',
      content: 'Bergabunglah dengan tantangan komunitas VitaRing untuk mencapai gaya hidup sehat dalam 30 hari. Raih berbagai hadiah menarik dan tingkatkan skor kesehatan Anda bersama ribuan pengguna lainnya.',
      excerpt: 'Tantangan komunitas VitaRing: 30 hari hidup sehat.',
      authorId: 'vitaring-team',
      authorName: 'VitaRing Team',
      publishedAt: new Date(2025, 7, 17), // 17 Agustus 2025
      createdAt: new Date(2025, 7, 17),
      updatedAt: new Date(2025, 7, 17),
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
      tags: ['Challenge', 'Komunitas', 'Hidup Sehat'],
      category: 'Komunitas',
      viewCount: 1156,
      
      // Backward compatibility fields
      likes: ['user1', 'user3', 'user7'],
      likesCount: 3,
      author: 'VitaRing Team',
      date: new Date(2025, 7, 17),
      views: 1156
    },
    {
      id: '5',
      title: 'Update Firmware v2.5: Fitur Heart Rate Variability Terbaru',
      content: 'Pembaruan firmware terbaru membawa fitur Heart Rate Variability (HRV) yang lebih akurat. Dapatkan insight mendalam tentang tingkat stress dan recovery Anda dengan algoritma yang telah diperbaiki.',
      excerpt: 'Update firmware v2.5 dengan fitur HRV yang lebih akurat.',
      authorId: 'engineering-team',
      authorName: 'Engineering Team',
      publishedAt: new Date(2025, 7, 16), // 16 Agustus 2025
      createdAt: new Date(2025, 7, 16),
      updatedAt: new Date(2025, 7, 16),
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop',
      tags: ['Firmware', 'HRV', 'Update'],
      category: 'Update',
      viewCount: 743,
      
      // Backward compatibility fields
      likes: ['user2', 'user4', 'user5'],
      likesCount: 3,
      author: 'Engineering Team',
      date: new Date(2025, 7, 16),
      views: 743
    },
    {
      id: '6',
      title: 'Integrasi VitaRing dengan Apple Health dan Google Fit',
      content: 'Kini VitaRing dapat terintegrasi dengan platform kesehatan populer seperti Apple Health dan Google Fit. Sinkronkan semua data kesehatan Anda dalam satu dashboard terpadu.',
      excerpt: 'VitaRing kini terintegrasi dengan Apple Health dan Google Fit.',
      authorId: 'product-team',
      authorName: 'Product Team',
      publishedAt: new Date(2025, 7, 15), // 15 Agustus 2025
      createdAt: new Date(2025, 7, 15),
      updatedAt: new Date(2025, 7, 15),
      isPublished: true,
      imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=250&fit=crop',
      tags: ['Apple Health', 'Google Fit', 'Integrasi'],
      category: 'Integrasi',
      viewCount: 892,
      
      // Backward compatibility fields
      likes: ['user1', 'user6'],
      likesCount: 2,
      author: 'Product Team',
      date: new Date(2025, 7, 15),
      views: 892
    }
  ];

  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {}

  /**
   * Mengambil daftar berita terbaru dari koleksi 'news' di Firestore secara real-time
   * Hanya menampilkan berita yang sudah dipublish (isPublished: true)
   */
  getLatestNews(): Observable<News[]> {
    // Menggunakan Firebase Firestore
    const newsCollection = collection(this.firestore, 'news');
    const newsQuery = query(
      newsCollection, 
      where('isPublished', '==', true),
      orderBy('publishedAt', 'desc')
    );
    
    return collectionData(newsQuery, { idField: 'id' }).pipe(
      map((newsList: any[]) => {
        // Jika tidak ada data di Firestore, return dummy data
        if (newsList.length === 0) {
          console.log('No news found in Firestore, returning dummy data');
          return this.dummyNews
            .filter(news => news.isPublished)
            .map(news => this.normalizeNewsData(news))
            .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
        }
        
        return newsList.map(news => this.normalizeNewsData(news));
      }),
      catchError(error => {
        console.error('Error fetching news from Firebase:', error);
        console.log('Falling back to dummy data');
        return of(this.dummyNews
          .filter(news => news.isPublished)
          .map(news => this.normalizeNewsData(news))
          .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()));
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
          return foundNews ? this.normalizeNewsData(foundNews) : undefined;
        }
        
        return this.normalizeNewsData(news);
      }),
      catchError(error => {
        console.error('Error fetching news detail from Firebase:', error);
        console.log('Falling back to dummy data');
        const foundNews = this.dummyNews.find(news => news.id === newsId);
        return of(foundNews ? this.normalizeNewsData(foundNews) : undefined);
      })
    );
  }

  /**
   * Normalize news data from Firestore to ensure all required fields are present
   * and handle timestamp conversion
   */
  private normalizeNewsData(news: any): News {
    return {
      id: news.id,
      title: news.title || '',
      content: news.content || '',
      excerpt: news.excerpt || news.summary || '',
      authorId: news.authorId || news.author || '',
      authorName: news.authorName || news.author || '',
      publishedAt: this.convertTimestamp(news.publishedAt || news.date),
      createdAt: this.convertTimestamp(news.createdAt),
      updatedAt: this.convertTimestamp(news.updatedAt),
      isPublished: news.isPublished ?? true,
      imageUrl: news.imageUrl || null,
      tags: news.tags || [],
      category: news.category || 'Uncategorized',
      viewCount: news.viewCount || news.views || 0,
      
      // Backward compatibility fields for existing UI
      likes: news.likes || [],
      likesCount: news.likes?.length || 0,
      author: news.authorName || news.author || '',
      date: this.convertTimestamp(news.publishedAt || news.date),
      views: news.viewCount || news.views || 0
    };
  }

  /**
   * Convert Firestore timestamp to Date object
   */
  private convertTimestamp(timestamp: any): Date {
    if (!timestamp) return new Date();
    if (timestamp instanceof Date) return timestamp;
    if (timestamp?.toDate) return timestamp.toDate();
    if (typeof timestamp === 'string') return new Date(timestamp);
    return new Date();
  }

  /**
   * Menambahkan berita baru ke koleksi 'news'
   */
  async addNews(news: Omit<News, 'id' | 'viewCount' | 'likes' | 'likesCount' | 'author' | 'date' | 'views'>, imageFile?: File): Promise<string> {
    try {
      let imageUrl = news.imageUrl || '';
      
      // Upload image to Firebase Storage if provided
      if (imageFile) {
        imageUrl = await this.uploadImage(imageFile);
      }

      const newsData = {
        title: news.title,
        content: news.content,
        excerpt: news.excerpt,
        authorId: news.authorId,
        authorName: news.authorName,
        publishedAt: news.isPublished ? serverTimestamp() : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPublished: news.isPublished,
        imageUrl,
        tags: news.tags,
        category: news.category,
        viewCount: 0,
        
        // Additional fields for backward compatibility
        likes: [],
        author: news.authorName, // For backward compatibility
        date: news.isPublished ? serverTimestamp() : null, // For backward compatibility
        views: 0 // For backward compatibility
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
  async updateNewsLikes(newsId: string, userId: string, userHasLiked: boolean): Promise<void> {
    try {
      const newsDoc = doc(this.firestore, `news/${newsId}`);

      if (userHasLiked) {
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
   * Meningkatkan jumlah 'viewCount' saat berita dibuka
   */
  async updateNewsViews(newsId: string): Promise<void> {
    try {
      const newsDoc = doc(this.firestore, `news/${newsId}`);
      await updateDoc(newsDoc, {
        viewCount: increment(1),
        views: increment(1), // Also update legacy field for backward compatibility
        updatedAt: serverTimestamp()
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

  /**
   * Mengambil komentar untuk berita tertentu
   */
  getNewsComments(newsId: string): Observable<NewsComment[]> {
    try {
      const commentsCollection = collection(this.firestore, 'newsComments');
      const commentsQuery = query(
        commentsCollection, 
        orderBy('createdAt', 'asc')
      );
      
      return collectionData(commentsQuery, { idField: 'id' }).pipe(
        map((comments: any[]) => {
          return comments
            .filter(comment => comment.newsId === newsId)
            .map(comment => ({
              ...comment,
              createdAt: comment.createdAt?.toDate() || new Date(),
              updatedAt: comment.updatedAt?.toDate() || new Date()
            }));
        }),
        catchError(error => {
          console.error('Error fetching news comments:', error);
          return of([]);
        })
      );
    } catch (error) {
      console.error('Error setting up news comments listener:', error);
      return of([]);
    }
  }

  /**
   * Menambahkan komentar baru ke berita
   */
  async addNewsComment(comment: Omit<NewsComment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const commentData = {
        ...comment,
        likes: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const commentsCollection = collection(this.firestore, 'newsComments');
      const docRef = await addDoc(commentsCollection, commentData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding news comment:', error);
      throw error;
    }
  }

  /**
   * Update likes pada komentar berita
   */
  async updateCommentLikes(commentId: string, userId: string): Promise<void> {
    try {
      const commentDoc = doc(this.firestore, `newsComments/${commentId}`);
      
      // Get current comment to check if user already liked
      const commentSnapshot = await docData(commentDoc).pipe(map(data => data)).toPromise();
      const currentComment = commentSnapshot as NewsComment;

      if (currentComment?.likes?.includes(userId)) {
        // User already liked, so remove the like
        await updateDoc(commentDoc, {
          likes: arrayRemove(userId),
          updatedAt: serverTimestamp()
        });
      } else {
        // User hasn't liked, so add the like
        await updateDoc(commentDoc, {
          likes: arrayUnion(userId),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating comment likes:', error);
      throw error;
    }
  }

  /**
   * Mengambil berita berdasarkan kategori
   */
  getNewsByCategory(category: string): Observable<News[]> {
    const newsCollection = collection(this.firestore, 'news');
    const newsQuery = query(
      newsCollection,
      where('category', '==', category),
      where('isPublished', '==', true),
      orderBy('publishedAt', 'desc')
    );

    return collectionData(newsQuery, { idField: 'id' }).pipe(
      map((newsList: any[]) => {
        if (newsList.length === 0) {
          // Fallback to dummy data
          return this.dummyNews
            .filter(news => news.category === category && news.isPublished)
            .map(news => this.normalizeNewsData(news));
        }
        return newsList.map(news => this.normalizeNewsData(news));
      }),
      catchError(error => {
        console.error('Error fetching news by category:', error);
        return of(this.dummyNews
          .filter(news => news.category === category && news.isPublished)
          .map(news => this.normalizeNewsData(news)));
      })
    );
  }

  /**
   * Mengambil berita berdasarkan author ID
   */
  getNewsByAuthor(authorId: string): Observable<News[]> {
    const newsCollection = collection(this.firestore, 'news');
    const newsQuery = query(
      newsCollection,
      where('authorId', '==', authorId),
      where('isPublished', '==', true),
      orderBy('publishedAt', 'desc')
    );

    return collectionData(newsQuery, { idField: 'id' }).pipe(
      map((newsList: any[]) => {
        if (newsList.length === 0) {
          // Fallback to dummy data
          return this.dummyNews
            .filter(news => news.authorId === authorId && news.isPublished)
            .map(news => this.normalizeNewsData(news));
        }
        return newsList.map(news => this.normalizeNewsData(news));
      }),
      catchError(error => {
        console.error('Error fetching news by author:', error);
        return of(this.dummyNews
          .filter(news => news.authorId === authorId && news.isPublished)
          .map(news => this.normalizeNewsData(news)));
      })
    );
  }

  /**
   * Search berita berdasarkan title atau content
   */
  searchNews(searchTerm: string): Observable<News[]> {
    // For Firestore, we'll get all published news and filter client-side
    // In production, consider using Algolia or other search service for better performance
    return this.getLatestNews().pipe(
      map(newsList => 
        newsList.filter(news => 
          news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      )
    );
  }

  /**
   * Mengambil semua kategori berita yang tersedia
   */
  getNewsCategories(): Observable<string[]> {
    return this.getLatestNews().pipe(
      map(newsList => {
        const categories = [...new Set(newsList.map(news => news.category))];
        return categories.filter(category => category); // Remove empty categories
      })
    );
  }

  /**
   * Update berita yang sudah ada
   */
  async updateNews(newsId: string, updates: Partial<News>): Promise<void> {
    try {
      const newsDoc = doc(this.firestore, `news/${newsId}`);
      const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      // Handle publishedAt field
      if (updates.isPublished && !updates.publishedAt) {
        updateData.publishedAt = serverTimestamp();
      }

      // Remove computed fields
      delete updateData.id;
      delete updateData.likesCount;
      delete updateData.author; // This is computed from authorName
      delete updateData.date; // This is computed from publishedAt
      delete updateData.views; // This is computed from viewCount

      await updateDoc(newsDoc, updateData);
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  }

  /**
   * Soft delete berita (set isPublished to false)
   */
  async deleteNews(newsId: string): Promise<void> {
    try {
      const newsDoc = doc(this.firestore, `news/${newsId}`);
      await updateDoc(newsDoc, {
        isPublished: false,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  }
}
