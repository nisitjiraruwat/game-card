import { randomCards } from '@/utils/card';
import { create } from 'zustand';
import usePlayer from './player';
import useLeaderboard from './leaderboard';

const ORIGINAL_CARDS = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]

interface GameState {
  isPaused: boolean
  displayCards: string[]
  answerCards: number[]
  predictCardIndexList: number[]
  clickCount: number
  validatePredictCardTimeout: NodeJS.Timeout | undefined
  newGame: () => void
  clickCard: (index: number) => void
  setIsPaused: (value: boolean) => void
  validatePredictCard: () => void
  validateEndGame: () => void
}

const useGameStore = create<GameState>((set, get) => ({
  isPaused: false,
  displayCards: [],
  answerCards: [],
  predictCardIndexList: [],
  clickCount: 0,
  validatePredictCardTimeout: undefined,
  newGame: () => {
    clearTimeout(get().validatePredictCardTimeout)
    set(() => ({
      isPaused: false,
      displayCards: Array<string>(ORIGINAL_CARDS.length).fill(''),
      answerCards: randomCards(ORIGINAL_CARDS),
      predictCardIndexList: [],
      clickCount: 0,
      validatePredictCardTimeout: undefined
    }))
  },
  clickCard: (clickedIndex: number) => {
    let predictCardIndexList = get().predictCardIndexList
    predictCardIndexList = [...predictCardIndexList, clickedIndex]
    const canValidate = predictCardIndexList.length >= 2

    set((state) => ({
      isPaused: canValidate,
      predictCardIndexList: predictCardIndexList,
      clickCount: state.clickCount + 1
    }))

    if (canValidate) {
      get().validatePredictCard()
    }
  },
  setIsPaused: (value: boolean) => {
    set(() => ({ isPaused: value }))
  },
  validatePredictCard: () => {
    const predictCardIndexList = get().predictCardIndexList
    let displayCards = get().displayCards
    const answerCards = get().answerCards

    const firstPredictCardIndex = predictCardIndexList[0]
    const sencondPredictCardIndex = predictCardIndexList[1]
  
    if (predictCardIndexList.length === 2 && answerCards[firstPredictCardIndex] === answerCards[sencondPredictCardIndex]) {
      displayCards[firstPredictCardIndex] = `${answerCards[firstPredictCardIndex]}`
      displayCards[sencondPredictCardIndex] = `${answerCards[sencondPredictCardIndex]}`

      set(() => ({
        isPaused: false,
        predictCardIndexList: [],
        displayCards
      }))

      get().validateEndGame()
    } else {
      const validatePredictCardTimeout = setTimeout(() => {
        set(() => ({
          isPaused: false,
          predictCardIndexList: [],
          displayCards,
          validatePredictCardTimeout: undefined
        }))
      }, 2000)

      set(() => ({
        validatePredictCardTimeout
      }))
    }
  },
  validateEndGame: () => {
    const emptyDisplayCardIndex = get().displayCards.findIndex((displayCard) => displayCard === '')
    const endScore = get().clickCount
    const playerState = usePlayer.getState()
    const leaderboardState = useLeaderboard.getState()

    if (emptyDisplayCardIndex === -1) {
      if (playerState.myBestScore === undefined || endScore < playerState.myBestScore) {
        playerState.saveMyBestScore(endScore);
      }

      if (endScore < leaderboardState.globalBestScore) {
        leaderboardState.updateGlobalBestScore(endScore);
      }
    }
  }
}))

export default useGameStore