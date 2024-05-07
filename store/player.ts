import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createLeaderboardEntry, fetchLeaderboard, updateLeaderboard } from '@/services/leaderboard/leaderboard'

interface PlayState {
  id: string | undefined
  myBestScore: number | undefined
  isLoading: boolean
  saveMyBestScore: (value: number) => void
  createMyBestScore: (value: number) => Promise<void>
  updateMyBestScore: (value: number) => Promise<void>
  fetchMyBestScore: () => Promise<void>
}

const usePlayerStore = create(
  persist<PlayState>(
    (set, get) => ({
      id: undefined,
      myBestScore: undefined,
      isLoading: false,
      saveMyBestScore: async (value: number) => {
        if (get().id === undefined) {
          get().createMyBestScore(value)
        } else {
          get().updateMyBestScore(value)
        }
      },
      createMyBestScore: async (value: number) => {
        set({ isLoading: true, myBestScore: value })

        createLeaderboardEntry({ score: value })
          .then(({ data }) => {
            set({ isLoading: false, id: data.id, myBestScore: data.score });
          })
          .catch(() => {
            set({ isLoading: false });
          })
      },
      updateMyBestScore: async (value: number) => {
        const playerId = get().id
        if (playerId === undefined) {
          return
        }

        set({ isLoading: true, myBestScore: value })

        updateLeaderboard(playerId, { score: value })
          .then(({ data }) => {
            set({ isLoading: false, myBestScore: data.score });
          })
          .catch(() => {
            set({ isLoading: false });
          })
      },
      fetchMyBestScore: async () => {
        const playerId = get().id
        if (playerId === undefined) {
          return
        }

        set({ isLoading: true })

        fetchLeaderboard(playerId)
          .then(({ data }) => {
            set({ isLoading: false, myBestScore: data.score });
          })
          .catch(() => {
            set({ isLoading: false });
          })
      },
    }),
    {
      name: 'player-storage'
    }
  )
)

export default usePlayerStore
