/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Box, Divider, Stack } from '@mui/material';
import { chatApi } from '../../../api/chat';
import { Scrollbar } from '../../../components/scrollbar';
import { paths } from '../../../paths';
import { useDispatch, useSelector } from '../../../store';
import { thunks } from '../../../thunks/chat';
import { ChatMessageAdd } from './chat-message-add';
import { ChatMessages } from './chat-messages';
import { ChatThreadToolbar } from './chat-thread-toolbar';
import { useAuth } from '../../../hooks/use-auth';
import { useSocket } from '../../../hooks/use-socket';

const useParticipants = ({ user, threadKey }) => {
    const router = useRouter();
    const [participants, setParticipants] = useState([]);

    const getParticipants = useCallback(
        async ({ user, threadKey }) => {
            try {
                const participants = await chatApi.getParticipants({
                    user,
                    threadKey,
                });
                setParticipants(participants);
            } catch (err) {
                console.error(err);
                //router.push(paths.dashboard.chat);
            }
        },
        [router],
    );

    useEffect(
        () => {
            if (user) getParticipants({ user, threadKey });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [threadKey],
    );

    return participants;
};

const useThread = ({ user, threadKey }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const thread = useSelector((state) => {
        const { threads, currentThreadId } = state.chat;

        return threads.byId[currentThreadId];
    });

    const getThread = useCallback(
        async ({ user, threadKey }) => {
            // If thread key is not a valid key (thread id or contact id)
            // the server throws an error, this means that the user tried a shady route
            // and we redirect them on the home view

            let threadId;

            try {
                threadId = await dispatch(
                    thunks.getThread({
                        user,
                        threadKey,
                    }),
                );
            } catch (err) {
                console.error(err);
                router.push(paths.dashboard.chat);
                return;
            }

            // Set the active thread
            // If the thread exists, then is sets it as active, otherwise it sets is as undefined

            dispatch(
                thunks.setCurrentThread({
                    threadId,
                }),
            );

            // Mark the thread as seen only if it exists

            if (threadId) {
                dispatch(
                    thunks.markThreadAsSeen({
                        threadId,
                    }),
                );
            }
        },
        [router, dispatch, threadKey],
    );

    useEffect(() => {
        getThread({ user, threadKey });
    }, [threadKey]);

    return thread;
};

const useMessagesScroll = (thread) => {
    const messagesRef = useRef(null);

    const handleUpdate = useCallback(() => {
        // Thread does not exist
        if (!thread) {
            return;
        }

        // Ref is not used
        if (!messagesRef.current) {
            return;
        }

        const container = messagesRef.current;
        const scrollElement = container.getScrollElement();
        scrollElement.scrollTop = container.el.scrollHeight;
    }, [thread]);

    useEffect(
        () => {
            handleUpdate();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [thread],
    );

    return {
        messagesRef,
    };
};

export const ChatThread = (props) => {
    const { threadKey, ...other } = props;
    const dispatch = useDispatch();
    const { user } = useAuth();
    const thread = useThread({ user, threadKey });
    const participants = useParticipants({ user, threadKey });
    const { messagesRef } = useMessagesScroll(thread);

    const { socket } = useSocket();

    const handleSend = useCallback(
        async (body) => {
            // If we have the thread, we use its ID to add a new message
            const recipientIds = participants
                .filter((participant) => participant.id !== user.id)
                .map((participant) => participant.id);

            if (thread) {
                try {
                    await dispatch(
                        thunks.addMessage({
                            user,
                            threadId: thread.id,
                            recipientIds,
                            body,
                        }),
                    );
                } catch (err) {
                    console.error(err);
                }

                return;
            }

            // Add the new message

            let threadId;

            try {
                threadId = await dispatch(
                    thunks.addMessage({
                        userId: user.id,
                        recipientIds,
                        body,
                    }),
                );
            } catch (err) {
                console.error(err);
                return;
            }

            // Load the thread because we did not have it

            try {
                await dispatch(
                    thunks.getThread({
                        user,
                        threadKey: threadId,
                    }),
                );
            } catch (err) {
                console.error(err);
                return;
            }

            // Set the new thread as active

            dispatch(thunks.setCurrentThread({ threadId }));
        },
        [dispatch, participants, thread, user],
    );

    // Maybe implement a loading state

    return (
        <Stack
            sx={{
                flexGrow: 1,
                overflow: 'hidden',
            }}
            {...other}
        >
            <ChatThreadToolbar participants={participants} />
            <Divider />
            <Box
                sx={{
                    flexGrow: 1,
                    overflow: 'hidden',
                }}
            >
                <Scrollbar ref={messagesRef} sx={{ maxHeight: '100%' }}>
                    <ChatMessages
                        messages={thread?.messages || []}
                        participants={thread?.participants || []}
                    />
                </Scrollbar>
            </Box>
            <Divider />
            <ChatMessageAdd onSend={handleSend} />
        </Stack>
    );
};

ChatThread.propTypes = {
    threadKey: PropTypes.string.isRequired,
};
