// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

const { themes } = require("prism-react-renderer");
const npm2yarn = require("@docusaurus/remark-plugin-npm2yarn");

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Portfolio Documentation",
  tagline: "Comprehensive documentation for Vishal Biyani's portfolio - Technical Program Management, Agile Methodologies, and Software Architecture",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://vishal.biyani.xyz",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/docs/",
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "biyani701", // Usually your GitHub org/user name.
  projectName: "portfolio", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // Add scripts to include on every page
  scripts: [
    {
      src: "/docs/js/docusaurus-router.js",
      async: false,
    },
    {
      src: "/docs/js/theme-init.js",
      async: false,
    },
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/biyani701/portfolio/tree/main/docs/",
          remarkPlugins: [[npm2yarn, { sync: true }]],
          sidebarCollapsible: true,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      colorMode: {
        defaultMode: "light",
        disableSwitch: true, // We're using our custom theme toggle
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: "Portfolio Docs",
        logo: {
          alt: "My Site Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Documentation",
          },
          { to: "https://vishal.biyani.xyz", label: "Main Site", position: "right" },
          {
            href: "https://github.com/biyani701/portfolio",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Documentation",
            items: [
              {
                label: "Introduction",
                to: "/intro",
              },
              {
                label: "Architecture",
                to: "/architecture/overview",
              },
              {
                label: "Libraries",
                to: "/libraries/mui",
              },
            ],
          },
          {
            title: "Policies",
            items: [
              {
                label: "Privacy Policy",
                to: "/policies/privacy-policy",
              },
              {
                label: "Terms of Use",
                to: "/policies/terms-of-use",
              },
              {
                label: "Security Policy",
                to: "/policies/security-policy",
              },
              {
                label: "Cookie Policy",
                to: "/policies/cookie-policy",
              },
            ],
          },
          {
            title: "Links",
            items: [
              {
                label: "Main Site",
                href: "https://vishal.biyani.xyz",
              },
              {
                label: "GitHub",
                href: "https://github.com/biyani701/portfolio",
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/vishalbiyani2/",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Vishal Biyani. All rights reserved.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: prismThemes.dracula,
      },
      mermaid: {
        theme: { light: "neutral", dark: "dark" },
      },
    }),
};

export default config;
