import { Button } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import { Delete } from "@material-ui/icons";
import NotificationsIcon from "@material-ui/icons/Notifications";
import React, { useRef, useState } from "react";
import AuthenticationService from "../../../Services/AuthenticationService";
import { useNotificationChannel } from "../../../Services/Hooks";

const useStyles = makeStyles(theme => ({
    linkButton: {
        color: "inherit",
        fontWeight: "normal",
        "&:hover": {
            backgroundColor: "#FFFFFF33"
        }
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    spacer: {
        flexGrow: 1
    }
}))

export default function NotificationButton() {
    const [notifications, markAsRead] = useNotificationChannel(AuthenticationService.getCurrentUser().id)
    const [notifOpen, setNotifOpen] = useState(false)
    const classes = useStyles()
    const notifAnchor = useRef(null)

    function notificationList() {
        if (notifications.length > 0) {
            return notifications.map((notif, i) =>
                <MenuItem dense key={i}>
                    <IconButton edge={"start"} onClick={() => {
                        markAsRead(i)
                    }}><Delete color={"secondary"}/></IconButton>
                    {notif.message}
                </MenuItem>
            )
        } else {
            return <MenuItem onClick={() => setNotifOpen(false)}>Sem novas notificações</MenuItem>
        }
    }

    return <>
        <Button ref={notifAnchor} onClick={() => setNotifOpen(true)} className={classes.linkButton}>

            <Badge badgeContent={notifications.length}
                   color={"secondary"}
                   anchorOrigin={{vertical: "top", horizontal: "left"}}
            >
                <NotificationsIcon fontSize={"small"}/>
                &ensp;Notificações
            </Badge>
        </Button>
        <Menu
            anchorEl={notifAnchor.current}
            getContentAnchorEl={null}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left"
            }}
            keepMounted
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
        >
            {notificationList()}
        </Menu>
    </>
}