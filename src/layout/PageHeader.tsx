import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronRight } from 'lucide-react';

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;



  
  background: transparent;
  border-bottom: 1px solid transparent;
`;


const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #64748b;
`;

const CrumbLink = styled(Link)`
  color: #1e293b;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h2`
  margin-top: 12px;
  font-size: 22px;
  color: #1e293b;  
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

interface PageHeaderProps {
  title: string;
  actionButtons?: React.ReactNode;
}

const PageHeader = ({ title, actionButtons }: PageHeaderProps) => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <HeaderWrapper>
      <div>
        <Breadcrumbs>
          <CrumbLink to="/">Home</CrumbLink>
          {pathParts.map((part, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ChevronRight size={14} />
              {i === pathParts.length - 1 ? (
                <span style={{ color: '#475569', fontWeight: 600 }}>{part}</span>
              ) : (
                <CrumbLink to={`/${pathParts.slice(0, i + 1).join('/')}`}>{part}</CrumbLink>
              )}
            </span>
          ))}
        </Breadcrumbs>
        <PageTitle>{title}</PageTitle>
      </div>

      {actionButtons && <Actions>{actionButtons}</Actions>}
    </HeaderWrapper>
  );
};

export default PageHeader;
