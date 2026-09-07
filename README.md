# SnapGallery — Collaborative Event Photo Sharing Platform

SnapGallery is a production-quality, full-stack collaborative platform built for photography teams and event managers. It enables Admin leads to create events and assign photographers, Team Members to upload high-resolution event photographs, Admins to curate and publish customer galleries with 6-digit BCrypt PIN protection, and Customers to securely browse published galleries via shareable URLs without needing an account.

---

## 🚀 Primary Features

### 🛡️ Admin Lead Experience
- **Account Management & Authentication:** JWT-authenticated registration and login.
- **Event Studio:** Create, edit, and manage multi-day event shoots with cover images and metadata.
- **Team Assignment:** Assign team photographers to specific events with backend authorization.
- **Photo Curation Studio:** Filter uploaded photos by photographer, perform bulk checkbox selections, select all/deselect all, and manage photo assets.
- **PIN-Protected Customer Galleries:** Create and publish galleries with secure 6-digit PIN hashing, custom descriptions, expiration dates, and auto-generated random public slugs (`/gallery/8f3k92ab`).

### 📸 Team Member (Photographer) Experience
- **Assigned Workspace:** View events explicitly assigned to the photographer.
- **Multi-File Upload Queue:** Drag-and-drop batch upload with real-time status tags, progress tracking, and retry/remove features.
- **Personal Upload Studio:** View and manage personal uploaded photographs.
- **Backend Role Security:** Strict permission enforcement preventing photographers from managing unauthorized events or publishing galleries.

### 🔐 Customer Gallery Experience
- **No-Registration Access:** Customers access private galleries via shareable public URLs (`/gallery/8f3k92ab`).
- **Interactive PIN Authentication:** Enter 6-digit access PIN verified against BCrypt hash on backend.
- **Short-Lived Access Sessions:** Successfully entering the PIN issues a short-lived `GallerySessionToken` (2h expiry).
- **Responsive High-Res Gallery:** Browse curated photographs in dynamic grid layouts with fullscreen Lightbox and full-resolution download support.
- **Strict Data Isolation:** Customers can NEVER access unpublished photos, internal event metadata, or other user accounts.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router v7, React Hook Form, Zod |
| **Backend** | Java 17, Spring Boot 3.4, Spring Security, Spring Data JPA, Hibernate, Jakarta Validation, JJWT (0.12.6), Lombok |
| **Database** | PostgreSQL (Production) / H2 (Local Development & Integration Testing) |
| **Object Storage** | AWS S3 SDK v2 (`software.amazon.awssdk:s3`) with Local Disk Fallback (`./uploads`) |
| **Testing** | JUnit 5, Spring Boot Test, MockMvc, Mockito |
| **DevOps & Containers** | Docker, Docker Compose |

---

## 📂 Repository Structure

```
scratch/
├── backend/                  # Spring Boot 3 Java Backend
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       ├── main/java/com/snapgallery/
│       │   ├── config/       # Security, WebMvc, CORS, DataSeeder
│       │   ├── security/     # JwtTokenProvider, JwtAuthFilter, UserPrincipal
│       │   ├── auth/         # AuthController, AuthService, DTOs
│       │   ├── user/         # User, UserRepository, UserService, TeamController
│       │   ├── event/        # Event, EventMember, EventController, EventService
│       │   ├── photo/        # Photo, PhotoController, PhotoService
│       │   ├── gallery/      # Gallery, GalleryPhoto, GalleryController, PublicGalleryController, GalleryService
│       │   ├── storage/      # StorageService, LocalStorageService
│       │   ├── common/       # ApiResponse, PageResponse
│       │   └── exception/    # GlobalExceptionHandler, ApiException
│       └── test/java/com/snapgallery/
│           ├── auth/         # AuthIntegrationTest
│           ├── security/     # SecurityAuthorizationTest
│           └── gallery/      # GallerySecurityTest
├── frontend/                 # React 19 + Vite + TypeScript Frontend
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── api/              # API Client & endpoint modules
│   │   ├── components/       # Navbar, Sidebar, UploadModal, Lightbox, PINModal
│   │   ├── contexts/         # AuthContext
│   │   ├── pages/            # Login, Register, AdminDashboard, EventDetail, PhotoReview, MemberDashboard, CustomerGallery
│   │   └── router/           # AppRouter with protected role routes
├── docs/                     # Technical Documentation
│   ├── architecture.md       # High-level architecture & sequence diagrams
│   ├── database.md           # ER Diagram & database constraints
│   └── api.md                # Full REST API endpoint reference
├── docker-compose.yml        # Docker Compose setup for PostgreSQL & Backend
├── .env.example              # Sample environment variables
└── README.md                 # Complete project documentation
```

---

## ⚡ Quick Start & Setup Guide

### 1. Prerequisites
- Java 17+
- Apache Maven 3.9+
- Node.js v18+ and npm

### 2. Run Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
*The backend starts on `http://localhost:8080` and automatically seeds demo accounts & sample event data!*

### 3. Run React Frontend
```bash
cd frontend
npm install
npm run dev
```
*The frontend starts on `http://localhost:5173`.*

---

## 🧪 Automated Testing

To run all backend unit and integration security tests (`AuthIntegrationTest`, `SecurityAuthorizationTest`, `GallerySecurityTest`):

```bash
cd backend
mvn test
```

*Results: 8 tests executed, 0 failures, 0 errors.*

---

## 🔑 Demo Accounts & Test Scenario

The application automatically seeds demo credentials on startup:

| Role | Email | Password | Allowed Scope |
|---|---|---|---|
| **Admin Lead** | `admin@snapgallery.demo` | `admin123` | Full access, event creation, team assignment, photo review, gallery publishing |
| **Team Member** | `rahul@snapgallery.demo` | `rahul123` | Assigned events, multi-photo upload queue, own uploads tracking |
| **Team Member** | `priya@snapgallery.demo` | `priya123` | Assigned events, photo upload |
| **Customer** | *No account needed* | PIN: `482917` | Public slug access (`/gallery/{slug}`) with 6-digit PIN verification |

---

## 🐳 Docker Deployment

To launch the entire stack (PostgreSQL + Spring Boot backend) using Docker Compose:

```bash
docker-compose up --build
```
