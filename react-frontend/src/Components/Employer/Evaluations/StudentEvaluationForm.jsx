import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { ErrorMessage, Field } from "formik";
import { SimpleFileUpload, TextField } from "formik-material-ui";
import React from "react";
import { useLocation } from "react-router-dom";
import * as yup from "yup";
import { FormikStepper } from "../../Utils/FormikStepper";
import useStyles from "../../Utils/Style/useStyles";

const tooShortError = (value) =>
  "Deve ter pelo menos " + value.min + " caracteres";
const tooLittleError = (valueNumber) =>
  "Deve ser maior ou igual a" + valueNumber.min;
const tooBigError = (valueNumber) =>
  "Deve ser menor ou igual a " + valueNumber.max;
const requiredFieldMsg = "Campo obrigatório";
const requiredRadioMsg = "Deve escolher uma opção";
const invalidSelectOption = "Opção selecionada inválida";

function GeneralInfoStep(props) {
  return (
    <FormikStep validationSchema={props.validationSchema}>
      <Grid container alignItems="flex-start" justify="center" spacing={2}>
        <Typography variant={"h1"} className={props.classes.formTitle}>
          Avaliação do estagiário
        </Typography>
        <Grid item xs={12}>
          <Field
            component={TextField}
            name="infos.studentProgram"
            id="studentProgram"
            variant="outlined"
            label="Programa de estudo : "
            required
            fullWidth
            autoFocus
          />
        </Grid>
      </Grid>
    </FormikStep>
  );
}

function ProductivityStep(props) {
  return (
    <FormikStep validationSchema={props.validationSchema}>
      <Grid container justify="space-between" spacing={2}>
        <Grid item xs={12}>
          <h3>Capacidade de otimizar o desempenho do trabalho</h3>
        </Grid>
        <Grid item xs={8}>
          <label>a - Planeja e organiza seu trabalho de maneira eficaz</label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" variant="outlined" name="productivity.efficiency">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="productivity.efficiency">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label style={{ marginRight: "2em" }}>
            b - Compreende rapidamente as diretrizes para o seu trabalho
          </label>
        </Grid>
        <Grid item xs={4}>
          <Field
            variant="outlined"
            as="select"
            name="productivity.comprehension"
          >
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="productivity.comprehension">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label style={{ marginRight: "2em" }}>
            c - Mantém um ritmo de trabalho consistente
          </label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="productivity.rythm">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="productivity.rhythm">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label style={{ marginRight: "2em" }}>
            d - Estabelece suas prioridades de forma assertiva
          </label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="productivity.priorities">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="productivity.priorities">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label style={{ marginRight: "2em" }}>e - Respeita seus prazos</label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="productivity.deadlines">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="productivity.deadlines">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            rows={4}
            variant={"outlined"}
            fullWidth
            multiline
            label="Comentários adicionais"
            name="productivity.comment"
          />
        </Grid>
      </Grid>
    </FormikStep>
  );
}

function QualityStep(props) {
  return (
    <FormikStep validationSchema={props.validationSchema}>
      <Grid container alignItems="flex-start" justify="center" spacing={2}>
        <Grid item xs={12}>
          <h3>
            Capacidade de realizar as tarefas com autonomia e seguindo padrões
            de qualidade
          </h3>
        </Grid>
        <Grid item xs={8}>
          <label>a - Respeita o que lhe é delegado</label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="quality.followsInstruction">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="quality.followsInstruction">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label>b - Presta atenção aos detalhes ao realizar as tarefas</label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="quality.detailsAttention">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="quality.detailsAttention">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label>
            c - Revisa seu trabalho, certifica-se de que nada foi esquecido
          </label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="quality.doubleChecks">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="quality.doubleChecks">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label>
            d - Procura oportunidades para melhorar suas habilidades
          </label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="quality.strivesForPerfection">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="quality.strivesForPerfection">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label>e - Faz uma boa análise dos problemas encontrados</label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="quality.problemAnalysis">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="quality.problemAnalysis">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            variant={"outlined"}
            rows={4}
            fullWidth
            multiline
            label="Comentários adicionais"
            name="quality.comment"
          />
        </Grid>
      </Grid>
    </FormikStep>
  );
}

