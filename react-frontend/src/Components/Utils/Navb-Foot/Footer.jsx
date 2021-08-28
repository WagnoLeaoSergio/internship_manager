import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(theme => ({
    footer: {
        position: "relative",
        bottom: 0,
        width: "100%",
        textAlign: "center",
        paddingBottom: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        minHeight: "3vh",
        maxHeight: "3vh",
        lineHeight: "3vh",
        color: theme.palette.primary.contrastText
    }
}))

export default function Footer() {
    const classes = useStyles()

    return <div className={classes.footer}>
        <i className="fa fa-copyright"/>{new Date().getFullYear()} UFJF
    </div>
}
