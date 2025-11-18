import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  HabitCreateRequest,
  HabitDeleteResponse,
  HabitListResponse,
  HabitResponse,
  HabitsByDateResponse,
  HabitUpdateRequest,
} from "../types/habitTypes";
import { axiosBaseQuery } from "@/shared/services/baseApi";

export const habitApi = createApi({
  reducerPath: "habitApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Habit"],
  endpoints: (builder) => ({
    getHabits: builder.query<HabitListResponse, { page: number; size: number }>(
      {
        query: ({ page, size }) => ({
          url: `/habits?page=${page}&size=${size}`,
          method: "GET",
        }),
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

    getActiveHabitsByDate: builder.query<HabitsByDateResponse, string>({
      query: (date) => ({
        url: `/habits/active?date=${encodeURIComponent(date)}`,
        method: "GET",
      }),
      providesTags: ["Habit"],
    }),

    createHabit: builder.mutation<HabitResponse, HabitCreateRequest>({
      query: (habit) => ({ url: "/habits", method: "POST", data: habit }),
      invalidatesTags: [{ type: "Habit", id: "LIST" }],
    }),

    updateHabit: builder.mutation<
      HabitResponse,
      { id: number; habit: HabitUpdateRequest }
    >({
      query: ({ id, habit }) => ({
        url: `/habits/${id}`,
        method: "PUT",
        data: habit,
      }),

      async onQueryStarted({ id, habit }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          habitApi.util.updateQueryData(
            "getHabits",
            { page: 0, size: 10 },
            (draft) => {
              const found = draft.data.content.find((h) => h.id === id);
              if (found) Object.assign(found, habit);
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

    deleteHabit: builder.mutation<HabitDeleteResponse, number>({
      query: (id) => ({ url: `/habits/${id}`, method: "DELETE" }),
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
