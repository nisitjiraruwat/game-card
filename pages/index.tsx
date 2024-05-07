import CardItem from '@/components/CardItem';
import useGameStore from '@/store/game';
import clsx from 'clsx';
import { Roboto } from 'next/font/google';
import { useEffect } from 'react';

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400'
});

export default function HomePage() {
  const { displayCards, clickCount, newGame } = useGameStore()

  useEffect(() => {
    newGame()
  }, [newGame])

  return (
    <main className={clsx('min-h-svh p-4 laptop:p-20', roboto.className)}>
      <div className='flex flex-col gap-4 laptop:flex-row'>
        <div>
          <div>Click: {clickCount}</div>
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
