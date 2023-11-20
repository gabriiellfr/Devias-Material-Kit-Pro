/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-max-props-per-line */
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import {
    Box,
    Button,
    Drawer,
    IconButton,
    Stack,
    SvgIcon,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { agentsApi } from '../../../api/agents';
import { Scrollbar } from '../../../components/scrollbar';
import { thunks } from '../../../thunks/chat';
import { paths } from '../../../paths';
import { useDispatch, useSelector } from '../../../store';
import { ChatSidebarSearch } from './chat-sidebar-search';
import { ChatThreadItem } from './chat-thread-item';
import { useAuth } from '../../../hooks/use-auth';

const getThreadKey = (thread, userId) => {
    let threadKey;

    if (thread.type === 'GROUP') {
        threadKey = thread.id;
    } else {
        // We hardcode the current user ID because the mocked that is not in sync
        // with the auth provider.
        // When implementing this app with a real database, replace this
        // ID with the ID from Auth Context.
        threadKey = thread.participantIds.find(
            (participantId) => participantId !== userId,
        );
    }

    return threadKey;
};

const useThreads = () => {
    return useSelector((state) => state.chat.threads);
};

const useCurrentThreadId = () => {
    return useSelector((state) => state.chat.currentThreadId);
};

export const ChatSidebar = (props) => {
    const { container, onClose, open, ...other } = props;
    const { user } = useAuth();
    const router = useRouter();
    const threads = useThreads();
    const currentThreadId = useCurrentThreadId();
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
    const dispatch = useDispatch();

    const handleCompose = useCallback(() => {
        router.push(paths.dashboard.chat + '?compose=true');
    }, [router]);

    const handleSearchChange = useCallback(async (event) => {
        const query = event.target.value;

        setSearchQuery(query);

        if (!query) return setSearchResults([]);

        try {
            const agentsData = await agentsApi.getAgentsByName({
                user,
                name: query,
            });

            setSearchResults(agentsData);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handleSearchClickAway = useCallback(() => {
        if (searchFocused) {
            setSearchFocused(false);
            setSearchQuery('');
        }
    }, [searchFocused]);

    const handleSearchFocus = useCallback(() => {
        setSearchFocused(true);
    }, []);

    const handleSearchSelect = useCallback(
        (contact) => {
            const threadId = contact.id;

            setSearchFocused(false);
            setSearchQuery('');

            dispatch(
                thunks.setCurrentThread({
                    threadId,
                }),
            );

            router.push(paths.dashboard.chat + `?compose=true&contact=true`);
        },
        [router],
    );

    const handleThreadSelect = useCallback(
        (threadId) => {
            const thread = threads.byId[threadId];

            if (!thread) router.push(paths.dashboard.chat);
            else router.push(paths.dashboard.chat + `?threadKey=${thread.id}`);
        },
        [router, threads, user],
    );

    const content = (
        <div>
            <Stack
                alignItems="center"
                direction="row"
                spacing={2}
                sx={{ p: 2 }}
            >
                <Typography variant="h5" sx={{ flexGrow: 1 }}>
                    Chats
                </Typography>
                <Button
                    onClick={handleCompose}
                    startIcon={
                        <SvgIcon>
                            <PlusIcon />
                        </SvgIcon>
                    }
                    variant="contained"
                >
                    Group
                </Button>
                {!mdUp && (
                    <IconButton onClick={onClose}>
                        <SvgIcon>
                            <XIcon />
                        </SvgIcon>
                    </IconButton>
                )}
            </Stack>
            <ChatSidebarSearch
                isFocused={searchFocused}
                onChange={handleSearchChange}
                onClickAway={handleSearchClickAway}
                onFocus={handleSearchFocus}
                onSelect={handleSearchSelect}
                query={searchQuery}
                results={searchResults}
            />
            <Box sx={{ display: searchFocused ? 'none' : 'block' }}>
                <Scrollbar>
                    <Stack
                        component="ul"
                        spacing={0.5}
                        sx={{
                            listStyle: 'none',
                            m: 0,
                            p: 2,
                        }}
                    >
                        {threads.allIds.map((threadId) => (
                            <ChatThreadItem
                                active={currentThreadId === threadId}
                                key={threadId}
                                onSelect={() => handleThreadSelect(threadId)}
                                thread={threads.byId[threadId]}
                            />
                        ))}
                    </Stack>
                </Scrollbar>
            </Box>
        </div>
    );

    if (mdUp) {
        return (
            <Drawer
                anchor="left"
                open={open}
                PaperProps={{
                    sx: {
                        position: 'relative',
                        width: 380,
                    },
                }}
                SlideProps={{ container }}
                variant="persistent"
                {...other}
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor="left"
            hideBackdrop
            ModalProps={{
                container,
                sx: {
                    pointerEvents: 'none',
                    position: 'absolute',
                },
            }}
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    maxWidth: '100%',
                    width: 380,
                    pointerEvents: 'auto',
                    position: 'absolute',
                },
            }}
            SlideProps={{ container }}
            variant="temporary"
            {...other}
        >
            {content}
        </Drawer>
    );
};

ChatSidebar.propTypes = {
    container: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool,
};
