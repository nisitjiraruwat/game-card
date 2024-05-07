import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import HomePage from '@/pages'
import axios from 'axios'
import { GlobalBestScore } from '@/types/GlobalBestScore';
import usePlayerStore from '@/store/player';
import { Leaderboard } from '@/types/Leaderboard';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Page', () => {
  const globalBestScore: GlobalBestScore = {
    id: '1',
    score: 50
  }

  beforeEach(async () => {
    mockedAxios.get
      .mockImplementationOnce(() => Promise.resolve({ data: globalBestScore }))
  })

  afterEach(async () => {
    mockedAxios.get.mockClear()
    mockedAxios.get.mockReset()
  })

  it('Should display global best score correclty after fetched', async () => {
    render(<HomePage />)
 
    await waitFor(() => {
      expect(screen.getByTestId('global-best-score').textContent).toBe(`${globalBestScore.score}`)
    })
  })

  it('Should not fetch my best score correclty when has no player id', async () => {
    expect(mockedAxios.get.mock.calls.length).toBe(0)
    const player = usePlayerStore.getState()

    render(<HomePage />)

    expect(player.id).toBe(undefined)
 
    await waitFor(() => {
      expect(mockedAxios.get.mock.calls.length).toBe(1)
      expect(mockedAxios.get.mock.calls[0][0]).toBe('/global-best-score/1')
      expect(screen.getByTestId('my-best-score').textContent).toBe('-')
    })
  })

  it('Should fetch my best score correclty when has player id', async () => {
    expect(mockedAxios.get.mock.calls.length).toBe(0)
    const mockedPlayer = '1'
    usePlayerStore.setState(() => ({ id: mockedPlayer }))
    const player = usePlayerStore.getState()

    const mockedMyLeaderboard: Leaderboard = {
      id: mockedPlayer,
      score: 45
    }

    // Mock fetch y best score
    mockedAxios.get
      .mockImplementationOnce(() => Promise.resolve({ data: mockedMyLeaderboard }))

    render(<HomePage />)

    expect(player.id).toBe(mockedPlayer)
 
    await waitFor(() => {
      expect(mockedAxios.get.mock.calls.length).toBe(2)
      expect(mockedAxios.get.mock.calls[0][0]).toBe('/global-best-score/1')
      expect(mockedAxios.get.mock.calls[1][0]).toBe(`/leaderboards/${mockedPlayer}`)
      expect(screen.getByTestId('my-best-score').textContent).toBe(`${mockedMyLeaderboard.score}`)
    })
  })
})