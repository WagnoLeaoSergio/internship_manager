import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React, { useContext } from "react";
import * as yup from "yup";
import { ModalContext } from "../App";
import AuthenticationService from "../Services/AuthenticationService";

const tooShortError = value => "Deve ter pelo menos " + value.min + " caracteres"
const tooLongError = value => "Deve ter até " + value.max + " caracteres"
const requiredFieldMsg = "Campo obrigatório"

export default function RegisterStudent(props) {
    const {open} = useContext(ModalContext)
    const validationSchema = yup.object()
        .shape({
            firstName: yup.string().trim().min(2, tooShortError).required(requiredFieldMsg),
            address: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
            lastName: yup.string().trim().min(2, tooShortError).max(30, tooLongError).required(requiredFieldMsg),
            studentId: yup.string().trim().min(7, tooShortError).max(7, tooLongError).required(requiredFieldMsg),
            phoneNumber: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
            email: yup.string().trim().email("O endereço de e-mail é inválido").required(requiredFieldMsg),
            password: yup.string().trim().min(8, tooShortError).required(requiredFieldMsg),
            passwordConfirm: yup.string()
                .oneOf([yup.ref('password'), null], "As senhas devem ser idênticas").required(requiredFieldMsg),
        })
    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: "",
        studentId: "",
        phoneNumber: "",
        address: "",
    }

    return <Formik
        onSubmit={async (values, {setFieldError}) =>
            AuthenticationService.registerUser("/students", values, setFieldError, open, props.history)
        }

        validateOnBlur={false}
        validateOnChange={false}
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={initialValues}
    >
        {({isSubmitting}) => <Form className={props.classes.form}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="firstName"
                        id="firstNameStudent"
                        variant="outlined"
                        label="Primeiro nome"
                        required
                        fullWidth
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="lastName"
                        id="lastNameStudent"
                        variant="outlined"
                        label="Sobrenome"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        component={TextField}
                        name="address"
                        id="addressStudent"
                        variant="outlined"
                        label="Endereço"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="studentId"
                        id="studentIdStudent"
                        variant="outlined"
                        label="Matrícula"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="phoneNumber"
                        id="phoneNumberStudent"
                        variant="outlined"
                        label="Telefone de contato"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        component={TextField}
                        name="email"
                        id="emailStudent"
                        variant="outlined"
                        label="E-mail"
                        type={"email"}
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="password"
                        id="passwordStudent"
                        variant="outlined"
                        label="Senha"
                        type={"password"}
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="passwordConfirm"
                        id="passwordConfirmStudent"
                        variant="outlined"
                        label="Confirmação de senha"
                        type={"password"}
                        required
                        fullWidth
                    />
                </Grid>
            </Grid>
            <br/>
            {isSubmitting && <LinearProgress/>}
            <Button
                type={"submit"}
                fullWidth
                variant="contained"
                color="primary"
                size={"large"}
                className={props.classes.submit}
                disabled={isSubmitting}
            >
                Cadastrar
            </Button>
        </Form>}
    </Formik>
}
