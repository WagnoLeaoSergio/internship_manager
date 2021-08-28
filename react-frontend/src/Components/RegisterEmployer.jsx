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

export default function RegisterEmployer(props) {
    const {open} = useContext(ModalContext)
    const validationSchema = yup.object()
        .shape({
            companyName: yup.string().trim().min(5, tooShortError).required(requiredFieldMsg),
            address: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
            contactName: yup.string().trim().min(5, tooShortError).max(50, tooLongError).required(requiredFieldMsg),
            phoneNumber: yup.string().trim().min(10, tooShortError).required(requiredFieldMsg),
            email: yup.string().trim().email("O endereço de e-mail é inválido").required(requiredFieldMsg),
            password: yup.string().trim().min(8, tooShortError).required(requiredFieldMsg),
            passwordConfirm: yup.string()
                .oneOf([yup.ref("password"), null], "As senhas devem ser idênticas").required(requiredFieldMsg)
        })
    const initialValues = {
        companyName: '',
        contactName: '',
        phoneNumber: '',
        address: '',
        email: '',
        password: '',
        passwordConfirm: '',
    }

    return <Formik
        onSubmit={async (values, {setFieldError}) =>
            AuthenticationService.registerUser("/employers", values, setFieldError, open, props.history)
        }

        validateOnBlur={false}
        validateOnChange={false}
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={initialValues}
    >
        {({isSubmitting}) => <Form className={props.classes.form}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Field
                        component={TextField}
                        name="companyName"
                        id="companyName"
                        variant="outlined"
                        label="Nome da empresa"
                        required
                        fullWidth
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        component={TextField}
                        name="address"
                        id="address"
                        variant="outlined"
                        label="Endereço da empresa"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="contactName"
                        id="contactName"
                        variant="outlined"
                        label="Nome do supervisor"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Field
                        component={TextField}
                        name="phoneNumber"
                        id="phoneNumberEmployer"
                        variant="outlined"
                        label="Número de telefone"
                        required
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Field
                        component={TextField}
                        name="email"
                        id="emailEmployer"
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
                        id="passwordEmployer"
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
                        id="passwordConfirmEmployer"
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
