import { useTheme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AuthenticationService from "../../Services/AuthenticationService";
import { useEmployerOfferManagement } from "../../Services/EmployerHooks";
import {
  useDateParser,
  useModal,
  useTimeParserFromDate,
} from "../../Services/Hooks";
import InterviewConvocationModal from "../Employer/Interview/InterviewConvocationModal";
import ApprovalButtons from "./ApprovalButtons";
import PdfSelectionViewer from "./PDF/PdfSelectionViewer";

export default function ApplicationList() {
  const theme = useTheme();
  const location = useLocation();
  const dateParser = useDateParser();
  const timeParser = useTimeParserFromDate();
  const [offer, setOffer] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const manageApplication = useEmployerOfferManagement();
  const [application, setApplication] = useState({});
  const [
    isInterviewConvocationModalOpen,
    openInterviewConvocationModal,
    closeInterviewConvocationModal,
  ] = useModal();

  useEffect(() => {
    manageApplication.retrieveOffer("/offers/" + location.state.offerId, (r) =>
      setOffer(r ? r.data : [])
    );
  }, [location.state.offerId]); // eslint-disable-line react-hooks/exhaustive-deps

  function applicationActions(i) {
    switch (offer.applications[i].state) {
      case "APPLICATION_PENDING_FOR_EMPLOYER_INITIAL_REVIEW":
      case "STUDENT_INVITED_FOR_INTERVIEW_BY_EMPLOYER":
      case "WAITING_FOR_EMPLOYER_HIRING_FINAL_DECISION":
        return (
          <ApprovalButtons
            onApprove={() => {
              const copy = { ...offer };
              copy.applications[i].state =
                copy.applications[i].state === "STUDENT_HIRED_BY_EMPLOYER"
                  ? "WAITING_FOR_EMPLOYER_HIRING_FINAL_DECISION"
                  : "STUDENT_HIRED_BY_EMPLOYER";
              return manageApplication.decideHirement(
                `applications/state/${offer.applications[i].id}`,
                offer.applications[i],
                () => setOffer(copy)
              );
            }}
            onDeny={() => {
              const copy = { ...offer };
              copy.applications[i].state = "STUDENT_REJECTED_BY_EMPLOYER";
              return manageApplication.decideHirement(
                `applications/state/${offer.applications[i].id}`,
                offer.applications[i],
                () => setOffer(copy)
              );
            }}
            approveLabel={"Contratar o estudante"}
            denyLabel={"Recusar inscrição"}
          />
        );
      default:
        return "";
    }
  }

  function applicationDecisionMessage(i) {
    switch (offer.applications[i].state) {
      case "STUDENT_HIRED_BY_EMPLOYER":
        return applicationDecisionStatus(
          "Inscrição aceita",
          theme.palette.success.main
        );
      case "APPLICATION_REJECTED_BY_EMPLOYER":
      case "STUDENT_REJECTED_BY_EMPLOYER":
        return applicationDecisionStatus(
          AuthenticationService.getCurrentUserRole() === "admin"
            ? "O supervisor recusou o pedido"
            : "Você recusou o pedido",
          theme.palette.error.main
        );
      case "WAITING_FOR_STUDENT_HIRING_FINAL_DECISION":
        return applicationDecisionStatus(
          "Aguardando decisão do aluno",
          theme.palette.info.main
        );
      case "JOB_OFFER_DENIED_BY_STUDENT":
        return applicationDecisionStatus(
          `O estudante recusou oferta de estágio : ${offer.applications[i].reasonForRejection}`,
          theme.palette.error.main
        );
      case "JOB_OFFER_ACCEPTED_BY_STUDENT":
        return applicationDecisionStatus(
          "O estudante aceitou a oferta de estágio",
          theme.palette.success.main
        );
      default:
        return "";
    }
  }

  function applicationDecisionStatus(statusMessage, messageColor) {
    return (
      <Typography variant={"body1"}>
        Status da inscrição :{" "}
        <span style={{ color: messageColor }}>{statusMessage}</span>
      </Typography>
    );
  }

  function interviewDecisionMessage(i) {
    if (offer.applications[i].interview)
      switch (offer.applications[i].interview.studentAcceptanceState) {
        case "INTERVIEW_WAITING_FOR_STUDENT_DECISION":
          return interviewDecisionStatus(
            "Aguardando decisão do aluno",
            theme.palette.info.main,
            offer.applications[i].interview.dateTime
          );
        case "INTERVIEW_ACCEPTED_BY_STUDENT":
          return interviewDecisionStatus(
            "O estudante aceitou o convite para entrevista",
            theme.palette.success.main,
            offer.applications[i].interview.dateTime
          );
        case "INTERVIEW_REJECTED_BY_STUDENT":
          return interviewDecisionStatus(
            `O estudante rejeitou o convite para entrevista : ${offer.applications[i].interview.reasonForRejectionByStudent} `,
            theme.palette.error.main,
            offer.applications[i].interview.dateTime
          );
        default:
          return "";
      }
  }

  function interviewDecisionStatus(statusMessage, messageColor, dateTime) {
    return (
      <>
        <Typography variant={"body1"}>
          Entrevista agendada para : {dateParser(dateTime)} a{" "}
          {timeParser(dateTime)}
        </Typography>
        <Typography variant={"body1"}>
          Status da entrevista :{" "}
          <span style={{ color: messageColor }}>{statusMessage}</span>
        </Typography>
      </>
    );
  }

  function showInterviewConvocationButtonCondition(i) {
    return (
      AuthenticationService.getCurrentUserRole() === "employer" &&
      offer.applications[i].interview === null &&
      (offer.applications[i].state ===
        "APPLICATION_PENDING_FOR_EMPLOYER_INITIAL_REVIEW" ||
        offer.applications[i].state ===
          "WAITING_FOR_EMPLOYER_HIRING_FINAL_DECISION" ||
        offer.applications[i].state ===
          "WAITING_FOR_STUDENT_HIRING_FINAL_DECISION")
    );
  }

  return (
    <div style={{ height: "100%" }}>
      <PdfSelectionViewer
        documents={(offer.applications ? offer.applications : []).map(
          (o) => o.resume.file
        )}
        title={<>Inscrição para vaga de {offer.title}</>}
      >
        {(i, setCurrent) => (
          <div key={i}>
            <Button
              variant={currentIndex === i ? "contained" : "outlined"}
              color={"primary"}
              size={"large"}
              fullWidth
              onClick={() => {
                setCurrent(i);
                setCurrentIndex(i);
              }}
            >
              <Typography variant={"button"}>
                {offer.applications[i].student.firstName}{" "}
                {offer.applications[i].student.lastName}
              </Typography>
            </Button>
            {currentIndex === i && (
              <div style={{ marginTop: 10 }}>
                <Typography color={"textPrimary"} variant={"body1"}>
                  {offer.applications[i].student.phoneNumber}{" "}
                  {offer.applications[i].student.email}
                </Typography>
                <Typography color={"textPrimary"} variant={"body1"}>
                  {offer.applications[i].student.address}
                </Typography>
                {applicationDecisionMessage(i)}
                {interviewDecisionMessage(i)}
                {showInterviewConvocationButtonCondition(i) && (
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    size={"small"}
                    onClick={() => {
                      setApplication(offer.applications[i]);
                      openInterviewConvocationModal();
                    }}
                  >
                    Convocar estudante para a entrevista
                  </Button>
                )}
                {applicationActions(i)}
              </div>
            )}
            <hr />
          </div>
        )}
      </PdfSelectionViewer>
      <InterviewConvocationModal
        isOpen={isInterviewConvocationModalOpen}
        hide={closeInterviewConvocationModal}
        application={application}
        title={offer.title}
      />
    </div>
  );
}
