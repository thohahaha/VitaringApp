export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  imageUrl?: string | null;
  tags: string[];
  category: string;
  viewCount: number;
  
  // Additional fields for backward compatibility with existing UI
  likes?: string[]; // Array of user IDs who liked
  likesCount?: number; // Computed field for UI
  author?: string; // Alias for authorName
  date?: Date; // Alias for publishedAt
  views?: number; // Alias for viewCount
}

export interface NewsComment {
  id: string;
  newsId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
}
