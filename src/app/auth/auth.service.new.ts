import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { 
  Auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc,
  docData
} from '@angular/fire/firestore';

export interface AppUser {
	uid: string;
	email: string;
	role?: 'admin' | 'user';
	displayName?: string;
	photoURL?: string;
	phoneNumber?: string;
	createdAt?: Date;
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private readonly loggedIn$ = new BehaviorSubject<boolean>(false);
	private currentUser: AppUser | null = null;
	private initialized = false;

	constructor(
		private auth: Auth,
		private firestore: Firestore,
		private router: Router
	) {
		console.log('AuthService initialized with Firebase');
		this.initializeAuth();
	}

	private initializeAuth() {
		// Firebase onAuthStateChanged listener
		onAuthStateChanged(this.auth, async (firebaseUser: User | null) => {
			if (firebaseUser) {
				// User is signed in
				const userData = await this.getUserData(firebaseUser.uid);
				this.currentUser = {
					uid: firebaseUser.uid,
					email: firebaseUser.email!,
					role: userData?.role || 'user',
					displayName: userData?.displayName || firebaseUser.displayName || undefined,
					createdAt: userData?.createdAt
				};
				this.loggedIn$.next(true);
				console.log('User authenticated:', this.currentUser.email);
			} else {
				// User is signed out
				this.currentUser = null;
				this.loggedIn$.next(false);
				console.log('User signed out');
			}
			this.initialized = true;
		});
	}

	// Get user data from Firestore
	private async getUserData(uid: string): Promise<AppUser | null> {
		try {
			const userDoc = doc(this.firestore, 'users', uid);
			const userSnap = await getDoc(userDoc);
			
			if (userSnap.exists()) {
				return userSnap.data() as AppUser;
			}
			return null;
		} catch (error) {
			console.error('Error getting user data:', error);
			return null;
		}
	}

	// Create user profile in Firestore
	private async createUserProfile(
		uid: string, 
		email: string, 
		role: 'admin' | 'user' = 'user',
		additionalData?: {
			displayName?: string;
			photoURL?: string;
			phoneNumber?: string;
		}
	): Promise<void> {
		try {
			const userDoc = doc(this.firestore, 'users', uid);
			const userData: AppUser = {
				uid,
				email,
				role,
				createdAt: new Date(),
				// Tambahkan data tambahan dari Google jika ada
				...(additionalData?.displayName && { displayName: additionalData.displayName }),
				...(additionalData?.photoURL && { photoURL: additionalData.photoURL }),
				...(additionalData?.phoneNumber && { phoneNumber: additionalData.phoneNumber })
			};
			
			await setDoc(userDoc, userData);
			console.log('User profile created in Firestore');
		} catch (error) {
			console.error('Error creating user profile:', error);
			throw error;
		}
	}

