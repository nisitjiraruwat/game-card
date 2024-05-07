import { AxiosResponse } from 'axios'
import leaderboardAxios from './base'
import { Leaderboard } from '@/types/Leaderboard'

export const fetchLeaderboard = async (id: string): Promise<AxiosResponse<Leaderboard>> => {
  return leaderboardAxios.get(`/leaderboards/${id}`)
}

export const createLeaderboardEntry = async (data: Pick<Leaderboard, 'score'>): Promise<AxiosResponse<Leaderboard>> => {
  return leaderboardAxios.post('/leaderboards', data)
}

export const updateLeaderboard = async (id: string, data: Pick<Leaderboard, 'score'>): Promise<AxiosResponse<Leaderboard>> => {
  return leaderboardAxios.put(`/leaderboards/${id}`, data)
}
