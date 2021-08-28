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
import * as yup from "yup";
import { useApi } from "../../../Services/Hooks";
import useStyles from "../../Utils/Style/useStyles";

export function RescheduleInterviewModal({
  isOpen,
  hide,
  interview,
  setInterview,
}) {
  const api = useApi();
  const classes = useStyles();

  function updateInterview(values) {
    const nextState = { ...interview };
    nextState.dateTime = values.dateTime;
    nextState.studentAcceptanceState = "INTERVIEW_WAITING_FOR_STUDENT_DECISION";
    api.put("/interviews/" + nextState.id, nextState).then((r) => {
      setInterview(r.data);
      hide();
    });
  }

  const validationSchema = yup.object().shape({
    dateTime: yup
      .date()
      .required()
      .min(new Date(), "A data não pode estar no passado"),
  });

  return (
    <Dialog open={isOpen} onClose={hide} fullWidth maxWidth={"md"}>
      <DialogTitle id="alert-dialog-title">
        Reagendar uma entrevista
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" component={"div"}>
          <Formik
            onSubmit={updateInterview}
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            validationSchema={validationSchema}
            initialValues={
              isOpen
                ? {
                    studentName:
                      interview.studentApplication.student.firstName +
                      " " +
                      interview.studentApplication.student.lastName,
                    offerName: interview.studentApplication.offer.title,
                    dateTime: interview.dateTime,
                  }
                : {}
            }
          >
            {({ isSubmitting }) => (
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      name="studentName"
                      variant="outlined"
                      label="Nome do aluno"
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
                      label="Nome da oferta"
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
                  type={"submit"}
                  fullWidth
                  variant="contained"
                  color="primary"
                  size={"large"}
                  className={classes.submit}
                  disabled={isSubmitting}
                >
                  Reprogramar a entrevista
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
  );
}