	/**
	 * Login dengan email dan password
	 */
	login(email: string, password: string): Observable<UserCredential> {
		console.log('Attempting email/password login for:', email);
		
		return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
			switchMap(async (result: UserCredential) => {
				const user = result.user;
				console.log('Email login successful:', user.email);
				
				// Cek apakah user sudah ada di Firestore
				const existingUserData = await this.getUserData(user.uid);
				
				if (!existingUserData) {
					// Buat profil user baru
					await this.createUserProfile(user.uid, user.email!, 'user');
				}
				
				return result;
			}),
			catchError((error) => {
				console.error('Login error:', error);
				// Handle specific error codes
				if (error.code === 'auth/user-not-found') {
					throw new Error('Email tidak terdaftar');
				} else if (error.code === 'auth/wrong-password') {
					throw new Error('Password salah');
				} else if (error.code === 'auth/invalid-email') {
					throw new Error('Format email tidak valid');
				} else if (error.code === 'auth/user-disabled') {
					throw new Error('Akun telah dinonaktifkan');
				} else if (error.code === 'auth/too-many-requests') {
					throw new Error('Terlalu banyak percobaan login. Silakan coba lagi nanti.');
				} else {
					throw new Error('Login gagal. Silakan coba lagi.');
				}
			})
		);
	}

	/**
	 * Register dengan email dan password
	 */
	register(email: string, password: string, role: 'admin' | 'user' = 'user'): Observable<UserCredential> {
		console.log('Attempting registration for:', email);
		
		return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
			switchMap(async (result: UserCredential) => {
				const user = result.user;
				console.log('Registration successful:', user.email);
				
				// Buat profil user di Firestore
				await this.createUserProfile(result.user.uid, email, role);
				
				return result;
			}),
			catchError((error) => {
				console.error('Registration error:', error);
				// Handle specific error codes
				if (error.code === 'auth/email-already-in-use') {
					throw new Error('Email sudah terdaftar');
				} else if (error.code === 'auth/invalid-email') {
					throw new Error('Format email tidak valid');
				} else if (error.code === 'auth/weak-password') {
					throw new Error('Password terlalu lemah');
				} else {
					throw new Error('Registrasi gagal. Silakan coba lagi.');
				}
			})
		);
	}

	/**
	 * Login dengan Google menggunakan popup dengan fallback ke redirect
	 */
	googleLogin(): Observable<UserCredential> {
		console.log('Attempting Google login...');
		
		const provider = new GoogleAuthProvider();
		// Tambahkan scope untuk mengakses profil pengguna
		provider.addScope('profile');
		provider.addScope('email');
		
		return from(signInWithPopup(this.auth, provider)).pipe(
			switchMap(async (result: UserCredential) => {
				const user = result.user;
				console.log('Google login successful:', user.email);
				
				// Cek apakah user sudah ada di Firestore
				const existingUserData = await this.getUserData(user.uid);
				
				if (!existingUserData) {
					// Buat profil user baru dengan data dari Google
					await this.createUserProfile(
						user.uid, 
						user.email!, 
						'user', // default role
						{
							displayName: user.displayName || undefined,
							photoURL: user.photoURL || undefined,
							phoneNumber: user.phoneNumber || undefined
						}
					);
				}
				
				// Return result untuk melanjutkan Observable chain
				return result;
			}),
			catchError((error) => {
				console.error('Google login error:', error);
				// Handle specific error codes
				if (error.code === 'auth/popup-closed-by-user') {
					throw new Error('Login dibatalkan oleh pengguna');
				} else if (error.code === 'auth/popup-blocked') {
					// Jika popup diblokir, gunakan redirect method
					console.log('Popup blocked, falling back to redirect method');
					return this.googleLoginRedirect();
				} else if (error.code === 'auth/network-request-failed') {
					throw new Error('Tidak ada koneksi internet. Periksa koneksi Anda.');
				} else {
					throw new Error('Login Google gagal. Silakan coba lagi.');
				}
			})
		);
	}

	/**
	 * Login dengan Google menggunakan redirect (fallback untuk popup yang diblokir)
	 */
	googleLoginRedirect(): Observable<UserCredential> {
		console.log('Using Google redirect login...');
		
		const provider = new GoogleAuthProvider();
		provider.addScope('profile');
		provider.addScope('email');
		
		// Redirect ke Google OAuth
		from(signInWithRedirect(this.auth, provider)).subscribe();
		
		// Kembalikan Observable yang akan resolve setelah redirect
		return from(getRedirectResult(this.auth)).pipe(
			filter(result => result !== null),
			switchMap(async (result: UserCredential) => {
				const user = result.user;
				console.log('Google redirect login successful:', user.email);
				
				// Cek apakah user sudah ada di Firestore
				const existingUserData = await this.getUserData(user.uid);
				
				if (!existingUserData) {
					// Buat profil user baru dengan data dari Google
					await this.createUserProfile(
						user.uid, 
						user.email!, 
						'user',
						{
							displayName: user.displayName || undefined,
							photoURL: user.photoURL || undefined,
							phoneNumber: user.phoneNumber || undefined
						}
					);
				}
				
				return result;
			}),
			catchError((error) => {
				console.error('Google redirect login error:', error);
				throw new Error('Login Google dengan redirect gagal. Silakan coba lagi.');
			})
		);
	}

	logout(): Observable<void> {
		console.log('Attempting to logout user');
		
		return from(signOut(this.auth)).pipe(
			map(() => {
				console.log('User logged out successfully');
			}),
			catchError((error) => {
				console.error('Logout error:', error);
				throw error;
			})
		);
	}

	isLoggedIn(): boolean {
		const loggedIn = this.loggedIn$.getValue();
		console.log('Checking if user is logged in:', loggedIn);
		return loggedIn;
	}

	getCurrentUser(): AppUser | null {
		console.log('Getting current user:', this.currentUser);
		return this.currentUser;
	}

	getCurrentUserRole(): 'admin' | 'user' | undefined {
		return this.currentUser?.role;
	}

	async checkAuthAndRedirect(): Promise<void> {
		// Wait for auth initialization
		while (!this.initialized) {
			await new Promise(resolve => setTimeout(resolve, 100));
		}
		
		if (!this.isLoggedIn()) {
			console.log('User not authenticated, redirecting to login');
			this.router.navigate(['/login']);
		}
	}

	// Observable untuk subscribe ke auth state changes
	get authState$(): Observable<boolean> {
		return this.loggedIn$.asObservable();
	}
}
