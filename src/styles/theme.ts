export const theme = {
    colors: {
        // Primary colors
        primary: '#4A90E2',
        primaryHover: '#3a7bc8',
        primaryLight: 'rgba(74, 144, 226, 0.1)',
        
        // Text colors
        text: {
            primary: '#1e293b',
            secondary: '#475569',
            muted: '#64748b',
            placeholder: '#94a3b8',
        },
        
        // Background colors
        background: {
            white: '#ffffff',
            light: '#f8fafc',
            lighter: '#f8f9fa',
            gray: '#f1f3f6',
        },
        
        // Border colors
        border: {
            default: '#e2e8f0',
            light: '#e8ebef',
            dark: '#6B7A90',
        },
        
        // Status colors
        status: {
            good: {
                main: '#10b981',
                light: '#d1fae5',
                dark: '#065f46',
            },
            warning: {
                main: '#f59e0b',
                light: '#fed7aa',
                dark: '#92400e',
            },
            error: {
                main: '#ef4444',
                light: '#fecaca',
                dark: '#991b1b',
            },
            critical: {
                main: '#dc2626',
                light: '#fee2e2',
                dark: '#7f1d1d',
            },
            neutral: {
                main: '#64748b',
                light: '#e2e8f0',
                dark: '#475569',
            },
        },
    },
    
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        xxl: '24px',
    },
    
    borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        full: '16px',
        round: '50%',
    },
    
    typography: {
        fontFamily: 'inherit',
        fontSize: {
            xs: '12px',
            sm: '13px',
            base: '14px',
            md: '16px',
            lg: '18px',
            xl: '20px',
            xxl: '22px',
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
        },
        letterSpacing: {
            tight: '0.5px',
        },
    },
    
    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.03)',
        md: '0 1px 3px rgba(0, 0, 0, 0.08)',
        lg: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    
    transitions: {
        default: 'all 0.2s ease',
    },
    
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
    },
} as const;

export type Theme = typeof theme;




