import React, { useState } from 'react'
import { AddEdit, CommonFields } from '../interfaces'

type FinAddEdit = AddEdit & { fields: CommonFields }

const Board = (props: FinAddEdit) => {
  const [texts, setTexts] = useState(props.fields || { title: '', desc: '' })

  const changeTxt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentElem = e.currentTarget as HTMLInputElement
    setTexts((prevTxts) => ({
      ...prevTxts,
      [currentElem.name]: currentElem.value,
    }))
  }
  return (
    <div className="add-edit">
      {Object.keys(texts).map((itm, ix) => (
        <input
          key={ix}
          type="text"
          placeholder={itm}
          name={itm}
          value={(texts as { [key: string]: string })[itm]}
          onChange={changeTxt}
        />
      ))}
      <button onClick={() => props.onDone(texts)}>Done</button>
    </div>
  )
}
export default Board
