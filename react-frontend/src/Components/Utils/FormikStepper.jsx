import {
  Button,
  CircularProgress,
  Grid,
  Step,
  StepLabel,
  Stepper,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useBusinessEnvironmentEvaluation } from "../../Services/AdminHooks";
import AuthenticationService from "../../Services/AuthenticationService";
import { useStudentEvaluation } from "../../Services/EmployerHooks";
import { useFileReader, useModal } from "../../Services/Hooks";
import StudentEvaluationModal from "../Employer/Evaluations/StudentEvaluationModal";
import BusinessEvaluationModal from "../Manager/BusinessEvaluations/BusinessEvaluationModal";

export function FormikStepper({ contract, initialValues, children }) {
  const childrenArray = React.Children.toArray(children);
  const readFile = useFileReader();
  const businessEvaluation = useBusinessEnvironmentEvaluation();
  const studentEvaluation = useStudentEvaluation();
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step];
  const [completed, setCompleted] = useState(false);
  const [data, setData] = useState({});
  const [validationButtonClick, setValidationButtonClick] = useState(false);
  const [isEvaluationModalOpen, openEvalationModal, closeEvaluationModal] =
    useModal();
  const [
    isBusinessEvaluationModalOpen,
    openBusinessEvaluationModal,
    closeBusinessEvaluationModal,
  ] = useModal();

  function isLastStep() {
    return step === childrenArray.length - 1;
  }

  function directionModal() {
    return AuthenticationService.getCurrentUserRole() === "admin" ? (
      <BusinessEvaluationModal
        isOpen={isBusinessEvaluationModalOpen}
        data={data}
        hide={closeBusinessEvaluationModal}
      />
    ) : (
      <StudentEvaluationModal
        isOpen={isEvaluationModalOpen}
        data={data}
        hide={closeEvaluationModal}
      />
    );
  }

  async function evaluate(userType, dto) {
    return userType === "admin"
      ? await businessEvaluation.evaluate(
          "/businessEvaluation",
          dto,
          "/dashboard/businessEvaluationList"
        )
      : await studentEvaluation.evaluate(
          "/internEvaluation",
          dto,
          "/dashboard/studentEvaluationList"
        );
  }

  function openModal() {
    return AuthenticationService.getCurrentUserRole() === "admin"
      ? openBusinessEvaluationModal()
      : openEvalationModal();
  }

  return (
    <>
      {validationButtonClick && directionModal()}
      <Formik
        initialValues={initialValues}
        validationSchema={currentChild.props.validationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        validate={(values) => {
          if (!isLastStep()) return {};
          const errors = {};
          if (
            values.signature.image.type !== "image/png" &&
            values.signature.image.type !== "image/jpeg"
          ) {
            errors.signature = {};
            errors.signature.image = "O arquivo deve ser do tipo PNG ou JPEG";
          }
          return errors;
        }}
        onSubmit={async (values) => {
          if (isLastStep()) {
            setValidationButtonClick(false);
            const dto = { ...values };
            dto.contract = contract;
            delete dto.contract.studentApplication;
            dto.signature.image = await readFile(values.signature.image);
            setCompleted(true);
            await evaluate(AuthenticationService.getCurrentUserRole(), dto);
          } else setStep((s) => s + 1);
        }}
      >
        {({ isSubmitting, values, submitForm }) => (
          <Form autoComplete="off">
            <Stepper alternativeLabel activeStep={step}>
              {childrenArray.map((child, index) => (
                <Step
                  key={child.props.label}
                  completed={step > index || completed}
                >
                  <StepLabel>{child.props.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {currentChild}
            <Grid container spacing={2}>
              {step > 0 && (
                <Grid item>
                  <Button
                    disabled={isSubmitting}
                    variant="contained"
                    color="primary"
                    onClick={() => setStep((s) => s - 1)}
                  >
                    PÁGINA ANTERIOR
                  </Button>
                </Grid>
              )}
              {isLastStep() && (
                <Grid item>
                  <Button
                    disabled={isSubmitting}
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      setData({ ...values, submitForm });
                      setValidationButtonClick(true);
                      openModal();
                    }}
                  >
                    Valide a avaliação
                  </Button>
                </Grid>
              )}
              {isSubmitting && <LinearProgress />}
              {!isLastStep() && (
                <Grid item>
                  <Button
                    startIcon={
                      isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                    disabled={isSubmitting}
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    PÁGINA SEGUINTE
                  </Button>
                </Grid>
              )}
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}
