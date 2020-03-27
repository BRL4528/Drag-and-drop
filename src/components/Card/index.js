import React, { useRef, useContext } from 'react';
// Item importado responsavel pela utlizzação do  DRAG N' DROP
import { useDrag, useDrop } from 'react-dnd'

import BoardContext from '../Board/context'

import { Container, Label } from './styles';
// Desestruturo minha Props, para utilizar a que eu quero => [{ isDraggind }]
export default function Card({ data, index, listIndex }) {
  const ref = useRef();
  const { move } = useContext(BoardContext);

  const [{ isDraggind }, dragRef] = useDrag({
    item: { type: 'CARD', index, listIndex },
    collect: monitor => ({
      isDraggind: monitor.isDragging(),
    })
  })
// Netse Momento meu card vai ser tanto um elemento arrastavel, quanto um CONTAINER.
// hover(item, monitor)  => o Hover é acionando toda vez que passo meu card, por cima de outro, "item" contem as informações do card que esta sendo arrastado.
// o "monitor" = traz informações do card em realação a posição dele na tela.
  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor){
    const draggedListIndex = item.listIndex;
    const targetListIndex = listIndex;

     const draggedIndex = item.index;
     const targetIndex = index;

     if(draggedIndex === targetIndex && draggedListIndex === targetListIndex) {
       return;
     }
     const targetSize = ref.current.getBoundingClientRect();
     const targetCenter = (targetSize.bottom - targetSize.top) / 2;
     
     const draggedOffset = monitor.getClientOffset();

     const draggedTop = draggedOffset.y - targetSize.top;
     
     if(draggedIndex < targetIndex && draggedTop < targetCenter) {
       return;
     }
     if(draggedIndex > targetIndex && draggedTop > targetCenter){
       return;
     }

     move(draggedListIndex,targetListIndex, draggedIndex, targetIndex);

     item.index = targetIndex;
     item.listIndex = targetListIndex;
      
    }
  });

  // Adiciono aq duas funções dentro de ref, para ser usado em meu elemento Container
  dragRef(dropRef(ref))

  return (
    <Container ref={ref} isDraggind={isDraggind}>
      <header>
        { data.labels.map( label => <Label key={label} color={label} /> ) }
        
      </header>
      <p>{data.content}</p>
       { data.user &&  <img src={data.user} alt="" /> }
    </Container>
  );
}
