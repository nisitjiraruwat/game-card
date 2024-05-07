import { create } from 'zustand'
import { fetchGlobalBestScoreEntry, updateGlobalBestScore } from '@/services/leaderboard/globalBestScore'

interface LeaderboardState {
  globalBestScore: number
  isLoading: boolean
  updateGlobalBestScore: (value: number) => Promise<void>
  fetchGlobalBestScore: () => Promise<void>
}

const useLeaderboardStore = create<LeaderboardState>(
  (set) => ({
    globalBestScore: Infinity,
    isLoading: false,
    updateGlobalBestScore: async (value: number) => {
      set({ isLoading: true, globalBestScore: value })

      updateGlobalBestScore({ score: value })
        .then(({ data }) => {
          set({ isLoading: false, globalBestScore: data.score });
        })
        .catch(() => {
          set({ isLoading: false });
        })
    },
    fetchGlobalBestScore: async () => {
      set({ isLoading: true })

      fetchGlobalBestScoreEntry()
        .then(({ data }) => {
          set({ isLoading: false, globalBestScore: data.score });
        })
        .catch(() => {
          set({ isLoading: false });
        })
    }
  })
)

export default useLeaderboardStore
