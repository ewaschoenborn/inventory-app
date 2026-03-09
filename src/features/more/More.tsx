import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Eye, CircleQuestionMark, FolderSync } from 'lucide-react';
import PageHeader from '../../layout/PageHeader';

const MoreContainer = styled.div`
    padding: 16px;
`;

const SectionList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
`;

const SectionItem = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: white;
    border: 0.5px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);

    &:hover {
        background-color: #f8fafc;
        border-color: #4A90E2;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    &:active {
        transform: translateY(0);
    }
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background-color: #f1f5f9;
    color: #4A90E2;
    flex-shrink: 0;
`;

const SectionContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const SectionTitle = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
`;

const SectionDescription = styled.div`
    font-size: 13px;
    color: #64748b;
`;

const More = () => {
    const navigate = useNavigate();

    const sections = [
        {
            path: '/import',
            title: 'Import / Export',
            description: 'Daten importieren und exportieren',
            icon: FolderSync,
        },
        {
            path: '/guide',
            title: 'Anleitung',
            description: 'Hilfe und Dokumentation',
            icon: CircleQuestionMark,
        },
    ];

    return (
        <div>
            <PageHeader title="Mehr" />
            <MoreContainer>
                <SectionList>
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <SectionItem
                                key={section.path}
                                onClick={() => navigate(section.path)}
                            >
                                <IconWrapper>
                                    <Icon size={20} />
                                </IconWrapper>
                                <SectionContent>
                                    <SectionTitle>{section.title}</SectionTitle>
                                    <SectionDescription>{section.description}</SectionDescription>
                                </SectionContent>
                            </SectionItem>
                        );
                    })}
                </SectionList>
            </MoreContainer>
        </div>
    );
};

export default More;

