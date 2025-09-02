import { Injectable } from '@angular/core';
import { Observable, map, of, catchError, combineLatest } from 'rxjs';
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
  Timestamp,
  writeBatch,
  getDoc
} from '@angular/fire/firestore';
import { 
  Storage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from '@angular/fire/storage';
import { ForumPost, ForumComment, Post, Comment, ForumStats, ForumCategory } from '../models/forum.model';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  
  // Dummy data for development testing - now matching new interface
  private dummyPosts: ForumPost[] = [
    {
      id: '1',
      title: 'Tips Memaksimalkan Battery Life VitaRing',
      content: 'Halo semua! Saya ingin berbagi beberapa tips untuk memaksimalkan battery life VitaRing kalian. Setelah menggunakan selama 6 bulan, saya menemukan beberapa cara yang efektif:\n\n1. Matikan fitur yang tidak perlu seperti continuous heart rate monitoring saat tidur\n2. Kurangi frekuensi sinkronisasi data\n3. Gunakan mode hemat daya saat traveling\n\nAda yang punya tips lain?',
      authorId: 'user-123',
      authorName: 'Ahmad Rizki',
      createdAt: new Date(2025, 8, 1), // 1 September 2025
      updatedAt: new Date(2025, 8, 1),
      isDeleted: false,
      category: 'Tips & Tricks',
      comments: [
        {
          content: 'Terima kasih tipsnya! Saya juga biasanya mematikan GPS tracking saat di dalam ruangan.',
          authorId: 'user-456',
          authorName: 'Sarah Chen',
          createdAt: new Date(2025, 8, 1, 10, 30),
          isDeleted: false,
          likeCount: 0
        },
        {
          content: 'Battery saya bisa tahan sampai 5 hari dengan tips ini. Recommended!',
          authorId: 'user-789',
          authorName: 'Budi Santoso',
          createdAt: new Date(2025, 8, 1, 14, 45),
          isDeleted: false,
          likeCount: 0
        }
      ],
      likeCount: 24,
      commentCount: 2,
      tags: ['battery', 'tips', 'vitaring', 'optimization']
    },
    {
      id: '2',
      title: 'VitaRing Deteksi Aritmia Jantung Saya',
      content: 'Saya ingin berbagi pengalaman yang sangat berharga. Minggu lalu VitaRing saya memberikan notifikasi tentang irregular heartbeat yang persisten. Awalnya saya pikir ini false alarm, tapi setelah konsultasi dengan dokter ternyata saya memang mengalami atrial fibrillation.\n\nTerima kasih VitaRing! Deteksi dini ini sangat membantu untuk pengobatan.',
      authorId: 'user-101',
      authorName: 'Dr. Lisa Wang',
      createdAt: new Date(2025, 8, 1, 8, 0),
      updatedAt: new Date(2025, 8, 1, 8, 0),
      isDeleted: false,
      category: 'Health Stories',
      comments: [
        {
          content: 'Wow, syukurlah terdeteksi lebih awal! Semoga lekas sembuh dok.',
          authorId: 'user-202',
          authorName: 'Maria Santos',
          createdAt: new Date(2025, 8, 1, 9, 15),
          isDeleted: false,
          likeCount: 0
        },
        {
          content: 'Ini membuktikan kalau VitaRing bukan cuma gadget biasa. Life saver!',
          authorId: 'user-303',
          authorName: 'John Mitchell',
          createdAt: new Date(2025, 8, 1, 11, 20),
          isDeleted: false,
          likeCount: 0
        },
        {
          content: 'Apakah ada setting khusus untuk deteksi aritmia yang perlu diaktifkan?',
          authorId: 'user-404',
          authorName: 'Alice Johnson',
          createdAt: new Date(2025, 8, 1, 13, 30),
          isDeleted: false,
          likeCount: 0
        }
      ],
      likeCount: 45,
      commentCount: 3,
      tags: ['health', 'arrhythmia', 'detection', 'medical', 'heart']
    },
    {
      id: '3',
      title: 'Integrasi VitaRing dengan Home Assistant',
      content: 'Berhasil mengintegrasikan VitaRing dengan Home Assistant! Sekarang data kesehatan saya bisa ditampilkan di dashboard smart home dan bahkan bisa trigger automasi berdasarkan heart rate atau sleep quality.\n\nContoh: Jika sleep score < 70, smart light akan otomatis dimmer untuk membantu tidur yang lebih baik.\n\nMau share tutorialnya kalau ada yang tertarik!',
      authorId: 'user-505',
      authorName: 'Tech Enthusiast',
      createdAt: new Date(2025, 8, 31, 20, 30),
      updatedAt: new Date(2025, 8, 31, 20, 30),
      isDeleted: false,
      category: 'Tech Integration',
      comments: [
        {
          content: 'Keren banget! Boleh share tutorialnya dong. Saya juga pakai Home Assistant.',
          authorId: 'user-606',
          authorName: 'Smart Home Guy',
          createdAt: new Date(2025, 8, 31, 21, 0),
          isDeleted: false,
          likeCount: 0
        }
      ],
      likeCount: 18,
      commentCount: 1,
      tags: ['home-assistant', 'smart-home', 'integration', 'automation', 'iot']
    },
    {
      id: '4',
      title: 'Perbandingan VitaRing Gen 2 vs Gen 3',
      content: 'Setelah upgrade dari Gen 2 ke Gen 3, berikut perbandingan yang saya rasakan:\n\n**Gen 3 Advantages:**\n- Battery life 40% lebih lama\n- Sensor suhu lebih akurat\n- AI insights lebih personal\n- Design lebih premium\n\n**Yang Masih Sama:**\n- Akurasi heart rate\n- Water resistance\n- Charging time\n\nOverall, upgrade worth it kalau budget memungkinkan!',
      authorId: 'user-707',
      authorName: 'Early Adopter',
      createdAt: new Date(2025, 8, 30, 15, 45),
      updatedAt: new Date(2025, 8, 30, 15, 45),
      isDeleted: false,
      category: 'Product Review',
      comments: [
        {
          content: 'Makasih reviewnya! Jadi makin yakin untuk upgrade.',
          authorId: 'user-808',
          authorName: 'Potential Buyer',
          createdAt: new Date(2025, 8, 30, 16, 30),
          isDeleted: false,
          likeCount: 0
        },
        {
          content: 'Harga Gen 2 sekarang gimana? Masih worth it buat pemula?',
          authorId: 'user-909',
          authorName: 'Budget Conscious',
          createdAt: new Date(2025, 8, 30, 18, 15),
          isDeleted: false,
          likeCount: 0
        }
      ],
      likeCount: 32,
      commentCount: 2,
      tags: ['comparison', 'gen2', 'gen3', 'review', 'upgrade']
    },
    {
      id: '5',
      title: 'VitaRing Community Meetup Jakarta',
      content: 'Hai VitaRing users di Jakarta! Kami planning untuk mengadakan meetup pertama di Jakarta. Agenda:\n\n📅 Sabtu, 15 September 2025\n📍 Coffee Shop di area Senayan\n⏰ 14:00 - 17:00 WIB\n\n**Agenda:**\n- Sharing tips & tricks\n- Demo fitur terbaru\n- Network dengan fellow users\n- Q&A dengan representative VitaRing\n\nYang minat comment di bawah ya!',
      authorId: 'community-manager',
      authorName: 'VitaRing Community',
      createdAt: new Date(2025, 8, 30, 10, 0),
      updatedAt: new Date(2025, 8, 30, 10, 0),
      isDeleted: false,
      category: 'Community Events',
      comments: [
        {
          content: 'Interested! Boleh tau lokasi pastinya?',
          authorId: 'user-jakarta-1',
          authorName: 'Jakarta User 1',
          createdAt: new Date(2025, 8, 30, 10, 30),
          isDeleted: false,
          likeCount: 0
        },
        {
          content: 'Count me in! Finally bisa ketemu sesama VitaRing enthusiast.',
          authorId: 'user-jakarta-2',
          authorName: 'Jakarta User 2',
          createdAt: new Date(2025, 8, 30, 11, 45),
          isDeleted: false,
          likeCount: 0
        },
        {
          content: 'Apakah ada planning untuk meetup di kota lain juga?',
          authorId: 'user-bandung',
          authorName: 'Bandung User',
          createdAt: new Date(2025, 8, 30, 13, 20),
          isDeleted: false,
          likeCount: 0
        }
      ],
      likeCount: 67,
      commentCount: 3,
      tags: ['meetup', 'jakarta', 'community', 'event', 'networking']
    }
  ];

  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {}

  /**
   * Mengambil daftar forum posts dari koleksi 'forum_posts' di Firestore secara real-time
   * Hanya menampilkan posts yang tidak dihapus (isDeleted: false)
   */
  getForumPosts(): Observable<ForumPost[]> {
    const postsCollection = collection(this.firestore, 'forum_posts');
    const postsQuery = query(
      postsCollection, 
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    return collectionData(postsQuery, { idField: 'id' }).pipe(
      map((postsList: any[]) => {
        // Jika tidak ada data di Firestore, return dummy data
        if (postsList.length === 0) {
          console.log('No forum posts found in Firestore, returning dummy data');
          return this.dummyPosts
            .filter(post => !post.isDeleted)
            .map(post => this.normalizeForumPostData(post))
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
        
        return postsList.map(post => this.normalizeForumPostData(post));
      }),
      catchError(error => {
        console.error('Error fetching forum posts from Firebase:', error);
        console.log('Falling back to dummy data');
        return of(this.dummyPosts
          .filter(post => !post.isDeleted)
          .map(post => this.normalizeForumPostData(post))
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      })
    );
  }

  /**
   * Mengambil detail satu forum post berdasarkan ID-nya
   */
  getForumPostDetail(postId: string): Observable<ForumPost | undefined> {
    const postDoc = doc(this.firestore, `forum_posts/${postId}`);
    return docData(postDoc, { idField: 'id' }).pipe(
      map((post: any) => {
        if (!post) {
          // Jika tidak ada di Firestore, cari di dummy data
          const foundPost = this.dummyPosts.find(p => p.id === postId);
          return foundPost ? this.normalizeForumPostData(foundPost) : undefined;
        }
        
        return this.normalizeForumPostData(post);
      }),
      catchError(error => {
        console.error('Error fetching forum post detail from Firebase:', error);
        console.log('Falling back to dummy data');
        const foundPost = this.dummyPosts.find(post => post.id === postId);
        return of(foundPost ? this.normalizeForumPostData(foundPost) : undefined);
      })
    );
  }

  /**
   * Normalize forum post data from Firestore to ensure all required fields are present
   * and handle timestamp conversion
   */
  private normalizeForumPostData(post: any): ForumPost {
    return {
      id: post.id,
      title: post.title || '',
      content: post.content || '',
      authorId: post.authorId || '',
      authorName: post.authorName || '',
      createdAt: this.convertTimestamp(post.createdAt),
      updatedAt: this.convertTimestamp(post.updatedAt),
      isDeleted: post.isDeleted ?? false,
      category: post.category || 'General',
      comments: (post.comments || []).map((comment: any) => ({
        content: comment.content || '',
        authorId: comment.authorId || '',
        authorName: comment.authorName || '',
        createdAt: this.convertTimestamp(comment.createdAt),
        isDeleted: comment.isDeleted ?? false,
        likeCount: comment.likeCount || 0
      })),
      likeCount: post.likeCount || 0,
      commentCount: post.commentCount || (post.comments?.length || 0),
      tags: post.tags || []
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
   * Menambahkan forum post baru ke koleksi 'forum_posts'
   */
  async addForumPost(post: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'commentCount'>): Promise<string> {
    try {
      const postData = {
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        authorName: post.authorName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isDeleted: false,
        category: post.category,
        comments: post.comments || [],
        likeCount: 0,
        commentCount: post.comments?.length || 0,
        tags: post.tags || []
      };

      const postsCollection = collection(this.firestore, 'forum_posts');
      const docRef = await addDoc(postsCollection, postData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding forum post:', error);
      throw error;
    }
  }

  /**
   * Alias method untuk createPost - untuk compatibility dengan create-post page
   */
  async createPost(post: Partial<ForumPost>): Promise<string> {
    const postData: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'commentCount'> = {
      title: post.title || '',
      content: post.content || '',
      authorId: post.authorId || '',
      authorName: post.authorName || '',
      isDeleted: false,
      category: post.category || 'general',
      comments: post.comments || [],
      tags: post.tags || []
    };

    return this.addForumPost(postData);
  }

  /**
   * Menambahkan komentar ke forum post
   */
  async addCommentToPost(postId: string, comment: Omit<ForumComment, 'createdAt'>): Promise<void> {
    try {
      const postDoc = doc(this.firestore, `forum_posts/${postId}`);
      
      const newComment = {
        ...comment,
        createdAt: serverTimestamp(),
        isDeleted: false,
        likeCount: 0
      };

      await updateDoc(postDoc, {
        comments: arrayUnion(newComment),
        commentCount: increment(1),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  /**
   * Mengupdate like count pada forum post
   */
  async updatePostLikeCount(postId: string, increment_value: number = 1): Promise<void> {
    try {
      const postDoc = doc(this.firestore, `forum_posts/${postId}`);
      await updateDoc(postDoc, {
        likeCount: increment(increment_value),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating post like count:', error);
      throw error;
    }
  }

  /**
   * Mengupdate forum post yang sudah ada
   */
  async updateForumPost(postId: string, updates: Partial<ForumPost>): Promise<void> {
    try {
      const postDoc = doc(this.firestore, `forum_posts/${postId}`);
      const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      // Remove computed fields and ID
      delete updateData.id;
      delete updateData.createdAt;

      await updateDoc(postDoc, updateData);
    } catch (error) {
      console.error('Error updating forum post:', error);
      throw error;
    }
  }

  /**
   * Soft delete forum post (set isDeleted to true)
   */
  async deleteForumPost(postId: string): Promise<void> {
    try {
      const postDoc = doc(this.firestore, `forum_posts/${postId}`);
      await updateDoc(postDoc, {
        isDeleted: true,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error deleting forum post:', error);
      throw error;
    }
  }

  /**
   * Mengambil posts berdasarkan kategori
   */
  getPostsByCategory(category: string): Observable<ForumPost[]> {
    const postsCollection = collection(this.firestore, 'forum_posts');
    const postsQuery = query(
      postsCollection,
      where('category', '==', category),
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc')
    );

    return collectionData(postsQuery, { idField: 'id' }).pipe(
      map((postsList: any[]) => {
        if (postsList.length === 0) {
          // Fallback to dummy data
          return this.dummyPosts
            .filter(post => post.category === category && !post.isDeleted)
            .map(post => this.normalizeForumPostData(post));
        }
        return postsList.map(post => this.normalizeForumPostData(post));
      }),
      catchError(error => {
        console.error('Error fetching posts by category:', error);
        return of(this.dummyPosts
          .filter(post => post.category === category && !post.isDeleted)
          .map(post => this.normalizeForumPostData(post)));
      })
    );
  }

  /**
   * Mengambil posts berdasarkan author ID
   */
  getPostsByAuthor(authorId: string): Observable<ForumPost[]> {
    const postsCollection = collection(this.firestore, 'forum_posts');
    const postsQuery = query(
      postsCollection,
      where('authorId', '==', authorId),
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc')
    );

    return collectionData(postsQuery, { idField: 'id' }).pipe(
      map((postsList: any[]) => {
        if (postsList.length === 0) {
          // Fallback to dummy data
          return this.dummyPosts
            .filter(post => post.authorId === authorId && !post.isDeleted)
            .map(post => this.normalizeForumPostData(post));
        }
        return postsList.map(post => this.normalizeForumPostData(post));
      }),
      catchError(error => {
        console.error('Error fetching posts by author:', error);
        return of(this.dummyPosts
          .filter(post => post.authorId === authorId && !post.isDeleted)
          .map(post => this.normalizeForumPostData(post)));
      })
    );
  }

  /**
   * Search forum posts berdasarkan title atau content
   */
  searchForumPosts(searchTerm: string): Observable<ForumPost[]> {
    // For Firestore, we'll get all non-deleted posts and filter client-side
    // In production, consider using Algolia or other search service for better performance
    return this.getForumPosts().pipe(
      map(postsList => 
        postsList.filter(post => 
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  /**
   * Mengambil semua kategori forum yang tersedia
   */
  getForumCategories(): Observable<string[]> {
    return this.getForumPosts().pipe(
      map(postsList => {
        const categories = [...new Set(postsList.map(post => post.category))];
        return categories.filter(category => category); // Remove empty categories
      })
    );
  }

  /**
   * Mengambil statistik forum
   */
  getForumStats(): Observable<ForumStats> {
    return this.getForumPosts().pipe(
      map(posts => {
        const totalPosts = posts.length;
        const totalComments = posts.reduce((sum, post) => sum + post.commentCount, 0);
        const uniqueAuthors = new Set(posts.map(post => post.authorId));
        const totalUsers = uniqueAuthors.size;
        
        // For active users, consider users who posted in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentPosts = posts.filter(post => post.createdAt > thirtyDaysAgo);
        const activeUsers = new Set(recentPosts.map(post => post.authorId)).size;

        return {
          totalPosts,
          totalComments,
          totalUsers,
          activeUsers
        };
      })
    );
  }

  /**
   * Legacy methods for backward compatibility
   */
  getPosts(filter: 'newest' | 'featured' | 'popular' = 'newest'): Observable<Post[]> {
    return this.getForumPosts().pipe(
      map(forumPosts => forumPosts.map(post => this.convertToLegacyPost(post)))
    );
  }

  searchPosts(searchTerm: string): Observable<Post[]> {
    return this.searchForumPosts(searchTerm).pipe(
      map(forumPosts => forumPosts.map(post => this.convertToLegacyPost(post)))
    );
  }

  /**
   * Convert ForumPost to legacy Post interface for backward compatibility
   */
  private convertToLegacyPost(forumPost: ForumPost): Post {
    return {
      id: forumPost.id,
      title: forumPost.title,
      content: forumPost.content,
      authorId: forumPost.authorId,
      authorName: forumPost.authorName,
      createdAt: forumPost.createdAt,
      updatedAt: forumPost.updatedAt,
      likes: [], // Legacy field, would need separate likes tracking
      commentsCount: forumPost.commentCount,
      views: 0, // Not tracked in new interface
      tags: forumPost.tags,
      category: forumPost.category
    };
  }
}