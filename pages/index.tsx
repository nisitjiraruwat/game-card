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
    <main className={clsx('min-h-svh p-4 laptop:px-10 laptop:py-20', roboto.className)}>
      <div className='flex flex-col gap-4 laptop:flex-row'>
        <div>
          <div>Click: {clickCount}</div>
          <div>My Best: {displayMyBestScore}</div>
          <div>Global Best: {displayGlobalBestScore}</div>
          <div><button onClick={newGame}>New Game</button></div>
        </div>
        <div className='grid flex-1 grid-cols-3 gap-4 laptop:grid-cols-6'>
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
    </main>
  );
}
