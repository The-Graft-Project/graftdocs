// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Graft Docs',
			customCss: ['./src/styles/custom.css'],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/skssmd/Graft' }],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'How Graft Works', slug: 'guides/how-it-works' },
						{ label: 'Installation', slug: 'install' },
						{ label: 'Deployment Modes', slug: 'guides/deployment-modes' },
					],
				},
				
				{
					label: 'Commands',
					items: [
						{ label: 'Initialization', slug: 'commands/initialization' },
						{ label: 'Post-Initialization', slug: 'commands/post-initialization' },
						{ label: 'Deployment', slug: 'commands/deployment' },
						{ label: 'Shared Postgres/Redis', slug: 'commands/infrastructure' },
						{ label: 'DNS', slug: 'commands/dns' },
						{ label: 'Deployment Mode', slug: 'commands/mode' },
						{ label: 'Host/Server Management', slug: 'commands/host-server' },
						{ label: 'Rollback', slug: 'commands/rollback' },
						{ label: 'Registry Management', slug: 'commands/registry' },
						{ label: 'Project Scope', slug: 'commands/project-scope' },
						{ label: 'Docker Compose Passthrough', slug: 'commands/docker-compose' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Request a Feature', link: 'https://github.com/skssmd/Graft/issues/new?labels=enhancement' },
						{ label: 'Submit an Issue', link: 'https://github.com/skssmd/Graft/issues/new?labels=bug' },
						{ label: 'Technical Reference', autogenerate: { directory: 'reference' } },
					],
				},
			],
		}),
	],
});
