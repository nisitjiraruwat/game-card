import useGameStore from "@/store/game";
import clsx from "clsx";
import { Roboto } from "next/font/google";
import { useEffect, useMemo } from "react";

interface Props {
  item: string
  index: number
}

export default function CardItem (props: Props) {
  const { isPaused, predictCardIndexList, answerCards, clickCard } = useGameStore()

  const displayItem = useMemo((): string => {
    if (props.item === '') {
      const predictCardIndex = predictCardIndexList.find((predictCardIndex) => predictCardIndex === props.index)
      return predictCardIndex === undefined ? '' : `${answerCards[predictCardIndex]}`
    }

    return props.item
  }, [props.item, props.index, predictCardIndexList, answerCards])

  const canClick = useMemo((): boolean => {
    return !isPaused && displayItem === ''
  }, [isPaused, displayItem])

  return (
    <div
      className={clsx(
        'flip-card relative aspect-card cursor-pointer',
        {
          actived: displayItem !== ''
        }
      )}
      onClick={() => canClick && clickCard(props.index)}
    >
      <div className='flip-card-front absolute size-full rounded-lg bg-cartoon bg-cover bg-center ring-4 ring-transparent hover:ring-black' />
      <div className={'flip-card-back absolute flex size-full items-center justify-center rounded-lg border-8 border-[#d5b4fd] bg-white'}>
        <span className='text-8xl text-[#d5b4fd] laptop:text-[10vw]'>{displayItem}</span>
      </div>
    </div>
  )
}
