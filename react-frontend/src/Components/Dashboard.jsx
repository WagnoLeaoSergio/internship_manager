import { Divider, Grid, Typography } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import { makeStyles } from "@material-ui/core/styles";
import NotificationImportantOutlinedIcon from "@material-ui/icons/NotificationImportantOutlined";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AuthenticationService from "../Services/AuthenticationService";
import Interviewlist from "./Employer/Interview/InterviewList";
import OfferApprobation from "./Manager/OfferApprobation";
import PendingContracts from "./Manager/PendingContracts";
import ResumeApprobation from "./Manager/ResumeApprobation";
import OfferApplication from "./Student/OfferApplication";
import ResumeList from "./Student/ResumeList";
import OfferList from "./Utils/OfferList";
import SignContract from "./Utils/SignContract";
import useStyles from "./Utils/Style/useStyles";
import TabPanel from "./Utils/TabPanel";

function useSpecificStyles() {
  return makeStyles((theme) => ({
    dashboardList: {
      backgroundColor: theme.palette.background.paper,
      padding: 0,
    },
  }))();
}

function TabButton({ value, index, onClick, children }) {
  const classes = useStyles();
  const activeClasses = [
    classes.dashboardTab,
    index === value && classes.selectedDashboardTab,
  ].join(" ");
  return (
    <Typography
      variant={"h6"}
      onClick={() => onClick(index)}
      className={activeClasses}
    >
      {children}
    </Typography>
  );
}

function AdminDashboard() {
  const classes = useStyles();
  const specificClasses = useSpecificStyles();
  const [currentTab, setCurrentTab] = useState(0);
  const [cvCount, setCvCount] = useState(0);
  const [offerCount, setOfferCount] = useState(0);
  const [contractCount, setContractCount] = useState(0);

  return (
    <>
      <Grid
        item
        xs={2}
        className={[classes.list, specificClasses.dashboardList].join(" ")}
      >
        <TabButton value={currentTab} index={0} onClick={setCurrentTab}>
          {cvCount !== 0 && (
            <Badge
              badgeContent={cvCount}
              color="secondary"
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <NotificationImportantOutlinedIcon />
            </Badge>
          )}
          Currículos pendentes
          <Typography variant={"body2"}>{cvCount} documentos</Typography>
        </TabButton>
        <Divider />
        <TabButton value={currentTab} index={1} onClick={setCurrentTab}>
          {offerCount !== 0 && (
            <Badge
              badgeContent={offerCount}
              color="secondary"
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <NotificationImportantOutlinedIcon />
            </Badge>
          )}
          Ofertas pendentes
          <Typography variant={"body2"}>{offerCount} documentos</Typography>
        </TabButton>
        <Divider />
        <TabButton value={currentTab} index={2} onClick={setCurrentTab}>
          {contractCount !== 0 && (
            <Badge
              badgeContent={contractCount}
              color="secondary"
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <NotificationImportantOutlinedIcon />
            </Badge>
          )}
          Contratos pendentes
          <Typography variant={"body2"}>{contractCount} documentos</Typography>
        </TabButton>
        <Divider />
      </Grid>
      <Divider orientation={"vertical"} flexItem />
      <Grid item xs={10}>
        <TabPanel value={currentTab} index={0}>
          <ResumeApprobation count={setCvCount} />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <OfferApprobation count={setOfferCount} />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <PendingContracts count={setContractCount} />
        </TabPanel>
      </Grid>
    </>
  );
}

