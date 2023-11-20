/* eslint-disable react/jsx-max-props-per-line */
import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Link,
    Stack,
    SvgIcon,
    Tab,
    Tabs,
    Typography,
    Unstable_Grid2 as Grid,
} from '@mui/material';
import { agentsApi } from '../../../../api/agents';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { AgentBasicDetails } from '../../../../sections/dashboard/agent/agent-basic-details';
import { getInitials } from '../../../../utils/get-initials';
import { useAuth } from '../../../../hooks/use-auth';

const tabs = [
    { label: 'Details', value: 'details' },
    { label: 'Invoices', value: 'invoices' },
    { label: 'Logs', value: 'logs' },
];

const useAgent = ({ user, agentId }) => {
    const isMounted = useMounted();
    const [agent, setAgent] = useState(null);

    const getAgent = useCallback(
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
            getAgent({ user, agentId });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user, agentId],
    );

    return agent;
};

const Page = ({ agentId }) => {
    const [currentTab, setCurrentTab] = useState('details');
    const { user } = useAuth();

    const agent = useAgent({ user, agentId });

    usePageView();

    const handleTabsChange = useCallback((event, value) => {
        setCurrentTab(value);
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

    /*
        
        I am requesting an in-depth, knowledge-centric summary of ${title} by ${author}
that captures the essence of the book in a ${writingStyle} yet engaging manner. The summary should focus on the
core principles and insights, rather than just the storyline or narrative details. It should be substantial, providing valuable learning, rather than being a mere synopsis.

The desired outcome is a text that educates and informs the reader, imparting a sense of significant learning from the content. The summary should be approximately ${textSize} words, written in ${language}. 

Please format the text suitably for readability, use HTML tags.
        
        
        */

    return (
        <>
            <Head>
                <title>Dashboard: Agent Details | Devias Kit PRO</title>
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
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={2}
                                >
                                    {user.id === agent.createdBy && (
                                        <Button
                                            color="inherit"
                                            component={NextLink}
                                            endIcon={
                                                <SvgIcon>
                                                    <Edit02Icon />
                                                </SvgIcon>
                                            }
                                            href={`/dashboard/agents/${agent.id}/edit`}
                                        >
                                            Edit
                                        </Button>
                                    )}

                                    {user.id !== agent.createdBy && (
                                        <Button
                                            color="inherit"
                                            component={NextLink}
                                            endIcon={
                                                <SvgIcon>
                                                    <Edit02Icon />
                                                </SvgIcon>
                                            }
                                            href={`/dashboard/agents/${agent.id}/copy`}
                                        >
                                            Copy
                                        </Button>
                                    )}

                                    <Button
                                        endIcon={
                                            <SvgIcon>
                                                <ChevronDownIcon />
                                            </SvgIcon>
                                        }
                                        variant="contained"
                                    >
                                        Actions
                                    </Button>
                                </Stack>
                            </Stack>
                            <div>
                                <Tabs
                                    indicatorColor="primary"
                                    onChange={handleTabsChange}
                                    scrollButtons="auto"
                                    sx={{ mt: 3 }}
                                    textColor="primary"
                                    value={currentTab}
                                    variant="scrollable"
                                >
                                    {tabs.map((tab) => (
                                        <Tab
                                            key={tab.value}
                                            label={tab.label}
                                            value={tab.value}
                                        />
                                    ))}
                                </Tabs>
                                <Divider />
                            </div>
                        </Stack>
                        {currentTab === 'details' && (
                            <div>
                                <Grid container spacing={4}>
                                    <Grid xs={12} lg={12}>
                                        <AgentBasicDetails
                                            address1={agent.address1}
                                            address2={agent.address2}
                                            country={agent.country}
                                            email={agent.email}
                                            isVerified={!!agent.isVerified}
                                            phone={agent.phone}
                                            state={agent.state}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        )}
                    </Stack>
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
