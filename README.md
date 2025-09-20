# 📚 AI-Powered Book Review Platform

An AI-enhanced book discovery and review platform built with **Next.js**, **Prisma**, and **Neon (Postgres + pgvector)**.  
Users can post reviews, see AI-generated summaries, and get personalized book recommendations powered by embeddings.

---

## 🚀 Features
- ✅ User accounts with profile & avatar  
- ✅ Add books (title, author, genre, cover)  
- ✅ Write reviews with ratings  
- ✅ AI-generated review summaries & tones  
- ✅ Semantic book recommendations (pgvector + embeddings)  
- ✅ Analytics dashboard (top books, trending genres, most loved)  

---

## 🛠️ Tech Stack
- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router)  
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)  
- **Database**: [Neon Postgres](https://neon.tech) (with `pgvector` for embeddings)  
- **ORM**: [Prisma](https://www.prisma.io/)  
- **AI Models**:
  - VLM: [Moondream2](https://huggingface.co/vikhyatk/moondream2) / BLIP-2 (extract book info from covers)  
  - Summarization: [Llama-3 Instruct](https://huggingface.co/meta-llama) or GPT-4o-mini  
  - Embeddings: [SentenceTransformers all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)  
  - Fake Review Detection (optional): [RoBERTa Fake Review Detector](https://huggingface.co/voidful/roberta-fake-review-detection)  

---

## 📂 Project Structure
