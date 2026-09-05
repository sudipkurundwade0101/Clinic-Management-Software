# 🩺 Clinic Management System - Backend API Server

A Node.js + Express + TypeScript + MongoDB REST API server powering the Clinic Management System.

---

## 🚀 Tech Stack

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js
- **Language**: TypeScript (ES Modules, NodeNext)
- **Database**: MongoDB with Mongoose ODM
- **Security & Utils**: Helmet, CORS, Morgan (HTTP request logger), Dotenv, Zod

---

## 📁 Directory Structure

```
server/
├── .env.example            # Environment variables template
├── .env                    # Local environment variables
├── package.json
├── tsconfig.json
├── dist/                   # Compiled JavaScript output
└── src/
    ├── config/
    │   └── db.ts           # MongoDB connection handler with Mongoose
    ├── models/             # Mongoose Schemas and Models
    │   ├── Patient.ts
    │   ├── Consultation.ts
    │   ├── Prescription.ts
    │   └── Bill.ts
    ├── controllers/        # Express Route Controllers
    │   ├── patientController.ts
    │   ├── consultationController.ts
    │   ├── prescriptionController.ts
    │   ├── billingController.ts
    │   └── statsController.ts
    ├── routes/             # Express API Route Definitions
    │   ├── patientRoutes.ts
    │   ├── consultationRoutes.ts
    │   ├── prescriptionRoutes.ts
    │   ├── billingRoutes.ts
    │   ├── statsRoutes.ts
    │   └── index.ts        # Master router with /api/health check
    ├── middleware/
    │   └── errorHandler.ts # Centralized JSON error handling
    ├── seed/
    │   └── seedData.ts     # Initial seed dataset (10 Indian patients, consultations, prescriptions)
    ├── scripts/
    │   └── seed.ts         # Database seeder script
    ├── app.ts              # Express App setup & middleware
    └── server.ts           # HTTP server listener and DB initializer
```

---

## ⚙️ Setup & Installation

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create `.env` (a default `.env` is already configured):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/clinic_management
CLIENT_URL=http://localhost:5173
```

### 3. Seed Mock Database (Optional)

```bash
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be live at `http://localhost:5000`.

---

## 📡 API Endpoints

### 🩺 Health & System
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root service status and available routes |
| `GET` | `/api/health` | Service health check |

### 👤 Patients (`/api/patients`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/patients` | Get all patients (supports `?search=` and `?status=`) |
| `GET` | `/api/patients/:id` | Get patient details by ID (e.g. `PAT-2026-1001`) |
| `POST` | `/api/patients` | Register a new patient |
| `PUT` | `/api/patients/:id` | Update patient record |
| `DELETE` | `/api/patients/:id` | Remove patient record |

### 📋 Consultations (`/api/consultations`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/consultations` | Get all consultations (supports `?patientId=`) |
| `GET` | `/api/consultations/:id` | Get consultation by ID (e.g. `CON-001`) |
| `POST` | `/api/consultations` | Record a new consultation (auto-updates patient `lastVisit`) |
| `PUT` | `/api/consultations/:id` | Update consultation details |
| `DELETE` | `/api/consultations/:id` | Delete consultation |

### 💊 Prescriptions (`/api/prescriptions`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/prescriptions` | Get all prescriptions (supports `?patientId=` and `?consultationId=`) |
| `GET` | `/api/prescriptions/:id` | Get prescription by ID (e.g. `RX-001`) |
| `POST` | `/api/prescriptions` | Create and issue prescription (auto-links to consultation) |
| `PUT` | `/api/prescriptions/:id` | Update existing prescription |
| `DELETE` | `/api/prescriptions/:id` | Delete prescription |

### 💳 Billing (`/api/billing`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/billing` | Get all bills (supports `?patientId=` and `?status=`) |
| `GET` | `/api/billing/:id` | Get invoice by ID |
| `POST` | `/api/billing` | Generate invoice |
| `PUT` | `/api/billing/:id` | Update payment status / amount |
| `DELETE` | `/api/billing/:id` | Delete invoice |

### 📊 Stats (`/api/stats`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/stats/dashboard` | Aggregated dashboard overview metrics |

---

## 🛠 Available NPM Scripts

- `npm run dev`: Starts the TypeScript server in watch mode using `tsx`.
- `npm run build`: Compiles TypeScript files to the `dist/` directory.
- `npm start`: Runs the compiled production server (`node dist/server.js`).
- `npm run seed`: Seeds the MongoDB database with initial sample data.
