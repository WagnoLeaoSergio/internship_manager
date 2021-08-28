import { Button, Divider, Grid, Typography, useTheme } from "@material-ui/core";
import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  useApi,
  useDateParser,
  useModal,
  useTimeParserFromDate,
} from "../../Services/Hooks";
import OfferDetails from "../Utils/OfferDetails";
import PdfModal from "../Utils/PdfModal";
import useStyles from "../Utils/Style/useStyles";

function EmployerApplicationDetails({ offers }) {
  function interviewStatus() {
    let interviewCount = 0;

    for (const offer of offers)
      interviewCount += offer.applications.filter(
        (appli) => appli.interview
      ).length;

    if (interviewCount > 0)
      return (
        interviewCount +
        (interviewCount === 1 ? " pedido" : " pedidos") +
        " de entrevista"
      );
    else return "Sem pedido de entrevista";
  }

  function isApplicationWaitingForEmployer(appli) {
    return (
      appli.state === "APPLICATION_PENDING_FOR_EMPLOYER_INITIAL_REVIEW" ||
      appli.state === "WAITING_FOR_EMPLOYER_HIRING_FINAL_DECISION"
    );
  }

  function applicationsStatus() {
    let applisWaitingForEmployerCount = 0;

    for (const offer of offers)
      applisWaitingForEmployerCount += offer.applications.filter((appli) =>
        isApplicationWaitingForEmployer(appli)
      ).length;

    return (
      applisWaitingForEmployerCount +
      (applisWaitingForEmployerCount === 1 ? " inscrição" : " inscrições") +
      " aguardando supervisor"
    );
  }

  function contractsStatus() {
    let contractsWaitingCount = 0;
    let contractFinalizedCount = 0;

    for (const offer of offers)
      for (const appli of offer.applications)
        if (appli.contract)
          switch (appli.contract.signatureState) {
            case "PENDING_FOR_ADMIN_REVIEW":
            case "WAITING_FOR_EMPLOYER_SIGNATURE":
            case "WAITING_FOR_STUDENT_SIGNATURE":
            case "WAITING_FOR_ADMIN_SIGNATURE":
              contractsWaitingCount++;
              break;
            case "SIGNED":
              contractFinalizedCount++;
              break;
            default:
              break;
          }

    return (
      contractsWaitingCount +
      (contractsWaitingCount === 1 ? " contrato" : " contratos") +
      " aguardando, " +
      contractFinalizedCount +
      (contractFinalizedCount === 1
        ? " contrato finalizado"
        : " contratos finalizados")
    );
  }

  return offers.find((offer) => offer.applications).applications.length > 0 ? (
    <>
      <Typography>{applicationsStatus()}</Typography>
      <Typography>{interviewStatus()}</Typography>
      <Typography>{contractsStatus()}</Typography>
    </>
  ) : (
    <Typography>Não recebeu nenhuma inscrição de aluno</Typography>
  );
}

EmployerApplicationDetails.propTypes = {
  offers: PropTypes.array.isRequired,
};

function EmployerStatusDetails({ offers }) {
  function offerStatus() {
    if (offers.length === 0) return "Nenhuma oferta";
    else {
      let approvedOffers = 0;
      let pendingOffers = 0;
      let rejectedOffers = 0;

      for (const offer of offers) {
        if (offer.reviewState === "APPROVED") approvedOffers++;
        else if (offer.reviewState === "PENDING") pendingOffers++;
        else rejectedOffers++;
      }

      return (
        offers.length +
        (offers.length === 1 ? " oferta : " : " ofertas : ") +
        approvedOffers +
        (approvedOffers === 1 ? " aprovada, " : " aprovadas, ") +
        pendingOffers +
        " em espera, " +
        rejectedOffers +
        (rejectedOffers === 1 ? " rejeitada" : " rejeitadas")
      );
    }
  }

  return (
    <>
      <Typography>{offerStatus()}</Typography>
      {offers.find((offer) => offer.applications) && (
        <EmployerApplicationDetails offers={offers} />
      )}
    </>
  );
}

EmployerStatusDetails.propTypes = {
  offers: PropTypes.array.isRequired,
};

