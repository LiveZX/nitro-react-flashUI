import { IFurnitureData, PetCustomPart, PetFigureData, RoomObjectCategory, RoomObjectVariable, RoomUserData } from 'nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { GetFurnitureDataForRoomObject, GetRoomEngine } from '../../../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../../layout';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { FurniCategory } from '../../../../../inventory/common/FurniCategory';
import { PetImageView } from '../../../../../shared/pet-image/PetImageView';
import { useRoomContext } from '../../../../context/RoomContext';
import { RoomWidgetUseProductMessage } from '../../../../messages';
import { AvatarInfoUseProductConfirmViewProps } from './AvatarInfoUseProductConfirmView.types';

const _Str_5091: number = -1;
const _Str_11906: number = 0;
const _Str_11214: number = 1;
const _Str_11733: number = 2;
const _Str_11369: number = 3;
const _Str_8759: number = 4;
const _Str_8432: number = 5;
const _Str_9653: number = 6;

export const AvatarInfoUseProductConfirmView: FC<AvatarInfoUseProductConfirmViewProps> = props =>
{
    const { item = null, close = null } = props;
    const [ mode, setMode ] = useState(_Str_5091);
    const [ petData, setPetData ] = useState<RoomUserData>(null);
    const [ furniData, setFurniData ] = useState<IFurnitureData>(null);
    const { roomSession = null, widgetHandler = null } = useRoomContext();

    const selectRoomObject = useCallback(() =>
    {
        if(!petData) return;

        GetRoomEngine().selectRoomObject(roomSession.roomId, petData.roomIndex, RoomObjectCategory.UNIT);
    }, [ roomSession, petData ]);

    const useProduct = useCallback(() =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetUseProductMessage(RoomWidgetUseProductMessage.PET_PRODUCT, item.requestRoomObjectId, petData.webID));

        close();
    }, [ widgetHandler, item, petData, close ]);

    const getPetImage = useMemo(() =>
    {
        if(!petData || !furniData) return null;
        
        const petFigureData = new PetFigureData(petData.figure);
        const customParts = furniData.customParams.split(' ');
        const petIndex = parseInt(customParts[0]);

        switch(furniData.specialType)
        {
            case FurniCategory._Str_7696: {
                if(customParts.length < 2) return null;

                const currentPalette = GetRoomEngine().getPetColorResult(petIndex, petFigureData.paletteId);
                const possiblePalettes = GetRoomEngine().getPetColorResultsForTag(petIndex, customParts[1]);

                let paletteId = -1;

                for(const result of possiblePalettes)
                {
                    if(result.breed === currentPalette.breed)
                    {
                        paletteId = parseInt(result.id);

                        break;
                    }
                }

                return <PetImageView typeId={ petFigureData.typeId } paletteId={ paletteId } color={ petFigureData.color } customParts={ petFigureData.customParts } direction={ 2 } />
            }
            case FurniCategory._Str_7297: {
                if(customParts.length < 4) return null;

                const newCustomParts: PetCustomPart[] = [];

                const _local_6 = customParts[1].split(',').map(piece => parseInt(piece));
                const _local_7 = customParts[2].split(",").map(piece => parseInt(piece));
                const _local_8 = customParts[3].split(",").map(piece => parseInt(piece));

                let _local_10 = 0;

                while(_local_10 < _local_6.length)
                {
                    const _local_13 = _local_6[_local_10];
                    const _local_15 = petFigureData.getCustomPart(_local_13);
                    
                    let _local_12 = _local_8[_local_10];

                    if (_local_15 != null) _local_12 = _local_15.paletteId;

                    newCustomParts.push(new PetCustomPart(_local_13, _local_7[_local_10], _local_12));

                    _local_10++;
                }

                return <PetImageView typeId={ petFigureData.typeId } paletteId={ petFigureData.paletteId } color={ petFigureData.color } customParts={ newCustomParts } direction={ 2 } />;
            }
            case FurniCategory._Str_7954: {
                if(customParts.length < 3) return null;

                const newCustomParts: PetCustomPart[] = [];

                const _local_6 = customParts[1].split(",").map(piece => parseInt(piece));
                const _local_8 = customParts[2].split(",").map(piece => parseInt(piece));

                let _local_10 = 0;

                while(_local_10 < _local_6.length)
                {
                    const _local_13 = _local_6[_local_10];
                    const _local_15 = petFigureData.getCustomPart(_local_13);

                    let _local_14 = -1;

                    if(_local_15 != null) _local_14 = _local_15.partId;

                    newCustomParts.push(new PetCustomPart(_local_6[_local_10], _local_14, _local_8[_local_10]));

                    _local_10++;
                }

                return <PetImageView typeId={ petFigureData.typeId } paletteId={ petFigureData.paletteId } color={ petFigureData.color } customParts={ newCustomParts } direction={ 2 } />;
            }
            case FurniCategory._Str_6096: {
                if(customParts.length < 4) return null;

                const newCustomParts: PetCustomPart[] = [];

                const _local_6 = customParts[1].split(',').map(piece => parseInt(piece));
                const _local_7 = customParts[2].split(",").map(piece => parseInt(piece));
                const _local_8 = customParts[3].split(",").map(piece => parseInt(piece));

                let _local_10 = 0;

                while(_local_10 < _local_6.length)
                {
                    newCustomParts.push(new PetCustomPart(_local_6[_local_10], _local_7[_local_10], _local_8[_local_10]));

                    _local_10++;
                }

                for(const _local_21 of petFigureData.customParts)
                {
                    if(_local_6.indexOf(_local_21.layerId) === -1)
                    {
                        newCustomParts.push(_local_21);
                    }
                }

                return <PetImageView typeId={ petFigureData.typeId } paletteId={ petFigureData.paletteId } color={ petFigureData.color } customParts={ newCustomParts } direction={ 2 } />;
            }
            case FurniCategory._Str_8726:
            case FurniCategory._Str_6915:
            case FurniCategory._Str_9449: {
                let posture = 'rip';

                const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, petData.roomIndex, RoomObjectCategory.UNIT);

                if(roomObject)
                {
                    posture = roomObject.model.getValue<string>(RoomObjectVariable.FIGURE_POSTURE);

                    if(posture === 'rip')
                    {
                        const level = petData.petLevel;

                        if(level < 7) posture = `grw${ level }`;
                        else posture = 'std';
                    }
                }

                return <PetImageView typeId={ petFigureData.typeId } paletteId={ petFigureData.paletteId } color={ petFigureData.color } customParts={ petFigureData.customParts } posture={ posture } direction={ 2 } />;
            }
        }
    }, [ petData, furniData, roomSession ]);

    useEffect(() =>
    {
        const userData = roomSession.userDataManager.getUserDataByIndex(item.id);

        setPetData(userData);

        const furniData = GetFurnitureDataForRoomObject(roomSession.roomId, item.requestRoomObjectId, RoomObjectCategory.FLOOR);

        if(!furniData) return;

        setFurniData(furniData);

        let mode = _Str_5091;

        switch(furniData.specialType)
        {
            case FurniCategory._Str_7696:
                mode = _Str_11906;
                break;
            case FurniCategory._Str_7297:
                mode = _Str_11214;
                break;
            case FurniCategory._Str_7954:
                mode = _Str_11733;
                break;
            case FurniCategory._Str_6096:
                mode = _Str_11369;
                break;
            case FurniCategory._Str_6915:
                mode = _Str_8759;
                break;
            case FurniCategory._Str_8726:
                mode = _Str_8432;
                break;
            case FurniCategory._Str_9449:
                mode = _Str_9653;
                break;
        }

        setMode(mode);
    }, [ roomSession, item ]);

    if(!petData) return null;

    return (
        <NitroCardView className="nitro-use-product-confirmation">
            <NitroCardHeaderView headerText={ LocalizeText('useproduct.widget.title', [ 'name' ], [ petData.name ]) } onCloseClick={ close } />
            <NitroCardContentView>
                <div className="row">
                    <div className="w-unset">
                        <div className="product-preview cursor-pointer" onClick={ selectRoomObject }>
                            { getPetImage }
                        </div>
                    </div>
                    <div className="col d-flex flex-column justify-content-between">
                        <div className="d-flex flex-column">
                            { (mode === _Str_11906) && 
                                <>
                                    <div className="text-black mb-2">{ LocalizeText('useproduct.widget.text.shampoo', [ 'productName' ], [ furniData.name ] ) }</div>
                                    <div className="text-black">{ LocalizeText('useproduct.widget.info.shampoo') }</div>
                                </> }
                            { (mode === _Str_11214) && 
                                <>
                                    <div className="text-black mb-2">{ LocalizeText('useproduct.widget.text.custompart', [ 'productName' ], [ furniData.name ] ) }</div>
                                    <div className="text-black">{ LocalizeText('useproduct.widget.info.custompart') }</div>
                                </> }
                            { (mode === _Str_11733) && 
                                <>
                                    <div className="text-black mb-2">{ LocalizeText('useproduct.widget.text.custompartshampoo', [ 'productName' ], [ furniData.name ] ) }</div>
                                    <div className="text-black">{ LocalizeText('useproduct.widget.info.custompartshampoo') }</div>
                                </> }
                            { (mode === _Str_11369) && 
                                <>
                                    <div className="text-black mb-2">{ LocalizeText('useproduct.widget.text.saddle', [ 'productName' ], [ furniData.name ] ) }</div>
                                    <div className="text-black">{ LocalizeText('useproduct.widget.info.saddle') }</div>
                                </> }
                            { (mode === _Str_8759) && 
                                <>
                                    <div className="text-black mb-2">{ LocalizeText('useproduct.widget.text.revive_monsterplant', [ 'productName' ], [ furniData.name ] ) }</div>
                                    <div className="text-black">{ LocalizeText('useproduct.widget.info.revive_monsterplant') }</div>
                                </> }
                            { (mode === _Str_8432) && 
                                <>
                                    <div className="text-black mb-2">{ LocalizeText('useproduct.widget.text.rebreed_monsterplant', [ 'productName' ], [ furniData.name ] ) }</div>
                                    <div className="text-black">{ LocalizeText('useproduct.widget.info.rebreed_monsterplant') }</div>
                                </> }
                            { (mode === _Str_9653) && 
                                <>
                                    <div className="text-black mb-2">{ LocalizeText('useproduct.widget.text.fertilize_monsterplant', [ 'productName' ], [ furniData.name ] ) }</div>
                                    <div className="text-black">{ LocalizeText('useproduct.widget.info.fertilize_monsterplant') }</div>
                                </> }
                        </div>
                        <div className="d-flex justify-content-between align-items-end w-100 h-100">
                            <button type="button" className="btn btn-danger" onClick={ close }>{ LocalizeText('useproduct.widget.cancel') }</button>
                            <button type="button" className="btn btn-primary" onClick={ useProduct }>{ LocalizeText('useproduct.widget.use') }</button>
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}