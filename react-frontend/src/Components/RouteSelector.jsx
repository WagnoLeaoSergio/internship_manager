import {Container} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import React from "react"
import {Route, Switch} from "react-router-dom"
import Dashboard from "./Dashboard"
import StudentEvaluationForm from "./Employer/Evaluations/StudentEvaluationForm"
import HiredStudentList from "./Employer/HiredStudentList"
import BusinessEvaluationForm from "./Manager/BusinessEvaluations/BusinessEvaluationForm"
import BusinessEvaluationList from "./Manager/BusinessEvaluations/BusinessEvaluationList"
import ContractForm from "./Manager/ContractForm"
import ContractList from "./Manager/ContractList"
import Employerstatus from "./Manager/EmployerStatus"
import Managers from "./Manager/Managers"
import OfferAssignements from "./Manager/OfferAssignements"
import Reports from "./Manager/Reports"
import StudentStatus from "./Manager/StudentStatus"
import ApplicationList from "./Utils/ApplicationList"
import Footer from "./Utils/Navb-Foot/Footer"
import Navbar from "./Utils/Navb-Foot/Navbar"
import OfferList from "./Utils/OfferList"
import {RoleProtectedRoute} from "./Utils/Routes"
import StudentEvaluationsList from "./Utils/StudentEvaluationsList"

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
    },
    container: {
        flex: 1,
        height: "90vh",
        padding: 0,
        overflow: "hidden"
    }
}))

export default function RouteSelector() {
    const classes = useStyles()

    return <div className={classes.root}>
        <Navbar/>
        <Container maxWidth={"xl"} className={classes.container}>
            <Switch>
                <Route
                    exact={true}
                    path={"/dashboard"}
                    component={Dashboard}
                />
                {/* Administrador */}
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/assignement/offer"
                    component={OfferAssignements}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/status"
                    component={StudentStatus}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/OfferList"
                    component={OfferList}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/applicationsAdmin"
                    component={ApplicationList}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/employersStatus"
                    component={Employerstatus}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/reports"
                    component={Reports}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/contractForm"
                    component={ContractForm}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/businessEvaluation"
                    component={BusinessEvaluationForm}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/businessEvaluationList"
                    component={BusinessEvaluationList}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/studentEvaluationListAdmin"
                    component={StudentEvaluationsList}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/managers"
                    component={Managers}
                    role={"admin"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/contractList"
                    component={ContractList}
                    role={"admin"}
                />
                {/* Empregador */}
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/applications"
                    component={ApplicationList}
                    role={"employer"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/evaluateStudent"
                    component={StudentEvaluationForm}
                    role={"employer"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/studentEvaluationList"
                    component={StudentEvaluationsList}
                    role={"employer"}
                />
                <RoleProtectedRoute
                    exact={true}
                    path="/dashboard/hiredStudentList"
                    component={HiredStudentList}
                    role={"employer"}
                />
                {/* Aluno */}
            </Switch>
        </Container>
        <Footer/>
    </div>
}
