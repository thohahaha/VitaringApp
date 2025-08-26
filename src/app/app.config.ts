import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideAnimations } from '@angular/platform-browser/animations';

// Import untuk Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth'; // Ensure this is present
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics'; // Ensure this is present

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes, withComponentInputBinding()),
		provideIonicAngular({ mode: 'md' }),
		provideAnimations(),

		// Provider Firebase: Pastikan ini menggunakan environment.firebase dan menyertakan semua layanan yang dibutuhkan
		provideFirebaseApp(() => initializeApp(environment.firebase)),
		provideFirestore(() => getFirestore()),
		provideStorage(() => getStorage()),
		provideAuth(() => getAuth()), // Copilot: Verify this provider is correctly included
		provideAnalytics(() => getAnalytics()), // Copilot: Verify this provider is correctly included
	]
};
