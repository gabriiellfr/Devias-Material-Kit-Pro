import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Download01Icon from '@untitled-ui/icons-react/build/esm/Download01';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';
import NextLink from 'next/link';
import {
    Box,
    Button,
    Card,
    Container,
    Stack,
    SvgIcon,
    Typography,
} from '@mui/material';
import { agentsApi } from '../../../api/agents';
import { useMounted } from '../../../hooks/use-mounted';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { AgentListSearch } from '../../../sections/dashboard/agent/agent-list-search';
import { AgentListTable } from '../../../sections/dashboard/agent/agent-list-table';
import { useAuth } from '../../../hooks/use-auth';
import { useRouter } from 'next/router';

const useSearch = (pathname = []) => {
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
                const { agentsData, count } =
                    await agentsApi.getAgentsCopyAllowed({ user });

                if (isMounted())
                    setState({
                        agents: agentsData,
                        agentsCount: count,
                    });
            } catch (err) {
                console.error(err);
            }
        },
        [isMounted],
    );

    useEffect(
        () => {
            getAgents({ user });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return state;
};

const Page = () => {
    const { pathname } = useRouter();
    const { search, updateSearch } = useSearch(pathname);
    const { user } = useAuth();
    const { agents, agentsCount } = useAgents({ user });

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

    return (
        <>
            <Head>
                <title>Dashboard: Agent List | Devias Kit PRO</title>
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
                                <Typography variant="h4">
                                    Copy Agents
                                </Typography>
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
