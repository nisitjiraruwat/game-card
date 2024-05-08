import axios from 'axios'

const leaderboardAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LEADERBOARD_URL
})

export default leaderboardAxios
