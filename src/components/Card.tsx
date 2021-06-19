import { useState } from 'react'
import { CardProps, CommonFields } from './../interfaces'
import AddEdit from './AddEdit'

const dragOver = (e: React.DragEvent<HTMLElement>) => {
  e.preventDefault()
}
/** combined type make usability higher */
type FinCardProps = CardProps & {
  onDragStart: (e: React.DragEvent<HTMLElement>) => void
  edit: (card: CardProps) => void
  remove: () => CardProps | number
}

const Card = (props: FinCardProps) => {
  const [isEdit, setEdit] = useState(false)

  /** update the selected card (in state and local storage) after edit */
  const updateCard = (fields: CommonFields) => {
    props.edit({
      id: props.id,
      ...{ title: fields.title || '', desc: fields.desc || '' },
    })
    setEdit(false)
  }
  /** toggle between edit mode and default mode */
  const editToggle = () =>
    isEdit ? (
      <AddEdit
        onDone={updateCard}
        fields={{ title: props.title, desc: props.desc }}
      />
    ) : (
      <>
        <h4>{props.title}</h4>
        <p>{props.desc}</p>
        <button onClick={() => setEdit(true)}>Edit Card</button>
      </>
    )
  const cardId = `card-${props.id}`
  return (
    <div
      id={cardId}
      className="card"
      draggable={true}
      onDragStart={props.onDragStart}
      onDragOver={dragOver}
    >
      {editToggle()}

      <button onClick={props.remove}>Remove Card</button>
    </div>
  )
}
export default Card
