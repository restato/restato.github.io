# 🚀 Restato Blog

Claude와 함께하는 개발 일지 - Vibe Coding으로 배우고 만드는 것들

## 🛠 Tech Stack

- **Framework**: [Astro](https://astro.build) 5
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Content**: MDX
- **Interactive**: React (Islands)
- **Deployment**: GitHub Pages

## 📁 Structure

```
src/
├── content/
│   └── blog/          # Blog posts (MDX)
├── pages/
│   ├── index.astro    # Home
│   ├── blog/          # Blog list & detail
│   ├── projects/      # Projects showcase
│   └── about.astro    # About page
├── components/        # Reusable components
└── layouts/           # Page layouts
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

## 📝 Adding Blog Posts

Create a new `.mdx` file in `src/content/blog/`:

```mdx
---
title: "Post Title"
description: "Post description"
date: 2025-01-13
tags: ["tag1", "tag2"]
---

Your content here...
```

## 🔗 Links

- **Live Site**: https://restato.github.io
- **GitHub**: https://github.com/restato

---

Built with ❤️ and Claude
