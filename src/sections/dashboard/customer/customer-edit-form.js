/* eslint-disable react/jsx-max-props-per-line */
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Stack,
    Switch,
    TextField,
    Typography,
    Unstable_Grid2 as Grid,
} from '@mui/material';
import { paths } from '../../../paths';
import { customersApi } from '../../../api/customers';
import { useAuth } from '../../../hooks/use-auth';

const agentTypeOptions = [
    {
        id: 'content-creator',
        label: 'Content Creator',
    },
    {
        id: 'virtual-assistant',
        label: 'Virtual Assistant',
    },
];

export const CustomerEditForm = (props) => {
    const { customer, ...other } = props;
    const { user } = useAuth();

    const formik = useFormik({
        initialValues: {
            name: customer.name || '',
            agentType: customer.agentType || '',
            description: customer.description || '',
            initialPrompt: customer.initialPrompt || '',
            skills: customer.skills || '',
            allowCopy: customer.allowCopy || true,
        },
        validationSchema: Yup.object({
            name: Yup.string().max(255).required('Name is required'),
            agentType: Yup.string().max(255).required('Agent type is required'),
            description: Yup.string()
                .max(255)
                .required('Description is required'),
            initialPrompt: Yup.string()
                .max(1000)
                .required('Initial prompt is required'),
            skills: Yup.string().max(255),
        }),
        onSubmit: async (values, helpers) => {
            try {
                // NOTE: Make API request
                try {
                    if (customer.createdBy === user.id)
                        await customersApi.updateCustomer({
                            ...values,
                            id: customer.id,
                            createdBy: user.id,
                        });
                    else
                        await customersApi.createCostumer({
                            ...values,
                            createdBy: user.id,
                        });

                    helpers.setStatus({ success: true });
                    helpers.setSubmitting(false);
                    toast.success('Customer updated');
                } catch (err) {
                    console.error(err);
                }
            } catch (err) {
                console.error(err);
                toast.error('Something went wrong!');
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} {...other}>
            <Card>
                <CardHeader title="Edit Customer" />
                <CardContent sx={{ pt: 0 }}>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={6}>
                            <TextField
                                error={
                                    !!(
                                        formik.touched.name &&
                                        formik.errors.name
                                    )
                                }
                                fullWidth
                                helperText={
                                    formik.touched.name && formik.errors.name
                                }
                                label="Agent name"
                                name="name"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                required
                                value={formik.values.name}
                            />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <TextField
                                error={
                                    !!(
                                        formik.touched.agentType &&
                                        formik.errors.agentType
                                    )
                                }
                                fullWidth
                                helperText={
                                    formik.touched.agentType &&
                                    formik.errors.agentType
                                }
                                label="Agent type"
                                name="agentType"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                select
                                SelectProps={{ native: true }}
                                value={formik.values.agentType}
                            >
                                {agentTypeOptions.map((option, imdex) => (
                                    <option key={imdex} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid xs={12} md={12}>
                            <TextField
                                error={
                                    !!(
                                        formik.touched.description &&
                                        formik.errors.description
                                    )
                                }
                                fullWidth
                                helperText={
                                    formik.touched.description &&
                                    formik.errors.description
                                }
                                label="Description"
                                name="description"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.description}
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid xs={12} md={12}>
                            <TextField
                                error={
                                    !!(
                                        formik.touched.initialPrompt &&
                                        formik.errors.initialPrompt
                                    )
                                }
                                fullWidth
                                helperText={
                                    formik.touched.initialPrompt &&
                                    formik.errors.initialPrompt
                                }
                                label="Initial prompt"
                                name="initialPrompt"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.initialPrompt}
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid xs={12} md={12}>
                            <TextField
                                error={
                                    !!(
                                        formik.touched.skills &&
                                        formik.errors.skills
                                    )
                                }
                                fullWidth
                                helperText={
                                    formik.touched.skills &&
                                    formik.errors.skills
                                }
                                label="Skills"
                                name="skills"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.skills}
                            />
                        </Grid>
                    </Grid>
                    <Stack divider={<Divider />} spacing={3} sx={{ mt: 3 }}>
                        <Stack
                            alignItems="center"
                            direction="row"
                            justifyContent="space-between"
                            spacing={3}
                        >
                            <Stack spacing={1}>
                                <Typography gutterBottom variant="subtitle1">
                                    Allow copy
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                >
                                    Means that anyone will be able to copy your
                                    agent.
                                </Typography>
                            </Stack>
                            <Switch
                                checked={formik.values.allowCopy}
                                color="primary"
                                edge="start"
                                name="allowCopy"
                                onChange={formik.handleChange}
                                value={formik.values.allowCopy}
                            />
                        </Stack>
                    </Stack>
                </CardContent>
                <Stack
                    direction={{
                        xs: 'column',
                        sm: 'row',
                    }}
                    flexWrap="wrap"
                    spacing={3}
                    sx={{ p: 3 }}
                >
                    <Button
                        disabled={formik.isSubmitting}
                        type="submit"
                        variant="contained"
                    >
                        Update
                    </Button>
                    <Button
                        color="inherit"
                        component={NextLink}
                        disabled={formik.isSubmitting}
                        href={`/dashboard/customers/${customer.id}`}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Card>
        </form>
    );
};

CustomerEditForm.propTypes = {
    // @ts-ignore
    customer: PropTypes.object.isRequired,
};
