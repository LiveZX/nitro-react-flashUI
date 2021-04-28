import { FurnitureListComposer, RoomObjectVariable, Vector3d } from 'nitro-renderer';
import { FC, useEffect } from 'react';
import { GetRoomEngine } from '../../../../api';
import { SendMessageHook } from '../../../../hooks/messages/message-event';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { RoomPreviewerView } from '../../../room-previewer/RoomPreviewerView';
import { useInventoryContext } from '../../context/InventoryContext';
import { InventoryFurnitureActions } from '../../reducers/InventoryFurnitureReducer';
import { FurniCategory } from '../../utils/FurniCategory';
import { attemptItemPlacement } from '../../utils/FurnitureUtilities';
import { InventoryFurnitureViewProps } from './InventoryFurnitureView.types';
import { InventoryFurnitureResultsView } from './results/InventoryFurnitureResultsView';
import { InventoryFurnitureSearchView } from './search/InventoryFurnitureSearchView';

export const InventoryFurnitureView: FC<InventoryFurnitureViewProps> = props =>
{
    const { roomSession = null, roomPreviewer = null } = props;

    const { furnitureState = null, dispatchFurnitureState = null } = useInventoryContext();
    const { needsFurniUpdate = false, groupItem = null, groupItems = [] } = furnitureState;

    useEffect(() =>
    {
        if(needsFurniUpdate)
        {
            dispatchFurnitureState({
                type: InventoryFurnitureActions.SET_NEEDS_UPDATE,
                payload: {
                    flag: false
                }
            });

            SendMessageHook(new FurnitureListComposer());
        }
        else
        {
            dispatchFurnitureState({
                type: InventoryFurnitureActions.SET_GROUP_ITEM,
                payload: {
                    groupItem: null
                }
            });
        }

    }, [ needsFurniUpdate, groupItems, dispatchFurnitureState ]);

    useEffect(() =>
    {
        if(!groupItem || !roomPreviewer) return;

        const furnitureItem = groupItem.getLastItem();

        if(!furnitureItem) return;

        const roomEngine = GetRoomEngine();

        let wallType        = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_WALL_TYPE);
        let floorType       = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_FLOOR_TYPE);
        let landscapeType   = roomEngine.getRoomInstanceVariable<string>(roomEngine.activeRoomId, RoomObjectVariable.ROOM_LANDSCAPE_TYPE);

        wallType        = (wallType && wallType.length) ? wallType : '101';
        floorType       = (floorType && floorType.length) ? floorType : '101';
        landscapeType   = (landscapeType && landscapeType.length) ? landscapeType : '1.1';

        roomPreviewer.reset(false);
        roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType);
        roomPreviewer.updateRoomWallsAndFloorVisibility(true, true);

        if((furnitureItem.category === FurniCategory._Str_3639) || (furnitureItem.category === FurniCategory._Str_3683) || (furnitureItem.category === FurniCategory._Str_3432))
        {
            floorType       = ((furnitureItem.category === FurniCategory._Str_3683) ? groupItem.stuffData.getLegacyString() : floorType);
            wallType        = ((furnitureItem.category === FurniCategory._Str_3639) ? groupItem.stuffData.getLegacyString() : wallType);
            landscapeType   = ((furnitureItem.category === FurniCategory._Str_3432) ? groupItem.stuffData.getLegacyString() : landscapeType);

            roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType);

            if(furnitureItem.category === FurniCategory._Str_3432)
            {
                // insert a window if the type is landscape
                //_local_19 = this._model.controller._Str_18225("ads_twi_windw", ProductTypeEnum.WALL);
                //this._roomPreviewer._Str_12087(_local_19.id, new Vector3d(90, 0, 0), _local_19._Str_4558);
            }
        }
        else
        {
            if(groupItem.isWallItem)
            {
                roomPreviewer.addWallItemIntoRoom(groupItem.type, new Vector3d(90), furnitureItem.stuffData.getLegacyString());
            }
            else
            {
                roomPreviewer.addFurnitureIntoRoom(groupItem.type, new Vector3d(90), groupItem.stuffData, (furnitureItem.extra.toString()));
            }
        }
    }, [ roomPreviewer, groupItem ]);

    return (
        <div className="row h-100">
            <div className="col col-7">
                <InventoryFurnitureSearchView />
                <InventoryFurnitureResultsView groupItems={ groupItems } />
            </div>
            <div className="d-flex flex-column col col-5 justify-space-between">
                <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                { groupItem && <div className="d-flex flex-column flex-grow-1">
                    <p className="flex-grow-1 fs-6 text-black my-2">{ groupItem.name }</p>
                    { !!roomSession && <button type="button" className="btn btn-success" onClick={ event => attemptItemPlacement(groupItem) }>{ LocalizeText('inventory.furni.placetoroom') }</button> }
                </div> }
            </div>
        </div>
    );
}