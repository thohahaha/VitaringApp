import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDebugService {

  constructor(private auth: Auth) {}

  /**
   * Debug Firebase configuration dan connection
   */
  debugFirebaseConfig() {
    console.group('🔥 Firebase Debug Information');
    
    try {
      // Print environment config
      console.log('📝 Environment Config:', {
        production: environment.production,
        firebase: environment.firebase
      });
      
      // Print Auth instance
      console.log('🔐 Auth Instance:', this.auth);
      console.log('🔐 Auth App:', this.auth.app);
      console.log('🔐 Auth Config:', this.auth.config);
      
      // Print current domain
      console.log('🌐 Current Domain:', window.location.origin);
      console.log('🌐 Current Host:', window.location.host);
      console.log('🌐 Current Protocol:', window.location.protocol);
      
      // Check if running on localhost
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.includes('localhost');
      
      console.log('🏠 Is Localhost:', isLocalhost);
      
      // Print authorized domains info
      console.log('✅ Common authorized domains that should be added:');
      console.log('   - localhost:8100 (default Ionic)');
      console.log('   - localhost:8105 (current port)');
      console.log('   - 127.0.0.1:8100');
      console.log('   - 127.0.0.1:8105');
      
      // Check Firebase project settings URL
      const projectId = environment.firebase.projectId;
      console.log(`🔧 Firebase Console URL: https://console.firebase.google.com/project/${projectId}/authentication/settings`);
      
    } catch (error) {
      console.error('❌ Error in Firebase debug:', error);
    }
    
    console.groupEnd();
  }

  /**
   * Test Firebase Auth connection
   */
  async testAuthConnection() {
    console.group('🧪 Testing Firebase Auth Connection');
    
    try {
      // Test current user
      const currentUser = this.auth.currentUser;
      console.log('👤 Current User:', currentUser);
      
      // Test auth state
      console.log('🔄 Auth State:', {
        currentUser: !!currentUser,
        isAnonymous: currentUser?.isAnonymous,
        email: currentUser?.email
      });
      
      // Test if auth is ready
      console.log('⏳ Waiting for auth ready...');
      await this.auth.authStateReady();
      console.log('✅ Auth is ready');
      
    } catch (error) {
      console.error('❌ Auth connection test failed:', error);
    }
    
    console.groupEnd();
  }

  /**
   * Print troubleshooting steps
   */
  printTroubleshootingSteps() {
    console.group('🛠️ Google Sign-In Troubleshooting Steps');
    
    console.log(`
📋 LANGKAH TROUBLESHOOTING GOOGLE SIGN-IN:

1. 🔧 Periksa Firebase Console:
   - Buka: https://console.firebase.google.com/project/${environment.firebase.projectId}/authentication/settings
   - Klik tab "Sign-in method"
   - Pastikan Google provider diaktifkan
   - Periksa "Authorized domains" di bagian bawah

2. 🌐 Tambahkan Domain yang Diotorisasi:
   - localhost (untuk development)
   - 127.0.0.1 (untuk development)
   - localhost:8100 (port default Ionic)
   - localhost:8105 (port saat ini)
   - ${window.location.host} (domain saat ini)

3. 🔑 Periksa API Key:
   - Pastikan API Key di environment.ts benar
   - API Key saat ini: ${environment.firebase.apiKey.substring(0, 10)}...

4. 🌍 Periksa Auth Domain:
   - Auth Domain: ${environment.firebase.authDomain}
   - Pastikan domain ini aktif di Firebase Hosting

5. 🔄 Jika masih error:
   - Clear browser cache dan cookies
   - Coba mode incognito
   - Restart development server
   - Periksa browser console untuk error detail

6. 📧 Error Common:
   - "unauthorized-domain": Domain belum ditambahkan di Firebase Console
   - "popup-blocked": Browser memblokir popup, coba redirect method
   - "operation-not-allowed": Google provider belum diaktifkan
    `);
    
    console.groupEnd();
  }
}
