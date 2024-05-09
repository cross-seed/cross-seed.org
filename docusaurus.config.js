// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

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
    organizationName: "cross-seed", // Usually your GitHub org/user name.
    projectName: "cross-seed.org", // Usually your repo name.
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
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        "https://github.com/cross-seed/cross-seed.org/edit/master/",
                },
                // blog: {
                // 	showReadingTime: true,
                // 	// Please change this to your repo.
                // 	// Remove this to remove the "edit this page" links.
                // 	editUrl:
                // 		"https://github.com/cross-seed/cross-seed.org/edit/master/",
                // },
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
                logo: {
                    src: "img/cross-seed.svg",
                },
                items: [
                    //{
                    //  type: "doc",
                    //  docId: "basics/getting-started",
                    //  position: "left",
                    //  label: "Tutorial",
                    //},
                    {
                        to: "https://discord.gg/jpbUFzS5Wb",
                        label: "Discord",
                        className: "discord-link",
                        position: "right",
                    },
                    {
                        to: "https://github.com/cross-seed/cross-seed",
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
                                //className: "discord-link",
                            },
                        ],
                    },
                    {
                        title: "More",
                        items: [
                            {
                                label: "GitHub",
                                to: "https://github.com/cross-seed/cross-seed",
                                //className: "github-link",
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
