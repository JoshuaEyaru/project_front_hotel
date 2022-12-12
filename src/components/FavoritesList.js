import { memo, useCallback, useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { DndCard } from './DndCard.js';
import update from 'immutability-helper'
import { ItemTypes } from './ItemTypes';

const style = {
    width: 500,
    margin: '1em',
}

export const FavoritesList = memo(function FavoritesList({
    favMovies,
    reorderFavorites
  }) {
    const [cards, setCards] = useState(favMovies);
    useEffect(() => {
        if (favMovies.length > 0){
            setCards(favMovies);
        }
    },
    //using toString() for the dependency here ensures that the cards will only be set when
    //the array is actually different. Otherwise, the new (identical) array object will 
    //repeatedly trigger a re-render.
    [favMovies.toString()])

    useEffect(() => {
        let newFavs = cards.map(c => c.id);
        reorderFavorites(newFavs);
    }, [cards])

    const findCard = useCallback(
        (id) => {
            const card = cards.filter((c) => `${c.id}` === id)[0]
            return {
                card,
                index: cards.indexOf(card),
            }
        },
        [cards],
    )

    const moveCard = useCallback(
        (id, atIndex) => {
            const { card, index } = findCard(id)
            setCards(
                update(cards, {
                    $splice: [
                        [index, 1],
                        [atIndex, 0, card],
                    ],
                }),
            );
        },
        [findCard, cards, setCards],
    )
    const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD}))
    return (
        <div ref={drop} style={style}>
            {cards.map((card, index) => (
                <DndCard
                    key={card.id}
                    id={`${card.id}`}
                    index={index}
                    title={card.title}
                    poster={card.poster}
                    moveCard={moveCard}
                    findCard={findCard} 
                />
            ))}
        </div>
    )
});

export default FavoritesList