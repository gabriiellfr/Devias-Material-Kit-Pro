import { SvgIcon } from '@mui/material';
import GraduationHat01Icon from '../../icons/untitled-ui/duocolor/graduation-hat-01';
import HomeSmileIcon from '../../icons/untitled-ui/duocolor/home-smile';
import MessageChatSquareIcon from '../../icons/untitled-ui/duocolor/message-chat-square';
import Users03Icon from '../../icons/untitled-ui/duocolor/users-03';
import { tokens } from '../../locales/tokens';
import { paths } from '../../paths';

export const getSections = (t) => [
    {
        items: [
            {
                title: t(tokens.nav.overview),
                path: paths.dashboard.index,
                icon: (
                    <SvgIcon fontSize="small">
                        <HomeSmileIcon />
                    </SvgIcon>
                ),
            },
        ],
    },
    {
        subheader: t(tokens.nav.concepts),
        items: [
            {
                title: t(tokens.nav.customers),
                path: paths.dashboard.customers.index,
                icon: (
                    <SvgIcon fontSize="small">
                        <Users03Icon />
                    </SvgIcon>
                ),
                items: [
                    {
                        title: t(tokens.nav.list),
                        path: paths.dashboard.customers.index,
                    },
                    {
                        title: t(tokens.nav.details),
                        path: paths.dashboard.customers.details,
                    },
                    {
                        title: t(tokens.nav.edit),
                        path: paths.dashboard.customers.edit,
                    },
                ],
            },
            {
                title: t(tokens.nav.academy),
                path: paths.dashboard.academy.index,
                icon: (
                    <SvgIcon fontSize="small">
                        <GraduationHat01Icon />
                    </SvgIcon>
                ),
                items: [
                    {
                        title: t(tokens.nav.dashboard),
                        path: paths.dashboard.academy.index,
                    },
                    {
                        title: t(tokens.nav.course),
                        path: paths.dashboard.academy.courseDetails,
                    },
                ],
            },
            {
                title: t(tokens.nav.chat),
                path: paths.dashboard.chat,
                icon: (
                    <SvgIcon fontSize="small">
                        <MessageChatSquareIcon />
                    </SvgIcon>
                ),
            },
        ],
    },
];
