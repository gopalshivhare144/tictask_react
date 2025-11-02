import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  HabitCreateRequest,
  HabitDeleteResponse,
  HabitListResponse,
  HabitResponse,
  HabitsByDateResponse,
  HabitUpdateRequest,
} from "../types/habitTypes";

export const habitApi = createApi({
  reducerPath: "habitApi",
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
  tagTypes: ["Habit"],
  endpoints: (builder) => ({
    // Get all habits with pagination
    getHabits: builder.query<HabitListResponse, { page: number; size: number }>(
      {
        query: ({ page, size }) => `/habits?page=${page}&size=${size}`,
        providesTags: (result) =>
          result
            ? [
                ...result.data.content.map(({ id }) => ({
                  type: "Habit" as const,
                  id,
                })),
                { type: "Habit", id: "LIST" },
              ]
            : [{ type: "Habit", id: "LIST" }],
      }
    ),

    // Get active habits by date
    getActiveHabitsByDate: builder.query<HabitsByDateResponse, string>({
      query: (date) => `/habits/active?date=${date}`,
      providesTags: ["Habit"],
    }),

    // Create new habit
    createHabit: builder.mutation<HabitResponse, HabitCreateRequest>({
      query: (habit) => ({
        url: "/habits",
        method: "POST",
        body: habit,
      }),
      invalidatesTags: [{ type: "Habit", id: "LIST" }],
    }),

    // Update habit
    updateHabit: builder.mutation<
      HabitResponse,
      { id: number; habit: HabitUpdateRequest }
    >({
      query: ({ id, habit }) => ({
        url: `/habits/${id}`,
        method: "PUT",
        body: habit,
      }),
      async onQueryStarted({ id, habit }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          habitApi.util.updateQueryData(
            "getHabits",
            { page: 0, size: 10 },
            (draft) => {
              const habitToUpdate = draft.data.content.find((h) => h.id === id);
              if (habitToUpdate) {
                Object.assign(habitToUpdate, habit);
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Delete habit
    deleteHabit: builder.mutation<HabitDeleteResponse, number>({
      query: (id) => ({
        url: `/habits/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Habit", id: "LIST" }],
    }),
  }),
});

export const {
  useGetHabitsQuery,
  useGetActiveHabitsByDateQuery,
  useCreateHabitMutation,
  useUpdateHabitMutation,
  useDeleteHabitMutation,
} = habitApi;
