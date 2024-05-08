import '@testing-library/jest-dom'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import HomePage from '@/pages'
import axios from 'axios'
import { GlobalBestScore } from '@/types/GlobalBestScore'
import usePlayerStore from '@/store/player'
import { Leaderboard } from '@/types/Leaderboard'
import useGameStore from '@/store/game'
import { randomCards } from '@/utils/card'

jest.mock('@/utils/card', () => {
  return {
    randomCards: jest.fn()
  }
})

const mockedAxios = axios as jest.Mocked<typeof axios>
const mockedRandomCards = randomCards as unknown as jest.Mock<number[]>

describe('Home Page', () => {
  const mockedGlobalBestScore: GlobalBestScore = {
    id: '1',
    score: 50
  }
  const mockedAnswerCards: number[] = [6, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 1]

  beforeEach(async () => {
    mockedAxios.get
      .mockImplementationOnce(() => Promise.resolve({ data: mockedGlobalBestScore }))

      mockedRandomCards.mockImplementation(() => mockedAnswerCards)
  })

  afterEach(async () => {
    mockedAxios.get.mockClear()
    mockedAxios.get.mockReset()
    mockedAxios.post.mockClear()
    mockedAxios.post.mockReset()
    mockedAxios.put.mockClear()
    mockedAxios.put.mockReset()
    mockedRandomCards.mockClear()
    mockedRandomCards.mockReset()
  })

  
  describe('Fetch/Save Data', () => {
    it('Should display global best score correclty after fetched', async () => {
      render(<HomePage />)
      const globalBestScoreElement = screen.getByTestId('global-best-score')
      expect(globalBestScoreElement.textContent).toBe('-')
  
      await waitFor(() => {
        expect(globalBestScoreElement.textContent).toBe(`${mockedGlobalBestScore.score}`)
      })
    })

    it('Should display global best score with "-" when fetched false', async () => {
      mockedAxios.get
        .mockRejectedValue(() => Promise.resolve({ status: 500 }))

      render(<HomePage />)
      const globalBestScoreElement = screen.getByTestId('global-best-score')
      expect(globalBestScoreElement.textContent).toBe('-')
  
      await waitFor(() => {
        expect(globalBestScoreElement.textContent).toBe('-')
      })
    })

    it('Should not fetch my best score when has no player id', async () => {
      expect(mockedAxios.get.mock.calls.length).toBe(0)
      const player = usePlayerStore.getState()

      render(<HomePage />)

      expect(player.id).toBe(undefined)
      const myBestScoreElement = screen.getByTestId('my-best-score')
      expect(myBestScoreElement.textContent).toBe('-')
  
      await waitFor(() => {
        expect(mockedAxios.get.mock.calls.length).toBe(1)
        expect(mockedAxios.get.mock.calls[0][0]).toBe('/global-best-score/1')
        expect(myBestScoreElement.textContent).toBe('-')
      })
    })

    it('Should fetch my best score when has player id', async () => {
      expect(mockedAxios.get.mock.calls.length).toBe(0)
      const mockedPlayer = '1'
      usePlayerStore.setState(() => ({ id: mockedPlayer }))
      const player = usePlayerStore.getState()

      const mockedMyLeaderboard: Leaderboard = {
        id: mockedPlayer,
        score: 46
      }

      // Mock fetch my best score
      mockedAxios.get
        .mockImplementationOnce(() => Promise.resolve({ data: mockedMyLeaderboard }))

      render(<HomePage />)

      expect(player.id).toBe(mockedPlayer)
      const myBestScoreElement = screen.getByTestId('my-best-score')
      expect(myBestScoreElement.textContent).toBe('-')
  
      await waitFor(() => {
        expect(mockedAxios.get.mock.calls.length).toBe(2)
        expect(mockedAxios.get.mock.calls[0][0]).toBe('/global-best-score/1')
        expect(mockedAxios.get.mock.calls[1][0]).toBe(`/leaderboards/${mockedPlayer}`)
        expect(myBestScoreElement.textContent).toBe(`${mockedMyLeaderboard.score}`)
      })
    })

    it('Should display my best score with "-" when fetched false', async () => {
      mockedAxios.get
        .mockRejectedValueOnce(() => Promise.resolve({ status: 500 }))

      const mockedPlayer = '1'
      usePlayerStore.setState(() => ({ id: mockedPlayer }))

      render(<HomePage />)
      const globalBestScoreElement = screen.getByTestId('global-best-score')
      const myBestScoreElement = screen.getByTestId('my-best-score')
      expect(myBestScoreElement.textContent).toBe('-')
  
  
      await waitFor(() => {
        expect(myBestScoreElement.textContent).toBe('-')
      })
    })

    it('Should create my best score when end game and has not player id', async () => {
      const player = usePlayerStore.getState()

      render(<HomePage />)

      expect(player.id).toBe(undefined)

      const clickCountElement = screen.getByTestId('click-count')
      const myBestScoreElement = screen.getByTestId('my-best-score')

      await waitFor(() => {
        expect(clickCountElement.textContent).toBe('0')
        expect(myBestScoreElement.textContent).toBe('-')
      })

      // Mock Click cards
      const mockedClickCount = 52
      const mockedDisplayCards = mockedAnswerCards.map((card) => `${card}`)
      // Claer 6 number index
      mockedDisplayCards[0] = ''
      mockedDisplayCards[10] = ''
      act(() => {
        useGameStore.setState(() => ({
          displayCards: mockedDisplayCards,
          clickCount: mockedClickCount
        }))
      })

      expect(mockedAxios.post.mock.calls.length).toBe(0)
      expect(clickCountElement.textContent).toBe(`${mockedClickCount}`)

      const cardItemElements = screen.getAllByTestId('card-item')

      expect(cardItemElements.length).toBe(mockedDisplayCards.length)

      // Click the last 2 cards (6,6)
      fireEvent.click(cardItemElements[0]) // 6 number index
      fireEvent.click(cardItemElements[10]) // 6 number index

      await waitFor(() => {
        const lastClickCount = mockedClickCount + 2
        expect(mockedAxios.post.mock.calls.length).toBe(1)
        expect(mockedAxios.post.mock.calls[0][0]).toBe('/leaderboards')
        expect(mockedAxios.post.mock.calls[0][1]).toEqual({ score: lastClickCount })
        expect(clickCountElement.textContent).toBe(`${lastClickCount}`)
        expect(myBestScoreElement.textContent).toBe(`${lastClickCount}`)
      })
    })

    it('Should update my best score when end game and new click count less than my best score', async () => {
      expect(mockedAxios.get.mock.calls.length).toBe(0)
      const mockedPlayer = '1'
      usePlayerStore.setState(() => ({ id: mockedPlayer }))
      const player = usePlayerStore.getState()

      const mockedMyLeaderboard: Leaderboard = {
        id: mockedPlayer,
        score: 56
      }

      // Mock fetch my best score
      mockedAxios.get
        .mockImplementationOnce(() => Promise.resolve({ data: mockedMyLeaderboard }))

      render(<HomePage />)

      expect(player.id).toBe(mockedPlayer)

      const clickCountElement = screen.getByTestId('click-count')
      const myBestScoreElement = screen.getByTestId('my-best-score')
  
      await waitFor(() => {
        expect(clickCountElement.textContent).toBe('0')
        expect(myBestScoreElement.textContent).toBe(`${mockedMyLeaderboard.score}`)
      })

      // Mock Click cards
      const mockedClickCount = 52
      const mockedDisplayCards = mockedAnswerCards.map((card) => `${card}`)
      // Claer 6 number index
      mockedDisplayCards[0] = ''
      mockedDisplayCards[10] = ''
      act(() => {
        useGameStore.setState(() => ({
          displayCards: mockedDisplayCards,
          clickCount: mockedClickCount
        }))
      })

      expect(mockedAxios.put.mock.calls.length).toBe(0)
      expect(clickCountElement.textContent).toBe(`${mockedClickCount}`)

      const cardItemElements = screen.getAllByTestId('card-item')

      expect(cardItemElements.length).toBe(mockedDisplayCards.length)

      // Click the last 2 cards (6,6)
      fireEvent.click(cardItemElements[0]) // 6 number index
      fireEvent.click(cardItemElements[10]) // 6 number index

      await waitFor(() => {
        const lastClickCount = mockedClickCount + 2
        expect(mockedAxios.put.mock.calls.length).toBe(1)
        expect(mockedAxios.put.mock.calls[0][0]).toBe(`/leaderboards/${player.id}`)
        expect(mockedAxios.put.mock.calls[0][1]).toEqual({ score: lastClickCount })
        expect(clickCountElement.textContent).toBe(`${lastClickCount}`)
        expect(myBestScoreElement.textContent).toBe(`${lastClickCount}`)
      })
    })

    it('Should not update my best score when end game and new click count nore than my best score', async () => {
      expect(mockedAxios.get.mock.calls.length).toBe(0)
      const mockedPlayer = '1'
      usePlayerStore.setState(() => ({ id: mockedPlayer }))
      const player = usePlayerStore.getState()

      const mockedMyLeaderboard: Leaderboard = {
        id: mockedPlayer,
        score: 56
      }

      // Mock fetch my best score
      mockedAxios.get
        .mockImplementationOnce(() => Promise.resolve({ data: mockedMyLeaderboard }))

      render(<HomePage />)

      expect(player.id).toBe(mockedPlayer)
  
      const clickCountElement = screen.getByTestId('click-count')
      const myBestScoreElement = screen.getByTestId('my-best-score')

      await waitFor(() => {
        expect(clickCountElement.textContent).toBe('0')
        expect(myBestScoreElement.textContent).toBe(`${mockedMyLeaderboard.score}`)
      })

      // Mock Click cards
      const mockedClickCount = 58
      const mockedDisplayCards = mockedAnswerCards.map((card) => `${card}`)
      // Claer 6 number index
      mockedDisplayCards[0] = ''
      mockedDisplayCards[10] = ''
      act(() => {
        useGameStore.setState(() => ({
          displayCards: mockedDisplayCards,
          clickCount: mockedClickCount
        }))
      })

      expect(mockedAxios.put.mock.calls.length).toBe(0)
      expect(clickCountElement.textContent).toBe(`${mockedClickCount}`)

      const cardItemElements = screen.getAllByTestId('card-item')

      expect(cardItemElements.length).toBe(mockedDisplayCards.length)

      // Click the last 2 cards (6,6)
      fireEvent.click(cardItemElements[0]) // 6 number index
      fireEvent.click(cardItemElements[10]) // 6 number index

      await waitFor(() => {
        const lastClickCount = mockedClickCount + 2
        expect(mockedAxios.put.mock.calls.length).toBe(0)
        expect(clickCountElement.textContent).toBe(`${lastClickCount}`)
        expect(myBestScoreElement.textContent).not.toBe(`${lastClickCount}`)
        expect(myBestScoreElement.textContent).toBe(`${mockedMyLeaderboard.score}`)
      })
    })

    it('Should update global best score when end game and new click count less than global best score', async () => {
      expect(mockedAxios.get.mock.calls.length).toBe(0)
      const mockedPlayer = '1'
      usePlayerStore.setState(() => ({ id: mockedPlayer }))
      const player = usePlayerStore.getState()

      const mockedMyLeaderboard: Leaderboard = {
        id: mockedPlayer,
        score: 56
      }

      // Mock fetch my best score
      mockedAxios.get
        .mockImplementationOnce(() => Promise.resolve({ data: mockedMyLeaderboard }))

      render(<HomePage />)

      expect(player.id).toBe(mockedPlayer)
  
      const clickCountElement = screen.getByTestId('click-count')
      const globalBestScoreElement = screen.getByTestId('global-best-score')
    
      await waitFor(() => {
        expect(clickCountElement.textContent).toBe('0')
        expect(globalBestScoreElement.textContent).toBe(`${mockedGlobalBestScore.score}`)
      })

      // Mock Click cards
      const mockedClickCount = 40
      const mockedDisplayCards = mockedAnswerCards.map((card) => `${card}`)
      // Claer 6 number index
      mockedDisplayCards[0] = ''
      mockedDisplayCards[10] = ''
      act(() => {
        useGameStore.setState(() => ({
          displayCards: mockedDisplayCards,
          clickCount: mockedClickCount
        }))
      })

      expect(mockedAxios.put.mock.calls.length).toBe(0)
      expect(clickCountElement.textContent).toBe(`${mockedClickCount}`)

      const cardItemElements = screen.getAllByTestId('card-item')

      expect(cardItemElements.length).toBe(mockedDisplayCards.length)

      // Click the last 2 cards (6,6)
      fireEvent.click(cardItemElements[0]) // 6 number index
      fireEvent.click(cardItemElements[10]) // 6 number index

      await waitFor(() => {
        const lastClickCount = mockedClickCount + 2
        expect(mockedAxios.put.mock.calls.length).toBe(2) // update leaderboards & global best score
        expect(mockedAxios.put.mock.calls[0][0]).toBe(`/leaderboards/${player.id}`)
        expect(mockedAxios.put.mock.calls[0][1]).toEqual({ score: lastClickCount })
        expect(mockedAxios.put.mock.calls[1][0]).toBe('/global-best-score/1')
        expect(mockedAxios.put.mock.calls[1][1]).toEqual({ score: lastClickCount })
        expect(clickCountElement.textContent).toBe(`${lastClickCount}`)
        expect(globalBestScoreElement.textContent).not.toBe(`${mockedGlobalBestScore.score}`)
        expect(globalBestScoreElement.textContent).toBe(`${lastClickCount}`)
      })
    })

    it('Should not update global best score when end game and new click count more than global best score', async () => {
      expect(mockedAxios.get.mock.calls.length).toBe(0)
      const mockedPlayer = '1'
      usePlayerStore.setState(() => ({ id: mockedPlayer }))
      const player = usePlayerStore.getState()

      const mockedMyLeaderboard: Leaderboard = {
        id: mockedPlayer,
        score: 56
      }

      // Mock fetch my best score
      mockedAxios.get
        .mockImplementationOnce(() => Promise.resolve({ data: mockedMyLeaderboard }))

      render(<HomePage />)

      expect(player.id).toBe(mockedPlayer)
  
      const clickCountElement = screen.getByTestId('click-count')
      const globalBestScoreElement = screen.getByTestId('global-best-score')

      await waitFor(() => {
        expect(clickCountElement.textContent).toBe('0')
        expect(globalBestScoreElement.textContent).toBe(`${mockedGlobalBestScore.score}`)
      })

      // Mock Click cards
      const mockedClickCount = 52
      const mockedDisplayCards = mockedAnswerCards.map((card) => `${card}`)
      // Claer 6 number index
      mockedDisplayCards[0] = ''
      mockedDisplayCards[10] = ''
      act(() => {
        useGameStore.setState(() => ({
          displayCards: mockedDisplayCards,
          clickCount: mockedClickCount
        }))
      })

      expect(mockedAxios.put.mock.calls.length).toBe(0)
      expect(clickCountElement.textContent).toBe(`${mockedClickCount}`)

      const cardItemElements = screen.getAllByTestId('card-item')

      expect(cardItemElements.length).toBe(mockedDisplayCards.length)

      // Click the last 2 cards (6,6)
      fireEvent.click(cardItemElements[0]) // 6 number index
      fireEvent.click(cardItemElements[10]) // 6 number index

      await waitFor(() => {
        const lastClickCount = mockedClickCount + 2
        expect(mockedAxios.put.mock.calls.length).toBe(1) // update leaderboards only
        expect(mockedAxios.put.mock.calls[0][0]).toBe(`/leaderboards/${player.id}`)
        expect(mockedAxios.put.mock.calls[0][1]).toEqual({ score: lastClickCount })
        expect(clickCountElement.textContent).toBe(`${lastClickCount}`)
        expect(globalBestScoreElement.textContent).not.toBe(`${lastClickCount}`)
        expect(globalBestScoreElement.textContent).toBe(`${mockedGlobalBestScore.score}`)
      })
    })
  })

  describe('Board Game', () => {
    it('Should go back to previous state when prediction cards were incorrect and paused before back to previous', async () => {
      render(<HomePage />)

      // wait fetching
      await waitFor(() => { })

      const clickCountElement = screen.getByTestId('click-count')
      expect(clickCountElement.textContent).toBe('0')

      const cardItemElements = screen.getAllByTestId('card-item')

      for (let itemKey in cardItemElements) {
        expect(cardItemElements[itemKey].textContent).toBe('')
      }

      expect(useGameStore.getState().isPaused).toBe(false)

      // Click 1,1
      fireEvent.click(cardItemElements[1]) // 1 number index
      expect(cardItemElements[1].textContent).toBe('1')
      expect(clickCountElement.textContent).toBe('1')

      fireEvent.click(cardItemElements[11]) // 1 number index
      expect(cardItemElements[11].textContent).toBe('1')
      expect(clickCountElement.textContent).toBe('2')

      expect(useGameStore.getState().isPaused).toBe(false)

      jest.useFakeTimers()
    
      // Click 2,5
      fireEvent.click(cardItemElements[2]) // 2 number index
      expect(cardItemElements[2].textContent).toBe('2')
      expect(clickCountElement.textContent).toBe('3')

      fireEvent.click(cardItemElements[9]) // 5 number index
      expect(cardItemElements[9].textContent).toBe('5')
      expect(clickCountElement.textContent).toBe('4')

      expect(useGameStore.getState().isPaused).toBe(true)

      await act(async () => {
        await jest.advanceTimersByTimeAsync(3000) // Mock timeout go back to previous state
      })

      expect(cardItemElements[2].textContent).toBe('')
      expect(cardItemElements[9].textContent).toBe('')
      expect(clickCountElement.textContent).toBe('4')
      expect(useGameStore.getState().isPaused).toBe(false)

      jest.useRealTimers()
    })

    it('Should can\'t click other cards when game is paused', async () => {
      render(<HomePage />)

      // wait fetching
      await waitFor(() => { })

      const clickCountElement = screen.getByTestId('click-count')
      expect(clickCountElement.textContent).toBe('0')

      const cardItemElements = screen.getAllByTestId('card-item')

      for (let itemKey in cardItemElements) {
        expect(cardItemElements[itemKey].textContent).toBe('')
      }

      expect(useGameStore.getState().isPaused).toBe(false)

      // Click 1,1
      fireEvent.click(cardItemElements[1]) // 1 number index
      expect(cardItemElements[1].textContent).toBe('1')
      expect(clickCountElement.textContent).toBe('1')

      fireEvent.click(cardItemElements[11]) // 1 number index
      expect(cardItemElements[11].textContent).toBe('1')
      expect(clickCountElement.textContent).toBe('2')

      expect(useGameStore.getState().isPaused).toBe(false)

      jest.useFakeTimers()
    
      // Click 2,5
      fireEvent.click(cardItemElements[2]) // 2 number index
      expect(cardItemElements[2].textContent).toBe('2')
      expect(clickCountElement.textContent).toBe('3')

      fireEvent.click(cardItemElements[9]) // 5 number index
      expect(cardItemElements[9].textContent).toBe('5')
      expect(clickCountElement.textContent).toBe('4')

      expect(useGameStore.getState().isPaused).toBe(true)

      // can't click other card
      fireEvent.click(cardItemElements[0]) // 6 number index
      expect(cardItemElements[0].textContent).toBe('')
      expect(clickCountElement.textContent).toBe('4')

      await act(async () => {
        await jest.advanceTimersByTimeAsync(3000) // Mock timeout go back to previous state
      })

      expect(useGameStore.getState().isPaused).toBe(false)

      // can click other card
      fireEvent.click(cardItemElements[0]) // 6 number index
      expect(cardItemElements[0].textContent).toBe('6')
      expect(clickCountElement.textContent).toBe('5')

      jest.useRealTimers()
    })

    it('Should reset board when click new game button', async () => {
      render(<HomePage />)

      // wait fetching
      await waitFor(() => { })

      const clickCountElement = screen.getByTestId('click-count')
      expect(clickCountElement.textContent).toBe('0')

      const cardItemElements = screen.getAllByTestId('card-item')

      for (let itemKey in cardItemElements) {
        expect(cardItemElements[itemKey].textContent).toBe('')
      }

      expect(useGameStore.getState().isPaused).toBe(false)

      // Click 1,1
      fireEvent.click(cardItemElements[1]) // 1 number index
      expect(cardItemElements[1].textContent).toBe('1')
      expect(clickCountElement.textContent).toBe('1')

      fireEvent.click(cardItemElements[11]) // 1 number index
      expect(cardItemElements[11].textContent).toBe('1')
      expect(clickCountElement.textContent).toBe('2')

      expect(useGameStore.getState().isPaused).toBe(false)

      jest.useFakeTimers()
    
      // Click 2,5
      fireEvent.click(cardItemElements[2]) // 2 number index
      expect(cardItemElements[2].textContent).toBe('2')
      expect(clickCountElement.textContent).toBe('3')

      fireEvent.click(cardItemElements[9]) // 5 number index
      expect(cardItemElements[9].textContent).toBe('5')
      expect(clickCountElement.textContent).toBe('4')

      expect(useGameStore.getState().isPaused).toBe(true)

      // Click new game for reset board
      const newGameBtnElement = screen.getByTestId('new-game-btn')
      fireEvent.click(newGameBtnElement)
      expect(useGameStore.getState().isPaused).toBe(false)
      expect(clickCountElement.textContent).toBe('0')
      for (let itemKey in cardItemElements) {
        expect(cardItemElements[itemKey].textContent).toBe('')
      }

      jest.useRealTimers()
    })
  })
})