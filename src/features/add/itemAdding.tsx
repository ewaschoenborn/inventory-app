import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronLeft } from 'lucide-react';
import { theme } from '../../styles/theme';
import {
    Container,
    Card,
    FormGroup,
    Label,
    Input,
    Select,
    Button,
    ContentWrapper,
    BackButton,
    Header,
    HelperText,
    ButtonGroup,
} from '../../styles/components';

const StyledContainer = styled(Container)`
    @media (min-width: ${theme.breakpoints.lg}) {
        max-width: 800px;
    }
`;

const StyledHeader = styled(Header)`
    padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md} 0;
    margin-bottom: ${theme.spacing.xl};
`;

const StyledCard = styled(Card)`
    margin: 0 16px;
    padding: ${theme.spacing.xl};
    border-radius: ${theme.borderRadius.lg};
    box-shadow: ${theme.shadows.sm};

    @media (min-width: 768px) {
        margin: 0 auto;
        max-width: 600px;
    }
`;

const StyledFormGroup = styled(FormGroup)`
    margin-bottom: ${theme.spacing.lg};
`;

const StyledButtonGroup = styled(ButtonGroup)`
    margin-top: ${theme.spacing.xl};
    width: 100%;
`;

const StyledButton = styled(Button)`
    height: 52px;
    font-size: ${theme.typography.fontSize.base};
    padding: 0 ${theme.spacing.xxl};
`;

const ItemAdding = () => {
    const navigate = useNavigate();

    // Local form state for the minimal item fields on this screen.
    const [newItem, setNewItem] = useState({
        name: '',
        id: '',
        damageLevel: '',
        location: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        // One handler updates any field by input name.
        const { name, value } = e.target;
        setNewItem((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Placeholder: item persistence will be wired in later.
        // Save to DB here
        console.log('New Item:', newItem);

        // Redirect back to overview (keeping current behavior)
        navigate('/overview');
    };

    return (
        <StyledContainer>
            <StyledHeader>
                <BackButton onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} />
                </BackButton>
            </StyledHeader>
            <ContentWrapper>
                <StyledCard>
                    <StyledFormGroup>
                        <Label htmlFor="itemName">Item Name</Label>
                        <Input
                            type="text"
                            id="itemName"
                            placeholder="Enter item name"
                            name="name"
                            value={newItem.name}
                            onChange={handleChange}
                        />
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="itemId">Item ID</Label>
                        <Input
                            type="text"
                            id="itemId"
                            placeholder="Enter item ID"
                            name="id"
                            value={newItem.id}
                            onChange={handleChange}
                        />
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="damageLevel">Damage Level</Label>
                        <Select id="damageLevel" name="damageLevel" value={newItem.damageLevel} onChange={handleChange}>
                            <option value="">Select damage level</option>
                            <option value="None">None</option>
                            <option value="Minor">Minor</option>
                            <option value="Major">Major</option>
                            <option value="Total">Total</option>
                        </Select>
                    </StyledFormGroup>

                    <StyledFormGroup>
                        <Label htmlFor="location">Location</Label>
                        <Input
                            type="text"
                            id="location"
                            placeholder="Enter location"
                            name="location"
                            value={newItem.location}
                            onChange={handleChange}
                        />
                        <HelperText>Example: 3B, 2C, Warehouse A</HelperText>
                    </StyledFormGroup>

                    <StyledButtonGroup>
                        <StyledButton $variant="primary" onClick={handleSave}>
                            Save Item
                        </StyledButton>
                        <StyledButton $variant="ghost" onClick={() => navigate(-1)}>
                            Cancel
                        </StyledButton>
                    </StyledButtonGroup>
                </StyledCard>
            </ContentWrapper>
        </StyledContainer>
    );
};

export default ItemAdding;