function StudentDashboard() {
  const classes = useStyles();
  const specificClasses = useSpecificStyles();
  const [currentTab, setCurrentTab] = useState(0);
  const [cvCount, setCvCount] = useState(0);
  const [deniedCvCount, setDeniedCvCount] = useState(0);
  const [offerCount, setOfferCount] = useState(0);
  const [offerPendingCount, setOfferPendingCount] = useState(0);
  const [contractCount, setContractCount] = useState(0);
  const [contractWaitingCount, setContractWaitingCount] = useState(0);
  return (
    <>
      <Grid
        item
        xs={2}
        className={[classes.list, specificClasses.dashboardList].join(" ")}
      >
        <TabButton value={currentTab} index={0} onClick={setCurrentTab}>
          {offerCount + offerPendingCount !== 0 && (
            <Badge
              badgeContent={offerCount + offerPendingCount}
              color="secondary"
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <NotificationImportantOutlinedIcon />
            </Badge>
          )}
          Ofertas de estágio
          <Typography variant={"body2"}>
            {offerCount} ofertas nas quais você não tem&nbsp;não aplicado
          </Typography>
          <Typography variant={"body2"}>
            {offerPendingCount}
            ofertas pendentes&nbsp;sua resposta
          </Typography>
        </TabButton>
        <Divider />
        <TabButton value={currentTab} index={1} onClick={setCurrentTab}>
          {deniedCvCount !== 0 && (
            <Badge
              badgeContent={deniedCvCount}
              color="secondary"
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <NotificationImportantOutlinedIcon />
            </Badge>
          )}
          Meus currículos
          <Typography variant={"body2"}>{cvCount} documentos</Typography>
          <Typography variant={"body2"}>
            {deniedCvCount} documentos necessitam sua atenção
          </Typography>
        </TabButton>
        <Divider />
        <TabButton value={currentTab} index={2} onClick={setCurrentTab}>
          {contractWaitingCount !== 0 && (
            <Badge
              badgeContent={contractWaitingCount}
              color="secondary"
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <NotificationImportantOutlinedIcon />
            </Badge>
          )}
          Meus contratos
          <Typography variant={"body2"}>{contractCount} documentos</Typography>
          <Typography variant={"body2"}>
            {contractWaitingCount} documentos necessitam sua atenção
          </Typography>
        </TabButton>
        <Divider />
      </Grid>
      <Divider orientation={"vertical"} flexItem />
      <Grid item xs={10}>
        <TabPanel value={currentTab} index={0}>
          <OfferApplication
            count={setOfferCount}
            pendingCount={setOfferPendingCount}
          />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <ResumeList count={setCvCount} deniedCount={setDeniedCvCount} />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <SignContract
            count={setContractCount}
            waitingCount={setContractWaitingCount}
          />
        </TabPanel>
      </Grid>
    </>
  );
}

function EmployerDashboard() {
  const classes = useStyles();
  const specificClasses = useSpecificStyles();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState(
    location.state ? (location.state.tab ? location.state.tab : 0) : 0
  );
  const [offerCount, setOfferCount] = useState(0);
  const [contractCount, setContractCount] = useState(0);
  const [contractWaitingCount, setContractWaitingCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);
  const [interviewWaitingCount, setInterviewWaitingCount] = useState(0);

  return (
    <>
      <Grid
        item
        xs={2}
        className={[classes.list, specificClasses.dashboardList].join(" ")}
      >
        <TabButton value={currentTab} index={0} onClick={setCurrentTab}>
          Minhas ofertas de estágio
          <Typography variant={"body2"}>
            {offerCount} documento{offerCount !== 1 && "s"}
          </Typography>
        </TabButton>
        <Divider />
        <TabButton value={currentTab} index={1} onClick={setCurrentTab}>
          {interviewWaitingCount !== 0 && (
            <Badge
              badgeContent={interviewWaitingCount}
              color="secondary"
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <NotificationImportantOutlinedIcon />
            </Badge>
          )}
          Minhas entrevistas
          <Typography variant={"body2"}>
            {interviewCount} evento{interviewCount !== 1 && "s"}
          </Typography>
          <Typography variant={"body2"}>
            {interviewWaitingCount} evento
            {interviewWaitingCount !== 1 && "s"} necessita
            {interviewWaitingCount !== 1 && "m"} sua atenção
          </Typography>
        </TabButton>
        <Divider />
        <TabButton value={currentTab} index={2} onClick={setCurrentTab}>
          {contractWaitingCount !== 0 && (
            <Badge
              badgeContent={contractWaitingCount}
              color="secondary"
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <NotificationImportantOutlinedIcon />
            </Badge>
          )}
          Meus contratos
          <Typography variant={"body2"}>
            {contractCount} documento{contractCount !== 1 && "s"}
          </Typography>
          <Typography variant={"body2"}>
            {contractWaitingCount} documento{contractCount !== 1 && "s"}{" "}
            necessita{contractCount !== 1 && "m"} sua atenção
          </Typography>
        </TabButton>
        <Divider />
      </Grid>
      <Divider orientation={"vertical"} flexItem />
      <Grid item xs={10}>
        <TabPanel value={currentTab} index={0}>
          <OfferList count={setOfferCount} />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <Interviewlist
            count={setInterviewCount}
            waitingCount={setInterviewWaitingCount}
          />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <SignContract
            count={setContractCount}
            waitingCount={setContractWaitingCount}
          />
        </TabPanel>
      </Grid>
    </>
  );
}

export default function Dashboard() {
  const classes = useStyles();
  return (
    <Grid container wrap={"nowrap"} spacing={0} className={classes.main}>
      {(function () {
        switch (AuthenticationService.getCurrentUserRole()) {
          case "student":
            return <StudentDashboard />;
          case "employer":
            return <EmployerDashboard />;
          default:
            return <AdminDashboard />;
        }
      })()}
    </Grid>
  );
}
