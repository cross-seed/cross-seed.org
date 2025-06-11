// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer").themes.github;
const darkCodeTheme = require("prism-react-renderer").themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: "cross-seed",
	tagline: "Fully-automatic cross-seeding",
	url: "https://cross-seed.org",
	baseUrl: "/",
	onBrokenLinks: "throw",
	onBrokenMarkdownLinks: "warn",
	favicon: "img/favicon.ico",

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: "cross-seed",
	projectName: "cross-seed.org",
	deploymentBranch: "dist",
	trailingSlash: false,

	// Even if you don't use internalization, you can use this field to set useful
	// metadata like html lang. For example, if your site is Chinese, you may want
	// to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: "en",
		locales: ["en"],
	},

	presets: [
		[
			"classic",
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					sidebarPath: require.resolve("./sidebars.js"),
					sidebarCollapsed: false,
					editUrl:
						"https://github.com/cross-seed/cross-seed.org/edit/master/",
				},
				theme: {
					customCss: require.resolve("./src/css/custom.css"),
				},
			}),
		],
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			colorMode: {
				defaultMode: "light",
				disableSwitch: false,
				respectPrefersColorScheme: true,
			},
			navbar: {
				title: "cross-seed",
				logo: { src: "img/cross-seed.svg" },
				items: [
					{
						type: "doc",
						docId: "basics/getting-started",
						position: "left",
						label: "Documentation",
					},
					{
						href: "https://old.reddit.com/r/crossseed/comments/1l8x300/welcome_to_crossseed/",
						label: "Reddit",
						className: "reddit-link",
						position: "right",
					},
					{
						href: "https://old.reddit.com/crossseed/",
						label: "Discord",
						className: "discord-link",
						position: "right",
					},
					{
						href: "https://github.com/cross-seed/cross-seed",
						label: "GitHub",
						className: "github-link",
						position: "right",
					},
				],
			},
			footer: {
				style: "dark",
				links: [
					{
						title: "Docs",
						items: [
							{
								label: "Tutorial",
								to: "/docs/basics/getting-started",
							},
						],
					},
					{
						title: "Community",
						items: [
							{
								label: "Discord",
								to: "https://discord.gg/jpbUFzS5Wb",
								className: "discord-link",
							},
						],
					},
					{
						title: "More",
						items: [
							{
								label: "GitHub",
								to: "https://github.com/cross-seed/cross-seed",
								className: "github-link",
							},
						],
					},
				],
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme,
			},
		}),
	markdown: {
		mermaid: true,
	},
	themes: [
		"@docusaurus/theme-mermaid",
		[
			require.resolve("@easyops-cn/docusaurus-search-local"),
			{ hashed: true },
		],
	],
};

module.exports = config;