function InterviewStatus(props) {
  const theme = useTheme();
  const parseDate = useDateParser();
  const parseTimeFromDate = useTimeParserFromDate();

  function getInterviewState(interview) {
    if (
      interview.studentAcceptanceState ===
      "INTERVIEW_WAITING_FOR_STUDENT_DECISION"
    )
      return <span style={{ color: theme.palette.info.main }}>Aguardando</span>;
    else if (
      interview.studentAcceptanceState === "INTERVIEW_REJECTED_BY_STUDENT"
    )
      return (
        <>
          <span style={{ color: theme.palette.error.main }}>Rejeitado</span>
          {interview.reasonForRejectionByStudent}
        </>
      );
    else return <span style={{ color: theme.palette.success }}>Aprovado</span>;
  }

  return (
    <div>
      <Typography>
        Entrevista para o aluno{" "}
        {props.interview.studentApplication
          ? props.interview.studentApplication.student.firstName +
            " " +
            props.interview.studentApplication.student.lastName
          : ""}
      </Typography>
      <Typography>
        Data : {props.interview ? parseDate(props.interview.dateTime) : ""}
      </Typography>
      <Typography>
        Hora :{" "}
        {props.interview ? parseTimeFromDate(props.interview.dateTime) : ""}
      </Typography>
      <Typography>
        Título da oferta :
        {props.interview.studentApplication
          ? props.interview.studentApplication.offer.title
          : ""}
      </Typography>
      <Typography>Status : {getInterviewState(props.interview)}</Typography>
    </div>
  );
}

function Offer(props) {
  return (
    <>
      <div>
        <Typography variant={"h5"}>{props.o.title}</Typography>
        <OfferDetails offer={props.o} />
        <Typography>Lista de estudantes selecionados</Typography>
        {props.hiredStudentsNames}
        {props.printOfferStatus}
      </div>
      <Button
        variant={"contained"}
        color={"primary"}
        size={"small"}
        onClick={props.seeOffer}
      >
        <i className="fa fa-file-text-o" />
        &ensp;Ver oferta
      </Button>
      <Divider className={props.classes.dividers} />
    </>
  );
}

Offer.propTypes = {
  o: PropTypes.any,
  hiredStudentsNames: PropTypes.any,
  printOfferStatus: PropTypes.any,
  seeOffer: PropTypes.func,
  classes: PropTypes.any,
};

function EmployerInformation(props) {
  return (
    <div>
      <Button
        variant={"contained"}
        color={"primary"}
        style={{ textTransform: "none", marginBottom: 10 }}
        onClick={props.getEmployer}
      >
        <Typography variant={"body1"} display={"block"}>
          {props.employers[props.i].companyName +
            " - " +
            props.employers[props.i].contactName}
        </Typography>
      </Button>
      {props.currentEmployerIndex === props.i && (
        <div>
          <EmployerStatusDetails offers={props.offers} />
          <Button
            variant={props.currentSubtab === 0 ? "contained" : "outlined"}
            color={"primary"}
            style={{ textTransform: "none" }}
            onClick={props.getOffers}
          >
            <Typography variant={"body2"}>Ofertas</Typography>
          </Button>
          &ensp;
          <Button
            variant={props.currentSubtab === 1 ? "contained" : "outlined"}
            color={"primary"}
            style={{ textTransform: "none" }}
            onClick={props.getInterviews}
          >
            <Typography variant={"body2"}>Entrevistas</Typography>
          </Button>
        </div>
      )}
      <Divider className={props.classes.dividers} />
    </div>
  );
}

