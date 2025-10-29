import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TaskCreateRequest, TaskDeleteResponse, TaskListResponse, TaskResponse, TasksByDateResponse, TaskUpdateRequest } from "../types/taskTypes";


export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    // Get all tasks with pagination
    getTasks: builder.query<TaskListResponse, { page: number; size: number }>({
      query: ({ page, size }) => `/tasks?page=${page}&size=${size}`,
      providesTags: ["Task"],
    }),

    // Get single task by ID
    getTaskById: builder.query<TaskResponse, number>({
      query: (id) => `/tasks/${id}`,
      providesTags: ["Task"],
    }),

    // Search tasks by title
    searchTasks: builder.query<
      TaskListResponse,
      { title: string; page: number; size: number }>({
      query: ({ title, page, size }) =>
        `/tasks/search?title=${title}&page=${page}&size=${size}`,
      providesTags: ["Task"],
    }),

    // Get tasks by date
    getTasksByDate: builder.query<TasksByDateResponse, string>({
      query: (taskDate) => `/tasks/by-date?taskDate=${taskDate}`,
      providesTags: ["Task"],
    }),

    // Create new task
    createTask: builder.mutation<TaskResponse, TaskCreateRequest>({
      query: (task) => ({
        url: "/tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Task"],
    }),

    // Update task
    updateTask: builder.mutation<
      TaskResponse,
      { id: number; task: TaskUpdateRequest }>({
      query: ({ id, task }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: task,
      }),
      invalidatesTags: ["Task"],
    }),

    // Delete task
    deleteTask: builder.mutation<TaskDeleteResponse, number>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useSearchTasksQuery,
  useGetTasksByDateQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
