# API Architecture - Service → Hook → Page Pattern

## Structure

```
/web/src
├── services/          # API calls (Axios/Fetch)
├── hooks/            # React hooks using services
└── app/              # Pages using hooks only
```

## Rules

1. **Services** (`/services/*.ts`)
   - Pure API calls using axios
   - No React hooks
   - Export service objects with methods
   - Handle request/response formatting

2. **Hooks** (`/hooks/use-*.ts`)
   - Use React Query (useQuery/useMutation)
   - Call service methods
   - Manage loading/error states
   - Handle cache invalidation
   - Export reusable hooks

3. **Pages** (`/app/**/*.tsx`)
   - ONLY use hooks (never import services directly)
   - No direct API calls
   - Focus on UI logic only

## Example Flow

```typescript
// 1. Service (services/student.ts)
export const studentService = {
  getAll: (filters, page) => $client.get('/students', { params: {...} })
}

// 2. Hook (hooks/use-students.ts)
export const useStudents = (filters, page) => {
  return useQuery({
    queryKey: ['students', filters, page],
    queryFn: () => studentService.getAll(filters, page)
  })
}

// 3. Page (app/students/page.tsx)
export default function StudentsPage() {
  const { data, isLoading } = useStudents(filters, page)
  // UI only
}
```

## Current Issues

- 37+ pages directly import services
- Duplicate API logic across pages
- Inconsistent error handling
- No centralized cache management

## Benefits

- **Reusability**: One hook, many pages
- **Consistency**: Standardized patterns
- **Performance**: React Query caching
- **Maintainability**: Single source of truth
