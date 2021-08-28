import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import {Field, Form, Formik} from "formik";
import {SimpleFileUpload, TextField} from "formik-material-ui";
import React from "react";
import {useHistory} from "react-router-dom";
import * as yup from "yup";
import AuthenticationService from "../../../Services/AuthenticationService"
import {useApi} from "../../../Services/Hooks";

const tooShortError = value => "Deve ter pelo menos " + value.min + " caracteres"
const tooLongError = value => "Deve ter até " + value.max + " caracteres"

export default function SignModal({isOpen, hide, title, contract}) {
    const api = useApi()
    const history = useHistory()

    function sendDecision(isApprouved, values) {
        let dto = {}
        if (isApprouved) {
            return readFileAsync(values.file).then(file => {
                dto.contractId = contract.id
                dto.isApproved = isApprouved
                dto.imageSignature = file
                dto.reasonForRejection = ""
                dto.signatureName = values.signatureName
                return api.put("/contractGeneration/sign", dto)
                    .then(() => history.push("/"))
            })
        } else {
            dto.contractId = contract.id
            dto.isApproved = isApprouved
            dto.reasonForRejection = values.message
            return api.put("/contractGeneration/sign", dto)
                .then(() => history.push("/"))
        }
    }

    function readFileAsync(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader()
            reader.onload = () => {
                resolve(reader.result)
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    return isOpen ? <Dialog open={isOpen} onClose={hide} fullWidth maxWidth={"md"}>
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description" component={"div"}>
                <Formik
                    onSubmit={async values => sendDecision(true, values)}

                    validateOnBlur={false}
                    validateOnChange={false}
                    enableReinitialize={true}
                    validate={values => {
                        const errors = {}
                        if (values.file.type !== "image/png" && values.file.type !== "image/jpeg") {
                            errors.file = "A imagem deve ser do tipo PNG ou JPG"
                        }
                        return errors
                    }}
                    validationSchema={yup.object()
                        .shape({
                            signatureName: yup.string().trim().min(2, tooShortError).max(255, tooLongError).required("Ce champ est requis")
                        })
                    }
                    initialValues={{
                        signatureName: AuthenticationService.getCurrentUser().name,
                        file: ""
                    }}>
                    {({submitForm, isSubmitting}) => <Form>
                        <Grid container
                              justify="center"
                              spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    name="signatureName"
                                    id="signatureName"
                                    variant="outlined"
                                    label="Nome do signatário"
                                    required
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={SimpleFileUpload}
                                    type={"file"}
                                    name="file"
                                    id="file"
                                    variant="outlined"
                                    label="Uma imagem de assinatura no formato PNG ou JPG"
                                    fullwidth
                                    required
                                />
                            </Grid>
                        </Grid>
                        <br/>
                        {isSubmitting && <LinearProgress/>}
                        <Button
                            id="buttonSubmit"
                            type={"submit"}
                            variant="contained"
                            fullWidth
                            size={"large"}
                            color="primary"
                            disabled={isSubmitting}
                            onClick={submitForm}
                        >
                            Assinar
                        </Button>
                    </Form>}
                </Formik>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={hide} color={"primary"}>
                Cancelar
            </Button>
        </DialogActions>
    </Dialog> : null
}