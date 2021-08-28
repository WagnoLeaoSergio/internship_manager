import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {SimpleFileUpload, TextField} from "formik-material-ui";
import React from "react";
import {useHistory} from "react-router-dom";
import * as yup from "yup";
import {useApi} from "../../Services/Hooks";

export default function ResumeUploadModal({isOpen, hide, title}) {
    const api = useApi()
    const history = useHistory()

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
                    onSubmit={async values => readFileAsync(values.file)
                        .then(file => {
                            let dto = {...values}
                            dto.file = file
                            return api.post("/resumes", dto)
                                .then(() => history.push("/"))
                        })}

                    validateOnBlur={false}
                    validateOnChange={false}
                    enableReinitialize={true}
                    validationSchema={yup.object()
                        .shape({
                            name: yup.string().trim().required("Campo obrigatório")
                        })}
                    validate={values => {
                        const errors = {}
                        if (values.file.type !== "application/pdf")
                            errors.file = "O arquivo deve ser do tipo PDF"
                        return errors
                    }}
                    initialValues={{
                        name: "",
                        file: ""
                    }}>
                    {({submitForm, isSubmitting}) => <Form>
                        <Grid container
                              justify="center"
                              spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    name="name"
                                    id="name"
                                    variant="outlined"
                                    label="Nome do arquivo"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={SimpleFileUpload}
                                    type={"file"}
                                    name="file"
                                    id="file"
                                    variant="outlined"
                                    label="Arquivo PDF"
                                    fullwidth
                                    required
                                />
                                <ErrorMessage name={"file"}>
                                    {msg => <p className="msgError"><span style={{color: "red"}}>{msg}</span>
                                    </p>}
                                </ErrorMessage>
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
                            Carregar currículo
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