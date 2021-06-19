import './style.css'
import Board from './components/Board'
import React, { createRef, RefObject, useRef, useState } from 'react'
import { BoardProps, RefProps, CardProps, CommonFields } from './interfaces'
import AddEdit from './components/AddEdit'

type RefType = { [id: string]: RefObject<RefProps> }

/** mock date will to make staet from it */
const initialBoards: BoardProps[] = [
  {
    id: 1,
    title: 'Ready to dev',
    cards: [
      {
        id: 0,
        title: 'this is card 1',
        desc: 'first description goes here',
      },
      {
        id: 1,
        title: 'here is card 2',
        desc: 'sec description goes here',
      },
      {
        id: 2,
        title: 'so card 3 is this',
        desc: 'third description goes here',
      },
    ],
  },
  {
    id: 2,
    title: 'Ready to dev',
    cards: [
      {
        id: 10,
        title: 'this is card 10',
        desc: '10 description goes here',
      },
      {
        id: 11,
        title: 'here is card 11',
        desc: '11 description goes here',
      },
      {
        id: 12,
        title: 'so card 12 is this',
        desc: '12 description goes here',
      },
    ],
  },
]

export default function App() {
  const [boards, setBoard] = useState<BoardProps[]>(initialBoards)
  const [showAddEdit, toggleAddBoard] = useState(false)
  /** make ref for each board and add it to the 'childrenRef' obj(dictionary) */
  const childrenRef = useRef({})
  childrenRef.current = boards.reduce((acc: RefType, board: BoardProps) => {
    return {
      ...acc,
      ...((childrenRef.current as RefType)[`board-${board.id}`] // if the the ref for the particular id does exist
        ? {} //Then don't add new ref to the obj
        : {
            [`board-${board.id}`]: createRef<RefProps>(), //Then make add new ref to the obj
          }),
    }
  }, {})

  const hasDroppedInBoard = useRef<boolean>(false) // to switch between .app div handler and .board div handler

  const onDrop = (e: React.DragEvent<HTMLElement>, currParentId?: number) => {
    e.preventDefault()
    const cardId = e.dataTransfer.getData('card_id')
    const cardElm: HTMLElement | null = document.getElementById(cardId)
    if (e.currentTarget.classList.contains('app')) {
      // .board drop handler already been called?
      if (!hasDroppedInBoard.current) {
        ;(cardElm as HTMLElement).style.display = 'block'
      } else {
        hasDroppedInBoard.current = !hasDroppedInBoard.current // free .app onDrop handler for upcoming calls
      }

      return
    } else {
      hasDroppedInBoard.current = true // notifies .board drop handler already got called
    }

    const srcBoardId = e.dataTransfer.getData('src_id')

    const destBoardRef = (childrenRef.current as RefType)[
      `board-${currParentId}`
    ]
    const srcBoardRef = (childrenRef.current as RefType)[`board-${srcBoardId}`]

    if (
      /** if current board (which cards is dropping inside) is exist inside board list */
      destBoardRef &&
      destBoardRef !== srcBoardRef
    ) {
      if (cardId) {
        const draggedCard = srcBoardRef.current?.remove(cardId)
        if (draggedCard) destBoardRef.current?.add(draggedCard as CardProps)
      }
    } else {
      ;(cardElm as HTMLElement).style.display = 'block'
    }
  }

  const preToggleAddBoard = () => toggleAddBoard((prevBtn) => !prevBtn)
  const updateBoards = (fields: CommonFields) => {
    if (boards.find((itm) => itm.title === fields.title)) return
    // TO-DO later show warning that title same exists
    setBoard((prevSt) => [
      ...prevSt,
      {
        id: prevSt.length + 1,
        ...{ title: fields.title || '', desc: fields.desc || '' },
        cards: [],
      },
    ])
    preToggleAddBoard()
  }

  return (
    <div
      className="app"
      onDrop={(e: React.DragEvent<HTMLElement>) => onDrop(e)}
      onDragOver={(e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
      }}
    >
      <button onClick={preToggleAddBoard}>+ Add board</button>
      {showAddEdit && <AddEdit onDone={updateBoards} fields={{ title: '' }} />}
      <div className="bordContainer">
        {boards?.map((board) => (
          <Board
            key={board.id}
            {...board}
            ref={(childrenRef.current as RefType)[`board-${board.id}`]}
            onDrop={(e: React.DragEvent<HTMLElement>) => onDrop(e, board.id)}
            onDragOver={(e: React.DragEvent<HTMLElement>) => {
              e.preventDefault()
            }}
          />
        ))}
      </div>
    </div>
  )
}
