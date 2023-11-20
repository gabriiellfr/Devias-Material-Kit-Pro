import { createContext, useCallback, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

export const SocketContext = createContext({
    socket: null,
    connectSocket: () => {},
    disconnectSocket: () => {},
    isCustom: false,
});

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);

    const connectSocket = useCallback(() => {
        if (!socketRef.current) {
            socketRef.current = io('http://192.168.1.2:3001');

            socketRef.current.on('newMessage', (message) => {
                console.log('New message received:', message);
            });
        }
    }, []);

    const disconnectSocket = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    }, []);

    const isCustom = useMemo(() => socketRef.current !== null, [socketRef]);

    useEffect(() => {
        connectSocket();
        return () => {
            disconnectSocket();
        };
    }, [connectSocket, disconnectSocket]);

    return (
        <SocketContext.Provider
            value={{
                socket: socketRef.current,
                connectSocket,
                disconnectSocket,
                isCustom,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const SocketConsumer = SocketContext.Consumer;
