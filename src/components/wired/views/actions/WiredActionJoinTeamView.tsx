import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Column } from '../../../../common/Column';
import { Flex } from '../../../../common/Flex';
import { Text } from '../../../../common/Text';
import { WiredFurniType } from '../../common/WiredFurniType';
import { useWiredContext } from '../../context/WiredContext';
import { WiredActionBaseView } from './WiredActionBaseView';

export const WiredActionJoinTeamView: FC<{}> = props =>
{
    const [ selectedTeam, setSelectedTeam ] = useState(-1);
    const { trigger = null, setIntParams = null } = useWiredContext();

    const save = useCallback(() =>
    {
        setIntParams([ selectedTeam ]);
    }, [ selectedTeam, setIntParams ]);

    useEffect(() =>
    {
        setSelectedTeam((trigger.intData.length > 0) ? trigger.intData[0] : 0);
    }, [ trigger ]);

    return (
        <WiredActionBaseView requiresFurni={ WiredFurniType.STUFF_SELECTION_OPTION_NONE } hasSpecialInput={ true } save={ save }>
            <Column gap={ 1 }>
                <Text bold>{ LocalizeText('wiredfurni.params.team') }</Text>
                { [1, 2, 3, 4].map(team =>
                    {
                        return (
                            <Flex key={ team } gap={ 1 }>
                                <input className="form-check-input" type="radio" name="selectedTeam" id={ `selectedTeam${ team }` } checked={ (selectedTeam === team) } onChange={ event => setSelectedTeam(team) } />
                                <Text>{ LocalizeText(`wiredfurni.params.team.${ team }`) }</Text>
                            </Flex>
                        )
                    }) }
            </Column>
        </WiredActionBaseView>
    );
}
