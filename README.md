# IndoKerja.id - Frontend

Frontend aplikasi Job Application Management IndoKerja.id. Dibangun dengan React 19, TypeScript, Vite, dan shadcn/ui dengan desain Liquid Glass.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **UI Components:** shadcn/ui (base-nova style, @base-ui/react)
- **Styling:** Tailwind CSS 4
- **Routing:** react-router-dom 7
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** Sonner (toast)

## Fitur

- Autentikasi (Register/Login) dengan JWT
- Role-based UI (Job Seeker & Company)
- Browse & filter lowongan pekerjaan
- Apply lowongan dengan 1-click
- Status tracking lamaran
- Company dashboard (buat lowongan, kelola kandidat)
- Application history
- Liquid glass design (glassmorphism + gradient mesh)
- Responsive (mobile + desktop)
- Input error animation (shake + red glow)

## Persiapan

### Prerequisites

- Node.js >= 18

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment variable

Buat file `.env` di root frontend:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Jalankan development server

```bash
npm run dev
```

Buka `http://localhost:5173`

### 4. Build untuk production

```bash
npm run build
npm run preview
```

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run format       # Prettier format
```

## Struktur Project

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Navbar.tsx      # Glass navbar (responsive)
│   │   ├── JobCard.tsx     # Job card (glass style)
│   │   ├── StatusBadge.tsx # Application status badge
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── JobsPage.tsx          # Browse jobs + filter
│   │   ├── JobDetailPage.tsx     # Job detail + apply
│   │   ├── MyApplicationsPage.tsx # Job seeker applications
│   │   ├── CompanyJobsPage.tsx   # Company dashboard
│   │   └── JobCandidatesPage.tsx # Manage candidates
│   ├── lib/
│   │   ├── api.ts          # Axios instance + interceptors
│   │   └── auth-context.tsx # Auth state management
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces
│   ├── index.css           # Liquid glass theme + animations
│   ├── App.tsx             # React Router setup
│   └── main.tsx            # Entry point
├── components.json         # shadcn/ui config
├── vite.config.ts
└── package.json
```

## Design System

### Liquid Glass

Semua komponen menggunakan efek glass (glassmorphism):

- **Cards:** `bg-white/70 backdrop-blur-xl border-white/20`
- **Navbar:** `bg-white/60 backdrop-blur-24px` (sticky)
- **Background:** Gradient mesh (teal + purple)
- **Dark mode:** Support otomatis

### Input Error

Ketika form error:
- Input bergetar horizontal (shake animation)
- Border + shadow glow merah
- Error message di bawah input
- Hilang setelah 500ms atau user mulai typing ulang

### Skeleton Loading

Semua halaman menggunakan shimmer skeleton animation saat loading.

## Screenshots

### Job Seeker
- Browse Jobs: halaman utama dengan filter location & job type
- Job Detail: detail lowongan + tombol Apply
- My Applications: daftar lamaran + status

### Company
- My Jobs: daftar lowongan + form buat baru + hapus
- Candidates: daftar pelamar + ubah status + lihat history
