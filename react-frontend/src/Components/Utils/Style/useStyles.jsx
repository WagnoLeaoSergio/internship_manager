import {makeStyles} from "@material-ui/core/styles";
import {useContext} from "react"
import {ThemeContext} from "../../../App"

export default function useStyles() {
    const {isDarkMode} = useContext(ThemeContext)

    return makeStyles(theme => ({
        main: {
            backgroundColor: theme.palette.background.default,
            alignItems: "stretch",
            height: "100%"
        },
        list: {
            height: "inherit",
            overflow: "auto",
            padding: theme.spacing(0, 2)
        },
        viewbox: {
            height: "inherit",
            overflow: "auto",
            backgroundColor: isDarkMode ? theme.palette.background.paper : "#888"
        },
        page: {
            margin: theme.spacing(1, 0)
        },
        linkButton: {
            fontSize: "1.5rem",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            margin: 0,
            padding: 5,
            borderRadius: 0,
            '&:hover': {
                backgroundColor: "#00000055",
            },
            '&:focus': {
                outline: "none",
            }
        },
        fileButton: {
            outline: "none",
            backgroundColor: theme.palette.primary.light,
            display: "inline",
            '&:hover': {
                backgroundColor: "#00000055",
            }

        },
        buttonDiv: {
            margin: theme.spacing(1, 0, 0, 0)
        },
        offerState: {
            color: "black",
            display: "block",
            padding: theme.spacing(0.5, 2, 2),
            textAlign: "justify"
        },
        form: {
            width: '100%',
            marginTop: theme.spacing(2),
        },
        submit: {
            margin: theme.spacing(1, 0, 2),
        },
        container: {
            backgroundColor: theme.palette.background.default,
            borderRadius: theme.spacing(2)
        },
        appliedMark: {
            fontSize: "1.5rem",
            backgroundColor: "transparent",
            border: "none",
            margin: 0,
            padding: 5,
            borderRadius: 0,
            textAlign: "left",
        },
        logo: {
            margin: theme.spacing(6, 0, 0.5),
            fontSize: "3em",
        },
        formTitle: {
            margin: theme.spacing(2, 0, 1),
            fontSize: "3em",
        },
        subtitle: {
            fontSize: "1em",
            textAlign: "center",
            margin: theme.spacing(0, 0, 6)
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        link: {
            padding: theme.spacing(0, 0, 2)
        },
        divider: {
            height: theme.spacing(1),
            backgroundColor: theme.palette.primary.main,
        },
        title: {
            fontSize: "2em"
        },
        hrStyle: {
            width: "80%",
            marginLeft: "auto",
            marginRight: "auto"
        },
        approuvalButton: {
            backgroundColor: "#6a5acd",
            color: "white",
            border: "none",
            cursor: "pointer",
            margin: 0,
            padding: 5,
            borderRadius: 0,
            "&:hover": {
                backgroundColor: "#00000055"
            }
        },
        evaluationSections: {
            border: "2px solid black",
            marginBottom: "3em"
        },
        evaluationCriterias: {
            fontWeight: "bold"
        },
        signature: {
            maxHeight: 256,
            maxWidth: 256
        },
        dividers: {
            margin: theme.spacing(1, 0)
        },
        dashboardTab: {
            padding: theme.spacing(5, 0, 5, 3),
            backgroundColor: theme.palette.background.default,
            "&:hover": {
                backgroundColor: isDarkMode ? theme.palette.background.paper : "#CCC"
            }
        },
        selectedDashboardTab: {
            backgroundColor: isDarkMode ? theme.palette.primary.dark : theme.palette.primary.light,
            "&:hover": {
                backgroundColor: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark
            }
        }
    }))()
}
