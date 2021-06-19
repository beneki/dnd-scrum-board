import {
	forwardRef,
	useImperativeHandle,
	useEffect,
	useState,
	ForwardedRef,
} from "react";
import Card from "./Card";
import { BoardProps, CardProps, RefProps, CommonFields } from "../interfaces";
import AddEdit from "./AddEdit";

const Board = (props: BoardProps, ref: ForwardedRef<RefProps>) => {
	const [showAddCard, toggleAddCard] = useState(false);

	const initCards = () => {
		const localSotarge = localStorage.getItem(`board-${props.id}`);
		return (
			(localSotarge && JSON.parse(localSotarge).cards) || props?.cards || []
		);
	};
	const [cardList, setCardList] = useState(() => initCards());

	/** onDrageStart will add card_id and src_id(the board that drag started from) and send to drop handler */
	const dragStart = (e: React.DragEvent<HTMLElement>): void => {
		const crrCardId = (e?.target as HTMLElement).id;
		e?.dataTransfer.setData("card_id", crrCardId);
		e?.dataTransfer.setData("src_id", props.id.toString());

		setTimeout(() => {
			(e?.target as HTMLElement).style.display = "none";
		}, 0);
	};

	useEffect(() => {
		/** persist the state to localStorage after each state or props changes */
		localStorage.setItem(
			`board-${props.id}`,
			JSON.stringify({
				id: props.id,
				title: props.title,
				cards: cardList,
			})
		);
	}, [cardList, props.id, props.title]);

	const removeCard = (cardId: string) => {
		let card: CardProps | number = -1;
		const newState = cardList.filter((itm: CardProps) => {
			if (`card-${itm.id}` === cardId) {
				card = itm;
				return false;
			}
			return itm;
		});
		setCardList(newState);
		return card;
	};
	const addCard = (card: CardProps) => {
		setCardList((cards: CardProps[]) => [...cards, card]);
	};

	const editCard = (card: CardProps): void => {
		setCardList((prevCards: CardProps[]) =>
			prevCards.map((itm: CardProps) => (itm.id === card.id ? card : itm))
		);
	};

	/** to use forwardRef in hooks we need to add this to subscribe our functions to parent(App) component */
	useImperativeHandle(ref, () => ({
		add: addCard,
		remove: removeCard,
	}));
	const preToggleAddCard = () => toggleAddCard((prevBtn) => !prevBtn);

	/** a wrapper around addCard function (to intercept addCard from running and modify argument for it) */
	const preAddCard = (fields: CommonFields) => {
		addCard({
			id: new Date().getTime(), // make unique id
			title: fields.title || "",
			desc: fields.desc || "",
		});
		toggleAddCard(false);
	};

	return (
		<div
			id={`board-${props.id}`}
			className="board"
			onDrop={props.onDrop}
			onDragOver={props.onDragOver}
		>
			<h4>{props.title}</h4>
			<button onClick={preToggleAddCard}>+ Add card</button>
			{showAddCard && (
				<AddEdit onDone={preAddCard} fields={{ title: "", desc: "" }} />
			)}
			{cardList.map((cardProps: CardProps) => (
				<Card
					key={cardProps.id}
					{...cardProps}
					onDragStart={dragStart}
					edit={editCard}
					remove={() => removeCard(`card-${cardProps.id}`)}
				/>
			))}
		</div>
	);
};
export default forwardRef(Board);
