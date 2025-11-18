import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  TaskCreateRequest,
  TaskDeleteResponse,
  TaskListResponse,
  TaskResponse,
  TasksByDateResponse,
  TaskUpdateRequest,
} from "../types/taskTypes";
import { axiosBaseQuery } from "@/shared/services/baseApi";

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<TaskListResponse, { page: number; size: number }>({
      query: ({ page, size }) => ({
        url: `/tasks?page=${page}&size=${size}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.content.map(({ id }) => ({
                type: "Task" as const,
                id,
              })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    getTaskById: builder.query<TaskResponse, number>({
      query: (id) => ({ url: `/tasks/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "Task", id }],
    }),

    searchTasks: builder.query<
      TaskListResponse,
      { title: string; page: number; size: number }
    >({
      query: ({ title, page, size }) => ({
        url: `/tasks/search?title=${encodeURIComponent(
          title
        )}&page=${page}&size=${size}`,
        method: "GET",
      }),
      providesTags: ["Task"],
    }),

    getTasksByDate: builder.query<TasksByDateResponse, string>({
      query: (taskDate) => ({
        url: `/tasks/by-date?taskDate=${encodeURIComponent(taskDate)}`,
        method: "GET",
      }),
      providesTags: ["Task"],
    }),

    createTask: builder.mutation<TaskResponse, TaskCreateRequest>({
      query: (task) => ({ url: "/tasks", method: "POST", data: task }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),

    updateTask: builder.mutation<
      TaskResponse,
      { id: number; task: TaskUpdateRequest }
    >({
      query: ({ id, task }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        data: task,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),

    deleteTask: builder.mutation<TaskDeleteResponse, number>({
      query: (id) => ({ url: `/tasks/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
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
