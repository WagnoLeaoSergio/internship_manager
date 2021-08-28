import { Card, CardContent, Grid } from "@material-ui/core";
import { ErrorMessage, Field } from "formik";
import { SimpleFileUpload, TextField } from "formik-material-ui";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import * as yup from "yup";
import { FormikStepper } from "../../Utils/FormikStepper";
import useStyles from "../../Utils/Style/useStyles";

const tooLittleError = (valueNumber) =>
  "Deve ser maior ou igual a " + valueNumber.min;
const tooBigError = (valueNumber) => "Deve ser menor que " + valueNumber.max;
const requiredFieldMsg = "Campo obrigatório";
const requiredRadioMsg = "Clique na sua escolha";
const requiredSelectMsg = "Opção selecionada inválida";
export default function BusinessEvalution() {
  const classes = useStyles();
  const location = useLocation();
  const [variableShifts, setVariableShifts] = useState(true);

  const evaluationAnswers = [
    "Concordo plenamente",
    "Concordo",
    "Discordo parcialmente",
    "Discordo totalmente",
    "N / D",
  ];

  const traineesNumber = [
    "Estagiário",
    "Dois estagiários",
    "Três estagiários",
    "Mais de três",
  ];

  function mapAnswers(selectOptionAnswers) {
    return selectOptionAnswers.map((e, k) => (
      <option defaultValue={e} key={k}>
        {e}
      </option>
    ));
  }

  function showErrorMessage() {
    return (msg) => (
      <p className="msgError">
        <span style={{ color: "red" }}>{msg}</span>
      </p>
    );
  }

  const EvaluationCriteriasValidation = yup.object().shape({
    evaluationCriterias: yup.object().shape({
      internshipCount: yup.string().required(requiredRadioMsg),
      hoursOfWeekFirstMonth: yup
        .number()
        .required()
        .min(1, tooLittleError)
        .max(100, tooBigError)
        .required(requiredFieldMsg),
      hoursOfWeekSecondMonth: yup
        .number()
        .required()
        .min(1, tooLittleError)
        .max(100, tooBigError)
        .required(requiredFieldMsg),
      hoursOfWeekThirdMonth: yup
        .number()
        .required()
        .min(1, tooLittleError)
        .max(100, tooBigError)
        .required(requiredFieldMsg),
      workAsAnnoncement: yup
        .string()
        .oneOf(evaluationAnswers, requiredSelectMsg)
        .required(),
      easyIntigration: yup
        .string()
        .oneOf(evaluationAnswers, requiredSelectMsg)
        .required(),
      sufficientTime: yup
        .string()
        .oneOf(evaluationAnswers, requiredSelectMsg)
        .required(),
      securityWorkPlace: yup
        .string()
        .oneOf(evaluationAnswers, requiredSelectMsg)
        .required(),
      pleasantEnvironnement: yup
        .string()
        .oneOf(evaluationAnswers, requiredSelectMsg)
        .required(),
      accessiblePlace: yup
        .string()
        .oneOf(evaluationAnswers, requiredSelectMsg)
        .required(),
      goodSalary: yup
        .string()
        .oneOf(evaluationAnswers, requiredSelectMsg)
        .required(),
      supervisorFacilitatesIntern: yup
        .string()
        .oneOf(evaluationAnswers, requiredSelectMsg)
        .required(),
      adequateEquipement: yup
        .string()
        .oneOf(evaluationAnswers, requiredSelectMsg)
        .required(),
      accetableWorkload: yup
        .string()
        .oneOf(evaluationAnswers, requiredSelectMsg)
        .required(),
    }),
  });

  const ObservationsValidation = yup.object().shape({
    observations: yup.object().shape({
      preferedInternship: yup.string().required(requiredRadioMsg),
      welcomeSameIntern: yup.string().required(requiredRadioMsg),
      variablesShifts: yup.string().required(requiredRadioMsg),
      startShiftsOne: yup
        .number()
        .required()
        .min(0, tooLittleError)
        .max(23, tooBigError)
        .required(requiredFieldMsg),
      startShiftsTwo: yup
        .number()
        .required()
        .min(0, tooLittleError)
        .max(23, tooBigError),
      startShiftsThree: yup
        .number()
        .required()
        .min(0, tooLittleError)
        .max(23, tooBigError),
      endShiftsOne: yup
        .number()
        .required()
        .min(0, tooLittleError)
        .max(23, tooBigError)
        .required(requiredFieldMsg),
      endShiftsTwo: yup
        .number()
        .required()
        .min(0, tooLittleError)
        .max(23, tooBigError),
      endShiftsThree: yup
        .number()
        .required()
        .min(0, tooLittleError)
        .max(23, tooBigError),
      numbersOfInterns: yup
        .string()
        .oneOf(traineesNumber, requiredSelectMsg)
        .required(),
    }),
  });

  const SignatureValidation = yup.object().shape({
    signature: yup.object().shape({
      name: yup
        .string()
        .trim()
        .min(2, "Deve ter pelo menos 2 caracteres")
        .max(255, "Deve ter menos de 255 caracteres")
        .required(requiredFieldMsg),
    }),
  });

  function EvaluationStep(props) {
    return (
      <FormikStep label="Avaliação" validationSchema={props.validationSchema}>
        <Grid container justify="space-between" spacing={2}>
          <Grid item xs={12}>
            <label>Stage : </label>
            <Field
              type="radio"
              name="evaluationCriterias.internshipCount"
              id="internship"
              value="Primeiro estágio"
            />
            <label style={{ marginRight: "1em" }}>Primeiro estágio</label>
            <Field
              type="radio"
              name="evaluationCriterias.internshipCount"
              id="internship"
              value="Segundo estágio"
            />
            <label>Segundo estágio</label>
            <ErrorMessage name={"evaluationCriterias.internshipCount"}>
              {props.errorMessage()}
            </ErrorMessage>
          </Grid>
          <Grid item xs={8}>
            <label style={{ marginRight: "2em" }}>
              As tarefas atribuídas ao trainee são consistentes com as tarefas
              anunciado no acordo de estágio
            </label>
          </Grid>
          <Grid item xs={4}>
            <Field
              as="select"
              align="start"
              name="evaluationCriterias.workAsAnnoncement"
            >
              {props.mapEvaluationAnswers()}
            </Field>
            <ErrorMessage name={"evaluationCriterias.workAsAnnoncement"}>
              {props.errorMessage()}
            </ErrorMessage>
          </Grid>
          <Grid item xs={8}>
            <label style={{ marginRight: "2em" }}>
              Medidas de recepção facilitam a integração do novo estagiário
            </label>
          </Grid>
          <Grid item xs={4}>
            <Field as="select" name="evaluationCriterias.easyIntigration">
              {props.mapEvaluationAnswers()}
            </Field>
            <ErrorMessage name={"evaluationCriterias.easyIntigration"}>
              {props.errorMessage()}
            </ErrorMessage>
          </Grid>
          <Grid item xs={8}>
            <label style={{ marginRight: "2em" }}>
              O tempo real dedicado à supervisão do estagiário é suficiente
            </label>
          </Grid>
          <Grid item xs={4}>
            <Field as="select" name="evaluationCriterias.sufficientTime">
              {props.mapEvaluationAnswers()}
            </Field>
            <ErrorMessage name={"evaluationCriterias.sufficientTime"}>
              {props.errorMessage()}
            </ErrorMessage>
          </Grid>
          <Grid item xs={8}>
            <label style={{ marginRight: "2em" }}>
              O ambiente de trabalho respeita as normas de higiene e segurança
              no trabalho
            </label>
          </Grid>
          <Grid item xs={4}>
            <Field as="select" name="evaluationCriterias.securityWorkPlace">
              {props.mapEvaluationAnswers()}
            </Field>
            <ErrorMessage name={"evaluationCriterias.securityWorkPlace"}>
              {props.errorMessage()}
            </ErrorMessage>
          </Grid>
          <Grid item xs={8}>
            <label style={{ marginRight: "2em" }}>
              O clima de trabalho é agradável
            </label>
          </Grid>
          <Grid item xs={4}>
            <Field as="select" name="evaluationCriterias.pleasantEnvironnement">
              {props.mapEvaluationAnswers()}
            </Field>
            <ErrorMessage name={"evaluationCriterias.pleasantEnvironnement"}>
              {props.errorMessage()}
            </ErrorMessage>
          </Grid>
          <Grid item xs={8}>
            <label style={{ marginRight: "2em" }}>
              O ambiente de estágio é acessível por transporte público
            </label>
          </Grid>
          <Grid item xs={4}>
            <Field as="select" name="evaluationCriterias.accessiblePlace">
              {props.mapEvaluationAnswers()}
            </Field>
            <ErrorMessage name={"evaluationCriterias.accessiblePlace"}>
              {props.errorMessage()}
            </ErrorMessage>
          </Grid>
          <Grid item xs={8}>
            <label style={{ marginRight: "2em" }}>
              O salário oferecido é interessante para o estagiário
            </label>
          </Grid>
          <Grid item xs={4}>
            <Field as="select" name="evaluationCriterias.goodSalary">
              {props.mapEvaluationAnswers()}
            </Field>
            <ErrorMessage name={"evaluationCriterias.goodSalary"}>
              {props.errorMessage()}
            </ErrorMessage>
          </Grid>
          <Grid item xs={12}>
            <Field
              component={TextField}
              name="evaluationCriterias.salary"
              id="salary"
              variant="outlined"
              label="Especifique a carga horária"
              required
              type={"number"}
              style={{ marginRight: "2em" }}
              InputProps={{
                inputProps: {
                  min: 12.5,
                  step: "any",
                },
              }}
            />
          </Grid>
          <Grid item xs={8}>
            <label style={{ marginRight: "2em" }}>
              A comunicação com o supervisor de estágio facilita progresso do
              estágio
            </label>
          </Grid>
          <Grid item xs={4}>
            <Field
              as="select"
              name="evaluationCriterias.supervisorFacilitatesIntern"
            >
              {props.mapEvaluationAnswers()}
            </Field>
            <ErrorMessage
              name={"evaluationCriterias.supervisorFacilitatesIntern"}
            >
              {props.errorMessage()}
            </ErrorMessage>
          </Grid>
          <Grid item xs={8}>
            <label style={{ marginRight: "2em" }}>
              O equipamento fornecido é adequado para realizar as tarefas
              atribuídas
            </label>
          </Grid>
          <Grid item xs={4}>
            <Field as="select" name="evaluationCriterias.adequateEquipement">
              {props.mapEvaluationAnswers()}
            </Field>
            <ErrorMessage name={"evaluationCriterias.adequateEquipement"}>
              {props.errorMessage()}
            </ErrorMessage>
          </Grid>
          <Grid item xs={8}>
            <label style={{ marginRight: "2em" }}>
              O volume de trabalho é aceitável
            </label>
          </Grid>
          <Grid item xs={4}>
            <Field as="select" name="evaluationCriterias.accetableWorkload">
              {props.mapEvaluationAnswers()}
            </Field>
            <ErrorMessage name={"evaluationCriterias.accetableWorkload"}>
              {props.errorMessage()}
            </ErrorMessage>
          </Grid>
          <Grid item xs={12}>
            <label style={{ marginRight: "2em" }}>
              Especifique o número de horas por semana:
            </label>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Field
              component={TextField}
              name="evaluationCriterias.hoursOfWeekFirstMonth"
              id="hoursOfWeekFirstMonth"
              variant="outlined"
              label="Primeiro mês"
              required
              fullWidth
              type={"number"}
              InputProps={{
                inputProps: {
                  min: 1,
                  max: 100,
                  step: "any",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Field
              component={TextField}
              name="evaluationCriterias.hoursOfWeekSecondMonth"
              id="hoursOfWeekSecondMonth"
              variant="outlined"
              label="Segundo mês"
              required
              fullWidth
              type={"number"}
              InputProps={{
                inputProps: {
                  min: 1,
                  max: 100,
                  step: "any",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Field
              component={TextField}
              name="evaluationCriterias.hoursOfWeekThirdMonth"
              id="hoursOfWeekThirdMonth"
              variant="outlined"
              label="Terceiro mês"
              required
              fullWidth
              type={"number"}
              InputProps={{
                inputProps: {
                  min: 1,
                  max: 100,
                  step: "any",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              component={TextField}
              variant={"outlined"}
              rows={4}
              fullWidth
              multiline
              label="Comentários"
              name="evaluationCriterias.comment"
            ></Field>
          </Grid>
        </Grid>
      </FormikStep>
    );
  }

  function GeneralObservationsStep(props) {
    return (
      <FormikStep validationSchema={props.validationSchema}>
        <Grid container justify="space-between" spacing={2}>
          <Grid item xs={8}>
            <label style={{ marginRight: "2em" }}>
              Este ambiente é o preferido para o
            </label>
          </Grid>
          <Grid item xs={4}>
            <Field
              type="radio"
              name="observations.preferedInternship"
              value="Primeiro estágio"
            />
            <label style={{ marginRight: "1em" }}>Premier stage</label>
            <Field
              type="radio"
              name="observations.preferedInternship"
              value="Segundo estágio"
            />
            <label>Segundo estágio</label>
            <ErrorMessage name={"observations.preferedInternship"}>
              {props.errorMessage()}
            </ErrorMessage>
          </Grid>
          <Grid item xs={8}>
            <label style={{ marginRight: "2em" }}>
              
Este ambiente está aberto ao acolhimento
            </label>
          </Grid>
          <Grid item xs={4}>
            <Field as="select" name="observations.numbersOfInterns">
              {props.mapEvaluationAnswers()}
            </Field>
            <ErrorMessage name={"observations.numbersOfInterns"}>
              {props.errorMessage()}
            </ErrorMessage>
          </Grid>
          <Grid item xs={8}>
            <label style={{ marginRight: "2em" }}>
            Este ambiente deseja acolher o mesmo estagiário para um futuro
              estágio
            </label>
          </Grid>
          <Grid item xs={4}>
            <Field
              type="radio"
              name="observations.welcomeSameIntern"
              value="Sim"
            />
            <label style={{ marginRight: "1em" }}>Sim</label>
            <Field
              type="radio"
              name="observations.welcomeSameIntern"
              value="Não"
            />
            <label>Não</label>
            <ErrorMessage name={"observations.welcomeSameIntern"}>
              {props.errorMessage()}
            </ErrorMessage>
          </Grid>
          <Grid item xs={8}>
            <label style={{ marginRight: "2em" }}>
            Este ambiente oferece turnos flexíveis
            </label>
          </Grid>
          <Grid item xs={4}>
            <Field
              type="radio"
              name="observations.variablesShifts"
              value="Sim"
              onClick={() => setVariableShifts(true)}
            />
            <label style={{ marginRight: "1em" }}>Sim</label>
            <Field
              type="radio"
              name="observations.variablesShifts"
              value="Não"
              onClick={() => setVariableShifts(false)}
            />
            <label>Não</label>
            <ErrorMessage name={"observations.variablesShifts"}>
              {props.errorMessage()}
            </ErrorMessage>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Field
              component={TextField}
              name="observations.startShiftsOne"
              id="startShiftsOne"
              variant="outlined"
              label="De"
              required
              fullWidth
              type={"number"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Field
              component={TextField}
              name="observations.endShiftsOne"
              id="endShiftsOne"
              variant="outlined"
              label="a"
              required
              fullWidth
              type={"number"}
            />
          </Grid>
          {variableShifts && (
            <>
              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="observations.startShiftsTwo"
                  id="startShiftsTwo"
                  variant="outlined"
                  label="De"
                  fullWidth
                  type={"number"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="observations.endShiftsTwo"
                  id="endShiftsTwo"
                  variant="outlined"
                  label="a"
                  fullWidth
                  type={"number"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="observations.startShiftsThree"
                  id="startShiftsThree"
                  variant="outlined"
                  label="De"
                  fullWidth
                  type={"number"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  component={TextField}
                  name="observations.endShiftsThree"
                  id="endShiftsThree"
                  variant="outlined"
                  label="a"
                  fullWidth
                  type={"number"}
                />
              </Grid>
            </>
          )}
        </Grid>
      </FormikStep>
    );
  }

  function SignatureStep(props) {
    return (
      <FormikStep validationSchema={props.validationSchema}>
        <Grid container alignItems="flex-start" justify="center" spacing={2}>
          <Grid item xs={12}>
            <Field
              component={TextField}
              name="signature.name"
              variant="outlined"
              label="Nome"
              required
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              component={SimpleFileUpload}
              type={"file"}
              name="signature.image"
              id="file"
              variant="outlined"
              label="Arquivo de assinatura do tipo JPG ou PNG"
              required
              fullWidth
            />
          </Grid>
        </Grid>
      </FormikStep>
    );
  }

  return (
    <Card className={classes.list}>
      <CardContent>
        <FormikStepper
          contract={location.state}
          initialValues={{
            evaluationCriterias: {
              internshipCount: "",
              workAsAnnoncement: evaluationAnswers[0],
              easyIntigration: evaluationAnswers[0],
              sufficientTime: evaluationAnswers[0],
              hoursOfWeekFirstMonth: 1,
              hoursOfWeekSecondMonth: 1,
              hoursOfWeekThirdMonth: 1,
              securityWorkPlace: evaluationAnswers[0],
              pleasantEnvironnement: evaluationAnswers[0],
              accessiblePlace: evaluationAnswers[0],
              goodSalary: evaluationAnswers[0],
              salary: 12.5,
              supervisorFacilitatesIntern: evaluationAnswers[0],
              adequateEquipement: evaluationAnswers[0],
              accetableWorkload: evaluationAnswers[0],
              comment: "",
            },
            observations: {
              preferedInternship: "",
              numbersOfInterns: traineesNumber[0],
              welcomeSameIntern: "",
              variablesShifts: "",
              startShiftsOne: 0,
              startShiftsTwo: 0,
              startShiftsThree: 0,
              endShiftsOne: 0,
              endShiftsTwo: 0,
              endShiftsThree: 0,
            },
            signature: {
              image: "",
              name: location.state.admin.name,
              date: new Date(),
            },
          }}
          evaluationAnswers={evaluationAnswers}
          traineesNumber={traineesNumber}
        >
          <EvaluationStep
            label="Avaliação"
            validationSchema={EvaluationCriteriasValidation}
            mapEvaluationAnswers={() => mapAnswers(evaluationAnswers)}
            errorMessage={showErrorMessage}
          />
          <GeneralObservationsStep
            label="Observações Gerais"
            validationSchema={ObservationsValidation}
            mapEvaluationAnswers={() => mapAnswers(traineesNumber)}
            errorMessage={showErrorMessage}
          />
          <SignatureStep
            label="Assinatura"
            validationSchema={SignatureValidation}
            errorMessage={showErrorMessage}
          />
        </FormikStepper>
      </CardContent>
    </Card>
  );
}

export function FormikStep({ children }) {
  return <>{children}</>;
}
