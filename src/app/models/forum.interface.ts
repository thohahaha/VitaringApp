export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  category: string;
  tags?: string[];
  likes: string[]; // Array of user IDs who liked
  views: number;
  commentCount: number;
  isSticky?: boolean; // Pinned posts
  isLocked?: boolean; // Locked for new comments
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: string[];
  parentCommentId?: string; // For nested replies
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  postCount: number;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatar?: string;
  bio?: string;
  isActive: boolean;
  role: 'user' | 'moderator' | 'admin';
  joinedAt: Date;
  lastActiveAt: Date;
}
