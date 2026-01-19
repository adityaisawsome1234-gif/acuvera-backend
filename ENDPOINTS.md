# Acuvera API Endpoints

## Base URL
`http://localhost:8000`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Auth Endpoints

### POST /api/v1/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "PATIENT"  // PATIENT, PROVIDER, or ADMIN
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "PATIENT",
      "is_active": true,
      "created_at": "2025-01-05T12:00:00"
    }
  }
}
```

### POST /api/v1/auth/login
Login and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### GET /api/v1/auth/me
Get current authenticated user info.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "PATIENT",
    "is_active": true,
    "organization_id": null,
    "created_at": "2025-01-05T12:00:00"
  }
}
```

---

## Bills Endpoints

### POST /api/v1/bills/upload
Upload a medical bill for analysis.

**Request:** Multipart form data with `file` field (PDF, JPG, or PNG)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patient_id": 1,
    "organization_id": null,
    "file_name": "bill.pdf",
    "file_type": "pdf",
    "total_amount": null,
    "status": "PENDING",
    "uploaded_at": "2025-01-05T12:00:00",
    "analyzed_at": null,
    "created_at": "2025-01-05T12:00:00",
    "line_items": [],
    "findings": []
  }
}
```

**Access:** PATIENT or ADMIN

### GET /api/v1/bills/
List bills (filtered by user role).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patient_id": 1,
      "organization_id": null,
      "file_name": "bill.pdf",
      "file_type": "pdf",
      "total_amount": 1250.00,
      "status": "COMPLETED",
      "uploaded_at": "2025-01-05T12:00:00",
      "analyzed_at": "2025-01-05T12:00:05",
      "findings_count": 3,
      "estimated_savings": 395.00
    }
  ]
}
```

**Access:** All authenticated users (filtered by role)

### GET /api/v1/bills/{bill_id}
Get detailed bill information with line items and findings.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patient_id": 1,
    "organization_id": 1,
    "file_name": "bill.pdf",
    "file_type": "pdf",
    "total_amount": 1250.00,
    "status": "COMPLETED",
    "uploaded_at": "2025-01-05T12:00:00",
    "analyzed_at": "2025-01-05T12:00:05",
    "created_at": "2025-01-05T12:00:00",
    "line_items": [
      {
        "id": 1,
        "bill_id": 1,
        "description": "Office Visit - Level 3",
        "code": "99213",
        "quantity": 1.0,
        "unit_price": 150.00,
        "total_price": 150.00,
        "created_at": "2025-01-05T12:00:05"
      }
    ],
    "findings": [
      {
        "id": 1,
        "bill_id": 1,
        "type": "DUPLICATE_CHARGE",
        "severity": "HIGH",
        "confidence": 0.92,
        "estimated_savings": 150.00,
        "explanation": "Office visit charge appears to be duplicated...",
        "recommended_action": "Contact the billing department...",
        "line_item_id": 1,
        "created_at": "2025-01-05T12:00:05"
      }
    ]
  }
}
```

**Access:** 
- PATIENT: Only their own bills
- PROVIDER: Only bills from their organization
- ADMIN: All bills

---

## Provider Endpoints

### GET /api/v1/provider/orgs/dashboard
Get provider dashboard with stats and analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "organization_id": 1,
    "organization_name": "Demo Medical Center",
    "stats": {
      "claims_reviewed": 10,
      "errors_caught": 25,
      "estimated_savings_total": 2500.00,
      "error_breakdown": [
        {
          "type": "DUPLICATE_CHARGE",
          "count": 5,
          "total_savings": 750.00
        },
        {
          "type": "OVERCHARGE",
          "count": 8,
          "total_savings": 1200.00
        }
      ],
      "savings_over_time": [
        {
          "month": "2025-01",
          "savings": 1500.00,
          "claims_count": 6
        }
      ]
    },
    "recent_bills": [...]
  }
}
```

**Access:** PROVIDER or ADMIN

### GET /api/v1/provider/orgs/stats
Get provider statistics only.

**Response:**
```json
{
  "success": true,
  "data": {
    "claims_reviewed": 10,
    "errors_caught": 25,
    "estimated_savings_total": 2500.00,
    "error_breakdown": [...],
    "savings_over_time": [...]
  }
}
```

**Access:** PROVIDER or ADMIN

---

## Admin Endpoints

### POST /api/v1/admin/seed-demo
Seed demo data (creates demo users and a pre-analyzed bill).

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Demo data seeded successfully",
    "users_created": 3,
    "bills_created": 1
  }
}
```

**Access:** ADMIN only

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

Common error codes:
- `HTTP_400` - Bad Request
- `HTTP_401` - Unauthorized
- `HTTP_403` - Forbidden
- `HTTP_404` - Not Found
- `HTTP_500` - Internal Server Error

