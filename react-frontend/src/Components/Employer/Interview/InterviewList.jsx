import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import React, { useEffect, useState } from "react";
import AuthenticationService from "../../../Services/AuthenticationService";
import {
  useApi,
  useModal,
  useTimeParserFromDate,
} from "../../../Services/Hooks";
import useStyles from "../../Utils/Style/useStyles";
import { RescheduleInterviewModal } from "./RescheduleInterviewModal";

export default function Interviewlist({ count, waitingCount }) {
  const [interviews, setInterviews] = useState([{}]);
  const api = useApi();
  const classes = useStyles();
  const theme = useTheme();
  const parseTimeFromDate = useTimeParserFromDate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [buttonDeleting, setButtonDeleting] = useState(-1);
  const [interviewToEdit, setInterviewToEdit] = useState({});
  const [rescheduleOpen, openReschedule, closeReschedule] = useModal();

  useEffect(() => {
    api
      .get("/interviews/employer/" + AuthenticationService.getCurrentUser().id)
      .then((r) => setInterviews(r ? r.data : []));
  }, [setInterviews]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (count) count(interviews.length);
    if (waitingCount)
      waitingCount(
        interviews.filter(
          (i) => i.studentAcceptanceState === "INTERVIEW_REJECTED_BY_STUDENT"
        ).length
      );
  });

  function isInterviewAccepted(interview) {
    if (interview.studentAcceptanceState === "INTERVIEW_ACCEPTED_BY_STUDENT") {
      return (
        <span style={{ color: theme.palette.success.main }}>
          Aluno aceitou a entrevista
        </span>
      );
    } else if (
      interview.studentAcceptanceState === "INTERVIEW_REJECTED_BY_STUDENT"
    ) {
      return (
        <>
          <span style={{ color: theme.palette.error.main }}>Rejeitado</span>
          {interview.reasonForRejectionByStudent}
        </>
      );
    }
    return (
      <span style={{ color: theme.palette.info.main }}>
        Aguardando resposta do estudante
      </span>
    );
  }

  return (
    <>
      <Grid container spacing={0} className={classes.main}>
        <Grid item xs={12} className={classes.list}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell>Estudante</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reprogramar</TableCell>
                  <TableCell>Apagar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {interviews &&
                  interviews.map((interview, key) => (
                    <TableRow key={key}>
                      <TableCell>
                        {interview.dateTime
                          ? new Date(interview.dateTime).toLocaleDateString(
                              "pt-BR",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : ""}
                      </TableCell>
                      <TableCell>
                        {interview.dateTime
                          ? parseTimeFromDate(interview.dateTime)
                          : ""}
                      </TableCell>
                      <TableCell>
                        {interview.studentApplication
                          ? interview.studentApplication.offer.title
                          : ""}
                      </TableCell>
                      <TableCell>
                        {interview.studentApplication
                          ? interview.studentApplication.student.firstName +
                            " " +
                            interview.studentApplication.student.lastName
                          : ""}
                      </TableCell>
                      <TableCell>{isInterviewAccepted(interview)}</TableCell>
                      <TableCell>
                        <Button
                          variant={"contained"}
                          color={"primary"}
                          onClick={() => {
                            setInterviewToEdit(interview);
                            openReschedule();
                          }}
                        >
                          Reprogramar
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={"contained"}
                          color={"secondary"}
                          disabled={
                            isDeleting && buttonDeleting === interview.id
                          }
                          onClick={() => {
                            const interviewToDeleteIndex = interviews.findIndex(
                              (interv) => interv.id === interview.id
                            );
                            const copyInterviews = [...interviews];
                            setIsDeleting(true);
                            setButtonDeleting(interview.id);
                            api
                              .delete("/interviews/" + interview.id)
                              .then(() => {
                                copyInterviews.splice(
                                  interviewToDeleteIndex,
                                  1
                                );
                                setInterviews(copyInterviews);
                                setIsDeleting(false);
                                setButtonDeleting(-1);
                              });
                          }}
                        >
                          Cancelar
                        </Button>
                        {isDeleting && buttonDeleting === interview.id && (
                          <CircularProgress size={18} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <RescheduleInterviewModal
        isOpen={rescheduleOpen}
        hide={closeReschedule}
        interview={interviewToEdit}
        setInterview={(interview) =>
          setInterviews((oldInterviews) => {
            const idx = oldInterviews.findIndex((i) => i.id === interview.id);
            oldInterviews.splice(idx, 1);
            return [...oldInterviews, interview];
          })
        }
      />
    </>
  );
}
