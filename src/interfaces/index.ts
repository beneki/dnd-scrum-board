export interface CardProps {
  id: number
  title: string
  desc: string
  edit?: (card: CardProps) => void
}

export interface BoardProps {
  id: number
  title: string
  cards: CardProps[]
  onDrop?: (e: React.DragEvent<HTMLElement>) => void
  onDragOver?: (e: React.DragEvent<HTMLElement>) => void
}

export interface RefProps {
  add: (card: CardProps) => void
  remove: (hashId: string) => CardProps | number
}
export interface CommonFields {
  title?: string
  desc?: string
}
export interface AddEdit extends CommonFields {
  onDone: (fields: CommonFields) => void
}
