export interface ForumPost {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date | any; // Can be Date or Timestamp
  updatedAt: Date | any; // Can be Date or Timestamp
  isDeleted: boolean;
  category: string;
  comments: ForumComment[];
  likeCount: number;
  commentCount: number;
  tags: string[];
}

export interface ForumComment {
  id?: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date | any; // Can be Date or Timestamp
  isDeleted: boolean;
  likeCount: number;
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
