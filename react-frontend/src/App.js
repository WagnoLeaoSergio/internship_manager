import DateFnsUtils from "@date-io/date-fns"
import CssBaseline from "@material-ui/core/CssBaseline"
import * as locales from "@material-ui/core/locale"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import {MuiPickersUtilsProvider} from "@material-ui/pickers"
import ThemeProvider from "@material-ui/styles/ThemeProvider"
import axios from "axios"
import {frCA} from "date-fns/locale"
import React, {useEffect, useState} from "react"
import {pdfjs} from "react-pdf"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Login from "./Components/Login"
import PasswordChange from "./Components/PasswordChange"
import RegisteringManager from "./Components/RegisteringManager"
import RouteSelector from "./Components/RouteSelector"
import ErrorModal from "./Components/Utils/Modal/ErrorModal"
import {BasicProtectedRoute} from "./Components/Utils/Routes"
import {useModal, usePersistentState} from "./Services/Hooks"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export const ModalContext = React.createContext(null)
export const SemesterContext = React.createContext(null)
export const ThemeContext = React.createContext(null)

function App() {
    const [isErrorModalOpen, openErrorModal, closeErrorModal] = useModal()
    const [semester, setSemester] = useState(undefined)
    const [isDarkMode, setDarkMode] = usePersistentState("darkMode")
    const themeOptions = {
        palette: {
            type: isDarkMode ? "dark" : "light",
            primary: {
                main: "#78909c"
            },
            secondary: {
                main: "#f57f17"
            }
        },
        overrides: {
            MuiOutlinedInput: {
                input: {
                    "&:-webkit-autofill": {
                        "-webkit-box-shadow": isDarkMode ? "0 0 0 100px #424242 inset" : undefined
                    }
                }
            }
        }

    };

    useEffect(() => {
        axios.get("http://localhost:8080/api/semesters/present")
            .then(r => setSemester(r ? r.data : ""))
    }, [])

    return <ThemeProvider theme={createMuiTheme(themeOptions, locales["frFR"])}>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={frCA}>
            <ModalContext.Provider value={{open: openErrorModal}}>
                <SemesterContext.Provider value={{semester, setSemester}}>
                    <ThemeContext.Provider value={{isDarkMode, setDarkMode}}>
                        <div className="App">
                            <CssBaseline/>
                            <Router>
                                <Switch>
                                    <Route exact path="/" component={Login}/>
                                    <Route exact path="/register" component={RegisteringManager}/>
                                    <Route exact path="/passwordChange" component={PasswordChange}/>
                                    <BasicProtectedRoute exact={false} path="/dashboard" component={RouteSelector}/>
                                </Switch>
                            </Router>
                            <ErrorModal isOpen={isErrorModalOpen} hide={closeErrorModal}/>
                        </div>
                    </ThemeContext.Provider>
                </SemesterContext.Provider>
            </ModalContext.Provider>
        </MuiPickersUtilsProvider>
    </ThemeProvider>
}

export default App
