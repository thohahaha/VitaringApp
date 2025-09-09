import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'get-started',
		pathMatch: 'full',
	},
	{
		path: 'get-started',
		loadComponent: () => import('./get-started/get-started.page').then((m) => m.GetStartedPage)
	},
	{
		path: 'home',
		loadComponent: () => import('./home/home.page').then((m) => m.HomePage)
	},
	{
		path: 'news',
		loadComponent: () => import('./news/news.page').then((m) => m.NewsPage)
	},
	{
		path: 'news/:id',
		loadComponent: () => import('./news-detail/news-detail.page').then((m) => m.NewsDetailPage)
	},
	{
		path: 'forum',
		loadComponent: () => import('./forum/forum.page').then((m) => m.ForumPage)
	},
	{
		path: 'forum/:id',
		loadComponent: () => import('./post-detail/post-detail.page').then((m) => m.PostDetailPage)
	},
	{
		path: 'post-detail/:id',
		loadComponent: () => import('./post-detail/post-detail.page').then((m) => m.PostDetailPage)
	},
	{
		path: 'create-post',
		loadComponent: () => import('./create-post/create-post.page').then((m) => m.CreatePostPage)
	},
	{
		path: 'login',
		loadComponent: () => import('./login/login.page').then((m) => m.LoginPage)
	},
	{
		path: 'register',
		loadComponent: () => import('./register/register.page').then((m) => m.RegisterPage)
	},
	{
		path: 'privacy-policy',
		loadComponent: () => import('./privacy-policy/privacy-policy.page').then((m) => m.PrivacyPolicyPage)
	},
	{
		path: 'faq',
		loadComponent: () => import('./faq/faq.page').then((m) => m.FaqPage)
	},
	{
		path: 'about-app',
		loadComponent: () => import('./about-app/about-app.page').then((m) => m.AboutAppPage)
	},
	{
		path: 'profile',
		loadComponent: () => import('./profile/profile.page').then((m) => m.ProfilePage)
	},
	{
		path: 'perangkat',
		loadComponent: () => import('./perangkat/perangkat.page').then((m) => m.PerangkatPage)
	},
	{
		path: 'performa',
		loadComponent: () => import('./performa/performa.page').then((m) => m.PerformaPage)
	},
	{
		path: 'edit-profile',
		loadComponent: () => import('./edit-profile/edit-profile.page').then((m) => m.EditProfilePage)
	},
	{
		path: 'privacy',
		loadComponent: () => import('./privacy/privacy.page').then((m) => m.PrivacyPage)
	},
	{
		path: 'help-center',
		loadComponent: () => import('./help-center/help-center.page').then((m) => m.HelpCenterPage)
	},
	{
		path: 'about',
		loadComponent: () => import('./about/about.page').then((m) => m.AboutPage)
	},
	{
		path: 'ai-chat',
		loadComponent: () => import('./ai-chat/ai-chat.page').then((m) => m.AiChatPage)
	},
	{
		path: '**',
		redirectTo: 'get-started'
	}
];
