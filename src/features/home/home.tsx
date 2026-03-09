import styled from 'styled-components';
import { inventoryApi } from '../../app/api';
import type { IItem } from '../../db/items';
import { Card } from '../../styles/components';
import StatusBadge from '../../utils/StatusBadge';
import { theme } from '../../styles/theme';
import { Link } from 'react-router-dom';

const Home = () => {
    const { totalCount, firstThreeEntries } = inventoryApi.useCountWithFilter({});
    const { totalCount: damagedCount, firstThreeEntries: threeDamaged } = inventoryApi.useCountWithFilter({
        damageLevel: ['minor', 'major', 'total'],
    });

    return (
        <div>
            <h1 style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>Willkommen!</h1>

            <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <StatisticCard>
                        <span>
                            <h3>Anzahl aller Einträge</h3>
                            <h1>{totalCount}</h1>
                        </span>
                        {totalCount > 0 && (
                            <PreviewItemContainer>
                                {firstThreeEntries.map((item) => (
                                    <PreviewItem key={item.id} item={item} />
                                ))}
                            </PreviewItemContainer>
                        )}
                        <Link to="/items">Mehr...</Link>
                    </StatisticCard>
                    <StatisticCard>
                        <span>
                            <h3>Einträge, die deine Aufmerksamkeit brauchen</h3>
                            <h1>{damagedCount}</h1>
                        </span>
                        {damagedCount > 0 && (
                            <PreviewItemContainer>
                                {threeDamaged.map((item) => (
                                    <PreviewItem key={item.id} item={item} />
                                ))}
                            </PreviewItemContainer>
                        )}
                        <Link to="/items">Mehr...</Link>
                    </StatisticCard>
                </div>
            </div>
        </div>
    );
};

const PreviewItemContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: ${theme.colors.background.lighter};
    padding: 10px;
    border-radius: 6px;
`;

const StatisticCard = styled(Card)`
    display: flex;
    flex-direction: column;
    gap: 8px;

    padding: 24px;
    h1,
    h3 {
        margin: 0;
    }
    h3 {
        color: ${theme.colors.text.muted};
        font-size: ${theme.typography.fontSize.base};
        margin-bottom: 4px;
    }

    h1 {
        font-size: ${theme.typography.fontSize.xxl};
        font-weight: bold;
    }

    font-size: ${theme.typography.fontSize.base};
`;

const PreviewItem = (props: { item: IItem }) => {
    return (
        <PreviewItemWrapper to={`items/${props.item.id}`}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '6px',
                    alignItems: 'center',
                    fontSize: '13px',
                    color: '#64748b',
                }}
            >
                <StatusBadge damageLevelType={props.item.damageLevel} omitText />
                <div>
                    <span>{props.item.id}</span>
                </div>
                <span>-</span>
                <span>
                    {props.item.availability} / {props.item.amountActual} / {props.item.amountTarget}
                </span>
            </div>
            <span>{props.item.inventoryNumber ?? 'ohne Inventarnummer'}</span>
        </PreviewItemWrapper>
    );
};

const PreviewItemWrapper = styled(Link)`
    font-size: ${theme.typography.fontSize.base};
    color: ${theme.colors.text.primary};

    padding: 8px 10px;
    border: 1px solid ${theme.colors.border.light};
    border-radius: 10px;

    background-color: #fff;
`;

export default Home;
