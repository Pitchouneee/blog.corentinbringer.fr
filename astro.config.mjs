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
					items: [
						{
							label: 'Design Patterns',
							autogenerate: { directory: 'architecture_logicielle/design_patterns' },
						},
						{
							label: 'Microservices',
							autogenerate: { directory: 'architecture_logicielle/microservices' },
						},
					],
				},
				{
					label: 'DevOps',
					items: [
						{
							label: 'Conteneurisation',
							autogenerate: { directory: 'devops/conteneurisation' },
						},
					],
					// autogenerate: { directory: 'devops' },
				},
				{
					label: 'Pentest',
					items: [
						{
							label: 'Web client',
							autogenerate: { directory: 'pentest/web_client' },
						},
						{
							label: 'Web serveur',
							autogenerate: { directory: 'pentest/web_serveur' },
						},
						{
							label: 'Stéganographie',
							autogenerate: { directory: 'pentest/steganographie' },
						},
						{
							label: 'Réseau',
							autogenerate: { directory: 'pentest/reseau' },
						},
					],
				},
				{
					label: 'Snippets',
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
