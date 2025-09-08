export interface ForumPost {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date | any; // Can be Date or Timestamp
  updatedAt: Date | any; // Can be Date or Timestamp
  isDeleted: boolean;
  category: string;
  comments: ForumComment[];
  likeCount: number;
  commentCount: number;
  tags: string[];
  likedBy: string[]; // Array of user IDs who liked this post
  isPinned?: boolean;
  viewCount?: number;
  shareCount?: number;
}

export interface ForumComment {
  id?: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date | any; // Can be Date or Timestamp
  isDeleted: boolean;
  likeCount: number;
  likedBy: string[]; // Array of user IDs who liked this comment
}

// Legacy interface for backward compatibility
export interface Post {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: string[]; // Array of user IDs who liked this post
  commentsCount: number;
  views: number;
  tags?: string[];
  isSticky?: boolean; // For featured posts
  category?: string;
}

// Legacy interface for backward compatibility
export interface Comment {
  id?: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: string[]; // Array of user IDs who liked this comment
  parentCommentId?: string; // For nested replies
  replies?: Comment[];
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  postCount: number;
}

export interface ForumStats {
  totalPosts: number;
  totalComments: number;
  totalUsers: number;
  activeUsers: number;
}

// Analytics interfaces
export interface PostLike {
  id?: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: Date | any;
  type: 'like' | 'dislike';
}

export interface PostView {
  id?: string;
  postId: string;
  userId: string;
  userName: string;
  viewedAt: Date | any;
  sessionId: string;
  duration?: number;
  device: 'mobile' | 'tablet' | 'desktop';
}

export interface PostShare {
  id?: string;
  postId: string;
  userId: string;
  userName: string;
  sharedAt: Date | any;
  shareType: 'copy_link' | 'social_media' | 'direct_message';
  platform: string;
}

export interface DetailedComment {
  id?: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date | any;
  updatedAt: Date | any;
  isDeleted: boolean;
  likeCount: number;
  likedBy: string[];
  parentCommentId?: string;
  replyCount: number;
  replies?: DetailedComment[];
}

export interface CommentLike {
  id?: string;
  commentId: string;
  postId: string;
  userId: string;
  userName: string;
  createdAt: Date | any;
}

export interface PostAnalytics {
  likes: PostLike[];
  views: PostView[];
  shares: PostShare[];
  comments: DetailedComment[];
  totalEngagement: number;
  uniqueViewers: number;
  averageViewDuration?: number;
  topSharePlatforms: { platform: string; count: number }[];
}
