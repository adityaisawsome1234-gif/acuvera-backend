# Mobile App Backend Integration Guide

This guide explains how to connect the Acuvera mobile app to the backend API.

## Quick Start

1. **Start the Backend**
   ```bash
   cd acuvera-backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. **Update Mobile App API Config**
   
   Edit `acuvera-mobile/src/services/api.ts`:
   ```typescript
   const API_BASE_URL = __DEV__ 
     ? 'http://localhost:8000/api/v1/mobile'  // Development
     : 'https://your-api-domain.com/api/v1/mobile';  // Production
   ```

3. **Replace Mock Data**
   
   In your mobile app screens, replace mock data calls with API calls:
   
   ```typescript
   // Before (mock data)
   import { mockBills, mockUserStats } from '../data/mockData';
   const bills = mockBills;
   
   // After (API)
   import { getBills, getUserStats } from '../services/api';
   const bills = await getBills();
   ```

## API Endpoints Summary

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login (returns JWT token)
- `GET /api/v1/auth/me` - Get current user info

### Mobile Endpoints
- `POST /api/v1/mobile/bills/upload` - Upload bill
- `GET /api/v1/mobile/bills` - List all bills
- `GET /api/v1/mobile/bills/{bill_id}` - Get bill details
- `GET /api/v1/mobile/bills/{bill_id}/analysis-status` - Check analysis progress
- `GET /api/v1/mobile/bills/{bill_id}/flagged-items/{issue_id}` - Get flagged item
- `GET /api/v1/mobile/bills/{bill_id}/flagged-items/{issue_id}/actions` - Get actions
- `GET /api/v1/mobile/stats` - Get user statistics

## Step-by-Step Integration

### 1. Add Authentication

Create an auth context/provider:

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login, register } from '../services/api';

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('auth_token');
      setToken(storedToken);
    } catch (error) {
      console.error('Failed to load token', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    await SecureStore.setItemAsync('auth_token', result.access_token);
    setToken(result.access_token);
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    const result = await register(email, password, name);
    await SecureStore.setItemAsync('auth_token', result.access_token);
    setToken(result.access_token);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      token,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. Update API Service

Update `src/services/api.ts` to use SecureStore:

```typescript
import * as SecureStore from 'expo-secure-store';

const getAuthToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('auth_token');
};
```

### 3. Update Home Screen

Replace mock data with API calls:

```typescript
// src/screens/HomeScreen.tsx
import { useEffect, useState } from 'react';
import { getBills, getUserStats } from '../services/api';
import { BillAnalysis, UserStats } from '../types';

export const HomeScreen: React.FC = () => {
  const [bills, setBills] = useState<BillAnalysis[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [billsData, statsData] = await Promise.all([
        getBills(),
        getUserStats(),
      ]);
      setBills(billsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data', error);
      // Fallback to mock data on error
    } finally {
      setLoading(false);
    }
  };

  // Use stats and bills from API instead of mock data
  // ...
};
```

### 4. Update Upload Screen

Connect file upload:

```typescript
// src/screens/UploadScreen.tsx
import { uploadBill } from '../services/api';
import * as DocumentPicker from 'expo-document-picker';

const handleFileSelect = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
    });

    if (!result.canceled && result.assets[0]) {
      const file = result.assets[0];
      const uploadResult = await uploadBill({
        uri: file.uri,
        type: file.mimeType || 'application/pdf',
        name: file.name,
      });
      
      // Navigate to analysis screen
      navigation.navigate('Analysis', { billId: uploadResult.billId });
    }
  } catch (error) {
    console.error('Upload failed', error);
    alert('Failed to upload bill. Please try again.');
  }
};
```

### 5. Update Analysis Screen

Poll for analysis status:

```typescript
// src/screens/AnalysisScreen.tsx
import { useEffect, useState } from 'react';
import { getAnalysisStatus } from '../services/api';

export const AnalysisScreen: React.FC = () => {
  const route = useRoute();
  const billId = route.params?.billId;
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    if (billId) {
      pollAnalysisStatus();
    }
  }, [billId]);

  const pollAnalysisStatus = async () => {
    const interval = setInterval(async () => {
      try {
        const statusData = await getAnalysisStatus(billId);
        setStatus(statusData);

        if (statusData.status === 'completed') {
          clearInterval(interval);
          navigation.replace('Results', { billId });
        } else if (statusData.status === 'failed') {
          clearInterval(interval);
          alert('Analysis failed. Please try again.');
        }
      } catch (error) {
        console.error('Failed to check status', error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  };

  // Use status data for progress display
  // ...
};
```

### 6. Update Results Screen

Fetch bill from API:

```typescript
// src/screens/ResultsScreen.tsx
import { useEffect, useState } from 'react';
import { getBill } from '../services/api';

export const ResultsScreen: React.FC = () => {
  const route = useRoute();
  const billId = route.params?.billId;
  const [bill, setBill] = useState<BillAnalysis | null>(null);

  useEffect(() => {
    if (billId) {
      loadBill();
    }
  }, [billId]);

  const loadBill = async () => {
    try {
      const billData = await getBill(billId);
      setBill(billData);
    } catch (error) {
      console.error('Failed to load bill', error);
    }
  };

  if (!bill) {
    return <LoadingScreen />;
  }

  // Use bill data from API
  // ...
};
```

### 7. Update Explanation & Actions Screens

```typescript
// src/screens/ExplanationScreen.tsx
import { getFlaggedItem } from '../services/api';

const loadItem = async () => {
  const item = await getFlaggedItem(billId, issueId);
  setItem(item);
};

// src/screens/ActionsScreen.tsx
import { getRecommendedActions } from '../services/api';

const loadActions = async () => {
  const actions = await getRecommendedActions(billId, issueId);
  setActions(actions);
};
```

## Error Handling

Add error handling throughout:

```typescript
try {
  const data = await getBills();
  // Use data
} catch (error) {
  if (error.message.includes('401')) {
    // Token expired, redirect to login
    navigation.navigate('Login');
  } else {
    // Show error message
    alert('Failed to load data. Please try again.');
  }
}
```

## Testing

1. **Start Backend**: `uvicorn app.main:app --reload`
2. **Start Mobile App**: `npm start`
3. **Test Flow**:
   - Register/Login
   - Upload a bill
   - Check analysis status
   - View results
   - Check flagged items
   - View actions

## Production Checklist

- [ ] Update `API_BASE_URL` to production domain
- [ ] Add SSL certificate for HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Add request retry logic
- [ ] Implement offline support
- [ ] Add request caching
- [ ] Set up API monitoring

## Troubleshooting

### CORS Issues
If you see CORS errors, update backend `.env`:
```
CORS_ORIGINS=http://localhost:19006,exp://*
```

### Network Errors
- Check backend is running: `curl http://localhost:8000/health`
- Check mobile app can reach backend (use device IP for physical device)
- For iOS simulator: Use `localhost`
- For Android emulator: Use `10.0.2.2` instead of `localhost`

### Authentication Issues
- Verify token is stored correctly
- Check token expiration
- Ensure token is sent in Authorization header

## Next Steps

1. Implement authentication screens (Login/Register)
2. Add error boundaries
3. Add loading states
4. Implement pull-to-refresh
5. Add offline support
6. Set up analytics
7. Add push notifications
