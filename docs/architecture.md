# Architecture & System Design — SnapGallery

SnapGallery is designed following a clean multi-tier architecture, separating client presentation, REST APIs, business services, database persistence, and object storage.

---

## 1. High-Level System Architecture

```mermaid
graph TD
    subgraph Client Presentation Layer
        Admin[Admin Lead / Photographer Dashboard] -->|JWT Auth Header| Gateway[Spring Boot REST API]
        Customer[Customer Browser] -->|Public Slug + Session Token| Gateway
    end

    subgraph Backend Application Layer
        Gateway --> SecurityFilter[Spring Security & JWT Filter]
        SecurityFilter --> Controllers[REST Controllers thin layer]
        Controllers --> Services[Service Business Logic]
        Services --> StorageService[Storage Service Abstraction]
        Services --> JPA[Spring Data JPA Repositories]
    end

    subgraph Infrastructure & Persistence
        JPA --> Postgres[(PostgreSQL / H2 Database)]
        StorageService --> S3[AWS S3 Bucket / Signed URLs]
        StorageService --> LocalStorage[Local File Fallback System]
    end
```

---

## 2. Customer PIN Verification & Security Session Architecture

To avoid forcing end customers to register accounts while ensuring high security, SnapGallery uses a **Short-Lived Gallery Access Token Pattern**:

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Frontend as React Customer Gallery
    participant API as Spring Boot Backend
    participant DB as PostgreSQL / H2
    participant JWT as JwtTokenProvider

    Customer->>Frontend: Open /gallery/8f3k92ab
    Frontend->>API: GET /api/public/gallery/8f3k92ab
    API->>DB: Query Gallery Status (Must be PUBLISHED)
    DB-->>API: Status: PUBLISHED, name, totalPhotos
    API-->>Frontend: Public Info (No PIN Hash or secret metadata)
    Frontend->>Customer: Display PIN Entry Modal

    Customer->>Frontend: Enter 6-digit PIN (e.g. 482917)
    Frontend->>API: POST /api/public/gallery/8f3k92ab/verify { pin: "482917" }
    API->>DB: Fetch Gallery Pin Hash
    API->>API: BCrypt match(pin, pinHash)
    alt Valid PIN
        API->>JWT: Generate Short-lived GallerySessionToken (Type: CUSTOMER_GALLERY, 2h expiry)
        JWT-->>API: Encrypted Session Token
        API-->>Frontend: 200 OK + { sessionToken }
        Frontend->>Customer: Unlock Photo Grid
        Frontend->>API: GET /api/public/gallery/8f3k92ab/photos with Header "Gallery-Session-Token"
        API->>DB: Fetch Published GalleryPhotos only
        API-->>Frontend: 200 OK [Photo DTOs with secure URLs]
    else Invalid PIN
        API-->>Frontend: 401 Unauthorized "Invalid gallery PIN or access code"
    end
```

---

## 3. Storage Abstraction Layer

SnapGallery features a pluggable `StorageService` interface:

- **Production Mode:** `S3StorageService` uses AWS SDK v2 (`software.amazon.awssdk:s3`) to generate secure signed S3 object keys (`events/{eventId}/photos/{uuid}.jpg`).
- **Development Fallback:** `LocalStorageService` stores image binaries directly into `./uploads` and streams them via Spring MVC static resource handlers.

This guarantees zero-friction local development, instant testability, and seamless production readiness.
