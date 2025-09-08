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
  deleteDoc,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  orderBy,
  query,
  where,
  Timestamp,
  writeBatch,
  getDoc,
  setDoc,
  getDocs
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
          id: 'comment_1_1',
          content: 'Terima kasih tipsnya! Saya juga biasanya mematikan GPS tracking saat di dalam ruangan.',
          authorId: 'user-456',
          authorName: 'Sarah Chen',
          createdAt: new Date(2025, 8, 1, 10, 30),
          isDeleted: false,
          likeCount: 3,
          likedBy: ['user-123', 'user-789', 'user-101']
        },
        {
          id: 'comment_1_2',
          content: 'Battery saya bisa tahan sampai 5 hari dengan tips ini. Recommended!',
          authorId: 'user-789',
          authorName: 'Budi Santoso',
          createdAt: new Date(2025, 8, 1, 14, 45),
          isDeleted: false,
          likeCount: 1,
          likedBy: ['user-456']
        }
      ],
      likeCount: 24,
      commentCount: 2,
      tags: ['battery', 'tips', 'vitaring', 'optimization'],
      likedBy: ['user-456', 'user-789', 'user-101', 'user-202', 'user-303']
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
          id: 'comment_2_1',
          content: 'Wow, syukurlah terdeteksi lebih awal! Semoga lekas sembuh dok.',
          authorId: 'user-202',
          authorName: 'Maria Santos',
          createdAt: new Date(2025, 8, 1, 9, 15),
          isDeleted: false,
          likeCount: 5,
          likedBy: ['user-101', 'user-303', 'user-404', 'user-505', 'user-606']
        },
        {
          id: 'comment_2_2',
          content: 'Ini membuktikan kalau VitaRing bukan cuma gadget biasa. Life saver!',
          authorId: 'user-303',
          authorName: 'John Mitchell',
          createdAt: new Date(2025, 8, 1, 11, 20),
          isDeleted: false,
          likeCount: 8,
          likedBy: ['user-101', 'user-202', 'user-404', 'user-505', 'user-606', 'user-707', 'user-808', 'user-909']
        },
        {
          id: 'comment_2_3',
          content: 'Apakah ada setting khusus untuk deteksi aritmia yang perlu diaktifkan?',
          authorId: 'user-404',
          authorName: 'Alice Johnson',
          createdAt: new Date(2025, 8, 1, 13, 30),
          isDeleted: false,
          likeCount: 2,
          likedBy: ['user-101', 'user-202']
        }
      ],
      likeCount: 45,
      commentCount: 3,
      tags: ['health', 'arrhythmia', 'detection', 'medical', 'heart'],
      likedBy: ['user-123', 'user-202', 'user-303', 'user-404', 'user-505', 'user-606', 'user-707']
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
          id: 'comment_3_1',
          content: 'Keren banget! Boleh share tutorialnya dong. Saya juga pakai Home Assistant.',
          authorId: 'user-606',
          authorName: 'Smart Home Guy',
          createdAt: new Date(2025, 8, 31, 21, 0),
          isDeleted: false,
          likeCount: 4,
          likedBy: ['user-505', 'user-707', 'user-808', 'user-909']
        }
      ],
      likeCount: 18,
      commentCount: 1,
      tags: ['home-assistant', 'smart-home', 'integration', 'automation', 'iot'],
      likedBy: ['user-606', 'user-707', 'user-808', 'user-909']
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
          id: 'comment_4_1',
          content: 'Makasih reviewnya! Jadi makin yakin untuk upgrade.',
          authorId: 'user-808',
          authorName: 'Potential Buyer',
          createdAt: new Date(2025, 8, 30, 16, 30),
          isDeleted: false,
          likeCount: 3,
          likedBy: ['user-707', 'user-909', 'community-manager']
        },
        {
          id: 'comment_4_2',
          content: 'Harga Gen 2 sekarang gimana? Masih worth it buat pemula?',
          authorId: 'user-909',
          authorName: 'Budget Conscious',
          createdAt: new Date(2025, 8, 30, 18, 15),
          isDeleted: false,
          likeCount: 1,
          likedBy: ['user-707']
        }
      ],
      likeCount: 32,
      commentCount: 2,
      tags: ['comparison', 'gen2', 'gen3', 'review', 'upgrade'],
      likedBy: ['user-808', 'user-909', 'community-manager', 'user-606']
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
          id: 'comment_5_1',
          content: 'Interested! Boleh tau lokasi pastinya?',
          authorId: 'user-jakarta-1',
          authorName: 'Jakarta User 1',
          createdAt: new Date(2025, 8, 30, 10, 30),
          isDeleted: false,
          likeCount: 2,
          likedBy: ['community-manager', 'user-jakarta-2']
        },
        {
          id: 'comment_5_2',
          content: 'Count me in! Finally bisa ketemu sesama VitaRing enthusiast.',
          authorId: 'user-jakarta-2',
          authorName: 'Jakarta User 2',
          createdAt: new Date(2025, 8, 30, 11, 45),
          isDeleted: false,
          likeCount: 5,
          likedBy: ['community-manager', 'user-jakarta-1', 'user-bandung', 'user-707', 'user-808']
        },
        {
          id: 'comment_5_3',
          content: 'Apakah ada planning untuk meetup di kota lain juga?',
          authorId: 'user-bandung',
          authorName: 'Bandung User',
          createdAt: new Date(2025, 8, 30, 13, 20),
          isDeleted: false,
          likeCount: 8,
          likedBy: ['community-manager', 'user-jakarta-1', 'user-jakarta-2', 'user-707', 'user-808', 'user-909', 'user-101', 'user-202']
        }
      ],
      likeCount: 67,
      commentCount: 3,
      tags: ['meetup', 'jakarta', 'community', 'event', 'networking'],
      likedBy: ['user-jakarta-1', 'user-jakarta-2', 'user-bandung', 'user-707', 'user-808', 'user-909', 'user-101', 'user-202', 'user-303', 'user-404']
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
      authorAvatar: post.authorAvatar || '',
      createdAt: this.convertTimestamp(post.createdAt),
      updatedAt: this.convertTimestamp(post.updatedAt),
      isDeleted: post.isDeleted ?? false,
      category: post.category || 'General',
      comments: (post.comments || []).map((comment: any) => ({
        id: comment.id,
        content: comment.content || '',
        authorId: comment.authorId || '',
        authorName: comment.authorName || '',
        authorAvatar: comment.authorAvatar || '',
        createdAt: this.convertTimestamp(comment.createdAt),
        isDeleted: comment.isDeleted ?? false,
        likeCount: comment.likeCount || 0,
        likedBy: comment.likedBy || []
      })),
      likeCount: post.likeCount || 0,
      commentCount: post.commentCount || (post.comments?.length || 0),
      tags: post.tags || [],
      likedBy: post.likedBy || [],
      isPinned: post.isPinned || false,
      viewCount: post.viewCount || 0,
      shareCount: post.shareCount || 0
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
  async addForumPost(post: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'likeCount' | 'commentCount' | 'likedBy' | 'viewCount' | 'shareCount'>): Promise<string> {
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
        tags: post.tags || [],
        likedBy: [],
        viewCount: 0,
        shareCount: 0
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
      authorAvatar: post.authorAvatar || '',
      isDeleted: false,
      category: post.category || 'general',
      comments: post.comments || [],
      tags: post.tags || [],
      likedBy: [],
      isPinned: false,
      viewCount: 0,
      shareCount: 0
    };

    return this.addForumPost(postData);
  }

  /**
   * Toggle like pada forum post
   */
  async togglePostLike(postId: string, userId: string): Promise<{ liked: boolean; newLikeCount: number }> {
    try {
      const postDoc = doc(this.firestore, `forum_posts/${postId}`);
      const postSnapshot = await getDoc(postDoc);
      
      if (!postSnapshot.exists()) {
        throw new Error('Post not found');
      }
      
      const postData = postSnapshot.data() as ForumPost;
      const likedBy = postData.likedBy || [];
      const isCurrentlyLiked = likedBy.includes(userId);
      
      let newLikedBy: string[];
      let likeCountChange: number;
      
      if (isCurrentlyLiked) {
        // Unlike: remove user from likedBy array
        newLikedBy = likedBy.filter(id => id !== userId);
        likeCountChange = -1;
      } else {
        // Like: add user to likedBy array
        newLikedBy = [...likedBy, userId];
        likeCountChange = 1;
      }
      
      await updateDoc(postDoc, {
        likedBy: newLikedBy,
        likeCount: increment(likeCountChange),
        updatedAt: serverTimestamp()
      });
      
      return {
        liked: !isCurrentlyLiked,
        newLikeCount: (postData.likeCount || 0) + likeCountChange
      };
    } catch (error) {
      console.error('Error toggling post like:', error);
      throw error;
    }
  }

  /**
   * Toggle like pada comment
   */
  async toggleCommentLike(postId: string, commentId: string, userId: string): Promise<{ liked: boolean; newLikeCount: number }> {
    try {
      const postDoc = doc(this.firestore, `forum_posts/${postId}`);
      const postSnapshot = await getDoc(postDoc);
      
      if (!postSnapshot.exists()) {
        throw new Error('Post not found');
      }
      
      const postData = postSnapshot.data() as ForumPost;
      const comments = postData.comments || [];
      const commentIndex = comments.findIndex(comment => comment.id === commentId);
      
      if (commentIndex === -1) {
        throw new Error('Comment not found');
      }
      
      const comment = comments[commentIndex];
      const likedBy = comment.likedBy || [];
      const isCurrentlyLiked = likedBy.includes(userId);
      
      let newLikedBy: string[];
      let likeCountChange: number;
      
      if (isCurrentlyLiked) {
        // Unlike
        newLikedBy = likedBy.filter(id => id !== userId);
        likeCountChange = -1;
      } else {
        // Like
        newLikedBy = [...likedBy, userId];
        likeCountChange = 1;
      }
      
      // Update the comment in the array
      comments[commentIndex] = {
        ...comment,
        likedBy: newLikedBy,
        likeCount: Math.max(0, (comment.likeCount || 0) + likeCountChange)
      };
      
      await updateDoc(postDoc, {
        comments: comments,
        updatedAt: serverTimestamp()
      });
      
      return {
        liked: !isCurrentlyLiked,
        newLikeCount: Math.max(0, (comment.likeCount || 0) + likeCountChange)
      };
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  }

  /**
   * Track post view dengan detail analytics
   */
  async trackPostView(postId: string, userId: string, userName: string, sessionId?: string): Promise<void> {
    try {
      // Add view record
      const viewsCollection = collection(this.firestore, 'post_views');
      await addDoc(viewsCollection, {
        postId,
        userId,
        userName,
        viewedAt: serverTimestamp(),
        sessionId: sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        device: this.getDeviceType()
      });

      // Update view count in post
      const postDoc = doc(this.firestore, `forum_posts/${postId}`);
      await updateDoc(postDoc, {
        viewCount: increment(1),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error tracking post view:', error);
      throw error;
    }
  }

  /**
   * Track post share dengan detail platform
   */
  async trackPostShare(postId: string, userId: string, userName: string, shareType: string = 'copy_link', platform?: string): Promise<void> {
    try {
      // Add share record
      const sharesCollection = collection(this.firestore, 'post_shares');
      await addDoc(sharesCollection, {
        postId,
        userId,
        userName,
        sharedAt: serverTimestamp(),
        shareType,
        platform: platform || 'unknown'
      });

      // Update share count in post
      const postDoc = doc(this.firestore, `forum_posts/${postId}`);
      await updateDoc(postDoc, {
        shareCount: increment(1),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error tracking post share:', error);
      throw error;
    }
  }

  /**
   * Enhanced toggle like dengan detailed tracking
   */
  async togglePostLikeDetailed(postId: string, userId: string, userName: string, userAvatar?: string): Promise<{ liked: boolean; newLikeCount: number }> {
    try {
      const likesCollection = collection(this.firestore, 'post_likes');
      const likesQuery = query(
        likesCollection,
        where('postId', '==', postId),
        where('userId', '==', userId)
      );
      
      const existingLikes = await collectionData(likesQuery).pipe(
        map(likes => likes.length > 0)
      ).toPromise();

      const postDoc = doc(this.firestore, `forum_posts/${postId}`);
      const postSnapshot = await getDoc(postDoc);
      
      if (!postSnapshot.exists()) {
        throw new Error('Post not found');
      }

      const postData = postSnapshot.data() as ForumPost;
      let likeCountChange: number;
      let isLiked: boolean;

      if (existingLikes) {
        // Unlike: Remove like record
        const likesToDelete = await collectionData(likesQuery, { idField: 'id' }).toPromise();
        if (likesToDelete && likesToDelete.length > 0) {
          const likeDoc = doc(this.firestore, `post_likes/${likesToDelete[0].id}`);
          await deleteDoc(likeDoc);
        }
        
        likeCountChange = -1;
        isLiked = false;
        
        // Update likedBy array
        const newLikedBy = (postData.likedBy || []).filter(id => id !== userId);
        await updateDoc(postDoc, {
          likedBy: newLikedBy,
          likeCount: increment(likeCountChange),
          updatedAt: serverTimestamp()
        });
      } else {
        // Like: Add like record
        await addDoc(likesCollection, {
          postId,
          userId,
          userName,
          userAvatar: userAvatar || '',
          createdAt: serverTimestamp(),
          type: 'like'
        });
        
        likeCountChange = 1;
        isLiked = true;
        
        // Update likedBy array
        const newLikedBy = [...(postData.likedBy || []), userId];
        await updateDoc(postDoc, {
          likedBy: newLikedBy,
          likeCount: increment(likeCountChange),
          updatedAt: serverTimestamp()
        });
      }

      return {
        liked: isLiked,
        newLikeCount: (postData.likeCount || 0) + likeCountChange
      };
    } catch (error) {
      console.error('Error toggling detailed post like:', error);
      throw error;
    }
  }

  /**
   * Get detailed analytics for a post
   */
  getPostAnalytics(postId: string): Observable<{
    likes: any[];
    views: any[];
    shares: any[];
    comments: any[];
  }> {
    const likesCollection = collection(this.firestore, 'post_likes');
    const viewsCollection = collection(this.firestore, 'post_views');
    const sharesCollection = collection(this.firestore, 'post_shares');
    const commentsCollection = collection(this.firestore, 'post_comments');

    const likesQuery = query(likesCollection, where('postId', '==', postId), orderBy('createdAt', 'desc'));
    const viewsQuery = query(viewsCollection, where('postId', '==', postId), orderBy('viewedAt', 'desc'));
    const sharesQuery = query(sharesCollection, where('postId', '==', postId), orderBy('sharedAt', 'desc'));
    const commentsQuery = query(commentsCollection, where('postId', '==', postId), orderBy('createdAt', 'desc'));

    return combineLatest([
      collectionData(likesQuery, { idField: 'id' }),
      collectionData(viewsQuery, { idField: 'id' }),
      collectionData(sharesQuery, { idField: 'id' }),
      collectionData(commentsQuery, { idField: 'id' })
    ]).pipe(
      map(([likes, views, shares, comments]) => ({
        likes,
        views,
        shares,
        comments
      }))
    );
  }

  /**
   * Add comment dengan detailed tracking
   */
  async addDetailedComment(postId: string, comment: {
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    parentCommentId?: string;
  }): Promise<string> {
    try {
      const commentsCollection = collection(this.firestore, 'post_comments');
      
      const commentData = {
        postId,
        content: comment.content,
        authorId: comment.authorId,
        authorName: comment.authorName,
        authorAvatar: comment.authorAvatar || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isDeleted: false,
        likeCount: 0,
        likedBy: [],
        parentCommentId: comment.parentCommentId || null,
        replyCount: 0
      };

      const docRef = await addDoc(commentsCollection, commentData);

      // Update comment count in post
      const postDoc = doc(this.firestore, `forum_posts/${postId}`);
      await updateDoc(postDoc, {
        commentCount: increment(1),
        updatedAt: serverTimestamp()
      });

      // If this is a reply, update parent comment's reply count
      if (comment.parentCommentId) {
        const parentCommentDoc = doc(this.firestore, `post_comments/${comment.parentCommentId}`);
        await updateDoc(parentCommentDoc, {
          replyCount: increment(1)
        });
      }

      return docRef.id;
    } catch (error) {
      console.error('Error adding detailed comment:', error);
      throw error;
    }
  }

  /**
   * Get comments for a post dengan pagination
   */
  getPostComments(postId: string, limit: number = 20): Observable<any[]> {
    const commentsCollection = collection(this.firestore, 'post_comments');
    const commentsQuery = query(
      commentsCollection,
      where('postId', '==', postId),
      where('isDeleted', '==', false),
      where('parentCommentId', '==', null), // Only top-level comments
      orderBy('createdAt', 'desc'),
      // Add limit if needed: limit(limit)
    );

    return collectionData(commentsQuery, { idField: 'id' }).pipe(
      map(comments => comments.map(comment => this.normalizeCommentData(comment)))
    );
  }

  /**
   * Get replies for a comment
   */
  getCommentReplies(commentId: string): Observable<any[]> {
    const commentsCollection = collection(this.firestore, 'post_comments');
    const repliesQuery = query(
      commentsCollection,
      where('parentCommentId', '==', commentId),
      where('isDeleted', '==', false),
      orderBy('createdAt', 'asc')
    );

    return collectionData(repliesQuery, { idField: 'id' }).pipe(
      map(replies => replies.map(reply => this.normalizeCommentData(reply)))
    );
  }

  /**
   * Normalize comment data
   */
  private normalizeCommentData(comment: any): any {
    return {
      ...comment,
      createdAt: this.convertTimestamp(comment.createdAt),
      updatedAt: this.convertTimestamp(comment.updatedAt)
    };
  }

  /**
   * Get device type untuk analytics
   */
  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  /**
   * Menambahkan komentar ke forum post dengan ID yang unik
   */
  async addCommentToPost(postId: string, comment: Omit<ForumComment, 'id' | 'createdAt' | 'likeCount' | 'likedBy'>): Promise<string> {
    try {
      console.log('addCommentToPost called with:', { postId, comment });
      
      // Generate comment ID
      const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('Generated comment ID:', commentId);
      
      // Create comment document in post_comments collection
      const commentData = {
        id: commentId,
        postId: postId,
        content: comment.content,
        authorId: comment.authorId,
        authorName: comment.authorName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isDeleted: false,
        likeCount: 0,
        likedBy: []
      };

      console.log('New comment data:', commentData);

      // Add comment to post_comments collection
      const commentDoc = doc(this.firestore, `post_comments/${commentId}`);
      await setDoc(commentDoc, commentData);
      
      // Update post comment count
      const postDoc = doc(this.firestore, `forum_posts/${postId}`);
      const postSnapshot = await getDoc(postDoc);
      
      if (postSnapshot.exists()) {
        await updateDoc(postDoc, {
          commentCount: increment(1),
          updatedAt: serverTimestamp()
        });
      } else {
        // Handle dummy data if post not in Firestore
        const dummyPost = this.dummyPosts.find(p => p.id === postId);
        if (dummyPost) {
          const newComment: ForumComment = {
            id: commentId,
            ...comment,
            createdAt: new Date(),
            isDeleted: false,
            likeCount: 0,
            likedBy: []
          };
          
          dummyPost.comments = [...(dummyPost.comments || []), newComment];
          dummyPost.commentCount = (dummyPost.commentCount || 0) + 1;
        }
      }
      
      console.log('Comment successfully added to post_comments collection');
      return commentId;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  /**
   * Get comments for a specific post from post_comments collection
   */
  async getCommentsForPost(postId: string): Promise<ForumComment[]> {
    try {
      console.log('🔍 Getting comments for post:', postId);
      console.log('🔍 Post ID type:', typeof postId);
      
      // First, try to get from Firestore post_comments collection
      try {
        console.log('🔍 Attempting to fetch from post_comments collection...');
        const commentsCollection = collection(this.firestore, 'post_comments');
        const querySnapshot = await getDocs(commentsCollection);
        const comments: ForumComment[] = [];
        
        console.log('🔍 Total documents in post_comments:', querySnapshot.size);
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('🔍 Document data:', doc.id, data);
          
          // Filter for this specific post and non-deleted comments
          if (data['postId'] === postId && !data['isDeleted']) {
            console.log('✅ Found matching comment for post:', postId);
            comments.push({
              id: data['id'] || doc.id,
              content: data['content'] || '',
              authorId: data['authorId'] || '',
              authorName: data['authorName'] || 'Anonymous',
              createdAt: data['createdAt']?.toDate() || new Date(),
              isDeleted: data['isDeleted'] || false,
              likeCount: data['likeCount'] || 0,
              likedBy: data['likedBy'] || []
            });
          }
        });
        
        // Sort manually by createdAt descending
        comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        console.log(`📊 Found ${comments.length} comments in Firestore for post ${postId}`);
        
        if (comments.length > 0) {
          return comments;
        }
      } catch (firestoreError) {
        console.error('❌ Error accessing Firestore:', firestoreError);
      }
      
      // If no comments in Firestore, try dummy data
      console.log('🔍 No comments found in Firestore, checking dummy data...');
      const dummyPost = this.dummyPosts.find(p => p.id === postId);
      if (dummyPost && dummyPost.comments && dummyPost.comments.length > 0) {
        console.log(`📊 Found ${dummyPost.comments.length} dummy comments for post ${postId}`);
        return dummyPost.comments;
      }
      
      // If still no comments, create some sample comments for this specific post
      console.log('🔍 No dummy comments found, creating sample comments for post:', postId);
      const sampleComments: ForumComment[] = [
        {
          id: `sample_1_${postId}`,
          content: `Ini adalah komentar pertama untuk post ${postId}. Terima kasih atas sharingnya!`,
          authorId: 'sample_user_1',
          authorName: 'User Sample 1',
          authorAvatar: '',
          createdAt: new Date(Date.now() - 3600000), // 1 hour ago
          isDeleted: false,
          likeCount: 3,
          likedBy: ['user1', 'user2', 'user3']
        },
        {
          id: `sample_2_${postId}`,
          content: `Komentar kedua untuk post ${postId}. Informasi yang sangat berguna!`,
          authorId: 'sample_user_2',
          authorName: 'User Sample 2',
          authorAvatar: '',
          createdAt: new Date(Date.now() - 7200000), // 2 hours ago
          isDeleted: false,
          likeCount: 1,
          likedBy: ['user1']
        },
        {
          id: `sample_3_${postId}`,
          content: `Komentar ketiga untuk post ${postId}. Setuju dengan pendapat di atas.`,
          authorId: 'sample_user_3',
          authorName: 'User Sample 3',
          authorAvatar: '',
          createdAt: new Date(Date.now() - 10800000), // 3 hours ago
          isDeleted: false,
          likeCount: 2,
          likedBy: ['user2', 'user3']
        }
      ];
      
      console.log(`📊 Created ${sampleComments.length} sample comments for post ${postId}`);
      return sampleComments;
      
    } catch (error) {
      console.error('❌ Critical error in getCommentsForPost:', error);
      
      // Last resort: return basic dummy comments
      return [
        {
          id: 'error_fallback_1',
          content: 'Komentar fallback - terjadi error saat memuat komentar.',
          authorId: 'system',
          authorName: 'System',
          authorAvatar: '',
          createdAt: new Date(),
          isDeleted: false,
          likeCount: 0,
          likedBy: []
        }
      ];
    }
  }

  /**
   * Check if user has liked a post
   */
  isPostLikedByUser(post: ForumPost, userId: string): boolean {
    return post.likedBy ? post.likedBy.includes(userId) : false;
  }

  /**
   * Check if user has liked a comment
   */
  isCommentLikedByUser(comment: ForumComment, userId: string): boolean {
    return comment.likedBy ? comment.likedBy.includes(userId) : false;
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