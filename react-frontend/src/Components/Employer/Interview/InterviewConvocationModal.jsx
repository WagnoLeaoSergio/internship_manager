import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { DateTimePicker } from "formik-material-ui-pickers";
import React from "react";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import AuthenticationService from "../../../Services/AuthenticationService";
import { useApi } from "../../../Services/Hooks";

const requiredFieldMsg = "Campo obrigatório";
export default function InterviewConvocationModal({
  isOpen,
  hide,
  application,
  title,
}) {
  const api = useApi();
  const history = useHistory();

  function createInterview(values) {
    let dto = { ...values };
    dto.employer = AuthenticationService.getCurrentUser();
    dto.reviewState = "PENDING";
    dto.studentApplication = application;
    return api
      .post("/interviews", dto)
      .then(() => history.push("/dashboard/", { tab: 1 }));
  }

  return (
    isOpen && (
      <Dialog open={isOpen} onClose={hide} fullWidth maxWidth={"md"}>
        <DialogTitle id="alert-dialog-title">Aluno para conhecer</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component={"div"}>
            <Formik
              onSubmit={createInterview}
              validateOnBlur={false}
              validateOnChange={false}
              enableReinitialize={true}
              validationSchema={yup.object().shape({
                dateTime: yup
                  .date()
                  .required(requiredFieldMsg)
                  .min(new Date(), "A data não pode estar no passado"),
              })}
              initialValues={{
                dateTime: new Date(),
                studentName:
                  application.student.firstName +
                  " " +
                  application.student.lastName,
                offerName: title,
              }}
            >
              {({ submitForm, isSubmitting }) => (
                <Form>
                  <Grid container justify="center" spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Field
                        component={TextField}
                        name="studentName"
                        variant="outlined"
                        label="Nome do estudante"
                        required
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        component={TextField}
                        name="offerName"
                        variant="outlined"
                        label="Nome da Oferta"
                        disabled
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        component={DateTimePicker}
                        name="dateTime"
                        variant="outlined"
                        label="Data e hora da entrevista"
                        ampm={false}
                        format="d MMM yyyy HH:mm"
                        required
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <br />
                  {isSubmitting && <LinearProgress />}
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
                    Convocar estudante
                  </Button>
                </Form>
              )}
            </Formik>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={hide} color={"primary"}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    )
  );
}
