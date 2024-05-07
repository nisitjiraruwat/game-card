export const randomCards = (cards: number[]): number[] => {
  const clonedCards: number[] = [...cards]
  const newCards: number[] = []
  Math.floor((Math.random() * clonedCards.length))

  while (clonedCards.length > 0) {
    const randomIndex = Math.floor((Math.random() * clonedCards.length))
    newCards.push(clonedCards[randomIndex])
    clonedCards.splice(randomIndex, 1)
  }

  return newCards
}
