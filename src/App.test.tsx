import { fireEvent, screen, render } from '@testing-library/react'
import App from './App'
import { CardProps } from './interfaces'

const MockCard = (props: CardProps) => {
  const id = `card-${props.id}`
  const dragStart = (e: React.DragEvent<HTMLElement>) => {
    e.dataTransfer.setData('card_id', id)
  }

  return (
    <div id={id} draggable="true" onDragStart={dragStart}>
      {props.desc}
    </div>
  )
}

test('component renders properly', async () => {
  console.log('to-do')
})
test('after Card got dragged and dropped should be inside append inside app container', async () => {
  const cardRes = render(
    <MockCard
      id={1}
      title="this is card 1"
      desc="card is droped inside app container"
    />
  )
  const page = render(<App />)
  fireEvent.dragStart(
    cardRes.container.querySelector('#card-1') as HTMLDivElement,
    {
      dataTransfer: { setData: jest.fn() },
    }
  )
  fireEvent.drop(page.container.querySelector('.app') as HTMLDivElement, {
    dataTransfer: {
      getData: () => {
        return 'card-1'
      },
    },
  })
  const cardElm = screen.getByText(/card is droped inside app container/i)
  expect(cardElm).toBeInTheDocument()
})
