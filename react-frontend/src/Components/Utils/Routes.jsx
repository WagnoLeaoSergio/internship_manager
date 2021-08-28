import React from "react";
import { Redirect } from "react-router-dom";
import AuthenticationService from "../../Services/AuthenticationService";

export function ConditionalRoute(props) {
    return (props.condition) ? <props.component/> : <Redirect to={"/"}/>
}

export function BasicProtectedRoute(props) {
    return <ConditionalRoute component={props.component} condition={AuthenticationService.isUserLoggedIn()}/>
}

export function RoleProtectedRoute(props) {
    return <ConditionalRoute
        component={props.component}
        condition={AuthenticationService.getCurrentUserRole() === props.role}
    />
}
