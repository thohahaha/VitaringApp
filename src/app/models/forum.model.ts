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
