import { memo } from 'react';
import Card  from 'react-bootstrap/Card';
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from './ItemTypes.js'

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

export const DndCard = memo(function DndCard({ id, title, index, poster, moveCard, findCard }) {
  const originalIndex = findCard(id).index;
  const [{ isDragging}, drag] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop){
          moveCard(droppedId, originalIndex);
        }
      }
    }),
    [id, originalIndex, moveCard]
  );


  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      hover({ id: draggedId}) {
        if (draggedId !== id) {
          const { index: overIndex} = findCard(id);
          moveCard(draggedId, overIndex);
        }
      }
    }),
    [findCard, moveCard]
  );
  const opacity = isDragging ? 0 : 1
    
  // drag(drop(ref))
  return (
    <div ref={(node) => drag(drop(node))} Style={{ ...style, opacity}}>
      <Card className="favoritesCard">
        { index < 9 ?
          <div className="favoritesNumber favoritesNumberOneDigit">
            { index + 1 }
          </div>
          :
          <div className='favoritesNumber favoritesNumberTwoDigit'>
            { index + 1 }
          </div>
        }
        <div>
          <Card.Img
            className="favoritesPoster"
            src={poster+"/100px180"}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src="/images/NoPosterAvailable-crop.jpeg"
            }
          }/>
        </div>
        <div className="favoritesHotel_name"> { title } </div>
        
      </Card>
    </div>
  );
});