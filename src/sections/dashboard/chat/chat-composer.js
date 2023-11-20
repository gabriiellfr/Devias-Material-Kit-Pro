/* eslint-disable react/jsx-max-props-per-line */
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Divider } from '@mui/material';
import { paths } from '../../../paths';
import { useDispatch } from '../../../store';
import { thunks } from '../../../thunks/chat';
import { ChatComposerRecipients } from './chat-composer-recipients';
import { ChatMessageAdd } from './chat-message-add';
import { useAuth } from '../../../hooks/use-auth';

const useRecipients = () => {
    const [recipients, setRecipients] = useState([]);

    const onRecipientAdd = useCallback((recipient) => {
        setRecipients((prevState) => {
            const found = prevState.find(
                (_recipient) => _recipient.id === recipient.id,
            );

            if (found) return prevState;

            return [...prevState, recipient];
        });
    }, []);

    const onRecipientRemove = useCallback((recipientId) => {
        setRecipients((prevState) => {
            return prevState.filter(
                (recipient) => recipient.id !== recipientId,
            );
        });
    }, []);

    return {
        onRecipientAdd,
        onRecipientRemove,
        recipients,
    };
};

export const ChatComposer = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const { user } = useAuth();
    const { onRecipientAdd, onRecipientRemove, recipients } = useRecipients();

    const handleSend = useCallback(
        async (body) => {
            try {
                const recipientIds = recipients.map(
                    (recipient) => recipient.id,
                );

                const threadId = await dispatch(
                    thunks.addMessage({
                        user,
                        recipientIds,
                        body,
                    }),
                );

                router.push(paths.dashboard.chat + `?threadKey=${threadId}`);
            } catch (err) {
                console.error(err);
                return;
            }
        },
        [dispatch, router, recipients, user],
    );

    const canAddMessage = recipients.length > 0;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
            }}
            {...props}
        >
            <ChatComposerRecipients
                onRecipientAdd={onRecipientAdd}
                onRecipientRemove={onRecipientRemove}
                recipients={recipients}
            />
            <Divider />
            <Box sx={{ flexGrow: 1 }} />
            <Divider />
            <ChatMessageAdd disabled={!canAddMessage} onSend={handleSend} />
        </Box>
    );
};
