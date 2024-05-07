import CardItem from '@/components/CardItem'
import CardsBoard from '@/components/CardsBoard'
import Loading from '@/components/Loading'
import PlayerScoreBoard from '@/components/PlayerScoreBoard'
import useGameStore from '@/store/game'
import useLeaderboardStore from '@/store/leaderboard'
import usePlayerStore from '@/store/player'
import clsx from 'clsx'
import { Roboto } from 'next/font/google'
import { useEffect, useMemo } from 'react'

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400'
})

export default function HomePage() {
  const { isLoading: isLeaderboardLoading, fetchGlobalBestScore } = useLeaderboardStore()
  const { isLoading: isPlayerLoading, fetchMyBestScore } = usePlayerStore()
  const { displayCards, newGame } = useGameStore()

  useEffect(() => {
    fetchGlobalBestScore()
    fetchMyBestScore()
    newGame()
  }, [fetchGlobalBestScore, fetchMyBestScore, newGame])

  return (
    <main className={clsx('min-h-svh p-4 laptop:p-10', roboto.className)}>
      <div className='flex flex-col gap-4 laptop:flex-row'>
        <div className='flex-none'>
          <PlayerScoreBoard />
        </div>
        <div className='flex-1'>
          <CardsBoard />
        </div>
      </div>
      {isLeaderboardLoading && isPlayerLoading && <Loading />}
    </main>
  )
}
