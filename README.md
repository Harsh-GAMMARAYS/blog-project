# Blog Project

A full-stack blog application built with Next.js, Node.js, GraphQL, and MongoDB.

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tech Stack

### Backend
- Node.js + Express
- Apollo Server (GraphQL)
- MongoDB + Mongoose
- JWT Authentication

### Frontend
- Next.js 13+
- Apollo Client
- Tailwind CSS
- React Markdown

## Core Features

### Blog Features
- 📝 Markdown & Plain Text Support
- 👤 Author Attribution
- 📅 Creation Timestamps
- 📱 Responsive Design
- 🔄 Real-time Preview

### API Features
- GraphQL API with:
  - Post CRUD Operations
  - Format Support (PLAIN/MARKDOWN)
  - Date Scalar Type
  - Error Handling

## Project Structure

```
blog-project/
├── frontend/          # Next.js frontend
│   ├── pages/        # Route pages
│   ├── components/   # React components
│   └── styles/       # Tailwind CSS
└── backend/          # Node.js backend
    ├── src/          # Source code
    │   ├── schema/   # GraphQL schema
    │   ├── models/   # Mongoose models
    │   └── config/   # Configuration
    └── scripts/      # Utility scripts
```

## Frontend Routes
```
/                   # Home page (redirects to /blog)
/blog              # Blog listing
/blog/[id]         # Single post view
/blog/create       # Create new post
/blog/edit/[id]    # Edit existing post
```

## Deployment

### Backend (EC2)
1. Launch EC2 instance
2. Install dependencies:
   ```bash
   sudo apt update
   sudo apt install nodejs nginx
   ```
3. Deploy with PM2:
   ```bash
   pm2 start src/index.js
   pm2 save
   ```
4. Configure Nginx & SSL:
   ```bash
   sudo certbot --nginx -d blog-project-be.mooo.com
   ```


### Monitoring
```bash
# Check services
pm2 list
sudo systemctl status nginx

# View logs
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

### Updates
```bash
# System updates
sudo apt update && sudo apt upgrade

