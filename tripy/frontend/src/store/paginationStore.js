// store/paginationStore.js
import { create } from "zustand";

export const usePaginationStore = create((set) => ({
  currentPage: 1,
  totalPages: 10, // 전체 페이지 수 (예: 10)
  setPage: (page) =>
    set((state) => ({
      currentPage:
        page < 1
          ? 1
          : page > state.totalPages
          ? state.totalPages
          : page,
    })),
  nextPage: () =>
    set((state) => ({
      currentPage:
        state.currentPage < state.totalPages
          ? state.currentPage + 1
          : state.totalPages,
    })),
  prevPage: () =>
    set((state) => ({
      currentPage:
        state.currentPage > 1
          ? state.currentPage - 1
          : 1,
    })),
}));