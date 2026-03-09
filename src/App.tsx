import GlobalStyle from './styles/GlobalStyle';

import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap

import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './features/sidebar/Sidebar';

const LayoutWrapper = styled.div`
    position: relative;
    display: flex;
    height: calc(100vh - env(safe-area-inset-bottom, 0px) - env(safe-area-inset-top, 0px));
    width: 100vw;

    background: transparent;

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        flex-direction: column;
        padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px));
    }
`;

const ContentArea = styled.div`
    flex: 1;
    padding: 24px 32px;
    overflow-y: auto;

    margin-left: 0;

    background-color: var(--color-bg);

    height: 100%;
    width: 100%;

    @media only screen and (max-device-width: 812px) and (orientation: portrait) {
        padding: 12px 16px;
    }
`;

const MainLayout = () => {
    return (
        <LayoutWrapper>
            <Sidebar />
            <ContentArea>
                <Outlet />
            </ContentArea>
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
