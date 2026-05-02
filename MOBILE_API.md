# Acuvera Mobile API Documentation

This document describes the mobile-specific API endpoints designed to work with the Acuvera mobile app.

## Base URL

```
http://localhost:8000/api/v1/mobile
```

For production, replace with your API domain.

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Get a token by logging in at `/api/v1/auth/login`.

## Endpoints

### 1. Upload Bill

Upload a medical bill for analysis.

**Endpoint:** `POST /api/v1/mobile/bills/upload`

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (PDF, JPG, PNG)

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "billId": "123",
    "message": "Bill uploaded successfully. Analysis will begin shortly."
  }
}
```

**Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/mobile/bills/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@bill.pdf"
```

---

### 2. List Bills

Get all bills for the current user in mobile app format.

**Endpoint:** `GET /api/v1/mobile/bills`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "providerName": "Memorial Hospital",
      "date": "2024-12-15T10:30:00",
      "totalAmount": 2847.00,
      "potentialSavings": 423.50,
      "confidenceScore": 94.0,
      "status": "analyzed",
      "flaggedItems": [
        {
          "id": "456",
          "serviceName": "Laboratory Services",
          "serviceCode": "CPT-80053",
          "chargedAmount": 156.00,
          "expectedAmount": 0.00,
          "savings": 156.00,
          "severity": "high",
          "errorType": "duplicate",
          "explanation": "This laboratory test appears twice...",
          "whyMatters": "Duplicate charges are one of the most common...",
          "nextSteps": "Most hospitals will remove duplicate charges...",
          "successProbability": 92.0,
          "estimatedResolution": "2-3 business days"
        }
      ]
    }
  ]
}
```

---

### 3. Get Bill Details

Get detailed information about a specific bill.

**Endpoint:** `GET /api/v1/mobile/bills/{bill_id}`

**Parameters:**
- `bill_id` (path): Bill ID as string

**Response:** Same structure as list bills, but single bill object.

---

### 4. Get Analysis Status

Check the analysis progress for a bill.

**Endpoint:** `GET /api/v1/mobile/bills/{bill_id}/analysis-status`

**Response:**
```json
{
  "success": true,
  "data": {
    "billId": "123",
    "status": "processing",
    "progress": 50.0,
    "currentStep": "Analyzing billing codes...",
    "estimatedTimeRemaining": 15
  }
}
```

**Status Values:**
- `pending`: Analysis not started
- `processing`: Analysis in progress
- `completed`: Analysis complete
- `failed`: Analysis failed

---

### 5. Get Flagged Item

Get details about a specific flagged item (for explanation screen).

**Endpoint:** `GET /api/v1/mobile/bills/{bill_id}/flagged-items/{issue_id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "456",
    "serviceName": "Laboratory Services",
    "serviceCode": "CPT-80053",
    "chargedAmount": 156.00,
    "expectedAmount": 0.00,
    "savings": 156.00,
    "severity": "high",
    "errorType": "duplicate",
    "explanation": "...",
    "whyMatters": "...",
    "nextSteps": "...",
    "successProbability": 92.0,
    "estimatedResolution": "2-3 business days"
  }
}
```

---

### 6. Get Recommended Actions

Get recommended actions for a flagged item.

**Endpoint:** `GET /api/v1/mobile/bills/{bill_id}/flagged-items/{issue_id}/actions`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "action-456-1",
      "title": "Generate Appeal Email",
      "icon": "mail",
      "description": "AI-drafted email to billing department",
      "badge": "Most effective",
      "type": "email"
    },
    {
      "id": "action-456-2",
      "title": "Request Itemized Bill",
      "icon": "file-text",
      "description": "Get detailed breakdown of charges",
      "type": "request"
    },
    {
      "id": "action-456-3",
      "title": "Call Billing Department",
      "icon": "phone",
      "description": "Speak with a representative",
      "phoneNumber": "(555) 123-4567",
      "type": "call"
    },
    {
      "id": "action-456-4",
      "title": "Save for Later",
      "icon": "bookmark",
      "description": "Add to your saved items",
      "type": "save"
    }
  ]
}
```

---

### 7. Get User Statistics

Get user statistics for the home screen.

**Endpoint:** `GET /api/v1/mobile/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "monthlySavings": 847.50,
    "monthlyTrend": 23.0,
    "totalSavedThisYear": 2340.00,
    "billsAnalyzed": 12,
    "issuesFound": 28
  }
}
```

**Notes:**
- `monthlySavings`: Total savings from bills uploaded this month
- `monthlyTrend`: Percentage change from last month (positive = increase)
- `totalSavedThisYear`: Total savings year-to-date
- `billsAnalyzed`: Total number of bills analyzed
- `issuesFound`: Total number of flagged items found

---

## Data Types

### Error Types
- `duplicate`: Duplicate charge detected
- `upcoding`: Incorrect coding/upcoding
- `out-of-network`: Out of network charge
- `unbundling`: Unbundling issue
- `coverage-mismatch`: Coverage mismatch

### Severity Levels
- `low`: Low severity issue
- `medium`: Medium severity issue
- `high`: High severity issue

### Bill Status
- `pending`: Bill uploaded, waiting for analysis
- `analyzed`: Analysis complete
- `resolved`: Issue resolved (future feature)

### Action Types
- `email`: Generate appeal email
- `request`: Request itemized bill
- `call`: Call billing department
- `save`: Save for later

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

**Common Error Codes:**
- `HTTP_400`: Bad request (invalid input)
- `HTTP_401`: Unauthorized (missing/invalid token)
- `HTTP_403`: Forbidden (insufficient permissions)
- `HTTP_404`: Not found
- `HTTP_500`: Internal server error

---

## Integration with Mobile App

The mobile app's API service should be configured to use these endpoints. Update the base URL in your mobile app's API configuration:

```typescript
// In your mobile app's API config
const API_BASE_URL = 'http://localhost:8000/api/v1/mobile';
```

Then update your API calls to use these endpoints instead of mock data.

---

## Testing

You can test these endpoints using:

1. **Swagger UI**: Navigate to `http://localhost:8000/docs` and find the "mobile" tag
2. **cURL**: Use the examples above
3. **Postman**: Import the endpoints and test with your JWT token

---

## Notes

- All monetary values are in USD
- Dates are in ISO 8601 format
- IDs are returned as strings for compatibility with mobile app
- The API automatically converts backend models to mobile app format
- File uploads are limited by `MAX_FILE_SIZE_MB` setting (default: 25MB)
