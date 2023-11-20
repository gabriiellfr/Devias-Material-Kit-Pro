/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import {
    Avatar,
    Box,
    Chip,
    CircularProgress,
    Container,
    Link,
    Stack,
    SvgIcon,
    Typography,
} from '@mui/material';
import { agentsApi } from '../../../../api/agents';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { AgentEditForm } from '../../../../sections/dashboard/agent/agent-edit-form';
import { getInitials } from '../../../../utils/get-initials';
import { useAuth } from '../../../../hooks/use-auth';

const useAgent = ({ user, agentId }) => {
    const isMounted = useMounted();
    const [agent, setAgent] = useState(null);

    const getAgents = useCallback(
        async ({ user, agentId }) => {
            try {
                const agentData = await agentsApi.getAgentById({
                    user,
                    agentId,
                });

                if (isMounted()) setAgent(agentData);
            } catch (err) {
                console.error(err);
            }
        },
        [isMounted],
    );

    useEffect(
        () => {
            getAgents({ user, agentId });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user, agentId],
    );

    return agent;
};

const Page = ({ agentId }) => {
    const { user } = useAuth();
    const router = useRouter();
    const agent = useAgent({ user, agentId });

    usePageView();

    const handleOnSubmit = useCallback(async ({ method, agentData }) => {
        try {
            const newAgentData = await agentsApi.createAgent({
                user,
                agentData,
            });

            router.push(paths.dashboard.agents.index + `/${newAgentData.id}`);
        } catch (error) {
            console.log(error, 'Update agent handleOnSubmit');
        }
    }, []);

    if (!agent)
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
                <title>Dashboard: Agent Edit | Devias Kit PRO</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth="lg">
                    {agent && (
                        <Stack spacing={4}>
                            <Stack spacing={4}>
                                <div>
                                    <Link
                                        color="text.primary"
                                        component={NextLink}
                                        href={paths.dashboard.agents.index}
                                        sx={{
                                            alignItems: 'center',
                                            display: 'inline-flex',
                                        }}
                                        underline="hover"
                                    >
                                        <SvgIcon sx={{ mr: 1 }}>
                                            <ArrowLeftIcon />
                                        </SvgIcon>
                                        <Typography variant="subtitle2">
                                            Agents
                                        </Typography>
                                    </Link>
                                </div>
                                <Stack
                                    alignItems="flex-start"
                                    direction={{
                                        xs: 'column',
                                        md: 'row',
                                    }}
                                    justifyContent="space-between"
                                    spacing={4}
                                >
                                    <Stack
                                        alignItems="center"
                                        direction="row"
                                        spacing={2}
                                    >
                                        <Avatar
                                            src={agent.avatar}
                                            sx={{
                                                height: 64,
                                                width: 64,
                                            }}
                                        >
                                            {getInitials(agent.name)}
                                        </Avatar>
                                        <Stack spacing={1}>
                                            <Typography variant="h4">
                                                {agent.name}
                                            </Typography>
                                            <Stack
                                                alignItems="center"
                                                direction="row"
                                                spacing={1}
                                            >
                                                <Typography variant="subtitle2">
                                                    user_id:
                                                </Typography>
                                                <Chip
                                                    label={agent.id}
                                                    size="small"
                                                />
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <AgentEditForm
                                agent={agent}
                                handleSubmit={handleOnSubmit}
                            />
                        </Stack>
                    )}
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

export async function getServerSideProps(context) {
    const { query } = context;
    const { agentId } = query;

    return {
        props: {
            agentId,
        },
    };
}
