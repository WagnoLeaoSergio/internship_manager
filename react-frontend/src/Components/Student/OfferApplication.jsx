import { Divider, useTheme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Select } from "formik-material-ui";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import AuthenticationService from "../../Services/AuthenticationService";
import {
  useApi,
  useDateParser,
  useModal,
  useTimeParserFromDate,
} from "../../Services/Hooks";
import ApprovalButtons from "../Utils/ApprovalButtons";
import TextboxModal from "../Utils/Modal/TextboxModal";
import OfferDetails from "../Utils/OfferDetails";
import PdfSelectionViewer from "../Utils/PDF/PdfSelectionViewer";
import useStyles from "../Utils/Style/useStyles";

function hasStudentAppliedOnOffer(offer) {
  return (
    offer.applications.find(
      (a) => a.student.id === AuthenticationService.getCurrentUser().id
    ) !== undefined && offer.applications.length !== 0
  );
}

function findStudentApplicationInOffer(offer) {
  return offer.applications.find(
    (a) => a.student.id === AuthenticationService.getCurrentUser().id
  );
}

function hasEmployeurAcceptedStudentOnOffer(offer) {
  return (
    offer.applications.find(
      (a) =>
        a.student.id === AuthenticationService.getCurrentUser().id &&
        a.state === "STUDENT_HIRED_BY_EMPLOYER"
    ) !== undefined && offer.applications.length !== 0
  );
}

function isApplicationDenied(offer) {
  return (
    offer.applications.find(
      (a) =>
        a.student.id === AuthenticationService.getCurrentUser().id &&
        (a.state === "APPLICATION_REJECTED_BY_EMPLOYER" ||
          a.state === "STUDENT_REJECTED_BY_EMPLOYER")
    ) !== undefined && offer.applications.length !== 0
  );
}

