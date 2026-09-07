# API Reference & Documentation — SnapGallery

SnapGallery exposes a RESTful API returning JSON responses wrapped in a standard `ApiResponse<T>` envelope.

---

## 1. Response Envelope Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-09-07T20:00:00"
}
```

### Error Response
```json
{
  "success": false,
  "message": "You do not have permission to access this event",
  "code": "EVENT_ACCESS_DENIED",
  "timestamp": "2026-09-07T20:00:00"
}
```

---

## 2. API Endpoint Matrix

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT Bearer token |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user details |

### 📅 Events (`/api/events`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/events` | Admin | Create a new event |
| `GET` | `/api/events` | Admin / Member | List assigned events (paginated) |
| `GET` | `/api/events/{id}` | Admin / Assigned | Get event details |
| `PUT` | `/api/events/{id}` | Admin | Update event details |
| `DELETE` | `/api/events/{id}` | Admin | Delete event |
| `GET` | `/api/events/{id}/members` | Admin / Assigned | List assigned team members |
| `POST` | `/api/events/{id}/members` | Admin | Assign photographer to event |
| `DELETE` | `/api/events/{id}/members/{userId}` | Admin | Remove photographer from event |

### 📸 Photos (`/api`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/events/{id}/photos` | Admin / Assigned | Upload multiple photographs |
| `GET` | `/api/events/{id}/photos` | Admin / Assigned | List event photos (paginated, uploader filter) |
| `GET` | `/api/member/uploads` | Member | List own uploaded photos |
| `DELETE` | `/api/photos/{id}` | Admin / Uploader | Delete photo |

### 🖼️ Admin Gallery Management (`/api`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/events/{id}/gallery` | Admin | Create gallery with 6-digit PIN |
| `GET` | `/api/events/{id}/gallery` | Admin | List galleries for event |
| `PUT` | `/api/galleries/{id}` | Admin | Update gallery configuration |
| `POST` | `/api/galleries/{id}/publish` | Admin | Publish customer gallery |
| `POST` | `/api/galleries/{id}/unpublish` | Admin | Unpublish customer gallery |

### 🌐 Public Customer Gallery (`/api/public/gallery`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/public/gallery/{slug}` | Public | Get public gallery intro info |
| `POST` | `/api/public/gallery/{slug}/verify` | Public | Verify 6-digit PIN; receive `Gallery-Session-Token` |
| `GET` | `/api/public/gallery/{slug}/photos` | Customer Session | Browse published high-res photographs |
