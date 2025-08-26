import { Injectable } from '@angular/core';
import { Observable, map, combineLatest, of, catchError } from 'rxjs';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  getDocs,
  query, 
  orderBy, 
  limit,
  where,
  collectionData,
  docData,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  writeBatch
} from '@angular/fire/firestore';
import { Post, Comment, ForumCategory } from '../models/forum.model';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private postsCollection = collection(this.firestore, 'posts');

  constructor(private firestore: Firestore) {}

  // ===== POST METHODS =====

  /**
   * Get all posts with real-time updates
   */
  getPosts(sortBy: 'newest' | 'featured' | 'popular' = 'newest'): Observable<Post[]> {
    let q;
    
    switch (sortBy) {
      case 'featured':
        q = query(
          this.postsCollection, 
          where('isSticky', '==', true),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        break;
      case 'popular':
        q = query(
          this.postsCollection, 
          orderBy('views', 'desc'),
          limit(50)
        );
        break;
      default: // newest
        q = query(
          this.postsCollection, 
          orderBy('createdAt', 'desc'),
          limit(50)
        );
    }

    return collectionData(q, { idField: 'id' }).pipe(
      map((posts: any[]) => {
        // Jika tidak ada data di Firestore, return dummy data
        if (posts.length === 0) {
          console.log('No posts found in Firestore, returning dummy data');
          // Get dummy data synchronously
          const dummyData = this.getDummyPostsArray();
          return dummyData;
        }
        
        return posts.map(post => ({
          ...post,
          createdAt: post.createdAt?.toDate() || new Date(),
          updatedAt: post.updatedAt?.toDate() || new Date()
        }));
      }),
      catchError(error => {
        console.error('Error fetching posts from Firebase:', error);
        console.log('Falling back to dummy data');
        return this.getDummyPosts();
      })
    ) as Observable<Post[]>;
  }

  /**
   * Get latest posts for dashboard
   */
  getLatestPosts(limitCount: number = 5): Observable<Post[]> {
    const q = query(
      this.postsCollection,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  /**
   * Get post detail with comments
   */
  getPostDetail(postId: string): Observable<Post | undefined> {
    const postDoc = doc(this.firestore, 'posts', postId);
    
    // Update view count when post is viewed
    this.updatePostViews(postId);
    
    return docData(postDoc, { idField: 'id' }) as Observable<Post>;
  }

  /**
   * Add new post
   */
  async addPost(post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'commentsCount' | 'views'>): Promise<string> {
    try {
      const newPost = {
        ...post,
        createdAt: serverTimestamp(),
        likes: [],
        commentsCount: 0,
        views: 0,
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(this.postsCollection, newPost);
      console.log('Post added successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding post:', error);
      throw error;
    }
  }

  /**
   * Update post
   */
  async updatePost(postId: string, updates: Partial<Post>): Promise<void> {
    try {
      const postDoc = doc(this.firestore, 'posts', postId);
      await updateDoc(postDoc, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  /**
   * Delete post
   */
  async deletePost(postId: string): Promise<void> {
    try {
      const postDoc = doc(this.firestore, 'posts', postId);
      await deleteDoc(postDoc);
      console.log('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  /**
   * Update post views
   */
  async updatePostViews(postId: string): Promise<void> {
    try {
      const postDoc = doc(this.firestore, 'posts', postId);
      await updateDoc(postDoc, {
        views: increment(1)
      });
    } catch (error) {
      console.error('Error updating post views:', error);
    }
  }

  /**
   * Toggle like on post
   */
  async togglePostLike(postId: string, userId: string): Promise<void> {
    try {
      const postDoc = doc(this.firestore, 'posts', postId);
      const postSnapshot = await getDoc(postDoc);
      
      if (postSnapshot.exists()) {
        const postData = postSnapshot.data() as Post;
        const isLiked = postData.likes?.includes(userId);

        if (isLiked) {
          // Remove like
          await updateDoc(postDoc, {
            likes: arrayRemove(userId)
          });
        } else {
          // Add like
          await updateDoc(postDoc, {
            likes: arrayUnion(userId)
          });
        }
        console.log('Post like toggled successfully');
      }
    } catch (error) {
      console.error('Error toggling post like:', error);
      throw error;
    }
  }

  // ===== COMMENT METHODS =====

  /**
   * Get comments for a specific post
   */
  getComments(postId: string): Observable<Comment[]> {
    const commentsCollection = collection(this.firestore, 'posts', postId, 'comments');
    const q = query(commentsCollection, orderBy('createdAt', 'asc'));
    
    return collectionData(q, { idField: 'id' }) as Observable<Comment[]>;
  }

  /**
   * Add comment to post
   */
  async addComment(postId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>): Promise<string> {
    try {
      const commentsCollection = collection(this.firestore, 'posts', postId, 'comments');
      
      const newComment = {
        ...comment,
        postId,
        createdAt: serverTimestamp(),
        likes: []
      };

      const docRef = await addDoc(commentsCollection, newComment);
      
      // Update post comment count
      const postDoc = doc(this.firestore, 'posts', postId);
      await updateDoc(postDoc, {
        commentsCount: increment(1)
      });

      console.log('Comment added successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  /**
   * Update comment
   */
  async updateComment(postId: string, commentId: string, updates: Partial<Comment>): Promise<void> {
    try {
      const commentDoc = doc(this.firestore, 'posts', postId, 'comments', commentId);
      await updateDoc(commentDoc, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      console.log('Comment updated successfully');
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  /**
   * Delete comment
   */
  async deleteComment(postId: string, commentId: string): Promise<void> {
    try {
      const commentDoc = doc(this.firestore, 'posts', postId, 'comments', commentId);
      await deleteDoc(commentDoc);
      
      // Update post comment count
      const postDoc = doc(this.firestore, 'posts', postId);
      await updateDoc(postDoc, {
        commentsCount: increment(-1)
      });

      console.log('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  /**
   * Toggle like on comment
   */
  async toggleCommentLike(postId: string, commentId: string, userId: string): Promise<void> {
    try {
      const commentDoc = doc(this.firestore, 'posts', postId, 'comments', commentId);
      const commentSnapshot = await getDoc(commentDoc);
      
      if (commentSnapshot.exists()) {
        const commentData = commentSnapshot.data() as Comment;
        const isLiked = commentData.likes?.includes(userId);

        if (isLiked) {
          // Remove like
          await updateDoc(commentDoc, {
            likes: arrayRemove(userId)
          });
        } else {
          // Add like
          await updateDoc(commentDoc, {
            likes: arrayUnion(userId)
          });
        }
        console.log('Comment like toggled successfully');
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  }

  // ===== DUMMY DATA METHODS (for development) =====

  /**
   * Get dummy posts for development
   */
  getDummyPosts(): Observable<Post[]> {
    const dummyPosts: Post[] = [
      {
        id: '1',
        title: 'Tips Menjaga Kesehatan Jantung dengan VitaRing',
        content: 'Berikut adalah beberapa tips efektif untuk menjaga kesehatan jantung menggunakan data dari VitaRing. Pantau detak jantung istirahat Anda setiap hari dan pastikan berada dalam rentang normal...',
        authorId: 'user1',
        authorName: 'Dr. Ahmad Wijaya',
        authorAvatar: 'https://ui-avatars.com/api/?name=Ahmad+Wijaya&background=f97316&color=fff',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        likes: ['user2', 'user3', 'user5'],
        commentsCount: 8,
        views: 124,
        tags: ['kesehatan', 'jantung', 'vitaring'],
        isSticky: true,
        category: 'Health Tips'
      },
      {
        id: '2',
        title: 'Pengalaman Menggunakan VitaRing Selama 6 Bulan',
        content: 'Saya ingin berbagi pengalaman menggunakan VitaRing selama 6 bulan terakhir. Perangkat ini benar-benar mengubah cara saya memantau kesehatan...',
        authorId: 'user2',
        authorName: 'Sarah Putri',
        authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Putri&background=ea580c&color=fff',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        likes: ['user1', 'user4'],
        commentsCount: 12,
        views: 89,
        tags: ['review', 'pengalaman', 'vitaring'],
        category: 'User Experience'
      },
      {
        id: '3',
        title: 'Cara Interpretasi Data Heart Rate Variability',
        content: 'Heart Rate Variability (HRV) adalah salah satu metrik penting yang diukur oleh VitaRing. Artikel ini akan menjelaskan cara membaca dan menginterpretasi data HRV...',
        authorId: 'user3',
        authorName: 'Dr. Siti Nurhaliza',
        authorAvatar: 'https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=dc2626&color=fff',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        likes: ['user1', 'user2', 'user4', 'user5'],
        commentsCount: 15,
        views: 156,
        tags: ['hrv', 'analisis', 'kesehatan'],
        category: 'Education'
      },
      {
        id: '4',
        title: 'Diskusi: Fitur Apa yang Kalian Inginkan di Update Selanjutnya?',
        content: 'Halo komunitas VitaRing! Saya ingin mendengar pendapat kalian mengenai fitur-fitur apa saja yang kalian harapkan di update aplikasi selanjutnya...',
        authorId: 'user4',
        authorName: 'Admin VitaRing',
        authorAvatar: 'https://ui-avatars.com/api/?name=Admin+VitaRing&background=f97316&color=fff',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        likes: ['user1', 'user2', 'user3', 'user5', 'user6'],
        commentsCount: 24,
        views: 201,
        tags: ['diskusi', 'feedback', 'update'],
        isSticky: true,
        category: 'Discussion'
      },
      {
        id: '5',
        title: 'Troubleshooting: VitaRing Tidak Terhubung ke Aplikasi',
        content: 'Beberapa pengguna melaporkan masalah koneksi antara VitaRing dan aplikasi. Berikut adalah langkah-langkah troubleshooting yang bisa dicoba...',
        authorId: 'user5',
        authorName: 'Tech Support',
        authorAvatar: 'https://ui-avatars.com/api/?name=Tech+Support&background=6b7280&color=fff',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        likes: ['user3', 'user4'],
        commentsCount: 7,
        views: 67,
        tags: ['troubleshooting', 'koneksi', 'bantuan'],
        category: 'Technical Support'
      }
    ];

    return new Observable(observer => {
      observer.next(dummyPosts);
      observer.complete();
    });
  }

  /**
   * Get dummy comments for development
   */
  getDummyComments(postId: string): Observable<Comment[]> {
    const dummyComments: Comment[] = [
      {
        id: '1',
        postId,
        authorId: 'user2',
        authorName: 'Sarah Putri',
        authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Putri&background=ea580c&color=fff',
        content: 'Terima kasih atas informasinya! Sangat membantu untuk pemula seperti saya.',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        likes: ['user1', 'user3']
      },
      {
        id: '2',
        postId,
        authorId: 'user3',
        authorName: 'Dr. Siti Nurhaliza',
        authorAvatar: 'https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=dc2626&color=fff',
        content: 'Artikel yang sangat informatif. Saya setuju dengan poin-poin yang disebutkan.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        likes: ['user1']
      },
      {
        id: '3',
        postId,
        authorId: 'user4',
        authorName: 'Budi Santoso',
        authorAvatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=3b82f6&color=fff',
        content: 'Apakah ada tips khusus untuk orang yang baru mulai menggunakan VitaRing?',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        likes: []
      }
    ];

    return new Observable(observer => {
      observer.next(dummyComments);
      observer.complete();
    });
  }

  /**
   * Search posts by title, content, or tags
   */
  searchPosts(searchTerm: string): Observable<Post[]> {
    // For development, implement simple client-side search
    // In production, this should use Firebase's full-text search or Algolia
    
    // Get dummy data for now
    const dummyPosts: Post[] = [
      {
        id: '1',
        title: 'Tips Optimasi VitaRing untuk Monitoring Jantung',
        content: 'Panduan lengkap untuk mengoptimalkan penggunaan VitaRing dalam monitoring kesehatan jantung sehari-hari...',
        authorId: 'user1',
        authorName: 'Dr. Andika Pratama',
        authorAvatar: 'https://ui-avatars.com/api/?name=Andika+Pratama&background=f97316&color=fff',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: ['user2', 'user3', 'user4'],
        commentsCount: 12,
        views: 234,
        tags: ['kesehatan', 'jantung', 'monitoring'],
        isSticky: true
      },
      {
        id: '2',
        title: 'Pengalaman 6 Bulan Menggunakan VitaRing',
        content: 'Review mendalam tentang pengalaman menggunakan VitaRing selama 6 bulan untuk tracking fitness dan kesehatan...',
        authorId: 'user2',
        authorName: 'Sarah Putri',
        authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Putri&background=ea580c&color=fff',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: ['user1', 'user3'],
        commentsCount: 8,
        views: 156,
        tags: ['review', 'pengalaman', 'fitness']
      }
    ];

    const filteredPosts = dummyPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return new Observable(observer => {
      observer.next(filteredPosts);
      observer.complete();
    });
  }

  /**
   * Get forum statistics
   */
  getForumStats(): Observable<any> {
    // Return mock forum statistics
    const stats = {
      totalPosts: 1248,
      totalComments: 3456,
      totalMembers: 892,
      activeToday: 67
    };

    return new Observable(observer => {
      observer.next(stats);
      observer.complete();
    });
  }

  /**
   * Helper method to get dummy posts as array (synchronous)
   */
  private getDummyPostsArray(): Post[] {
    return [
      {
        id: '1',
        title: 'Tips Menjaga Kesehatan Jantung dengan VitaRing',
        content: 'Berikut adalah beberapa tips efektif untuk menjaga kesehatan jantung menggunakan data dari VitaRing...',
        authorId: 'user1',
        authorName: 'Dr. Ahmad Wijaya',
        authorAvatar: 'https://ui-avatars.com/api/?name=Ahmad+Wijaya&background=f97316&color=fff',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: ['user2', 'user3', 'user5'],
        commentsCount: 8,
        views: 124,
        tags: ['kesehatan', 'jantung', 'vitaring'],
        isSticky: true,
        category: 'Health Tips'
      },
      {
        id: '2',
        title: 'Pengalaman Menggunakan VitaRing Selama 6 Bulan',
        content: 'Saya ingin berbagi pengalaman menggunakan VitaRing selama 6 bulan terakhir...',
        authorId: 'user2',
        authorName: 'Sarah Putri',
        authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Putri&background=ea580c&color=fff',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: ['user1', 'user4'],
        commentsCount: 12,
        views: 89,
        tags: ['review', 'pengalaman', 'vitaring'],
        category: 'User Experience'
      }
    ];
  }
}
