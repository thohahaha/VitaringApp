import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
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
  signInWithRedirect
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

	// Firebase onAuthStateChanged Promise wrapper
	onAuthStateChanged(): Promise<AppUser | null> {
		return new Promise((resolve) => {
			if (this.initialized) {
				resolve(this.currentUser);
			} else {
				// Wait for auth to initialize
				const unsubscribe = onAuthStateChanged(this.auth, async (firebaseUser) => {
					if (firebaseUser) {
						const userData = await this.getUserData(firebaseUser.uid);
						const user: AppUser = {
							uid: firebaseUser.uid,
							email: firebaseUser.email!,
							role: userData?.role || 'user',
							displayName: userData?.displayName || firebaseUser.displayName || undefined,
							createdAt: userData?.createdAt
						};
						resolve(user);
					} else {
						resolve(null);
					}
					unsubscribe();
				});
			}
		});
	}

	get authState$(): Observable<boolean> {
		return this.loggedIn$.asObservable();
	}

	register(email: string, password: string, role: 'admin' | 'user' = 'user'): Observable<UserCredential> {
		console.log('Attempting to register user:', email);
		
		return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
			switchMap(async (result: UserCredential) => {
				// Create user profile in Firestore
				await this.createUserProfile(result.user.uid, email, role);
				console.log('User registered successfully:', result.user.email);
				return result;
			}),
			catchError((error) => {
				console.error('Registration error:', error);
				throw error;
			})
		);
	}

	login(email: string, password: string): Observable<UserCredential> {
		console.log('Attempting to login user:', email);
		
		return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
			map((result: UserCredential) => {
				console.log('User logged in successfully:', result.user.email);
				return result;
			}),
			catchError((error) => {
				console.error('Login error:', error);
				throw error;
			})
		);
	}

	/**
	 * Login dengan Google menggunakan popup
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
					throw new Error('Popup diblokir browser. Silakan izinkan popup untuk situs ini.');
				} else if (error.code === 'auth/network-request-failed') {
					throw new Error('Tidak ada koneksi internet. Periksa koneksi Anda.');
				} else {
					throw new Error('Login Google gagal. Silakan coba lagi.');
				}
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
		return this.currentUser;
	}

	getCurrentUserRole(): 'admin' | 'user' | undefined {
		return this.currentUser?.role;
	}

	// Helper method to check auth state and redirect accordingly
	async checkAuthAndRedirect(): Promise<void> {
		const user = await this.onAuthStateChanged();
		if (user) {
			console.log('User is authenticated, redirecting to home');
			this.router.navigate(['/home']);
		} else {
			console.log('User is not authenticated, staying on current page');
		}
	}

	// Get current Firebase user
	getCurrentFirebaseUser(): User | null {
		return this.auth.currentUser;
	}

	// Update user profile
	async updateUserProfile(updates: Partial<AppUser>): Promise<void> {
		try {
			if (!this.currentUser) throw new Error('No user logged in');
			
			const userDoc = doc(this.firestore, 'users', this.currentUser.uid);
			await setDoc(userDoc, updates, { merge: true });
			
			// Update local user data
			this.currentUser = { ...this.currentUser, ...updates };
			console.log('User profile updated successfully');
		} catch (error) {
			console.error('Error updating user profile:', error);
			throw error;
		}
	}
}
