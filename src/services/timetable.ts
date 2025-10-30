import {
  Timetable,
  CreateTimetableInput,
  UpdateTimetableInput,
  TimetableFilters,
  TimetableConflict,
  TimetableStatistics,
  BulkTimetableEntry,
  BulkCreateResponse,
  DayOfWeek,
} from "@/types/timetable";
import { $clientPrivate } from "./client";

const BASE_URL = "/timetables";

export interface TimetableResponse {
  success: boolean;
  data: Timetable[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  message: string;
}

export interface SingleTimetableResponse {
  success: boolean;
  data: Timetable;
  message: string;
}

export interface StatisticsResponse {
  success: boolean;
  data: TimetableStatistics;
  message: string;
}

export interface ConflictResponse {
  success: boolean;
  data: TimetableConflict;
  message: string;
}

export interface BulkCreateResponseData {
  success: boolean;
  data: BulkCreateResponse;
  message: string;
}

export interface ClassTimetableResponse {
  success: boolean;
  data: Record<DayOfWeek, Timetable[]>;
  message: string;
}

export const timetableService = {
  /**
   * Get all timetable entries with pagination and filters
   */
  getAll: async (filters?: TimetableFilters): Promise<TimetableResponse> => {
    const response = await $clientPrivate.get<TimetableResponse>(BASE_URL, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get timetable entry by ID
   */
  getById: async (id: number): Promise<SingleTimetableResponse> => {
    const response = await $clientPrivate.get<SingleTimetableResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Get timetable for a specific class and section
   */
  getByClass: async (
    classId: number,
    sectionId: number,
    academicYearId?: number
  ): Promise<ClassTimetableResponse> => {
    const response = await $clientPrivate.get<ClassTimetableResponse>(`${BASE_URL}/class`, {
      params: {
        class_id: classId,
        section_id: sectionId,
        academic_year_id: academicYearId,
      },
    });
    return response.data;
  },

  /**
   * Get timetable for a specific teacher
   */
  getByTeacher: async (
    teacherId: number,
    academicYearId?: number
  ): Promise<ClassTimetableResponse> => {
    const response = await $clientPrivate.get<ClassTimetableResponse>(`${BASE_URL}/teacher`, {
      params: {
        teacher_id: teacherId,
        academic_year_id: academicYearId,
      },
    });
    return response.data;
  },

  /**
   * Get timetable for a specific room
   */
  getByRoom: async (
    roomNumber: string,
    academicYearId?: number
  ): Promise<ClassTimetableResponse> => {
    const response = await $clientPrivate.get<ClassTimetableResponse>(`${BASE_URL}/room`, {
      params: {
        room_number: roomNumber,
        academic_year_id: academicYearId,
      },
    });
    return response.data;
  },

  /**
   * Create a new timetable entry
   */
  create: async (data: CreateTimetableInput): Promise<SingleTimetableResponse> => {
    const response = await $clientPrivate.post<SingleTimetableResponse>(BASE_URL, data);
    return response.data;
  },

  /**
   * Bulk create timetable entries
   */
  bulkCreate: async (entries: BulkTimetableEntry[]): Promise<BulkCreateResponseData> => {
    const response = await $clientPrivate.post<BulkCreateResponseData>(`${BASE_URL}/bulk`, {
      entries,
    });
    return response.data;
  },

  /**
   * Update a timetable entry
   */
  update: async (id: number, data: UpdateTimetableInput): Promise<SingleTimetableResponse> => {
    const response = await $clientPrivate.put<SingleTimetableResponse>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a timetable entry
   */
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await $clientPrivate.delete<{ success: boolean; message: string }>(
      `${BASE_URL}/${id}`
    );
    return response.data;
  },

  /**
   * Check for timetable conflicts
   */
  checkConflicts: async (
    data: CreateTimetableInput & { exclude_id?: number }
  ): Promise<ConflictResponse> => {
    const response = await $clientPrivate.post<ConflictResponse>(
      `${BASE_URL}/check-conflicts`,
      data
    );
    return response.data;
  },

  /**
   * Get timetable statistics
   */
  getStatistics: async (academicYearId?: number): Promise<StatisticsResponse> => {
    const response = await $clientPrivate.get<StatisticsResponse>(`${BASE_URL}/statistics`, {
      params: { academic_year_id: academicYearId },
    });
    return response.data;
  },
};
