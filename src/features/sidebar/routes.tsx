import { Home, Package, FolderSync, CircleQuestionMark, ClipboardList } from 'lucide-react';

// Central navigation list used by the sidebar.
export const navItems = [
    { path: '/', label: 'Start', icon: Home },
    { path: '/items', label: 'Inventar', icon: Package },
    { path: '/packing-plans', label: 'Packing Plans', icon: ClipboardList },
    // { path: '/maintenance', label: 'Wartung', icon: Wrench },
    { path: '/import', label: 'Import / Export', icon: FolderSync },
    { path: '/guide', label: 'Anleitung', icon: CircleQuestionMark },
];
