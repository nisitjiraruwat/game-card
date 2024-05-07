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

  return (
    <div
      className='aspect-card rounded bg-blue-300 shadow'
      onClick={() => !isPaused && clickCard(props.index)}
    >
      {displayItem}
    </div>
  )
}
