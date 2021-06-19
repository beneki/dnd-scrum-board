import { render, screen } from '@testing-library/react'
import Card from '../Card'

test('components load without crashing', () => {
  render(
    <Card
      id={1}
      title="a card title"
      desc="something about card"
      onDragStart={jest.fn()}
    />
  )
  const cardElm = screen.getByText(/something about card/i)
  expect(cardElm).toBeInTheDocument()
})
