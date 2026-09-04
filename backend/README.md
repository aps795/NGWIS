# NGWIS Official School Backend API

Official REST API backend for **New Global Wisdom International School (NGWIS)**, Saidpur, Ghazipur, Uttar Pradesh.

Provides institutional backend services for:
- 🔐 **Administrative Authentication & 2-Step Verification (2FA / OTP)**
- 📝 **Admission Enquiries Management & Tracking ID Generation (`ENQ-XXXXXX`)**
- 📢 **Notice Board & Circular Publishing**
- 📅 **Upcoming Events Scheduling**
- ✉️ **Contact Form Message Ingestion**
- 🗄️ **Zero-Config Persistent Storage (Thread-safe JSON Store)**

---

## 📋 API Endpoints Reference

### Public Endpoints (No Authentication Required)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API service status & institutional metadata |
| `GET` | `/api/health` | Health check endpoint (for Render / Uptime monitors) |
| `POST` | `/api/auth/login` | Step 1: Admin / IT email & password login (triggers 2FA OTP) |
| `POST` | `/api/auth/verify-2fa` | Step 2: Verify 6-digit OTP passcode & receive JWT token |
| `POST` | `/api/enquiries` | Submit online admission application (generates `ENQ-XXXXXX`) |
| `GET` | `/api/notices` | Retrieve published school notices and circulars |
| `GET` | `/api/events` | Retrieve upcoming institutional events |
| `POST` | `/api/contact` | Submit message from Contact Us form |

### Protected Endpoints (`Authorization: Bearer <token>` required)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/auth/me` | Check active session identity & permissions |
| `POST` | `/api/auth/logout` | Invalidate active session |
| `GET` | `/api/enquiries` | List all admission enquiries (supports `?status=...`) |
| `PATCH` | `/api/enquiries/:id` | Update enquiry status (*Contacted, Enrolled, Archived*) & notes |
| `DELETE` | `/api/enquiries/:id` | Delete admission application |
| `POST` | `/api/notices` | Publish new official school notice |
| `PUT` | `/api/notices/:id` | Update notice title, category, or publish status |
| `DELETE` | `/api/notices/:id` | Remove notice |
| `POST` | `/api/events` | Schedule new school event |
| `DELETE` | `/api/events/:id` | Cancel/delete school event |
| `GET` | `/api/contact` | Review messages submitted from contact page |

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` or set these keys in Render / Vercel:

| Key | Example / Default | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for server binding (Render automatically provides this) |
| `NODE_ENV` | `production` | Environment mode (`development` / `production`) |
| `JWT_SECRET` | `your_strong_random_secret_string` | Secret key used to sign and verify JWT session tokens |
| `JWT_EXPIRES_IN` | `2h` | Session token lifespan (e.g., `2h`, `1d`) |
| `MASTER_2FA_CODE` | `201608` | Emergency institutional fallback 2FA code |
| `OTP_EXPIRY_SECONDS`| `300` | Expiration window for generated OTPs (in seconds) |
| `ALLOWED_ORIGINS` | `http://localhost:5173,https://aps795.github.io` | Comma-separated list of allowed frontend origins |

---

## 💻 Local Development

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment file:
   ```bash
   cp .env.example .env
   ```
4. Start development server with hot-reload:
   ```bash
   npm run dev
   ```
   The server will start at `http://localhost:5000`.

---

## 🚀 Deploying to Render (Recommended)

1. Sign in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → Select **Web Service**.
3. Connect your GitHub repository (`NGWIS`).
4. Configure the Web Service settings:
   - **Name**: `ngwis-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Click **Advanced** → Under **Health Check Path**, enter:
   ```
   /api/health
   ```
6. Add the following **Environment Variables**:
   ```env
   NODE_ENV = production
   JWT_SECRET = your_generated_secret_key
   MASTER_2FA_CODE = 201608
   ALLOWED_ORIGINS = https://aps795.github.io,http://localhost:5173
   ```
7. Click **Create Web Service**.
   Render will deploy your backend at `https://ngwis-backend.onrender.com`.

---

## ▲ Deploying to Vercel (Serverless)

1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New...** → **Project** → Select `NGWIS`.
3. Configure project settings:
   - **Root Directory**: `backend`
   - **Framework Preset**: `Other`
4. Under **Environment Variables**, add:
   ```env
   NODE_ENV = production
   JWT_SECRET = your_generated_secret_key
   MASTER_2FA_CODE = 201608
   ALLOWED_ORIGINS = https://aps795.github.io
   ```
5. Click **Deploy**.
   Vercel will deploy serverless endpoints using `vercel.json` and `api/index.js`.

---

## 🔗 Connecting Frontend to Backend

In your frontend root `.env` or deployment variables:
```env
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api
```
The frontend will immediately route all admissions, notices, events, and admin authentication requests through this backend API!