function OfferApplicationStatus({
  index,
  offer,
  currentIndex,
  setCurrent,
  setCurrentIndex,
  sendInterviewDecision,
  sendDecision,
  openReasonModal,
  openResumeModal,
  openReasonOfInterviewModal,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const dateParser = useDateParser();
  const timeParser = useTimeParserFromDate();

  function showInterviewButtonCondition() {
    return (
      index === currentIndex &&
      hasStudentAppliedOnOffer(offer) &&
      findStudentApplicationInOffer(offer).interview &&
      findStudentApplicationInOffer(offer).interview.studentAcceptanceState ===
        "INTERVIEW_WAITING_FOR_STUDENT_DECISION" &&
      hasStudentDeniedOffer(offer)
    );
  }

  function getStudentDecision(offer) {
    if (
      offer.applications.find(
        (a) =>
          a.student.id === AuthenticationService.getCurrentUser().id &&
          a.state === "JOB_OFFER_ACCEPTED_BY_STUDENT"
      )
    )
      return (
        <span style={{ color: theme.palette.success.main }}>
          Você aceitou esta oferta
        </span>
      );
    else if (
      offer.applications.find(
        (a) =>
          a.student.id === AuthenticationService.getCurrentUser().id &&
          a.state === "JOB_OFFER_DENIED_BY_STUDENT"
      )
    )
      return (
        <span style={{ color: theme.palette.error.main }}>
          Você rejeitou esta oferta
        </span>
      );

    return "";
  }

  function getStudentDecisionForInterview() {
    const application = findStudentApplicationInOffer(offer);
    if (application && application.interview) {
      if (
        application.interview.studentAcceptanceState ===
        "INTERVIEW_ACCEPTED_BY_STUDENT"
      )
        return (
          <span style={{ color: theme.palette.success.main }}>
            Você aceitou esta estrevista
          </span>
        );
      else if (
        application.interview.studentAcceptanceState ===
        "INTERVIEW_REJECTED_BY_STUDENT"
      )
        return (
          <span style={{ color: theme.palette.error.main }}>
            Você rejeitou esta estrevista
          </span>
        );
    }
    return "";
  }

  function getInterviewDate() {
    if (
      findStudentApplicationInOffer(offer) &&
      findStudentApplicationInOffer(offer).interview
    )
      return (
        dateParser(findStudentApplicationInOffer(offer).interview.dateTime) +
        " a " +
        timeParser(findStudentApplicationInOffer(offer).interview.dateTime)
      );

    return "";
  }

  function hasStudentDeniedOffer(offer) {
    return offer.applications.find(
      (a) =>
        a.student.id === AuthenticationService.getCurrentUser().id &&
        a.state !== "JOB_OFFER_DENIED_BY_STUDENT"
    );
  }

  return (
    <div>
      <Button
        variant={currentIndex === index ? "contained" : "outlined"}
        color={"primary"}
        size={"large"}
        fullWidth
        onClick={() => {
          setCurrentIndex(index);
          setCurrent(index);
        }}
      >
        <Typography color={"textPrimary"} variant={"body1"} display={"inline"}>
          {offer.title}&ensp;
        </Typography>
        <Typography
          color={"textSecondary"}
          variant={"body2"}
          display={"inline"}
        >
          {offer.employer.companyName}
        </Typography>
      </Button>
      {currentIndex === index && (
        <>
          <OfferDetails offer={offer} />
          {hasStudentAppliedOnOffer(offer) &&
            findStudentApplicationInOffer(offer).interview && (
              <>
                <Typography
                  color={"textPrimary"}
                  variant={"body1"}
                  display={"block"}
                >
                  Data da entrevista : {getInterviewDate()}
                </Typography>
                <Typography
                  color={"textPrimary"}
                  variant={"body1"}
                  display={"block"}
                >
                  {getStudentDecisionForInterview()}
                </Typography>
              </>
            )}
        </>
      )}
      {showInterviewButtonCondition() && (
        <ApprovalButtons
          onApprove={() =>
            sendInterviewDecision(index, "INTERVIEW_ACCEPTED_BY_STUDENT")
          }
          onDeny={() => {
            setCurrentIndex(index);
            openReasonOfInterviewModal();
          }}
          approveLabel={"Aceitar entrevista"}
          denyLabel={"Rejeitar entrevista"}
        />
      )}
      {hasEmployeurAcceptedStudentOnOffer(offer) && (
        <ApprovalButtons
          onApprove={() => sendDecision(index, "JOB_OFFER_ACCEPTED_BY_STUDENT")}
          onDeny={() => {
            setCurrentIndex(index);
            openReasonModal();
          }}
          approveLabel={"Aceitar oferta"}
          denyLabel={"Rejeitar oferta"}
        />
      )}
      <Typography color={"textPrimary"} variant={"body1"} display={"block"}>
        {getStudentDecision(offer)}
      </Typography>
      <Button
        variant={"contained"}
        color={"primary"}
        disabled={hasStudentAppliedOnOffer(offer)}
        onClick={() => {
          setCurrentIndex(index);
          openResumeModal();
        }}
      >
        <i className="fa fa-share-square-o" />
        &ensp;
        {hasStudentAppliedOnOffer(offer) ? "Inscrição enviada" : "Inscrever"}
      </Button>
      {isApplicationDenied(offer) && (
        <Typography
          style={{ color: theme.palette.error.main }}
          variant={"body1"}
        >
          O empregador rejeitou sua inscrição
        </Typography>
      )}
      <Divider className={classes.dividers} />
    </div>
  );
}

OfferApplicationStatus.propTypes = {
  index: PropTypes.number.isRequired,
  offer: PropTypes.object.isRequired,
  currentIndex: PropTypes.number.isRequired,
  setCurrent: PropTypes.func.isRequired,
  setCurrentIndex: PropTypes.func.isRequired,
  sendInterviewDecision: PropTypes.func.isRequired,
  sendDecision: PropTypes.func.isRequired,
  openReasonModal: PropTypes.func.isRequired,
  openResumeModal: PropTypes.func.isRequired,
  openReasonOfInterviewModal: PropTypes.func.isRequired,
};
export default function OfferApplication({ count, pendingCount }) {
  const api = useApi();
  const theme = useTheme();
  const [offers, setOffers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isResumeModalOpen, openResumeModal, closeResumeModal] = useModal();
  const [isReasonModalOpen, openReasonModal, closeReasonModal] = useModal();
  const [
    isReasonOfInterviewModalOpen,
    openReasonOfInterviewModal,
    closeReasonOfInterviewModal,
  ] = useModal();
  useEffect(() => {
    api
      .get("/resumes/student/" + AuthenticationService.getCurrentUser().id)
      .then((result) => setResumes(result ? result.data : []));
    api
      .get("/offers/student/" + AuthenticationService.getCurrentUser().id)
      .then((result) =>
        setOffers(
          result
            ? result.data.filter(
                (offer) =>
                  new Date(offer.details.limitDateToApply) >= new Date()
              )
            : []
        )
      );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    count(
      offers.filter(
        (item) =>
          !hasStudentAppliedOnOffer(
            item,
            AuthenticationService.getCurrentUser()
          )
      ).length
    );

    pendingCount(
      offers.filter((item) =>
        hasEmployeurAcceptedStudentOnOffer(
          item,
          AuthenticationService.getCurrentUser()
        )
      ).length
    );
  });

  function sendInterviewDecision(index, studentDecision, reason = "") {
    const nextState = { ...offers[index] };
    const application = findStudentApplicationInOffer(nextState);
    application.interview.studentAcceptanceState = studentDecision;
    application.interview.reasonForRejectionByStudent = reason;
    application.interview.studentApplication = { id: application.id };
    return api
      .put("/interviews/" + application.interview.id, application.interview)
      .then((result) => {
        if (result) {
          application.interview = result.data;
          setOffers((offers) => {
            offers.splice(index, 1);
            return [...offers, nextState];
          });
        }
        closeReasonOfInterviewModal();
      });
  }

  function sendDecision(index, studentDecision, reason = "") {
    const nextState = [...offers];
    const application = nextState[index].applications.find(
      (a) => a.student.id === AuthenticationService.getCurrentUser().id
    );
    application.reasonForRejection = reason;
    application.state = studentDecision;
    return api
      .put("/applications/state/" + application.id, application)
      .then((result) => {
        nextState[index].applications.splice(
          nextState[index].applications.indexOf(application),
          1,
          result.data
        );
        setOffers(nextState);
        closeReasonModal();
      });
  }

  function generateMenuItems() {
    let filteredResumes = resumes.filter((r) => r.reviewState === "APPROVED");
    if (filteredResumes.length === 1)
      return (
        <MenuItem value={filteredResumes[0].id}>
          {filteredResumes[0].name}
        </MenuItem>
      );
    else if (filteredResumes.length !== 0) {
      filteredResumes = filteredResumes.map((item, i) => (
        <MenuItem key={i} value={item.id}>
          {item.name}
        </MenuItem>
      ));
      filteredResumes.push(
        <MenuItem key={filteredResumes.length} value={-1} disabled>
          Por favor, escolha um currículo
        </MenuItem>
      );
      return filteredResumes;
    } else
      return (
        <MenuItem value={-1} disabled>
          Nenhum currículo foi aprovado
        </MenuItem>
      );
  }

  function setFirstCV() {
    let filteredResumes = resumes.filter((r) => r.reviewState === "APPROVED");
    return filteredResumes.length === 1 ? filteredResumes[0].id : -1;
  }

  return (
    <div style={{ height: "100%" }}>
      <PdfSelectionViewer
        documents={offers.map((o) => o.file)}
        title={"Ofertas de estágio disponíveis"}
      >
        {(i, setCurrent) => (
          <OfferApplicationStatus
            key={i}
            index={i}
            offer={offers[i]}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            setCurrent={setCurrent}
            sendDecision={sendDecision}
            sendInterviewDecision={sendInterviewDecision}
            openReasonModal={openReasonModal}
            openResumeModal={openResumeModal}
            openReasonOfInterviewModal={openReasonOfInterviewModal}
          />
        )}
      </PdfSelectionViewer>
      <Dialog
        open={isResumeModalOpen}
        onClose={closeResumeModal}
        fullWidth
        maxWidth={"md"}
      >
        <DialogTitle id="alert-dialog-title">
          {"Por favor, escolha um currículo :"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component={"div"}>
            <Formik
              onSubmit={async (values) => {
                return api
                  .post(
                    "/applications/" +
                      offers[currentIndex].id +
                      "/" +
                      values.resumeId,
                    {}
                  )
                  .then((r) => {
                    const nextState = [...offers];
                    nextState[currentIndex].applications.push(r.data);
                    setOffers(nextState);
                    closeResumeModal();
                  });
              }}
              validateOnBlur={false}
              validateOnChange={false}
              enableReinitialize={true}
              validationSchema={yup.object().shape({
                resumeId: yup
                  .number()
                  .notOneOf([-1], "Não pode se inscrever sem um currículo válido")
                  .required("Campo obrigatório"),
              })}
              initialValues={{ resumeId: setFirstCV() }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field
                    component={Select}
                    id="resumeId"
                    name="resumeId"
                    fullWidth
                    style={{ marginBottom: "10px" }}
                  >
                    {generateMenuItems()}
                  </Field>
                  <ErrorMessage name="resumeId">
                    {(msg) => (
                      <span
                        style={{
                          color: theme.palette.error.main,
                          lineHeight: 3,
                          verticalAlign: "center",
                        }}
                      >
                        {msg}
                      </span>
                    )}
                  </ErrorMessage>
                  {isSubmitting && <LinearProgress />}
                  <Button
                    id="buttonSubmit"
                    type={"submit"}
                    variant="contained"
                    fullWidth
                    size={"large"}
                    color="primary"
                    disabled={isSubmitting}
                  >
                    Enviar minha inscrição
                  </Button>
                </Form>
              )}
            </Formik>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeResumeModal} color={"primary"}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <TextboxModal
        isOpen={isReasonModalOpen}
        hide={closeReasonModal}
        title={"Justificativa de recusa"}
        onSubmit={async (values) =>
          sendDecision(
            currentIndex,
            "JOB_OFFER_DENIED_BY_STUDENT",
            values.message
          )
        }
      />
      <TextboxModal
        isOpen={isReasonOfInterviewModalOpen}
        hide={closeReasonOfInterviewModal}
        title={"Justificativa de recusa"}
        onSubmit={async (values) =>
          sendInterviewDecision(
            currentIndex,
            "INTERVIEW_REJECTED_BY_STUDENT",
            values.message
          )
        }
      />
    </div>
  );
}
