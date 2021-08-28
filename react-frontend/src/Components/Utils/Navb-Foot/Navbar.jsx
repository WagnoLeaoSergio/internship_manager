import {Button, List, ListSubheader, Switch, Toolbar, Typography} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {makeStyles} from "@material-ui/core/styles";
import {Brightness3, WbSunny} from "@material-ui/icons"
import MenuIcon from "@material-ui/icons/Menu";
import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {SemesterContext, ThemeContext} from "../../../App";
import AuthenticationService from "../../../Services/AuthenticationService";
import {useModal} from "../../../Services/Hooks";
import OfferCreationModal from "../../Employer/OfferCreationModal";
import SemesterSelectorModal from "../../Manager/SemesterSelectorModal";
import ResumeUploadModal from "../../Student/ResumeUploadModal";
import NotificationButton from "./NotificationButton";

const Links = {
    admin: [
        {
            title: "Dashboard",
            url: "/dashboard"
        },
        {
            title: <Divider/>
        },
        {
            title: "Atribuição de ofertas",
            url: "/dashboard/assignement/offer"
        },
        {
            title: <Divider/>
        },
        {
            title: "Estudantes",
            url: "/dashboard/status"
        },
        {
            title: "Supervisores",
            url: "/dashboard/employersStatus"
        },
        {
            title: "Coordenação de estágio",
            url: "/dashboard/managers"
        },
        {
            title: <Divider/>
        },
        {
            title: "Ofertas",
            url: "/dashboard/offerList"
        },
        {
            title: "Contratos",
            url: "/dashboard/contractList"
        },
        {
            title: <Divider/>
        },
        {
            title: "Relatórios",
            url: "/dashboard/reports"
        },
        {
            title: <Divider/>
        },
        {
            title: "Avaliações de estágio",
            url: "/dashboard/businessEvaluationList"
        },
        {
            title: "Avaliações dos estagiários",
            url: "/dashboard/studentEvaluationListAdmin"
        }
    ],
    student: [
        {
            title: "Dashboard",
            url: "/dashboard"
        },
        {
            title: <Divider/>
        },
        {
            title: "Carregar currículo"
        }
    ],
    employer: [
        {
            title: "Dashboard",
            url: "/dashboard"
        },
        {
            title: <Divider/>
        },
        {
            title: "Criar uma oferta"
        },
        {
            title: "Avaliações de estagiários",
            url: "/dashboard/studentEvaluationList"
        },
        {
            title: "Alunos contratados",
            url: "/dashboard/hiredStudentList"
        }
    ]
}

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

export default function Navbar() {
    const classes = useStyles()
    const history = useHistory()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const [current, setCurrent] = useState(0)
    const {semester, setSemester} = useContext(SemesterContext)
    const {isDarkMode, setDarkMode} = useContext(ThemeContext)
    const [isUploadResumeModalOpen, openUploadResumeModal, closeUploadResumeModal] = useModal()
    const [isSemesterSelectorModalOpen, openSemesterSelectorModal, closeSemesterSelectorModal] = useModal()
    const [isOfferCreationModalOpen, openOfferCreationModal, closeOfferCreationModal] = useModal()

    function getLinks() {
        if (AuthenticationService.getCurrentUserRole() === "student")
            return Links.student
        else if (AuthenticationService.getCurrentUserRole() === "employer")
            return Links.employer
        else
            return Links.admin
    }

    function getRole() {
        switch (AuthenticationService.getCurrentUser().role) {
            case "admin":
                return "Coordenação"
            case "student":
                return "Estudante"
            case "employer":
                return "Supervisor"
            default:
                return undefined;
        }
    }

    useEffect(() => {
        const index = getLinks().findIndex(route => route.url === location.pathname)
        if (index !== -1)
            setCurrent(index)
    }, [location])

    return <AppBar position="static">
        <Toolbar style={{minHeight: "7vh", maxHeight: "7vh", lineHeight: "7vh"}}>
            <Button edge="start" className={[classes.menuButton, classes.linkButton].join(" ")}
                    onClick={() => setMenuOpen(true)} color="inherit">
                <MenuIcon/>
                &ensp;
                <Typography>{getLinks()[current].title}</Typography>
            </Button>
            <div className={classes.spacer}/>
            <Typography>
                <span
                    style={{textTransform: "capitalize"}}>{getRole()}</span> &mdash; {AuthenticationService.getCurrentUser().email}
            </Typography>
            <div className={classes.spacer}/>
            <>
                {isDarkMode ? <Brightness3 fontSize={"small"}/> : <WbSunny fontSize={"small"}/>}
                <Switch
                    checked={Boolean(isDarkMode)}
                    onChange={evt => setDarkMode(evt.target.checked)}
                    size={"small"}
                />
                &emsp;
            </>
            <NotificationButton/>
            {AuthenticationService.getCurrentUserRole() === "admin" &&
            <>
                <Button className={classes.linkButton}
                        onClick={() => openSemesterSelectorModal()}
                >
                    <i className="fa fa-calendar"/>&ensp;{semester}
                </Button>
                &ensp;
            </>
            }
            <Button className={classes.linkButton}
                    onClick={() => {
                        AuthenticationService.logout()
                        axios.get("http://localhost:8080/api/semesters/present")
                            .then(r => setSemester(r ? r.data : ""))
                        history.push("/")
                    }}
            >
                <i className="fa fa-sign-out"/>&ensp;Logout
            </Button>
        </Toolbar>
        <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)} style={{width: 250}}>
            <List style={{width: 250}} onClick={() => setMenuOpen(false)}>
                <ListSubheader>Menu</ListSubheader>
                {getLinks().map((item, index) =>
                    <ListItem button
                              key={index}
                              onClick={() => {
                                  setCurrent(index)
                                  if (item.title === "Carregar currículo")
                                      openUploadResumeModal()
                                  else if (item.title === "Criar uma oferta")
                                      openOfferCreationModal()
                                  else
                                      history.push(item.url)
                              }}
                    >
                        <ListItemText primary={item.title}/>
                    </ListItem>
                )}
                <Divider/>
                <ListItem button
                          onClick={() => history.push("/passwordChange", {email: AuthenticationService.getCurrentUser().email})}>
                    <ListItemText primary={"Alterar senha"}/>
                </ListItem>
            </List>
        </Drawer>
        <ResumeUploadModal isOpen={isUploadResumeModalOpen}
                           hide={closeUploadResumeModal}
                           title={"Envie um novo currículo"}
        />
        <SemesterSelectorModal isOpen={isSemesterSelectorModalOpen}
                               hide={closeSemesterSelectorModal}
                               title={"Escolha um ano letivo"}
        />
        <OfferCreationModal isOpen={isOfferCreationModalOpen}
                            hide={closeOfferCreationModal}
                            title={"Nova oferta de estágio"}
        />
    </AppBar>
}