function RelationshipsStep(props) {
  return (
    <FormikStep validationSchema={props.validationSchema}>
      <Grid container alignItems="flex-start" justify="center" spacing={2}>
        <Grid item xs={12}>
          <h3>
            Capacidade de estabelecer relacionamentos interpessoais saudáveis em
            um ambiente de trabalho
          </h3>
        </Grid>
        <Grid item xs={8}>
          <label>a - Relaciona-se facilmente com as pessoas</label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="relationships.connectsEasily">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="relationships.connectsEasily">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label>b - Contribui ativamente para o trabalho em equipe</label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="relationships.teamworkContribution">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="relationships.teamworkContribution">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label>c - Se adapta facilmente à cultura da empresa</label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="relationships.culturalAdaptation">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="relationships.culturalAdaptation">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label>d - Aceita críticas construtivas</label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="relationships.acceptsCriticism">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="relationships.acceptsCriticism">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label>e - É respeitoso com as pessoas</label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="relationships.respectsOthers">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="relationships.respectsOthers">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label>
            f - Ouve de forma ativa enquanto tenta entender ponto de vista do
            outro
          </label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="relationships.activelyListens">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="relationships.activelyListens">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            variant={"outlined"}
            rows={4}
            fullWidth
            multiline
            label="Comentários adicionais"
            name="relationships.comment"
          />
        </Grid>
      </Grid>
    </FormikStep>
  );
}

function SkillsStep(props) {
  return (
    <FormikStep validationSchema={props.validationSchema}>
      <Grid container alignItems="flex-start" justify="center" spacing={2}>
        <Grid item xs={12}>
          <h3>
            Capacidade de demonstrar atitudes ou comportamentos maduros e
            responsáveis
          </h3>
        </Grid>
        <Grid item xs={8}>
          <label>a - Mostra interesse e motivação no trabalho</label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="skills.showsInterest">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="skills.showsInterest">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label>b - Expressa suas próprias ideias</label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="skills.expressesOwnIdeas">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="skills.expressesOwnIdeas">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label>c - Demonstra iniciativa em novos desafios</label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="skills.showsInitiative">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="skills.showsInitiative">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label>d - Trabalha com segurança</label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="skills.worksSafely">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="skills.worksSafely">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label>
            e - Demonstra um bom senso de responsabilidade, não exigindo maior
            supervisão do que necessário
          </label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="skills.dependable">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="skills.dependable">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={8}>
          <label>f - É pontual no trabalho</label>
        </Grid>
        <Grid item xs={4}>
          <Field as="select" name="skills.punctual">
            {props.mapEvaluationAnswers()}
          </Field>
          <ErrorMessage name="skills.punctual">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            variant={"outlined"}
            rows={4}
            fullWidth
            multiline
            label="Comentários adicionais"
            name="skills.comment"
          />
        </Grid>
      </Grid>
    </FormikStep>
  );
}

function AppreciationStep(props) {
  return (
    <FormikStep validationSchema={props.validationSchema}>
      <Grid container alignItems="flex-start" justify="center" spacing={2}>
        <Grid item xs={6}>
          <label>Satisfação geral do estagiário</label>
        </Grid>
        <Grid item xs={6}>
          <Field as="select" name="appreciation.expectations">
            {props.mapGlobalAppreciationAnswers()}
          </Field>
          <ErrorMessage name="appreciation.expectations">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>

        <Grid item xs={12}>
          <Field
            component={TextField}
            variant={"outlined"}
            rows={4}
            fullWidth
            multiline
            label="Justifique sua avaliação"
            name="appreciation.comment"
          />
        </Grid>

        <Grid item xs={8}>
          <label>Esta avaliação foi discutida com o estagiário :</label>
        </Grid>
        <Grid item xs={4}>
          <Field
            type="radio"
            name="appreciation.discussedWithIntern"
            value="Sim"
          />
          <label>Sim</label>
          <Field
            type="radio"
            name="appreciation.discussedWithIntern"
            value="Não"
          />
          <label>Não</label>
          <ErrorMessage name="appreciation.discussedWithIntern">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
      </Grid>
    </FormikStep>
  );
}

function SupervisionStep(props) {
  return (
    <FormikStep validationSchema={props.validationSchema}>
      <Grid container alignItems="flex-start" justify="center" spacing={2}>
        <Grid item xs={8}>
          <label>
            Indique o número real de horas por semana de supervisão concedidas
            ao estagiário :
          </label>
        </Grid>
        <Grid item xs={4}>
          <Field type="number" name="feedback.weeklySupervisionHours" />
          <ErrorMessage name="feedback.weeklySupervisionHours">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
      </Grid>
    </FormikStep>
  );
}

