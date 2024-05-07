import CardItem from '@/components/CardItem'
import useGameStore from '@/store/game'

export default function CardsBoard() {
  const { displayCards } = useGameStore()

  return (
    <div className='w-full rounded-2xl border-8 border-[#99561b] bg-[#b7842b] p-4 shadow-md'>
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
  )
}
