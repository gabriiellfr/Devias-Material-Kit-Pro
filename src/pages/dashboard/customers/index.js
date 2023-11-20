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
import { customersApi } from '../../../api/customers';
import { useMounted } from '../../../hooks/use-mounted';
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { CustomerListSearch } from '../../../sections/dashboard/customer/customer-list-search';
import { CustomerListTable } from '../../../sections/dashboard/customer/customer-list-table';
import { useAuth } from '../../../hooks/use-auth';
import { useRouter } from 'next/router';

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

const useCustomers = (user) => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        customers: [],
        customersCount: 0,
    });

    const getCustomers = useCallback(async () => {
        try {
            const response = await customersApi.getCustomers(user.id);

            if (isMounted()) {
                setState({
                    customers: response.customersData,
                    customersCount: response.count,
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [isMounted, user]);

    useEffect(
        () => {
            getCustomers();
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
    const { customers, customersCount } = useCustomers(user);

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
                <title>Dashboard: Customer List | Devias Kit PRO</title>
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
                                <Typography variant="h4">Customers</Typography>
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
                                    href={`/dashboard/customers/create`}
                                >
                                    Add
                                </Button>
                                <Button
                                    variant="contained"
                                    component={NextLink}
                                    href={`/dashboard/customers/copy`}
                                >
                                    Copy
                                </Button>
                            </Stack>
                        </Stack>
                        <Card>
                            <CustomerListSearch
                                onFiltersChange={handleFiltersChange}
                                onSortChange={handleSortChange}
                                sortBy={search.sortBy}
                                sortDir={search.sortDir}
                            />
                            <CustomerListTable
                                customers={customers}
                                customersCount={customersCount}
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
