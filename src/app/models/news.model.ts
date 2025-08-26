export interface News {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  date: any; // Menggunakan 'any' untuk kompatibilitas dengan Firebase Timestamp
  likes: string[]; // Array ID pengguna yang menyukai
  views: number;
}
