import { FC } from 'react';
import { DraggableWindow } from '../../hooks/draggable-window/DraggableWindow';
import { NitroCardViewProps } from './NitroCardView.types';

export const NitroCardView: FC<NitroCardViewProps> = props =>
{
    const { className = '', disableDrag = false } = props;

    return (
        <DraggableWindow handle=".drag-handler" disableDrag= { disableDrag }>
            <div className={ 'nitro-card d-flex flex-column rounded border shadow overflow-hidden ' + className }>
                { props.children }
            </div>
        </DraggableWindow>
    );
}