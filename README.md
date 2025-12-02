# BookBoxd 📚

BookBoxd is a modern, full-stack web application for book lovers to track their reading journey, discover new books, and analyze their reading habits using AI. Built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

## ✨ Features

- **📚 Digital Bookshelf**: Track books you're reading, want to read, and have finished.
- **🤖 AI-Powered Analytics**: Get personalized insights into your reading personality, sentiment analysis of your reviews, and keyword extraction using Google Gemini AI.
- **🔍 Smart Search**: Search for books using the Open Library API with instant results.
- **👤 User Profiles**: Customizable profiles with avatars, bios, and reading stats.
- **💬 Reviews & Ratings**: Share your thoughts on books and rate them.
- **❝ Quotes Collection**: Save and manage your favorite book quotes.
- **📊 Interactive Charts**: Visualize your reading genres and progress.
- **🎨 Modern UI/UX**: Fully responsive design with dark mode support, glassmorphism effects, and smooth animations.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/) or similar)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Clerk](https://clerk.com/)
- **File Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **AI Integration**: [Google Gemini API](https://ai.google.dev/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A PostgreSQL database
- Clerk account for authentication
- Vercel account for Blob storage (optional, for avatars)
- Google AI Studio API Key

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/bookboxd.git
    cd bookboxd
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    # Database
    DATABASE_URL="postgresql://..."

    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
    CLERK_SECRET_KEY="sk_test_..."

    # Google Gemini AI
    GEMINI_API_KEY="AIza..."

    # Vercel Blob (for image uploads)
    BLOB_READ_WRITE_TOKEN="vercel_blob_..."

    # Development (Optional)
    # DEV_FAKE_USER_ID="user_..."
    ```

4.  **Initialize the Database**

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the Development Server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/              # Backend API endpoints (profile, books, AI, etc.)
│   ├── collections/      # Book collections page
│   ├── profile/          # User profile page
│   └── ...
├── components/           # Reusable UI components
│   ├── ui/               # Shadcn UI primitives (buttons, dialogs, etc.)
│   └── ...
├── lib/                  # Utility functions and shared logic
│   ├── prisma.ts         # Prisma client instance
│   └── utils.ts          # Helper functions
└── ...
prisma/
└── schema.prisma         # Database schema definition
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
