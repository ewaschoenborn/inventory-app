import GlobalStyle from './styles/GlobalStyle';

import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap

import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import logo from './assets/favicon.svg';
import Sidebar from './features/sidebar/Sidebar';

const LayoutWrapper = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;

    background: transparent;
`;

const ContentArea = styled.div`
    flex: 1;
    padding: 24px 32px;
    overflow-y: auto;

    margin-left: 0;

    @media (min-width: 768px) {
        margin-left: 220px;
    }
`;

const Logo = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 2000;

    /* optional styling */
    padding: 8px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    background-color: rgba(255, 255, 255, 0.9);
`;

const MainLayout = () => {
    return (
        <LayoutWrapper>
            <Sidebar />
            <ContentArea>
                <Outlet />
            </ContentArea>

            <Logo>
                <img src={logo} alt="Logo" style={{ width: '60px', height: '60px' }} />
            </Logo>
        </LayoutWrapper>
    );
};

const App = () => {
    return (
        <>
            <GlobalStyle />
            <MainLayout />
        </>
    );
};

export default App;
