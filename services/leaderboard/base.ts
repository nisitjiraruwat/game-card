import axios from 'axios'

export const baseURL = 'https://6639da0f1ae792804bed037c.mockapi.io/api/'

const leaderboardAxios = axios.create({
  baseURL
})

export default leaderboardAxios
