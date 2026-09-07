# Database Schema & Entity Documentation — SnapGallery

SnapGallery relies on a fully normalized relational schema designed for PostgreSQL.

---

## 1. Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ EVENTS : "creates (Admin)"
    USERS ||--o{ EVENT_MEMBERS : "assigned to"
    EVENTS ||--o{ EVENT_MEMBERS : "has assigned"
    EVENTS ||--o{ PHOTOS : "contains"
    USERS ||--o{ PHOTOS : "uploads"
    EVENTS ||--o{ GALLERIES : "has"
    GALLERIES ||--o{ GALLERY_PHOTOS : "includes"
    PHOTOS ||--o{ GALLERY_PHOTOS : "linked in"

    USERS {
        uuid id PK
        string name
        string email UK
        string password_hash
        string role "ADMIN | TEAM_MEMBER"
        datetime created_at
        datetime updated_at
    }

    EVENTS {
        uuid id PK
        string name
        string description
        date event_date
        string location
        string cover_photo_url
        uuid created_by FK
        datetime created_at
        datetime updated_at
    }

    EVENT_MEMBERS {
        uuid id PK
        uuid event_id FK
        uuid user_id FK
        datetime assigned_at
    }

    PHOTOS {
        uuid id PK
        uuid event_id FK
        uuid uploaded_by FK
        string original_filename
        string storage_key
        string storage_url
        bigint file_size
        string content_type
        datetime created_at
    }

    GALLERIES {
        uuid id PK
        uuid event_id FK
        string name
        string description
        string public_slug UK
        string pin_hash
        string status "DRAFT | PUBLISHED | UNPUBLISHED | EXPIRED"
        datetime published_at
        datetime expires_at
        datetime created_at
        datetime updated_at
    }

    GALLERY_PHOTOS {
        uuid id PK
        uuid gallery_id FK
        uuid photo_id FK
        datetime created_at
    }
```

---

## 2. Table Specifications & Constraints

### Table: `users`
- `id` (UUID, Primary Key)
- `name` (VARCHAR(100), NOT NULL)
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `password_hash` (VARCHAR(255), NOT NULL) — BCrypt Hashing
- `role` (VARCHAR(50), NOT NULL) — `ADMIN` or `TEAM_MEMBER`

### Table: `events`
- `id` (UUID, Primary Key)
- `name` (VARCHAR(150), NOT NULL)
- `description` (TEXT)
- `event_date` (DATE, NOT NULL)
- `location` (VARCHAR(255))
- `cover_photo_url` (VARCHAR(1024))
- `created_by` (UUID, Foreign Key -> `users.id`)

### Table: `event_members`
- `id` (UUID, Primary Key)
- `event_id` (UUID, Foreign Key -> `events.id`)
- `user_id` (UUID, Foreign Key -> `users.id`)
- Unique Constraint: `(event_id, user_id)`

### Table: `photos`
- `id` (UUID, Primary Key)
- `event_id` (UUID, Foreign Key -> `events.id`)
- `uploaded_by` (UUID, Foreign Key -> `users.id`)
- `original_filename` (VARCHAR(255), NOT NULL)
- `storage_key` (VARCHAR(512), NOT NULL)
- `storage_url` (VARCHAR(1024), NOT NULL)
- `file_size` (BIGINT)
- `content_type` (VARCHAR(100))

### Table: `galleries`
- `id` (UUID, Primary Key)
- `event_id` (UUID, Foreign Key -> `events.id`)
- `name` (VARCHAR(255), NOT NULL)
- `description` (TEXT)
- `public_slug` (VARCHAR(64), UNIQUE, NOT NULL)
- `pin_hash` (VARCHAR(255), NOT NULL) — BCrypt Hashed 6-digit PIN
- `status` (VARCHAR(50), NOT NULL) — `DRAFT`, `PUBLISHED`, `UNPUBLISHED`, `EXPIRED`

### Table: `gallery_photos`
- `id` (UUID, Primary Key)
- `gallery_id` (UUID, Foreign Key -> `galleries.id`)
- `photo_id` (UUID, Foreign Key -> `photos.id`)
- Unique Constraint: `(gallery_id, photo_id)`
