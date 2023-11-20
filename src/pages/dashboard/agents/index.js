/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

import {
    Box,
    Button,
    Card,
    Container,
    Stack,
    SvgIcon,
    Typography,
    CircularProgress,
} from '@mui/material';

import Download01Icon from '@untitled-ui/icons-react/build/esm/Download01';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';

import { agentsApi } from '../../../api/agents';
import { useMounted } from '../../../hooks/use-mounted';
import { usePageView } from '../../../hooks/use-page-view';
import { useAuth } from '../../../hooks/use-auth';

import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { AgentListSearch } from '../../../sections/dashboard/agent/agent-list-search';
import { AgentListTable } from '../../../sections/dashboard/agent/agent-list-table';

const useSearch = (pathname) => {
    const [search, setSearch] = useState({
        filters: {
            query: undefined,
            hasAcceptedMarketing: undefined,
            isProspect: undefined,
            isReturning: undefined,
        },
        pathname: pathname.split('/'),
        page: 0,
        rowsPerPage: 5,
        sortBy: 'updatedAt',
        sortDir: 'desc',
    });

    return {
        search,
        updateSearch: setSearch,
    };
};

const useAgents = ({ user }) => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        agents: [],
        agentsCount: 0,
    });

    const getAgents = useCallback(
        async ({ user }) => {
            try {
                const { agentsData, count } = await agentsApi.getMyAgents({
                    user,
                });

                if (isMounted())
                    setState({
                        agents: agentsData,
                        agentsCount: count,
                    });
            } catch (err) {
                console.error(err);
                return err;
            }
        },
        [isMounted],
    );

    useEffect(() => {
        if (user) getAgents({ user });
    }, [user]);

    return state;
};

const Page = () => {
    const { pathname } = useRouter();
    const { search, updateSearch } = useSearch(pathname);
    const { user } = useAuth();
    const { agents, agentsCount } = useAgents({ user });
    const [isLoading, setIsLoading] = useState(!user);

    console.log(agents, agentsCount, user, '<<<<<<@@@');

    usePageView();

    const handleFiltersChange = useCallback(
        (filters) => {
            updateSearch((prevState) => ({
                ...prevState,
                filters,
            }));
        },
        [updateSearch],
    );

    const handleSortChange = useCallback(
        (sort) => {
            updateSearch((prevState) => ({
                ...prevState,
                sortBy: sort.sortBy,
                sortDir: sort.sortDir,
            }));
        },
        [updateSearch],
    );

    const handlePageChange = useCallback(
        (event, page) => {
            updateSearch((prevState) => ({
                ...prevState,
                page,
            }));
        },
        [updateSearch],
    );

    const handleRowsPerPageChange = useCallback(
        (event) => {
            updateSearch((prevState) => ({
                ...prevState,
                rowsPerPage: parseInt(event.target.value, 10),
            }));
        },
        [updateSearch],
    );

    useEffect(() => {
        setIsLoading(!user);
    }, [user]);

    if (isLoading)
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 3,
                }}
            >
                <CircularProgress />
            </Box>
        );

    return (
        <>
            <Head>
                <title>Dashboard: Agents List | Devias Kit PRO</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={4}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">Agents</Typography>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                    <Button
                                        color="inherit"
                                        size="small"
                                        startIcon={
                                            <SvgIcon>
                                                <Upload01Icon />
                                            </SvgIcon>
                                        }
                                    >
                                        Import
                                    </Button>
                                    <Button
                                        color="inherit"
                                        size="small"
                                        startIcon={
                                            <SvgIcon>
                                                <Download01Icon />
                                            </SvgIcon>
                                        }
                                    >
                                        Export
                                    </Button>
                                </Stack>
                            </Stack>
                            <Stack
                                alignItems="center"
                                direction="row"
                                spacing={1}
                            >
                                <Button
                                    startIcon={
                                        <SvgIcon>
                                            <PlusIcon />
                                        </SvgIcon>
                                    }
                                    variant="contained"
                                    component={NextLink}
                                    href={`/dashboard/agents/create`}
                                >
                                    Add
                                </Button>
                                <Button
                                    variant="contained"
                                    component={NextLink}
                                    href={`/dashboard/agents/copy`}
                                >
                                    Copy
                                </Button>
                            </Stack>
                        </Stack>
                        <Card>
                            <AgentListSearch
                                onFiltersChange={handleFiltersChange}
                                onSortChange={handleSortChange}
                                sortBy={search.sortBy}
                                sortDir={search.sortDir}
                            />
                            <AgentListTable
                                agents={agents}
                                agentsCount={agentsCount}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                rowsPerPage={search.rowsPerPage}
                                page={search.page}
                                pathname={search.pathname}
                            />
                        </Card>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
