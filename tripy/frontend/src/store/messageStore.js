import { create } from "zustand";

export const useMessageStore = create((set) => ({
  messages: [],
  latestMessage: null,

  addMessage: (msg) =>
    set((state) => {
      const exists = state.messages.some((m) => m.tripTitle === msg.tripTitle); // id 기준 비교
      if (!exists) {
        console.log("msg", msg.tripTitle);
        return {
          messages: [...state.messages, msg],
          latestMessage: msg,
        };
      }
      return state; // 이미 있으면 상태 그대로 반환
    }),

  clearLatest: () => set({ latestMessage: null }),

  nextMessage: () =>
    set((state) => {
      if (state.messages.length === 0) {
        return { latestMessage: null };
      }

      const newMessages = state.messages.slice(0, -1); // 마지막 요소 제외한 새 배열
      const msg = state.messages[state.messages.length - 2]; // 마지막 요소 읽기

      return {
        messages: newMessages,
        latestMessage: msg,
      };
    }),
}));
