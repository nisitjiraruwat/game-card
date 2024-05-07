import CardItem from '@/components/CardItem';
import useGameStore from '@/store/game';
import useLeaderboardStore from '@/store/leaderboard';
import usePlayerStore from '@/store/player';
import clsx from 'clsx';
import { Roboto } from 'next/font/google';
import { useEffect, useMemo } from 'react';

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400'
});

export default function HomePage() {
  const { globalBestScore, fetchGlobalBestScore } = useLeaderboardStore()
  const { myBestScore, fetchMyBestScore } = usePlayerStore()
  const { displayCards, clickCount, newGame } = useGameStore()

  const displayMyBestScore = useMemo((): string | number => {
    return myBestScore === undefined ? '-' : myBestScore
  }, [myBestScore])

  const displayGlobalBestScore = useMemo((): string | number => {
    return globalBestScore === Infinity ? '-' : globalBestScore
  }, [globalBestScore])

  useEffect(() => {
    fetchGlobalBestScore()
    fetchMyBestScore()
    newGame()
  }, [fetchGlobalBestScore, fetchMyBestScore, newGame])

  return (
    <main className={clsx('min-h-svh p-4 laptop:p-10', roboto.className)}>
      <div className='flex flex-col gap-4 laptop:flex-row'>
        <div className='flex-none'>
          <div className='grid grid-cols-2 gap-y-4 rounded-md bg-[#e2be8b] p-2 laptop:grid-cols-1 laptop:py-4'>
            <div>
              <div className='text-center text-xl font-bold text-[#a32335]'>Click</div>
              <div className='text-center text-lg'>{clickCount}</div>
            </div>
            <div>
              <div className='text-center text-xl font-bold text-pink-900'>My Best Score</div>
              <div className='text-center text-lg'>{displayMyBestScore}</div>
            </div>
            <div>
              <div className='text-center text-xl font-bold text-yellow-900'>Global Best Score</div>
              <div className='text-center text-lg'>{displayGlobalBestScore}</div>
            </div>
            <div className='flex justify-end laptop:justify-center'>
              <button
                className='rounded bg-slate-700 px-4 py-2 text-xl font-bold text-orange-500 hover:bg-slate-900'
                onClick={newGame}
              >
                NEW GAME
              </button>
            </div>
          </div>
        </div>
        <div className='flex-1 rounded-2xl border-8 border-[#99561b] bg-[#b7842b] p-4 shadow-md'>
          <div className='grid grid-cols-3 gap-4 laptop:grid-cols-6'>
            {displayCards.map((displayCard, index) => {
              return (
                <CardItem
                  key={`display-card-${index}`}
                  item={displayCard}
                  index={index}
                />)
            })}
          </div>
        </div>
    </div>
    </main>
  );
}
