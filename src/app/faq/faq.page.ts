import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  isExpanded: boolean;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FaqPage {

  searchTerm: string = '';
  selectedCategory: string = 'all';
  
  categories = [
    { value: 'all', label: 'Semua' },
    { value: 'device', label: 'Perangkat' },
    { value: 'health', label: 'Kesehatan' },
    { value: 'app', label: 'Aplikasi' },
    { value: 'account', label: 'Akun' },
    { value: 'troubleshooting', label: 'Pemecahan Masalah' }
  ];

  faqItems: FaqItem[] = [
    {
      id: 1,
      question: 'Bagaimana cara mengatur VitaRing untuk pertama kali?',
      answer: 'Untuk mengatur VitaRing: 1) Unduh aplikasi VitaRing dari App Store atau Google Play, 2) Buat akun atau masuk dengan akun yang sudah ada, 3) Ikuti panduan pairing untuk menghubungkan cincin dengan smartphone Anda, 4) Sesuaikan preferensi dan target kesehatan Anda, 5) Mulai gunakan cincin dan pantau data kesehatan Anda.',
      category: 'device',
      isExpanded: false
    },
    {
      id: 2,
      question: 'Berapa lama daya tahan baterai VitaRing?',
      answer: 'VitaRing memiliki daya tahan baterai hingga 7 hari dengan penggunaan normal. Daya tahan dapat bervariasi tergantung intensitas penggunaan fitur seperti monitoring berkelanjutan, notifikasi, dan sinkronisasi data. Untuk penggunaan optimal, kami merekomendasikan mengisi daya setiap 5-6 hari.',
      category: 'device',
      isExpanded: false
    },
    {
      id: 3,
      question: 'Apakah VitaRing tahan air?',
      answer: 'Ya, VitaRing memiliki rating tahan air IPX8, yang berarti Anda dapat menggunakannya saat mencuci tangan, mandi, berenang, atau beraktivitas di air hingga kedalaman 50 meter. Namun, hindari paparan air panas berlebihan dan jangan gunakan untuk menyelam dalam.',
      category: 'device',
      isExpanded: false
    },
    {
      id: 4,
      question: 'Apa saja data kesehatan yang bisa dipantau VitaRing?',
      answer: 'VitaRing dapat memantau berbagai data kesehatan: detak jantung dan variabilitas detak jantung (HRV), suhu tubuh, tingkat hidrasi, aktivitas fisik dan langkah harian, kalori yang terbakar, dan skor pemulihan. Semua data ini memberikan wawasan komprehensif tentang kesehatan dan kebugaran Anda.',
      category: 'health',
      isExpanded: false
    },
    {
      id: 5,
      question: 'Seberapa akurat sensor pada VitaRing?',
      answer: 'VitaRing menggunakan sensor medis dengan tingkat akurasi tinggi. Sensor detak jantung memiliki akurasi ±2 BPM, sensor suhu ±0.1°C, dan accelerometer untuk aktivitas ±1 langkah per 100 langkah. Akurasi dapat dipengaruhi oleh faktor seperti posisi cincin, kondisi kulit, dan gerakan.',
      category: 'health',
      isExpanded: false
    },
    {
      id: 6,
      question: 'Bagaimana cara mensinkronkan data dengan aplikasi?',
      answer: 'Data disinkronkan otomatis melalui Bluetooth saat cincin berada dalam jangkauan smartphone (sekitar 10 meter). Pastikan Bluetooth aktif dan aplikasi VitaRing terbuka di latar belakang. Sinkronisasi manual dapat dilakukan dengan membuka aplikasi dan menarik ke bawah pada halaman utama.',
      category: 'app',
      isExpanded: false
    },
    {
      id: 7,
      question: 'Apakah data saya aman dan privat?',
      answer: 'Keamanan data adalah prioritas utama kami. Semua data dienkripsi end-to-end, disimpan di server aman dengan standar medis, dan tidak dibagikan dengan pihak ketiga tanpa persetujuan eksplisit. Anda memiliki kontrol penuh atas data pribadi dan dapat menghapusnya kapan saja.',
      category: 'account',
      isExpanded: false
    },
    {
      id: 8,
      question: 'Bagaimana cara mengubah target kesehatan dan kebugaran?',
      answer: 'Untuk mengubah target: 1) Buka aplikasi VitaRing, 2) Masuk ke tab Profil, 3) Pilih "Pengaturan Target", 4) Sesuaikan target langkah harian, zona detak jantung, dan target kalori, 5) Simpan perubahan. Target akan otomatis diterapkan untuk tracking selanjutnya.',
      category: 'app',
      isExpanded: false
    },
    {
      id: 9,
      question: 'VitaRing tidak terhubung dengan smartphone saya, apa yang harus dilakukan?',
      answer: 'Untuk mengatasi masalah koneksi: 1) Pastikan Bluetooth aktif di kedua perangkat, 2) Restart aplikasi VitaRing, 3) Restart Bluetooth di smartphone, 4) Hapus VitaRing dari daftar Bluetooth dan pair ulang, 5) Pastikan cincin memiliki daya baterai cukup, 6) Jika masih bermasalah, reset cincin dengan menekan tombol selama 10 detik.',
      category: 'troubleshooting',
      isExpanded: false
    },
    {
      id: 10,
      question: 'Bagaimana cara mengisi daya VitaRing?',
      answer: 'Gunakan charging dock yang disediakan dalam kemasan. Letakkan cincin pada dock dengan posisi yang benar (magnet akan menarik cincin ke posisi yang tepat). Sambungkan dock ke charger USB-C. Indikator LED akan menyala merah saat mengisi daya dan hijau saat penuh. Pengisian penuh membutuhkan sekitar 2-3 jam.',
      category: 'device',
      isExpanded: false
    },
    {
      id: 11,
      question: 'Apakah VitaRing memiliki notifikasi?',
      answer: 'Ya, VitaRing dapat memberikan notifikasi melalui getaran halus untuk: pengingat bergerak setelah duduk lama, target harian tercapai, zona detak jantung optimal untuk olahraga, dan alert kesehatan penting. Semua notifikasi dapat diatur dalam aplikasi sesuai preferensi Anda.',
      category: 'app',
      isExpanded: false
    },
    {
      id: 12,
      question: 'Bisakah saya menggunakan VitaRing saat berolahraga intensif?',
      answer: 'Tentu saja! VitaRing dirancang untuk aktivitas olahraga intensif. Cincin dapat memantau zona detak jantung real-time, memberikan panduan intensitas latihan, tracking kalori yang akurat, dan analisis pemulihan pasca-olahraga. Pastikan cincin terpasang dengan nyaman namun tidak terlalu ketat.',
      category: 'health',
      isExpanded: false
    }
  ];

  constructor(
    private router: Router,
    private location: Location
  ) {}

  goBack() {
    this.location.back();
  }

  toggleFaq(item: FaqItem) {
    item.isExpanded = !item.isExpanded;
  }

  get filteredFaqItems() {
    let filtered = this.faqItems;
    
    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }
    
    // Filter by search term
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.question.toLowerCase().includes(searchLower) ||
        item.answer.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }

  clearSearch() {
    this.searchTerm = '';
  }

  trackByFaqId(index: number, item: FaqItem): number {
    return item.id;
  }

  getCategoryLabel(categoryValue: string): string {
    const category = this.categories.find(c => c.value === categoryValue);
    return category ? category.label : categoryValue;
  }

  resetSearch() {
    this.searchTerm = '';
    this.selectedCategory = 'all';
  }
}
