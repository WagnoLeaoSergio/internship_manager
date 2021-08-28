import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Field, Form, Formik } from "formik";
import { SimpleFileUpload, TextField } from "formik-material-ui";
import { DatePicker, TimePicker } from "formik-material-ui-pickers";
import React from "react";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import AuthenticationService from "../../Services/AuthenticationService";
import { useApi } from "../../Services/Hooks";

const tooShortError = (value) =>
  "Deve ter pelo menos " + value.min + " caracteres";
const tooLittleError = (valueNumber) =>
  "Deve ser um número maior ou igual a" + valueNumber.min;
const requiredFieldMsg = "Campo obrigatório";

export default function OfferCreationModal({ isOpen, hide, title }) {
  const api = useApi();
  const history = useHistory();

  function sendOfferToBackEnd(values) {
    return readFileAsync(values.file).then((base64file) => {
      let dto = {};
      dto.details = { ...values };
      dto.title = dto.details.title;
      dto.file = base64file;
      dto.employer = AuthenticationService.getCurrentUser();

      return api.post("/offers", dto);
    });
  }

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const validationSchema = yup.object().shape({
    title: yup.string().trim().min(5, tooShortError).required(requiredFieldMsg),
    description: yup
      .string()
      .trim()
      .min(10, tooShortError)
      .required(requiredFieldMsg),
    salary: yup.number().min(12.5, tooLittleError).required(requiredFieldMsg),
    nbStudentToHire: yup
      .number()
      .min(1, tooLittleError)
      .required(requiredFieldMsg),
    limitDateToApply: yup
      .date()
      .required()
      .when(
        "creationDate",
        (creationDate, schema) =>
          creationDate &&
          schema.min(creationDate, "A data de término deve ser no futuro")
      ),
    internshipStartDate: yup
      .date()
      .required()
      .min(
        yup.ref("limitDateToApply"),
        "A data de início do estágio não pode ser anterior ao prazo de inscrição"
      ),
    internshipEndDate: yup
      .date()
      .required()
      .min(
        yup.ref("internshipStartDate"),
        "A data de término do estágio não pode ser anterior à data de início"
      )
      .when(
        "internshipStartDate",
        (internshipStartDate, schema) =>
          internshipStartDate &&
          schema.min(
            internshipStartDate,
            "A data de início deve ser anterior à data de término"
          )
      ),
  });

  const initialValues = {
    title: "",
    description: "",
    salary: 12.5,
    creationDate: new Date(),
    limitDateToApply: (function () {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      return date;
    })(),
    internshipStartDate: (function () {
      const date = new Date();
      date.setMonth(date.getMonth() + 3);
      return date;
    })(),
    internshipEndDate: (function () {
      const date = new Date();
      date.setMonth(date.getMonth() + 6);
      return date;
    })(),
    nbStudentToHire: 1,
    file: "",
    startTime: Date.parse("Thu, 01 Jan 1970 08:00:00"),
    endTime: Date.parse("Thu, 01 Jan 1970 16:00:00"),
  };

  return isOpen ? (
    <Dialog open={isOpen} onClose={hide} fullWidth maxWidth={"md"}>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" component={"div"}>
          <Formik
            onSubmit={async (values) => {
              const dto = { ...values };
              dto.startTime = new Date(values.startTime)
                .toTimeString()
                .split(" ")[0];
              dto.endTime = new Date(values.endTime)
                .toTimeString()
                .split(" ")[0];
              return sendOfferToBackEnd(dto).then(() => history.push("/"));
            }}
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            validationSchema={validationSchema}
            validate={(values) => {
              const errors = {};
              if (values.file.type !== "application/pdf")
                errors.file = "O arquivo deve ser do tipo PDF";
              if (values.file.length === 0)
                errors.file = "O arquivo está ausente ou vazio";
              return errors;
            }}
            initialValues={initialValues}
          >
            {({ submitForm, isSubmitting }) => (
              <Form>
                <Grid container justify="center" spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="title"
                      id="offerTitle"
                      variant="outlined"
                      label="Título"
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="description"
                      id="description"
                      variant="outlined"
                      label="Descrição"
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      name="nbStudentToHire"
                      id="nbStudentToHire"
                      variant="outlined"
                      label="Número de alunos a contratar"
                      required
                      fullWidth
                      type={"number"}
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      name="salary"
                      id="salary"
                      variant="outlined"
                      label="Salário"
                      required
                      fullWidth
                      type={"number"}
                      InputProps={{ inputProps: { min: 12.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TimePicker}
                      name="startTime"
                      id="startTime"
                      variant="outlined"
                      label="Início do turno"
                      ampm={false}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TimePicker}
                      name="endTime"
                      id="endTime"
                      variant="outlined"
                      label="Fim do turno"
                      ampm={false}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={DatePicker}
                      name="internshipStartDate"
                      id="internshipStartDate"
                      variant="outlined"
                      label="Início do estágio"
                      required
                      fullWidth
                      format="dd MMM yyyy"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={DatePicker}
                      name="internshipEndDate"
                      id="internshipEndDate"
                      variant="outlined"
                      label="Fim do estágio"
                      required
                      fullWidth
                      format="dd MMM yyyy"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Field
                      component={DatePicker}
                      name="limitDateToApply"
                      id="limitDateToApply"
                      variant="outlined"
                      label="Prazo de inscrição"
                      format="dd MMM yyyy"
                      required
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
                  Crie a oferta de estágio
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
  ) : null;
}