EmployerInformation.propTypes = {
  getEmployer: PropTypes.func,
  employers: PropTypes.arrayOf(PropTypes.any),
  i: PropTypes.number,
  currentEmployerIndex: PropTypes.number,
  offers: PropTypes.arrayOf(PropTypes.any),
  currentSubtab: PropTypes.number,
  getOffers: PropTypes.func,
  getInterviews: PropTypes.func,
  classes: PropTypes.any,
};
export default function EmployerStatus() {
  const offersTabIndex = 0;
  const interviewsTabIndex = 1;
  const classes = useStyles();
  const theme = useTheme();
  const api = useApi();
  const [employers, setEmployers] = useState([]);
  const [currentEmployerOffers, setCurrentEmployerOffers] = useState([]);
  const [currentEmployerInterviews, setCurrentEmployerInterviews] = useState(
    []
  );
  const [currentEmployerIndex, setCurrentEmployerIndex] = useState(0);
  const [isPdfOpen, openPdf, closePdf] = useModal();
  const [currentDoc, setCurrentDoc] = useState("");
  const [currentSubtab, setCurrentSubtab] = useState(0);

  useEffect(() => {
    api.get("employers").then((resp) => {
      setEmployers(resp ? resp.data : []);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (employers[currentEmployerIndex])
      api
        .get("/offers/employer/" + employers[currentEmployerIndex].email)
        .then((r) => {
          setCurrentEmployerOffers(r.data);
        });
  }, [currentEmployerIndex, employers]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (employers[currentEmployerIndex]) {
      api
        .get("/interviews/employer/" + employers[currentEmployerIndex].id)
        .then((r) => {
          setCurrentEmployerInterviews(r ? r.data : []);
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function getCurrentEmployerInterviews(index) {
    api.get("/interviews/employer/" + employers[index].id).then((r) => {
      setCurrentEmployerInterviews(r ? r.data : []);
    });
  }

  function hiredStudentsNames(o) {
    return o.reviewState === "APPROVED" ? (
      o.applications.map((elem) => (
        <Typography style={{ fontWeight: "bold" }}>
          {elem.student.firstName + " " + elem.student.lastName}
        </Typography>
      ))
    ) : (
      <Typography style={{ fontWeight: "bold" }}>
        Nenhum aluno foi selecionado para a oferta
      </Typography>
    );
  }

  function printOfferStatus(offer) {
    if (offer.reviewState === "PENDING")
      return <span style={{ color: theme.palette.info.main }}>Aguardando</span>;
    else if (offer.reviewState === "DENIED")
      return (
        <>
          <span style={{ color: theme.palette.error.main }}>Rejeitado : </span>
          {offer.reasonForRejection}
        </>
      );
    else
      return (
        <span style={{ color: theme.palette.success.main }}>Aprovado</span>
      );
  }

  return (
    <Grid
      container
      spacing={0}
      wrap={"nowrap"}
      className={classes.main}
      style={{ padding: "15px 0 0 15px" }}
    >
      <Grid item xs={5} className={classes.list}>
        <Typography
          variant={"h4"}
          gutterBottom={true}
          className={classes.title}
        >
          Status dos supervisores
        </Typography>
        {employers.length !== 0 ? (
          employers.map((item, i) => (
            <EmployerInformation
              key={i}
              getEmployer={() => {
                setCurrentEmployerIndex(i);
              }}
              employers={employers}
              i={i}
              currentEmployerIndex={currentEmployerIndex}
              offers={currentEmployerOffers}
              currentSubtab={currentSubtab}
              getOffers={() => setCurrentSubtab(0)}
              getInterviews={() => {
                setCurrentSubtab(1);
                getCurrentEmployerInterviews(currentEmployerIndex);
              }}
              classes={classes}
            />
          ))
        ) : (
          <Typography variant={"h5"}>Sem supervisor</Typography>
        )}
      </Grid>
      <Divider orientation={"vertical"} flexItem />
      <Grid
        item
        xs={7}
        align="center"
        style={{ overflow: "auto", height: "100%" }}
      >
        {employers.length !== 0 && (
          <>
            {currentSubtab === offersTabIndex &&
              (currentEmployerOffers.length > 0 ? (
                currentEmployerOffers.map((o, k) => (
                  <Offer
                    key={k}
                    o={o}
                    hiredStudentsNames={hiredStudentsNames(o)}
                    printOfferStatus={printOfferStatus(o)}
                    seeOffer={() => {
                      setCurrentDoc(o.file);
                      openPdf();
                    }}
                    classes={classes}
                  />
                ))
              ) : (
                <Typography variant={"h5"}>
                  O supervisor não tem oferta
                </Typography>
              ))}
            {currentSubtab === interviewsTabIndex &&
              (currentEmployerInterviews.length > 0 ? (
                currentEmployerInterviews.map((interview, index) => (
                  <>
                    <InterviewStatus
                      key={index}
                      classes={classes}
                      interview={interview}
                    />
                    <Divider className={classes.dividers} />
                  </>
                ))
              ) : (
                <Typography variant={"h5"}>
                  O supervisor não agendou uma entrevista
                </Typography>
              ))}
          </>
        )}
      </Grid>
      <PdfModal open={isPdfOpen} onClose={closePdf} document={currentDoc} />
    </Grid>
  );
}
