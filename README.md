# Box Love PK - Premium E-commerce Store

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Management-purple?style=for-the-badge&logo=react)](https://github.com/pmndrs/zustand)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**Box Love PK** is a state-of-the-art e-commerce web application tailored for premium, handcrafted luxury gift boxes. Built using a modern full-stack architecture, it delivers a highly interactive, responsive, and secure shopping experience.

---

## 📸 Web App Screenshots

### 1. Hero & Customizer Page
A premium centered hero section and real-time customizer where users select color ink, write personalized text on box lids, configure hanging banners, and preview details dynamically.

![Hero & Customizer Showcase](./public/screenshots/hero.png)

### 2. Live Customizer Configuration
Step-by-step interactive customizer displaying options mutually exclusively to prevent logic conflicts, alongside the dynamic shopping cart summary.

![Live Box Builder Preview](./public/screenshots/builder.png)

### 3. Secure Admin Panel Vault
Passcode-locked administration console containing queue charts, sales stats, dynamic search filters, order status transition controllers, and actual box lid mockups.

![Secure Admin Control Vault](./public/screenshots/admin.png)

---

## 🚀 Key Features

*   **🔒 Secure Checkout**: Multi-layered validation workflow (HTML5 native constraints + client-side validation + server-side validation) protecting user information and preventing unauthorized checkouts.
*   **✨ Dynamic Product Grids**: Flexbox and CSS Grid designs crafted using Tailwind CSS that adapt fluidly between high-resolution monitors and mobile viewports.
*   **⚡ High PageSpeed Score**: Highly optimized asset delivery, automatic image formatting, and edge server-side rendering (SSR) ensuring page load speeds under 1.2s.
*   **🎨 Real-Time 2D Box Customizer**: High-performance React state management displaying metallic golden and silver ink renders of customer lettering in real-time.
*   **📊 Passcode-Protected Admin Vault**: Secure order management portal supporting search queries, status updates (Pending, Confirmed, Shipped, Cancelled), and order detail exports.

---

## 🛠️ Technology Stack

*   **Frontend**: Next.js App Router (React), Tailwind CSS (version 4) for responsive utility styling.
*   **State Management**: Zustand for clean, global client-side cart configurations and customization flows.
*   **Database ORM**: Prisma ORM facilitating schema validation and SQL queries.
*   **Database Engine**: Supabase (PostgreSQL) cloud hosting for high availability data storage.
*   **Deployment**: Vercel Serverless dynamic functions and CDN edge hosting.

---

## 💻 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18.0.0 or higher)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/your-username/boxlovepk.git
cd boxlovepk
npm install
```

### 3. Environment Variables Configuration
Create a `.env` (or `.env.local`) file in the root folder of the project and populate it with the following:
```env
# Database Credentials (Supabase PostgreSQL Connection String)
DATABASE_URL="postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres?schema=public"

# Admin Dashboard Access Passcode
ADMIN_PASSCODE="1234"
```

### 4. Running Migrations
Sync the Prisma schema with your Supabase PostgreSQL database:
```bash
npx prisma db push
```

### 5. Running the Development Server
Launch the local dev environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Folder Structure

```text
boxlovepk/
├── public/                 # Static assets (images, logos, screenshots)
├── src/
│   ├── app/                # Next.js App Router components & pages
│   │   ├── admin/          # Admin Dashboard Panel
│   │   ├── api/            # API Route Handlers (Orders, Admin gates)
│   │   ├── layout.tsx      # Root layout template
│   │   └── page.tsx        # Main storefront landing page
│   ├── lib/                # Database connections, helpers, and utilities
│   └── models/             # Prisma schema database models / typings
├── prisma/
│   └── schema.prisma       # Prisma database schema definition
├── .env.example            # Environment variables template
├── package.json            # Scripts and package dependencies
└── tsconfig.json           # TypeScript configuration
```

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
