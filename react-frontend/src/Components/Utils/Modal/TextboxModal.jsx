import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";
import * as yup from "yup";

export default function TextboxModal({isOpen, hide, title, onSubmit}) {
    return isOpen ? <Dialog open={isOpen} onClose={hide} fullWidth maxWidth={"md"}>
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description" component={"div"}>
                <Formik
                    onSubmit={onSubmit}

                    validationSchema={yup.object()
                        .shape({
                            message: yup.string().trim().max(255).required("Campo obrigatório"),
                        })}
                    validateOnBlur={false}
                    validateOnChange={false}
                    enableReinitialize={true}
                    initialValues={{message: ""}}>
                    {({isSubmitting}) => <Form>
                        <Field
                            component={TextField}
                            multiline
                            rows={5}
                            name="message"
                            id="message"
                            variant="outlined"
                            label="Digite sua mensagem aqui"
                            required
                            fullWidth
                        />
                        <br/>
                        {isSubmitting && <LinearProgress/>}
                        <Button
                            type={"submit"}
                            fullWidth
                            variant="contained"
                            color="primary"
                            size={"large"}
                            disabled={isSubmitting}
                        >
                            Enviar
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
