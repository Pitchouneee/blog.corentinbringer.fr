// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.corentinbringer.fr',
	integrations: [
		starlight({
			title: 'arch.log | Corentin BRINGER',
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
				// {
				// 	label: 'Guides',
				// 	items: [
				// 		// Each item here is one entry in the navigation menu.
				// 		{ label: 'Example Guide', slug: 'guides/example' },
				// 	],
				// },
				{
					label: 'Architecture logicielle',
					collapsed: true,
					items: [
						{
							label: 'Design Patterns',
							collapsed: true,
							autogenerate: { directory: 'architecture_logicielle/design_patterns' },
						},
						{
							label: 'Microservices',
							collapsed: true,
							autogenerate: { directory: 'architecture_logicielle/microservices' },
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
							autogenerate: { directory: 'devops/conteneurisation' },
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
							autogenerate: { directory: 'pentest/web_client' },
						},
						{
							label: 'Web serveur',
							collapsed: true,
							autogenerate: { directory: 'pentest/web_serveur' },
						},
						{
							label: 'Cryptographie',
							collapsed: true,
							autogenerate: { directory: 'pentest/crypto' },
						},
						{
							label: 'Stéganographie',
							collapsed: true,
							autogenerate: { directory: 'pentest/steganographie' },
						},
						{
							label: 'Réseau',
							collapsed: true,
							autogenerate: { directory: 'pentest/reseau' },
						},
						{
							label: 'Infrastructure',
							collapsed: true,
							autogenerate: { directory: 'pentest/infrastructure' },
						},
						{
							label: 'Forensic',
							collapsed: true,
							autogenerate: { directory: 'pentest/forensic' },
						},
						{
							label: 'Reverse',
							collapsed: true,
							autogenerate: { directory: 'pentest/reverse' },
						},
						{
							label: 'Système',
							collapsed: true,
							autogenerate: { directory: 'pentest/systeme' },
						},
						{ label: 'Ressources', slug: 'pentest/ressources' },
					],
				},
				{
					label: 'Snippets',
					collapsed: true,
					autogenerate: { directory: 'snippets' },
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
