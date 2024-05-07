import { AxiosResponse } from 'axios'
import leaderboardAxios from './base'
import { GlobalBestScore } from '@/types/GlobalBestScore'

export const fetchGlobalBestScoreEntry = async (): Promise<AxiosResponse<GlobalBestScore>> => {
  return leaderboardAxios.get('/global-best-score/1')
}

export const updateGlobalBestScore = async (data: Pick<GlobalBestScore, 'score'>): Promise<AxiosResponse<GlobalBestScore>> => {
  return leaderboardAxios.put('/global-best-score/1', data)
}