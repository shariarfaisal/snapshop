# API Refactoring Guide - Hooks Pattern

## Summary of Completed Work

### ✅ Hooks Created
All necessary hooks have been created in `/web/src/hooks/`:

1. **use-teachers.ts** - Teacher management operations
2. **use-school-classes.ts** - School class operations
3. **use-sections.ts** - Section operations
4. **use-finance.ts** - Finance operations (fee heads, structures, invoices, payments)
5. **use-exams.ts** - Comprehensive exam system hooks
6. **use-attendance.ts** - Attendance tracking operations
7. **use-communications.ts** - Messages, templates, notices
8. **use-academic-years.ts** - Academic year management
9. **use-rooms.ts** - Room management
10. **use-student.ts** - Updated with comprehensive student operations

### ✅ Pages Refactored
- **Students Page** (`/admin/students/page.tsx`) - Fully refactored as reference example

## Refactoring Pattern

### Before (Old Pattern - DON'T USE)
```typescript
import { studentService } from "@/services/student";

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await studentService.getAll(filters);
      setData(result.data);
    } catch (error) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await studentService.delete(id);
      loadData(); // Manual refetch
    } catch (error) {
      toast.error("Failed");
    }
  };
}
```

### After (New Pattern - USE THIS)
```typescript
import { useStudents, useDeleteStudent } from "@/hooks/use-student";

export default function Page() {
  const [filters, setFilters] = useState({...});

  // Use hooks instead of manual state
  const { data, isLoading } = useStudents(filters, page);
  const deleteStudentMutation = useDeleteStudent();

  // Derived data
  const students = data?.data || [];

  // Mutations handle refetch automatically
  const handleDelete = (id) => {
    deleteStudentMutation.mutate(id, {
      onSuccess: () => toast.success("Deleted"),
      onError: () => toast.error("Failed"),
    });
  };
}
```

## Step-by-Step Refactoring Guide

### 1. Update Imports
**Remove:**
```typescript
import { someService } from "@/services/some-service";
```

**Add:**
```typescript
import { useSomeData, useSomeMutation } from "@/hooks/use-something";
```

### 2. Replace Manual State with Hooks
**Remove:**
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
```

**Add:**
```typescript
const { data, isLoading: loading } = useSomeData(filters, page);
const someData = data?.data || [];
```

### 3. Remove useEffect Loaders
**Remove:**
```typescript
useEffect(() => {
  loadData();
}, [filters, page]);

const loadData = async () => {
  try {
    setLoading(true);
    const result = await service.getAll(filters, page);
    setData(result);
  } catch (error) {
    toast.error("Failed");
  } finally {
    setLoading(false);
  }
};
```

**Result:**
Hooks automatically handle this - no manual loading needed!

### 4. Convert CRUD Operations to Mutations
**Remove:**
```typescript
const handleCreate = async (data) => {
  try {
    await service.create(data);
    loadData(); // Manual refetch
    toast.success("Created");
  } catch (error) {
    toast.error("Failed");
  }
};
```

**Add:**
```typescript
const createMutation = useCreateSomething();

const handleCreate = (data) => {
  createMutation.mutate(data, {
    onSuccess: () => toast.success("Created"),
    onError: (error: any) => toast.error(error.message || "Failed"),
  });
};
```

## Pages Requiring Refactoring

### High Priority (37+ pages total)
1. **Teachers Page** - `/admin/teachers/page.tsx`
2. **Finance Pages:**
   - Invoices - `/admin/finance/invoices/page.tsx`
   - Payments - `/admin/finance/payments/page.tsx`
   - Fee Structures - `/admin/finance/fee-structure/page.tsx`
   - Fee Heads - `/admin/finance/fee-heads/page.tsx`
3. **Exam Pages:**
   - Setup - `/admin/exams/setup/page.tsx`
   - Schedule - `/admin/exams/schedule/page.tsx`
   - Results - `/admin/exams/results/page.tsx`
   - Grades - `/admin/exams/grades/page.tsx`
   - Participants - `/admin/exams/participants/page.tsx`
   - Rooms - `/admin/exams/rooms/page.tsx`
4. **Academic Pages:**
   - Classes - `/admin/academic/classes/page.tsx`
   - Subjects - `/admin/academic/subjects/page.tsx`
   - Sections - `/admin/academic/sections/page.tsx`
   - Rooms - `/admin/academic/rooms/page.tsx`
   - Years - `/admin/academic/years/page.tsx`
   - Timetable - `/admin/academic/timetable/page.tsx`
5. **Communication Pages:**
   - Notices - `/admin/communications/notices/page.tsx`
   - Messages - `/admin/communications/messages/page.tsx`
   - Templates - `/admin/communications/templates/page.tsx`
6. **Attendance Pages:**
   - Admin Attendance - `/admin/attendance/page.tsx`
   - Teacher Attendance - `/teacher/attendance/page.tsx`
   - Mark Attendance - `/teacher/attendance/mark/page.tsx`
7. **Role-Specific Pages:**
   - Teacher Dashboard, Marks, Assignments
   - Student Dashboard, Grades, Fees, Attendance
   - Accountant Pages
   - Parent Pages

## Hook Reference

### Query Hooks (for fetching data)
- Return: `{ data, isLoading, error, refetch }`
- Auto-refetch on dependencies
- Cached by React Query

### Mutation Hooks (for CUD operations)
- Return: `{ mutate, isLoading, error }`
- Use `.mutate(data, { onSuccess, onError })`
- Auto-invalidate queries on success

## Common Patterns

### Pattern 1: List with Filters
```typescript
const [filters, setFilters] = useState({ search: "", status: "all" });
const [page, setPage] = useState(1);
const { data, isLoading } = useItems(filters, page);
const items = data?.data || [];
```

### Pattern 2: CRUD Operations
```typescript
const createMutation = useCreateItem();
const updateMutation = useUpdateItem();
const deleteMutation = useDeleteItem();

const handleCreate = (data) => {
  createMutation.mutate(data, {
    onSuccess: () => { /* success */ },
    onError: () => { /* error */ },
  });
};
```

### Pattern 3: Dependent Queries
```typescript
const { data: classesData } = useSchoolClasses();
const { data: sectionsData } = useSectionsBySchoolClass(selectedClassId);
// Sections only load when classId is not null
```

## Benefits Achieved

1. **Consistency** - All pages follow same pattern
2. **Less Code** - No manual loading/error states
3. **Better UX** - Automatic caching and background refetch
4. **Type Safety** - Full TypeScript support
5. **Reusability** - One hook, many pages
6. **Maintainability** - Single source of truth

## Next Steps

Continue refactoring remaining pages following the pattern shown in:
- `/web/src/app/(protected)/admin/students/page.tsx` (completed example)
- This guide

Remove direct service imports from all pages and use hooks instead.
