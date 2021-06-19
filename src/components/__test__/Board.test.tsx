import { fireEvent, render } from '@testing-library/react'
import Card from '../Card'

test('components load without crashing', () => {
  console.log()
})

//---- though this is implementation detail later will change it
test('when Card get dragged dropHandler function should be called', async () => {
  const mockDrageHandler = jest.fn()
  const cardRes = render(
    <Card
      id={1}
      title="this is card"
      desc="a desc goes here"
      onDragStart={mockDrageHandler}
    />
  )

  fireEvent.dragStart(
    cardRes.container.querySelector('#card-1') as HTMLDivElement,
    {
      dataTransfer: { setData: jest.fn() },
    }
  )

  expect(mockDrageHandler).toHaveBeenCalled()
})
