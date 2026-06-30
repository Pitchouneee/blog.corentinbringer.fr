// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import mermaid from 'astro-mermaid';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.corentinbringer.fr',
	integrations: [
		starlight({
			plugins: [
				starlightBlog({
					title: 'Section blog',
					postCount: 5,
					recentPostCount: 5,
					metrics: { readingTime: true },
					authors: {
						corentin: {
							name: 'Corentin Bringer',
							url: 'https://blog.corentinbringer.fr',
						},
					},
				}),
			],
			title: 'arch.log | Corentin BRINGER',
			defaultLocale: 'root',
			locales: {
				root: { label: 'Français', lang: 'fr' },
			},
			head: [
				// Charger le script gtag.js
				{
					tag: 'script',
					attrs: {
						async: true,
						src: 'https://www.googletagmanager.com/gtag/js?id=G-4MDJ9HQJVN'
					},
				},
				// Initialiser Google Analytics
				{
					tag: 'script',
					content: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-4MDJ9HQJVN');
					`,
				},
			],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Pitchouneee' }],
			sidebar: [
				{
					label: 'Architecture logicielle',
					collapsed: true,
					items: [
						{
							label: 'Design Patterns',
							collapsed: true,
							items: [{ autogenerate: { directory: 'architecture_logicielle/design_patterns' } }],
						},
						{
							label: 'Microservices',
							collapsed: true,
							items: [{ autogenerate: { directory: 'architecture_logicielle/microservices' } }],
						},
					],
				},
				{
					label: 'DevOps',
					collapsed: true,
					items: [
						{
							label: 'Conteneurisation',
							collapsed: true,
							items: [{ autogenerate: { directory: 'devops/conteneurisation' } }],
						},
					],
				},
				{
					label: 'Pentest',
					collapsed: true,
					items: [
						{
							label: 'Web client',
							collapsed: true,
							items: [{ autogenerate: { directory: 'pentest/web_client' } }],
						},
						{
							label: 'Web serveur',
							collapsed: true,
							items: [{ autogenerate: { directory: 'pentest/web_serveur' } }],
						},
						{
							label: 'Cryptographie',
							collapsed: true,
							items: [{ autogenerate: { directory: 'pentest/crypto' } }],
						},
						{
							label: 'Stéganographie',
							collapsed: true,
							items: [{ autogenerate: { directory: 'pentest/steganographie' } }],
						},
						{
							label: 'Réseau',
							collapsed: true,
							items: [{ autogenerate: { directory: 'pentest/reseau' } }],
						},
						{
							label: 'Infrastructure',
							collapsed: true,
							items: [{ autogenerate: { directory: 'pentest/infrastructure' } }],
						},
						{
							label: 'Forensic',
							collapsed: true,
							items: [{ autogenerate: { directory: 'pentest/forensic' } }],
						},
						{
							label: 'Reverse',
							collapsed: true,
							items: [{ autogenerate: { directory: 'pentest/reverse' } }],
						},
						{
							label: 'Système',
							collapsed: true,
							items: [{ autogenerate: { directory: 'pentest/systeme' } }],
						},
						{ slug: 'pentest/ressources' },
					],
				},
				{
					label: 'Intelligence Artificielle',
					collapsed: true,
					items: [
						{
							label: 'Fondamentaux',
							collapsed: true,
							items: [{ autogenerate: { directory: 'intelligence_artificielle/fondamentaux' } }],
						},
						{
							label: 'Machine Learning',
							collapsed: true,
							items: [{ autogenerate: { directory: 'intelligence_artificielle/machine_learning' } }],
						},
						{
							label: 'Python et données',
							collapsed: true,
							items: [{ autogenerate: { directory: 'intelligence_artificielle/python_data' } }],
						},
					],
				},
				{
					label: 'Snippets',
					collapsed: true,
					items: [{ autogenerate: { directory: 'snippets' } }],
				},
			],
			customCss: [
				'./src/styles/custom.css',
			],
		}),
		mermaid(),
		sitemap()
	],
});
