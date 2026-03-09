import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Droplets, Flame, Wind, Search, FileText, ChevronLeft } from 'lucide-react';
import { packingPlanApi } from '../../app/packingPlanApi';
import type { IPackingPlan, EmergencyScenarioType } from '../../db/packingPlans';
import { Card, Container, BackButton } from '../../styles/components';
import { theme } from '../../styles/theme';
import IconContainer from '../../utils/IconContainer';

// Icon mapping for scenario types shown on cards.
const getScenarioIcon = (scenarioType: EmergencyScenarioType) => {
    switch (scenarioType) {
        case 'flood':
            return Droplets;
        case 'fire':
            return Flame;
        case 'storm':
            return Wind;
        case 'earthquake':
        case 'search_rescue':
            return Search;
        default:
            return FileText;
    }
};

// Human-readable labels for scenario types.
const getScenarioLabel = (scenarioType: EmergencyScenarioType): string => {
    switch (scenarioType) {
        case 'flood':
            return 'Flood';
        case 'fire':
            return 'Fire';
        case 'storm':
            return 'Storm';
        case 'earthquake':
            return 'Earthquake';
        case 'search_rescue':
            return 'Search & Rescue';
        case 'custom':
            return 'Custom';
        default:
            return scenarioType;
    }
};

const PackingPlanOverview = () => {
    const navigate = useNavigate();
    // Live list of saved packing plans from Dexie.
    const packingPlans = packingPlanApi.usePackingPlans();

    const handlePlanClick = (planId: string) => {
        navigate(`/packing-plans/${planId}`);
    };

    return (
        <StyledContainer>
            <Header>
                <HeaderLeft>
                    <StyledBackButton onClick={() => navigate(-1)}>
                        <ChevronLeft size={20} />
                    </StyledBackButton>
                    <Title>Packing Plans</Title>
                </HeaderLeft>
            </Header>

            {packingPlans.length === 0 ? (
                <EmptyState>
                    <IconContainer icon={FileText} />
                    <EmptyStateTitle>No packing plans yet</EmptyStateTitle>
                    <EmptyStateText>
                        No packing plans have been created yet.
                    </EmptyStateText>
                </EmptyState>
            ) : (
                <PlansGrid>
                    {packingPlans.map((plan) => {
                        const Icon = getScenarioIcon(plan.scenarioType);
                        const scenarioLabel = getScenarioLabel(plan.scenarioType);

                        return (
                            <PlanCard key={plan.id} onClick={() => handlePlanClick(plan.id)}>
                                <PlanCardHeader>
                                    <IconContainer icon={Icon} />
                                    <PlanTitle>{plan.name}</PlanTitle>
                                </PlanCardHeader>
                                <PlanMeta>
                                    <PlanMetaItem>
                                        <PlanMetaLabel>Scenario:</PlanMetaLabel>
                                        <PlanMetaValue>{scenarioLabel}</PlanMetaValue>
                                    </PlanMetaItem>
                                    {plan.description && (
                                        <PlanDescription>{plan.description}</PlanDescription>
                                    )}
                                </PlanMeta>
                                <PlanFooter>
                                    <PlanDate>
                                        Created:{' '}
                                        {new Date(plan.createdAt).toLocaleDateString('en-US', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </PlanDate>
                                </PlanFooter>
                            </PlanCard>
                        );
                    })}
                </PlansGrid>
            )}
        </StyledContainer>
    );
};

export default PackingPlanOverview;

// ─── Styled Components ────────────────────────────────────

const StyledContainer = styled(Container)`
    padding: ${theme.spacing.xl};
    max-width: 1200px;
    margin: 0 auto;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.xl};
    gap: ${theme.spacing.md};

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        flex-direction: column;
        align-items: flex-start;
        gap: ${theme.spacing.md};
    }
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    flex: 1;
    min-width: 0;
`;

const StyledBackButton = styled(BackButton)`
    padding-left: 0;
    margin-left: 0;
    flex-shrink: 0;
`;

const Title = styled.h1`
    font-size: ${theme.typography.fontSize.xxl};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin: 0;
    flex: 1;
    min-width: 0;
`;

const PlansGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: ${theme.spacing.lg};

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        grid-template-columns: 1fr;
    }
`;

const PlanCard = styled(Card)`
    cursor: pointer;
    transition: ${theme.transitions.default};
    display: flex;
    flex-direction: column;
    min-height: 180px;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.lg};
        border-color: ${theme.colors.primary};
    }
`;

const PlanCardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
`;

const PlanTitle = styled.h3`
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin: 0;
    flex: 1;
`;

const PlanMeta = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.md};
`;

const PlanMetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
`;

const PlanMetaLabel = styled.span`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.muted};
    font-weight: ${theme.typography.fontWeight.medium};
`;

const PlanMetaValue = styled.span`
    font-size: ${theme.typography.fontSize.base};
    color: ${theme.colors.text.primary};
`;

const PlanDescription = styled.p`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
    margin: 0;
    line-height: 1.5;
`;

const PlanFooter = styled.div`
    padding-top: ${theme.spacing.md};
    border-top: 1px solid ${theme.colors.border.default};
    margin-top: auto;
`;

const PlanDate = styled.div`
    font-size: ${theme.typography.fontSize.xs};
    color: ${theme.colors.text.muted};
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.xxl} ${theme.spacing.xl};
    text-align: center;
    gap: ${theme.spacing.lg};

    ${IconContainer} {
        color: ${theme.colors.text.muted};
        opacity: 0.5;
    }
`;

const EmptyStateTitle = styled.h2`
    font-size: ${theme.typography.fontSize.xl};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin: 0;
`;

const EmptyStateText = styled.p`
    font-size: ${theme.typography.fontSize.base};
    color: ${theme.colors.text.secondary};
    max-width: 500px;
    margin: 0;
    line-height: 1.6;
`;