function DecisionStep(props) {
  return (
    <FormikStep validationSchema={props.validationSchema}>
      <Grid container alignItems="flex-start" justify="center" spacing={2}>
        <Grid item xs={8}>
          <label>
            A empresa gostaria de dar as boas-vindas a este aluno para seu
            próximo estágio
          </label>
        </Grid>
        <Grid item xs={4}>
          <Field type="radio" name="feedback.hireAgain" value="Sim" />
          <label>Sim</label>
          <Field type="radio" name="feedback.hireAgain" value="Não" />
          <label>Não</label>
          <Field type="radio" name="feedback.hireAgain" value="Talvez" />
          <label>Talvez</label>
          <ErrorMessage name="feedback.hireAgain">
            {props.errorMessage()}
          </ErrorMessage>
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            variant={"outlined"}
            rows={4}
            fullWidth
            multiline
            required
            label="A formação técnica do estagiário foi suficiente para realizar o
            período de estágio?"
            name="feedback.technicalFormationOpinion"
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            variant="outlined"
            label="Nome do supervisor"
            name="signature.name"
            fullWidth
            disabled
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            name="infos.supervisorRole"
            id="supervisorRole"
            variant="outlined"
            label="Função do supervisor"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            name="infos.phoneNumber"
            id="phoneNumber"
            variant="outlined"
            label="Telefone"
            required
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
            fullwidth
            required
          />
        </Grid>
      </Grid>
    </FormikStep>
  );
}

