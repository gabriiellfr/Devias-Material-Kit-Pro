/* eslint-disable react/jsx-max-props-per-line */
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Typography,
} from '@mui/material';

export const AgentDataManagement = (props) => (
    <Card {...props}>
        <CardHeader title="Data Management" />
        <CardContent sx={{ pt: 0 }}>
            <Button color="error" variant="outlined">
                Delete Account
            </Button>
            <Box sx={{ mt: 1 }}>
                <Typography color="text.secondary" variant="body2">
                    Remove this agent’s chart if he requested that, if not
                    please be aware that what has been deleted can never brought
                    back
                </Typography>
            </Box>
        </CardContent>
    </Card>
);
