# API Client Usage Guide

After consolidation, all API calls should use the unified client from `@/lib/api-client`.

## Quick Start

### For New Services (Recommended Pattern)

Use the **type-safe `api` wrapper** for automatic response unwrapping:

```typescript
import { api } from "@/lib/api-client";

export const studentService = {
  getAll: async (filters?: StudentFilters, page = 1) => {
    return api.get<StudentListResponse>("/students", {
      params: { ...filters, page },
    });
  },

  create: async (data: CreateStudentInput) => {
    return api.post<Student>("/students", data);
  },

  update: async (id: string, data: UpdateStudentInput) => {
    return api.put<Student>(`/students/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete(`/students/${id}`);
  },
};
```

### For Existing Services Using Raw Axios

Continue using `$clientPrivate` or `$clientPublic` as before:

```typescript
import { $clientPrivate, $clientPublic } from "@/lib/api-client";

export const authService = {
  signup: async (payload) => {
    const { data } = await $clientPublic.post("/register", payload);
    return data;
  },

  login: async (payload) => {
    const { data } = await $clientPublic.post("/v1/login", payload);
    return data;
  },

  getProfile: async () => {
    const { data } = await $clientPrivate.get("/v1/me");
    return data;
  },
};
```

## Available Exports

### 1. Type-Safe Wrapper (Recommended)
```typescript
import { api } from "@/lib/api-client";

api.get<T>(url, config?)          // GET request
api.post<T>(url, data?, config?)  // POST request
api.put<T>(url, data?, config?)   // PUT request
api.patch<T>(url, data?, config?) // PATCH request
api.delete<T>(url, config?)       // DELETE request
```

**Automatically unwraps responses with this structure:**
```typescript
{
  success: boolean,
  message: string,
  data: T  // <- This is returned
}
```

### 2. Raw Axios Clients

**Authenticated client (auto token refresh on 401):**
```typescript
import { $clientPrivate } from "@/lib/api-client";

const response = await $clientPrivate.get(url);
// Returns full axios response: { data, status, headers, ... }
```

**Unauthenticated client (for public endpoints):**
```typescript
import { $clientPublic } from "@/lib/api-client";

const response = await $clientPublic.post(url, data);
// Returns full axios response
```

**Raw axios instance (if you need direct control):**
```typescript
import { apiClient } from "@/lib/api-client";

const response = await apiClient.get(url);
```

## Features

### ✅ Automatic Token Management
- Reads `auth_token` from cookies
- Sends in `Authorization: Bearer <token>` header
- Automatically refreshes when expired (401)
- Redirects to `/auth/login` on failed refresh

### ✅ Error Handling
- 401 Unauthorized: Attempts refresh, then redirects to login
- Prevents redirect loops (safe window checks)
- Returns full axios errors for custom handling

### ✅ SSR Safe
- All operations wrapped in `typeof window !== 'undefined'` checks
- Works in server components without errors
- Cookie-based storage (not localStorage)

### ✅ Type Safety with `api` wrapper
```typescript
// Good type inference
const users = await api.get<User[]>("/users");
// users type is User[]

// Works with complex types
const paginated = await api.get<PaginatedResponse<User>>("/users?page=1");
// paginated.items type is User[]
```

## Migration Guide

If you have services still using multiple clients:

**Before (Inconsistent):**
```typescript
import { apiClient } from '@/lib/apiClient';
import { $clientPrivate } from './client';

export const usersService = {
  getAll: async () => {
    const response = await apiClient.get('/users');
    return response.data.data;
  },
  create: async (data) => {
    const response = await $clientPrivate.post('/users', data);
    return response.data;
  },
};
```

**After (Consistent):**
```typescript
import { api } from '@/lib/api-client';

export const usersService = {
  getAll: async () => {
    return api.get<User[]>('/users');
  },
  create: async (data) => {
    return api.post<User>('/users', data);
  },
};
```

## Testing

All clients work the same way, so existing tests require no changes. The `api` wrapper can be mocked just like `$clientPrivate`:

```typescript
import { vi } from 'vitest';
import * as apiClient from '@/lib/api-client';

vi.mocked(apiClient.api.get).mockResolvedValue(testData);
```

## Base URL

Set via environment variable:
```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

The client automatically adds `/api` prefix internally if needed. Verify with your backend configuration.

## Common Issues & Solutions

### Issue: 401 redirect loop
**Solution:** Already handled! The client checks `window.location.pathname !== "/auth/login"` before redirecting.

### Issue: CORS errors
**Solution:** Check backend CORS configuration. Add credentials header: already included via `withCredentials: true`.

### Issue: localStorage token not sent
**Solution:** Use `$clientPrivate` which reads from cookies (not localStorage).

### Issue: "Cannot find module" errors after update
**Solution:** Verify import path is `@/lib/api-client` (not `./client` or `.../apiClient.ts`).

## Best Practices

1. **Prefer `api.*` for new code** - Better type safety and cleaner code
2. **Always specify return type** - `api.get<YourType>(...)`
3. **Use URLSearchParams for complex queries** - Easier to read and debug
4. **Handle errors in components/hooks** - Services should not handle UI logic
5. **Keep services pure** - No hooks, no state, just API calls

## Examples

### Pagination
```typescript
export const userService = {
  getAll: async (page = 1, limit = 15, filters = {}) => {
    return api.get<PaginatedUsers>("/users", {
      params: { page, limit, ...filters },
    });
  },
};
```

### File Upload
```typescript
export const mediaService = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post<MediaFile>("/media/upload", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};
```

### Bulk Operations
```typescript
export const userService = {
  bulkCreate: async (users: CreateUserInput[]) => {
    return api.post<BulkCreateResponse>("/users/bulk", { users });
  },
};
```

---

**Last Updated:** 2024
**Consolidated:** 3 inconsistent clients → 1 unified client
**Files Updated:** 30 services/hooks
**Breaking Changes:** None
