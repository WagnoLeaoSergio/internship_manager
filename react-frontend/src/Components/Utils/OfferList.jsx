import { Divider, useTheme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthenticationService from "../../Services/AuthenticationService";
import { useApi } from "../../Services/Hooks";
import OfferDetails from "../Utils/OfferDetails";
import PdfSelectionViewer from "./PDF/PdfSelectionViewer";
import useStyles from "./Style/useStyles";

export default function OfferList({ count }) {
  const classes = useStyles();
  const api = useApi();
  const theme = useTheme();
  const history = useHistory();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offers, setOffers] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [buttonDeleting, setButtonDeleting] = useState(-1);

  useEffect(() => {
    if (AuthenticationService.getCurrentUserRole() === "employer") {
      api
        .get("/offers/employer/" + AuthenticationService.getCurrentUser().email)
        .then((r) => setOffers(r ? r.data : []));
    } else if (AuthenticationService.getCurrentUserRole() === "admin") {
      api.get("/offers").then((r) => {
        setOffers(r ? r.data : []);
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (count) count(offers.length);
  });

  function deleteOffer(index) {
    const nextState = [...offers];

    return api.delete("/offers/" + nextState[index].id).then(() => {
      nextState.splice(index, 1);

      if (currentIndex >= nextState.length) setCurrentIndex(0);

      setOffers(nextState);
    });
  }

  function getOfferState(offer) {
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

  function showDeleteButtonCondition(i) {
    return (
      AuthenticationService.getCurrentUserRole() === "employer" &&
      i === currentIndex
    );
  }

  function redirection(i) {
    if (AuthenticationService.getCurrentUserRole() === "employer") {
      return history.push("/dashboard/applications", { offerId: offers[i].id });
    } else if (AuthenticationService.getCurrentUserRole() === "admin") {
      return history.push("/dashboard/applicationsAdmin", {
        offerId: offers[i].id,
      });
    }
    return "";
  }

  function offerHasUpcomingInterviews(offer) {
    return Boolean(
      offer.applications.find((application) => application.interview)
    );
  }

  return (
    <div style={{ height: "100%" }}>
      <PdfSelectionViewer
        documents={offers.map((o) => o.file)}
        title={"Ofertas de Estágio"}
      >
        {(i, setCurrent) => (
          <div key={i}>
            <Button
              variant={currentIndex === i ? "contained" : "outlined"}
              color={"primary"}
              size={"large"}
              fullWidth
              onClick={() => {
                setCurrentIndex(i);
                setCurrent(i);
              }}
            >
              <Typography variant={"button"} display={"inline"}>
                &ensp;{offers[i].title}&ensp;
              </Typography>
            </Button>
            <Typography variant={"body2"} style={{ marginTop: 10 }}>
              {AuthenticationService.getCurrentUserRole() !== "employer" &&
                offers[i].employer.companyName}
              {AuthenticationService.getCurrentUserRole() === "admin" && (
                <>&mdash; {offers[i].employer.contactName}&ensp;</>
              )}
            </Typography>
            <Typography variant={"body2"}>
              Status : {getOfferState(offers[i])}
            </Typography>
            {currentIndex === i && <OfferDetails offer={offers[i]} />}
            {offerHasUpcomingInterviews(offers[i]) && (
              <Typography variant={"body2"} display={"block"}>
                Entrevistas estão agendadas para esta vaga
              </Typography>
            )}
            {offers[i].applications.length !== 0 && (
              <>
                <Button
                  variant={"contained"}
                  color={"primary"}
                  size={"small"}
                  onClick={() => redirection(i)}
                >
                  Ver candidaturas
                </Button>
                &ensp;
              </>
            )}
            {showDeleteButtonCondition(i) && (
              <Button
                variant={"contained"}
                color={"secondary"}
                size={"small"}
                onClick={() => {
                  setIsDeleting(true);
                  setButtonDeleting(i);
                  deleteOffer(i).then(() => {
                    setIsDeleting(false);
                    setButtonDeleting(-1);
                  });
                }}
                disabled={
                  (isDeleting && buttonDeleting === i) ||
                  offerHasUpcomingInterviews(offers[i])
                }
              >
                <i className="fa fa-trash" />
                &ensp;Apagar&ensp;
                {isDeleting && buttonDeleting === i && (
                  <CircularProgress size={18} />
                )}
              </Button>
            )}
            <Divider className={classes.dividers} />
          </div>
        )}
      </PdfSelectionViewer>
    </div>
  );
}
