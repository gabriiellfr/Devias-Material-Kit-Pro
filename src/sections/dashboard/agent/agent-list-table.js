/* eslint-disable react/jsx-max-props-per-line */
import { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    IconButton,
    Link,
    Stack,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';
import { Scrollbar } from '../../../components/scrollbar';
import { paths } from '../../../paths';
import { getInitials } from '../../../utils/get-initials';

const useSelectionModel = (agents) => {
    const agentIds = useMemo(() => {
        return agents.map((agent) => agent.id);
    }, [agents]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setSelected([]);
    }, [agentIds]);

    const selectOne = useCallback((agentId) => {
        setSelected((prevState) => [...prevState, agentId]);
    }, []);

    const deselectOne = useCallback((agentId) => {
        setSelected((prevState) => {
            return prevState.filter((id) => id !== agentId);
        });
    }, []);

    const selectAll = useCallback(() => {
        setSelected([...agentIds]);
    }, [agentIds]);

    const deselectAll = useCallback(() => {
        setSelected([]);
    }, []);

    return {
        deselectAll,
        deselectOne,
        selectAll,
        selectOne,
        selected,
    };
};

export const AgentListTable = (props) => {
    const {
        agents,
        agentsCount,
        onPageChange,
        onRowsPerPageChange,
        pathname,
        page,
        rowsPerPage,
        ...other
    } = props;
    const { deselectAll, selectAll, deselectOne, selectOne, selected } =
        useSelectionModel(agents);

    const handleToggleAll = useCallback(
        (event) => {
            const { checked } = event.target;

            if (checked) {
                selectAll();
            } else {
                deselectAll();
            }
        },
        [selectAll, deselectAll],
    );

    const selectedAll = selected.length === agents.length;
    const selectedSome = selected.length > 0 && selected.length < agents.length;
    const enableBulkActions = selected.length > 0;

    return (
        <Box sx={{ position: 'relative' }} {...other}>
            {enableBulkActions && (
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        alignItems: 'center',
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'dark'
                                ? 'neutral.800'
                                : 'neutral.50',
                        display: enableBulkActions ? 'flex' : 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        px: 2,
                        py: 0.5,
                        zIndex: 10,
                    }}
                >
                    <Checkbox
                        checked={selectedAll}
                        indeterminate={selectedSome}
                        onChange={handleToggleAll}
                    />
                    <Button color="inherit" size="small">
                        Delete
                    </Button>
                    <Button color="inherit" size="small">
                        Edit
                    </Button>
                </Stack>
            )}
            <Scrollbar>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAll}
                                    indeterminate={selectedSome}
                                    onChange={handleToggleAll}
                                />
                            </TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Agent Type</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {agents.map((agent) => {
                            const isSelected = selected.includes(agent.id);
                            const location = `${agent.city}, ${agent.state}, ${agent.country}`;
                            const totalSpent = numeral(agent.totalSpent).format(
                                `${agent.currency}0,0.00`,
                            );

                            return (
                                <TableRow
                                    hover
                                    key={agent.id}
                                    selected={isSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={(event) => {
                                                const { checked } =
                                                    event.target;

                                                if (checked) {
                                                    selectOne(agent.id);
                                                } else {
                                                    deselectOne(agent.id);
                                                }
                                            }}
                                            value={isSelected}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Stack
                                            alignItems="center"
                                            direction="row"
                                            spacing={1}
                                        >
                                            <Avatar
                                                src={agent.avatar}
                                                sx={{
                                                    height: 42,
                                                    width: 42,
                                                }}
                                            >
                                                {getInitials(agent.name)}
                                            </Avatar>
                                            <div>
                                                <Link
                                                    color="inherit"
                                                    component={NextLink}
                                                    href={`/dashboard/agents/${agent.id}`}
                                                    variant="subtitle2"
                                                >
                                                    {agent.name}
                                                </Link>
                                            </div>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{agent.description}</TableCell>
                                    <TableCell>{agent.agentType}</TableCell>
                                    <TableCell align="right">
                                        {pathname.at(-1) === 'copy' && (
                                            <IconButton
                                                component={NextLink}
                                                href={`/dashboard/agents/${agent.id}/copy`}
                                            >
                                                <SvgIcon>
                                                    <Edit02Icon />
                                                </SvgIcon>
                                            </IconButton>
                                        )}

                                        {pathname.at(-1) !== 'copy' && (
                                            <IconButton
                                                component={NextLink}
                                                href={`/dashboard/agents/${agent.id}/edit`}
                                            >
                                                <SvgIcon>
                                                    <Edit02Icon />
                                                </SvgIcon>
                                            </IconButton>
                                        )}

                                        <IconButton
                                            component={NextLink}
                                            href={`/dashboard/agents/${agent.id}`}
                                        >
                                            <SvgIcon>
                                                <ArrowRightIcon />
                                            </SvgIcon>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>
            <TablePagination
                component="div"
                count={agentsCount}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Box>
    );
};

AgentListTable.propTypes = {
    agents: PropTypes.array.isRequired,
    agentsCount: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};
