import { createContext, useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { authApi } from '../../api/auth';
import { Issuer } from '../../utils/auth';

const STORAGE_KEY = 'accessToken';

var ActionType;
(function (ActionType) {
    ActionType['INITIALIZE'] = 'INITIALIZE';
    ActionType['SIGN_IN'] = 'SIGN_IN';
    ActionType['SIGN_UP'] = 'SIGN_UP';
    ActionType['SIGN_OUT'] = 'SIGN_OUT';
})(ActionType || (ActionType = {}));

const initialState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const handlers = {
    INITIALIZE: (state, action) => {
        const { isAuthenticated, user } = action.payload;

        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        };
    },
    SIGN_IN: (state, action) => {
        const { user } = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
    SIGN_UP: (state, action) => {
        return {
            ...state,
            isAuthenticated: false,
            user: null,
        };
    },
    SIGN_OUT: (state) => ({
        ...state,
        isAuthenticated: false,
        user: null,
    }),
};

const reducer = (state, action) =>
    handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({
    ...initialState,
    issuer: Issuer.JWT,
    signIn: () => Promise.resolve(),
    signUp: () => Promise.resolve(),
    signOut: () => Promise.resolve(),
});

export const AuthProvider = (props) => {
    const { children } = props;
    const [state, dispatch] = useReducer(reducer, initialState);

    const initialize = useCallback(async () => {
        try {
            const sessionToken = JSON.parse(
                globalThis.localStorage.getItem(STORAGE_KEY),
            );

            if (sessionToken?.user) {
                dispatch({
                    type: ActionType.INITIALIZE,
                    payload: {
                        isAuthenticated: true,
                        user: sessionToken.user,
                    },
                });
            } else {
                dispatch({
                    type: ActionType.INITIALIZE,
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        } catch (err) {
            console.error(err);
            dispatch({
                type: ActionType.INITIALIZE,
                payload: {
                    isAuthenticated: false,
                    user: null,
                },
            });
        }
    }, [dispatch]);

    useEffect(
        () => {
            initialize();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const signIn = useCallback(
        async (email, password) => {
            const signInData = await authApi.signIn({ email, password });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(signInData));

            dispatch({
                type: ActionType.SIGN_IN,
                payload: {
                    ...signInData['user'],
                },
            });
        },
        [dispatch],
    );

    const signUp = useCallback(
        async (email, name, password) => {
            const signUp = await authApi.signUp({
                email,
                name,
                password,
            });

            dispatch({
                type: ActionType.SIGN_UP,
            });
        },
        [dispatch],
    );

    const signOut = useCallback(async () => {
        localStorage.removeItem(STORAGE_KEY);

        dispatch({ type: ActionType.SIGN_OUT });
    }, [dispatch]);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                issuer: Issuer.JWT,
                signIn,
                signUp,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const AuthConsumer = AuthContext.Consumer;
