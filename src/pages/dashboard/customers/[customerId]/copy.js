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
import { customersApi } from '../../../../api/customers';
import { useMounted } from '../../../../hooks/use-mounted';
import { usePageView } from '../../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../../layouts/dashboard';
import { paths } from '../../../../paths';
import { CustomerEditForm } from '../../../../sections/dashboard/customer/customer-edit-form';
import { getInitials } from '../../../../utils/get-initials';

const useCustomer = (customerId) => {
    const isMounted = useMounted();
    const [customer, setCustomer] = useState(null);

    const getCustomer = useCallback(
        async (customerId) => {
            try {
                const response = await customersApi.getCustomer(customerId);

                if (isMounted()) setCustomer(response);
            } catch (err) {
                console.error(err);
            }
        },
        [isMounted],
    );

    useEffect(
        () => {
            getCustomer(customerId);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [customerId],
    );

    return customer;
};

const Page = ({ customerId }) => {
    const customer = useCustomer(customerId);

    usePageView();

    if (!customer)
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
                <title>Dashboard: Customer Edit | Devias Kit PRO</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={4}>
                        <Stack spacing={4}>
                            <div>
                                <Link
                                    color="text.primary"
                                    component={NextLink}
                                    href={paths.dashboard.customers.index}
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
                                        Customers
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
                                        src={customer.avatar}
                                        sx={{
                                            height: 64,
                                            width: 64,
                                        }}
                                    >
                                        {getInitials(customer.name)}
                                    </Avatar>
                                    <Stack spacing={1}>
                                        <Typography variant="h4">
                                            {customer.name}
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
                                                label={customer.id}
                                                size="small"
                                            />
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                        <CustomerEditForm customer={customer} />
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
    const { customerId } = query;

    return {
        props: {
            customerId,
        },
    };
}
