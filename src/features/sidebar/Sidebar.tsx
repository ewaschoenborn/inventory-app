import { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Home, Wrench, Eye, CircleQuestionMark, ToyBrick, Backpack } from 'lucide-react';

const SidebarWrapper = styled.aside<{ open: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
    height: 100vh;
    background: #1e293b;
    color: white;
    overflow: hidden;
    transition: width 0.3s ease;
    display: flex;
    flex-direction: column;
    z-index: 1000;

    @media (min-width: 768px) {
        width: 220px;
    }
`;

const SidebarHeader = styled.div<{ $sidebarOpen?: boolean }>`
    padding: 20px;
    padding-left: ${({ $sidebarOpen }) => ($sidebarOpen ? '60px' : '20px')};

    font-size: 20px;
    font-weight: bold;
    background: #0f172a;
    border-bottom: 1px solid #334155;
`;

const NavLinks = styled.nav`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 4px;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
    display: flex;
    align-items: center;
    gap: 10px; /* 👈 space between icon and text */
    padding: 10px 14px;
    border-radius: 6px;
    color: ${({ $active }) => ($active ? '#0f172a' : 'white')};
    background: ${({ $active }) => ($active ? '#e2e8f0' : 'transparent')};
    font-weight: ${({ $active }) => ($active ? '600' : '400')};
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
        background: ${({ $active }) => ($active ? '#cbd5e1' : '#334155')};
    }

    svg {
        width: 18px;
        height: 18px;
    }
`;

const ToggleButton = styled.button`
    position: fixed;
    top: 14px;
    left: 14px;
    background: #1e293b;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px;
    z-index: 1100;
    cursor: pointer;
    display: flex;
    align-items: center;

    /*
  {/@media (min-width: 768px) {
    display: none;
  }
  */
`;

const BottomLinks = styled.nav`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    margin-top: auto; // this pushes it to the bottom
`;

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const links = [
        { to: '/', label: 'Home', icon: <Home /> },
        { to: '/dashboard', label: 'Inventory Overview', icon: <Eye /> },
        { to: '/maintenance', label: 'Maintenance Overview', icon: <Wrench /> },
        { to: '/overview', label: 'Items Overview', icon: <ToyBrick /> },
    ];

    const bottomLinks = [
        { to: '/packingplanOverview', label: 'Packing Plans', icon: <Backpack /> },
        { to: '/guide', label: 'Guide', icon: <CircleQuestionMark /> },
        { to: '/ImportScreen', label: 'Import/Export', icon: <CircleQuestionMark /> },
    ];

    return (
        <>
            <ToggleButton onClick={() => setOpen(!open)}>{open ? <Menu size={18} /> : <Menu size={18} />}</ToggleButton>

            <SidebarWrapper open={open}>
                <SidebarHeader $sidebarOpen={open}>Inventory App</SidebarHeader>
                <NavLinks>
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            $active={location.pathname === link.to}
                            onClick={() => setOpen(false)}
                        >
                            {link.icon}
                            {link.label}
                        </NavLink>
                    ))}
                </NavLinks>

                <BottomLinks>
                    {bottomLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            $active={location.pathname === link.to}
                            onClick={() => setOpen(false)}
                        >
                            {link.icon}
                            {link.label}
                        </NavLink>
                    ))}
                </BottomLinks>
            </SidebarWrapper>
        </>
    );
};

export default Sidebar;
