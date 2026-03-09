import type { Scope } from '../../app/api';

export const useIsLoggedIn = (): boolean => {
    return true;
};

export const useHasScope = (...scopes: Scope[]): boolean => {
    // TODO: replace with real active scopes
    const activeScopes = ['user', 'editor'];

    return scopes.some((scope) => activeScopes.includes(scope) ?? false);
};

export default useIsLoggedIn;