export default function StudentEvaluationForm() {
  const classes = useStyles();
  const location = useLocation();
  const evaluationAnswers = [
    "Concordo plenamente",
    "Concordo",
    "Discordo parcialmente",
    "Discordo totalmente",
    "N / D",
  ];

  function showErrorMessage() {
    return (msg) => (
      <p className="msgError">
        <span style={{ color: "red" }}>{msg}</span>
      </p>
    );
  }

  function mapAnswers(selectOptionAnswers) {
    return selectOptionAnswers.map((e, k) => (
      <option defaultValue={e} key={k}>
        {e}
      </option>
    ));
  }

  const globalAppreciations = [
    "As habilidades demonstradas superam em muito as expectativas",
    "As habilidades demonstradas superam as expectativas",
    "As habilidades demonstradas atendem plenamente às expectativas",
    "As habilidades demonstradas atendem parcialmente às expectativas",
    "As habilidades demonstradas não atendem às expectativas",
  ];

  const validationSchemaStep1 = yup.object().shape({
    infos: yup.object().shape({
      studentProgram: yup
        .string()
        .trim()
        .min(5, tooLittleError)
        .max(50, tooBigError)
        .required(),
    }),
  });

  const validationSchemaStep2 = yup.object().shape({
    productivity: yup.object().shape({
      efficiency: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      comprehension: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      rythm: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      priorities: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      deadlines: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
    }),
  });

  const validationSchemaStep3 = yup.object().shape({
    quality: yup.object().shape({
      followsInstructions: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      detailsAttention: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      doubleChecks: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      strivesForPerfection: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      problemAnalysis: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
    }),
  });

  const validationSchemaStep4 = yup.object().shape({
    relationships: yup.object().shape({
      connectsEasily: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      teamworkContribution: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      culturalAdaptation: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      acceptsCriticism: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      respectsOthers: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      activelyListens: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
    }),
  });

  const validationSchemaStep5 = yup.object().shape({
    skills: yup.object().shape({
      showsInterest: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      expressesOwnIdeas: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      showsInitiative: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      worksSafely: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      dependable: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
      punctual: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(evaluationAnswers, invalidSelectOption),
    }),
  });

  const validationSchemaStep6 = yup.object().shape({
    appreciation: yup.object().shape({
      discussedWithIntern: yup.string().required(requiredRadioMsg),
      expectations: yup
        .string()
        .required(requiredFieldMsg)
        .oneOf(globalAppreciations, invalidSelectOption),
    }),
  });

  const validationSchemaStep7 = yup.object().shape({
    feedback: yup.object().shape({
      weeklySupervisionHours: yup.number().required().min(0, tooShortError),
    }),
  });

  const validationSchemaStep8 = yup.object().shape({
    feedback: yup.object().shape({
      hireAgain: yup.string().trim().required(requiredRadioMsg),
      technicalFormationOpinion: yup.string().trim().required(requiredFieldMsg),
    }),
    signature: yup.object().shape({
      name: yup
        .string()
        .min(2, tooShortError)
        .max(50, tooBigError)
        .required(requiredFieldMsg),
    }),
    infos: yup.object().shape({
      supervisorRole: yup
        .string()
        .min(5, tooShortError)
        .max(50, tooBigError)
        .required(requiredFieldMsg),
      phoneNumber: yup
        .string()
        .min(10, tooShortError)
        .required(requiredFieldMsg),
    }),
  });

  return (
    <Card className={classes.list}>
      <CardContent>
        <FormikStepper
          contract={location.state}
          initialValues={{
            infos: {
              studentProgram: "",
              supervisorRole: "",
              phoneNumber: "",
            },
            productivity: {
              efficiency: evaluationAnswers[0],
              comprehension: evaluationAnswers[0],
              rythm: evaluationAnswers[0],
              priorities: evaluationAnswers[0],
              deadlines: evaluationAnswers[0],
              comment: "",
            },
            quality: {
              followsInstructions: evaluationAnswers[0],
              detailsAttention: evaluationAnswers[0],
              doubleChecks: evaluationAnswers[0],
              strivesForPerfection: evaluationAnswers[0],
              problemAnalysis: evaluationAnswers[0],
              comment: "",
            },
            relationships: {
              connectsEasily: evaluationAnswers[0],
              teamworkContribution: evaluationAnswers[0],
              culturalAdaptation: evaluationAnswers[0],
              acceptsCriticism: evaluationAnswers[0],
              respectsOthers: evaluationAnswers[0],
              activelyListens: evaluationAnswers[0],
              comment: "",
            },
            skills: {
              showsInterest: evaluationAnswers[0],
              expressesOwnIdeas: evaluationAnswers[0],
              showsInitiative: evaluationAnswers[0],
              worksSafely: evaluationAnswers[0],
              dependable: evaluationAnswers[0],
              punctual: evaluationAnswers[0],
              comment: "",
            },
            appreciation: {
              expectations: globalAppreciations[0],
              comment: "",
              discussedWithIntern: "",
            },
            feedback: {
              weeklySupervisionHours: 0,
              hireAgain: "",
              technicalFormationOpinion: "",
            },
            signature: {
              name: location.state.studentApplication.offer.employer
                .contactName,
              image: "",
              date: new Date(),
            },
          }}
          evaluationAnswers={evaluationAnswers}
          globalAppreciations={globalAppreciations}
        >
          <GeneralInfoStep
            label="Informações gerais"
            validationSchema={validationSchemaStep1}
            classes={classes}
          />
          <ProductivityStep
            label="Produtividade"
            validationSchema={validationSchemaStep2}
            mapEvaluationAnswers={() => mapAnswers(evaluationAnswers)}
            errorMessage={showErrorMessage}
          />

          <QualityStep
            label="Qualidade do Trabalho"
            validationSchema={validationSchemaStep3}
            mapEvaluationAnswers={() => mapAnswers(evaluationAnswers)}
            errorMessage={showErrorMessage}
          />
          <RelationshipsStep
            label="Relacionamentos Interpessoais"
            validationSchema={validationSchemaStep4}
            mapEvaluationAnswers={() => mapAnswers(evaluationAnswers)}
            errorMessage={showErrorMessage}
          />
          <SkillsStep
            label="Habilidades"
            validationSchema={validationSchemaStep5}
            mapEvaluationAnswers={() => mapAnswers(evaluationAnswers)}
            errorMessage={showErrorMessage}
          />
          <AppreciationStep
            label="Satisfação Geral"
            validationSchema={validationSchemaStep6}
            mapGlobalAppreciationAnswers={() => mapAnswers(globalAppreciations)}
            errorMessage={showErrorMessage}
          />
          <SupervisionStep
            label="Supervisão"
            validationSchema={validationSchemaStep7}
            errorMessage={showErrorMessage}
          />
          <DecisionStep
            label="Decisão"
            validationSchema={validationSchemaStep8}
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
