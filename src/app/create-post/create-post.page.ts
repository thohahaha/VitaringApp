import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonButton, 
  IonIcon,
  IonItem,
  IonInput,
  IonTextarea,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonChip,
  IonCheckbox,
  AlertController,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { AuthService } from '../auth/auth.service';
import { ForumService } from '../services/forum.service';
import { ForumPost } from '../models/forum.model';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { addIcons } from 'ionicons';
import { 
  arrowBack,
  send,
  add,
  removeCircle,
  pricetag
} from 'ionicons/icons';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonInput,
    IonTextarea,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonChip,
    IonCheckbox,
    NavbarComponent
  ]
})
export class CreatePostPage implements OnInit {
  // Form data
  postTitle: string = '';
  postContent: string = '';
  selectedCategory: string = '';
  newTag: string = '';
  tags: string[] = [];
  isSubmitting: boolean = false;

  // Available categories
  categories = [
    { value: 'general', label: 'Diskusi Umum' },
    { value: 'health-tips', label: 'Tips Kesehatan' },
    { value: 'nutrition', label: 'Nutrisi' },
    { value: 'exercise', label: 'Olahraga' },
    { value: 'wellness', label: 'Wellness' },
    { value: 'technology', label: 'Teknologi Kesehatan' },
    { value: 'support', label: 'Dukungan & Motivasi' }
  ];

  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private forumService: ForumService
  ) {
    // Register icons
    addIcons({
      arrowBack,
      send,
      add,
      removeCircle,
      pricetag
    });
  }

  private alertController = inject(AlertController);
  private loadingController = inject(LoadingController);
  private toastController = inject(ToastController);

  ngOnInit() {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  async onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Membuat post...',
      spinner: 'circles'
    });
    await loading.present();

    try {
      this.isSubmitting = true;
      const user = this.authService.getCurrentUser();
      
      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      const newPost: Partial<ForumPost> = {
        title: this.postTitle.trim(),
        content: this.postContent.trim(),
        authorId: user.uid || user.email || '',
        authorName: user.displayName || user.email || 'Anonymous',
        category: this.selectedCategory,
        tags: this.tags,
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
        isDeleted: false,
        comments: [],
        likeCount: 0,
        commentCount: 0
      };

      // Create post using ForumService
      const postId = await this.forumService.createPost(newPost);
      console.log('Post created with ID:', postId);

      await loading.dismiss();
      
      // Show success message
      const toast = await this.toastController.create({
        message: 'Post berhasil dibuat!',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();

      // Navigate back to forum
      this.router.navigate(['/forum']);

    } catch (error) {
      await loading.dismiss();
      console.error('Error creating post:', error);
      
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Gagal membuat post. Silakan coba lagi.',
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      this.isSubmitting = false;
    }
  }

  validateForm(): boolean {
    if (!this.postTitle.trim()) {
      this.showValidationError('Judul post harus diisi');
      return false;
    }

    if (this.postTitle.trim().length < 5) {
      this.showValidationError('Judul post minimal 5 karakter');
      return false;
    }

    if (!this.postContent.trim()) {
      this.showValidationError('Konten post harus diisi');
      return false;
    }

    if (this.postContent.trim().length < 10) {
      this.showValidationError('Konten post minimal 10 karakter');
      return false;
    }

    if (!this.selectedCategory) {
      this.showValidationError('Kategori harus dipilih');
      return false;
    }

    return true;
  }

  async showValidationError(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }

  addTag() {
    const tag = this.newTag.trim().toLowerCase();
    
    if (!tag) {
      return;
    }

    if (this.tags.includes(tag)) {
      this.showValidationError('Tag sudah ditambahkan');
      return;
    }

    if (this.tags.length >= 5) {
      this.showValidationError('Maksimal 5 tag');
      return;
    }

    if (tag.length < 2) {
      this.showValidationError('Tag minimal 2 karakter');
      return;
    }

    this.tags.push(tag);
    this.newTag = '';
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  onTagInput(event: any) {
    const value = event.detail.value;
    if (value.includes(' ') || value.includes(',')) {
      // Auto-add tag when space or comma is typed
      this.newTag = value.replace(/[, ]+/g, '');
      this.addTag();
    }
  }

  goBack() {
    this.location.back();
  }

  async onCancelPost() {
    if (this.postTitle.trim() || this.postContent.trim() || this.tags.length > 0) {
      const alert = await this.alertController.create({
        header: 'Konfirmasi',
        message: 'Apakah Anda yakin ingin membatalkan? Semua data akan hilang.',
        buttons: [
          {
            text: 'Batal',
            role: 'cancel'
          },
          {
            text: 'Ya, Batalkan',
            handler: () => {
              this.goBack();
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.goBack();
    }
  }
}
