import { useMemo } from "react"

import useGameStore from "@/store/game"
import useLeaderboardStore from "@/store/leaderboard"
import usePlayerStore from "@/store/player"

export default function PlayerScoreBoard () {
  const { globalBestScore } = useLeaderboardStore()
  const { myBestScore } = usePlayerStore()
  const { clickCount, newGame } = useGameStore()

  const displayMyBestScore = useMemo((): string | number => {
    return myBestScore === undefined ? '-' : myBestScore
  }, [myBestScore])

  const displayGlobalBestScore = useMemo((): string | number => {
    return globalBestScore === Infinity ? '-' : globalBestScore
  }, [globalBestScore])

  return (
    <div className='grid grid-cols-2 gap-y-4 rounded-md bg-[#e2be8b] p-2 laptop:grid-cols-1 laptop:py-4'>
      <div>
        <div className='whitespace-nowrap text-center text-lg font-bold text-[#a32335] laptop:text-xl'>Click</div>
        <div
          data-testid="click-count"
          className='text-center text-lg'
        >{clickCount}</div>
      </div>
      <div>
        <div className='whitespace-nowrap text-center text-lg font-bold text-pink-900 laptop:text-xl'>My Best Score</div>
        <div
          data-testid="my-best-score"
          className='text-center text-lg'
        >{displayMyBestScore}</div>
      </div>
      <div>
        <div className='whitespace-nowrap text-center text-lg font-bold text-yellow-900 laptop:text-xl'>Global Best Score</div>
        <div
          data-testid="global-best-score"
          className='text-center text-lg'
        >{displayGlobalBestScore}</div>
      </div>
      <div className='flex items-end justify-end laptop:justify-center'>
        <div>
          <button
            data-testid="new-game-btn"
            className='rounded bg-slate-700 px-4 py-2 text-lg font-bold text-orange-500 hover:bg-slate-900 laptop:text-xl'
            onClick={newGame}
          >
            NEW GAME
          </button>
        </div>
      </div>
    </div>
  )
}