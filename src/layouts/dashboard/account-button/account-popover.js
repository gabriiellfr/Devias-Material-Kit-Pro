/* eslint-disable react/jsx-max-props-per-line */
import { useCallback, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import Settings04Icon from '@untitled-ui/icons-react/build/esm/Settings04';
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Popover,
    SvgIcon,
    Typography,
} from '@mui/material';
import { useAuth } from '../../../hooks/use-auth';
import { paths } from '../../../paths';
import { Issuer } from '../../../utils/auth';

export const AccountPopover = (props) => {
    const { anchorEl, onClose, open, ...other } = props;
    const router = useRouter();
    const auth = useAuth();

    const handleLogout = useCallback(async () => {
        try {
            onClose?.();

            switch (auth.issuer) {
                case Issuer.Amplify: {
                    await auth.signOut();
                    break;
                }

                case Issuer.Auth0: {
                    await auth.logout();
                    break;
                }

                case Issuer.Firebase: {
                    await auth.signOut();
                    break;
                }

                case Issuer.JWT: {
                    auth.signOut();
                    router.push(paths.index);
                    break;
                }

                default: {
                    console.warn(
                        'Using an unknown Auth Issuer, did not log out',
                    );
                }
            }

            router.push(paths.index);
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
        }
    }, [auth, router, onClose]);

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom',
            }}
            disableScrollLock
            onClose={onClose}
            open={!!open}
            PaperProps={{ sx: { width: 200 } }}
            {...other}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="body1">{}</Typography>
                <Typography color="text.secondary" variant="body2">
                    {}
                </Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 1 }}>
                <ListItemButton
                    component={NextLink}
                    href={paths.dashboard.account}
                    sx={{
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                    }}
                >
                    <ListItemIcon>
                        <SvgIcon fontSize="small">
                            <Settings04Icon />
                        </SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Typography variant="body1">Settings</Typography>
                        }
                    />
                </ListItemButton>
            </Box>
            <Divider sx={{ my: '0 !important' }} />
            <Box
                sx={{
                    display: 'flex',
                    p: 1,
                    justifyContent: 'center',
                }}
            >
                <Button color="inherit" onClick={handleLogout} size="small">
                    Logout
                </Button>
            </Box>
        </Popover>
    );
};

AccountPopover.propTypes = {
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool,
};
