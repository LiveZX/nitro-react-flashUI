import { CatalogRequestPetBreedsComposer, ColorConverter, SellablePetPaletteData } from 'nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { GetProductDataForLocalization } from '../../../../../../api/nitro/session/GetProductDataForLocalization';
import { SendMessageHook } from '../../../../../../hooks/messages/message-event';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { PetImageView } from '../../../../../pet-image/PetImageView';
import { RoomPreviewerView } from '../../../../../room-previewer/RoomPreviewerView';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogActions } from '../../../../reducers/CatalogReducer';
import { GetCatalogPageImage, GetCatalogPageText, GetPetAvailableColors, GetPetIndexFromLocalization } from '../../../../utils/CatalogUtilities';
import { CatalogLayoutPetViewProps } from './CatalogLayoutPetView.types';
import { CatalogLayoutPetPurchaseView } from './purchase/CatalogLayoutPetPurchaseView';

export const CatalogLayoutPetView: FC<CatalogLayoutPetViewProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { activeOffer = null, petPalettes = [] } = catalogState;
    const [ petIndex, setPetIndex ] = useState(-1);
    const [ sellablePalettes, setSellablePalettes ] = useState<SellablePetPaletteData[]>([]);
    const [ selectedPaletteIndex, setSelectedPaletteIndex ] = useState(-1);
    const [ sellableColors, setSellableColors ] = useState<number[][]>([]);
    const [ selectedColorIndex, setSelectedColorIndex ] = useState(-1);
    const [ colorsShowing, setColorsShowing ] = useState(false);

    useEffect(() =>
    {
        if(!pageParser || !pageParser.offers.length) return;

        const offer = pageParser.offers[0];

        dispatchCatalogState({
            type: CatalogActions.SET_CATALOG_ACTIVE_OFFER,
            payload: {
                activeOffer: offer
            }
        });

        setPetIndex(GetPetIndexFromLocalization(offer.localizationId));
        setColorsShowing(false);
    }, [ pageParser, dispatchCatalogState ]);

    useEffect(() =>
    {
        if(!activeOffer) return;

        const productData = GetProductDataForLocalization(activeOffer.localizationId);

        if(!productData) return;

        for(const paletteData of petPalettes)
        {
            if(paletteData.breed !== productData.type) continue;

            const palettes: SellablePetPaletteData[] = [];

            for(const palette of paletteData.palettes)
            {
                if(!palette.sellable) continue;

                palettes.push(palette);
            }

            setSelectedPaletteIndex((palettes.length ? 0 : -1));
            setSellablePalettes(palettes);

            return;
        }

        setSelectedPaletteIndex(-1);
        setSellablePalettes([]);

        SendMessageHook(new CatalogRequestPetBreedsComposer(productData.type));
    }, [ activeOffer, petPalettes ]);

    useEffect(() =>
    {
        if(petIndex === -1) return;

        const colors = GetPetAvailableColors(petIndex, sellablePalettes);

        setSelectedColorIndex((colors.length ? 0 : -1));
        setSellableColors(colors);
    }, [ petIndex, sellablePalettes ]);

    const getColor = useMemo(() =>
    {
        if(!sellableColors.length || (selectedColorIndex === -1)) return 0xFFFFFF;

        return sellableColors[selectedColorIndex][0];
    }, [ sellableColors, selectedColorIndex ]);

    useEffect(() =>
    {
        if(!roomPreviewer) return;

        roomPreviewer && roomPreviewer.reset(false);

        if((petIndex === -1) || !sellablePalettes.length || (selectedPaletteIndex === -1)) return;

        let petFigureString = `${ petIndex } ${ sellablePalettes[selectedPaletteIndex].paletteId }`;

        if(petIndex <= 7) petFigureString += ` ${ getColor.toString(16) }`;

        roomPreviewer.addPetIntoRoom(petFigureString);
    }, [ roomPreviewer, petIndex, sellablePalettes, selectedPaletteIndex, getColor ]);

    const petBreedName = useMemo(() =>
    {
        if((petIndex === -1) || !sellablePalettes.length || (selectedPaletteIndex === -1)) return '';

        return LocalizeText(`pet.breed.${ petIndex }.${ sellablePalettes[selectedPaletteIndex].breedId }`);
    }, [ petIndex, sellablePalettes, selectedPaletteIndex ]);

    const petPurchaseString = useMemo(() =>
    {
        if(!sellablePalettes.length || (selectedPaletteIndex === -1)) return '';

        const paletteId = sellablePalettes[selectedPaletteIndex].paletteId;

        let color = 0xFFFFFF;

        if(petIndex <= 7)
        {
            if(selectedColorIndex === -1) return '';

            color = sellableColors[selectedColorIndex][0];
        }

        let colorString = color.toString(16).toUpperCase();

        while(colorString.length < 6)
        {
            colorString = ('0' + colorString);
        }

        return `${ paletteId }\n${ colorString }`;
    }, [ sellablePalettes, selectedPaletteIndex, petIndex, sellableColors, selectedColorIndex ]);

    if(!activeOffer) return null;

    return (
        <div className="row h-100 nitro-catalog-layout-pets">
            <div className="col-7">
                <div className="row row-cols-5 align-content-start g-0 mb-n1 w-100 catalog-offers-container single-bundle-items-container">
                    { colorsShowing && (sellableColors.length > 0) && sellableColors.map((colorSet, index) =>
                        {
                            return <div key={ index } className="col pe-1 pb-1 catalog-offer-item-container">
                                <div className={ 'position-relative border border-2 rounded catalog-offer-item cursor-pointer ' + ((selectedColorIndex === index) ? 'active ' : '') } style={ { backgroundColor: ColorConverter.int2rgb(colorSet[0]) } } onClick={ event => setSelectedColorIndex(index) }>
                                </div>
                            </div>;
                        })}
                    { !colorsShowing && (sellablePalettes.length > 0) && sellablePalettes.map((palette, index) =>
                        {
                            return <div key={ index } className="col pe-1 pb-1 catalog-offer-item-container">
                                <div className={ 'position-relative border border-2 rounded catalog-offer-item cursor-pointer ' + ((selectedPaletteIndex === index) ? 'active ' : '') } onClick={ event => setSelectedPaletteIndex(index) }>
                                    <PetImageView typeId={ petIndex } paletteId={ palette.paletteId } direction={ 2 } headOnly={ true } />
                                </div>
                            </div>;
                        }) }
                </div>
            </div>
            { (petIndex === -1) &&
                <div className="position-relative d-flex flex-column col-5 justify-content-center align-items-center">
                    <div className="d-block mb-2">
                        <img alt="" src={ GetCatalogPageImage(pageParser, 1) } />
                    </div>
                    <div className="fs-6 text-center text-black lh-sm overflow-hidden">{ GetCatalogPageText(pageParser, 0) }</div>
                </div> }
            { (petIndex >= 0) &&
                <div className="position-relative d-flex flex-column col-5">
                    <RoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 }>
                        { (petIndex > -1 && petIndex <= 7) &&
                            <button type="button" className= { 'btn btn-primary btn-sm color-button ' + (colorsShowing ? 'active ' : '') } onClick={ event => setColorsShowing(!colorsShowing) }>
                                <i className="fas fa-fill-drip" />
                            </button> }
                    </RoomPreviewerView>
                    <div className="fs-6 text-black mt-1 overflow-hidden">{ petBreedName }</div>
                    <CatalogLayoutPetPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } extra={ petPurchaseString } />
                </div> }
        </div>
    );
}