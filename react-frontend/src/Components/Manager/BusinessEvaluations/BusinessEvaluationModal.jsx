import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useDateParser, useFileReader } from "../../../Services/Hooks";
import useStyles from "../../Utils/Style/useStyles";

export default function BusinessEvaluationModal({ isOpen, data, hide }) {
  const [imageSrc, setImageSrc] = useState("");
  const classes = useStyles();
  const parseDate = useDateParser();
  const imageDecoder = useFileReader();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data.signature.image)
      imageDecoder(data.signature.image).then(setImageSrc);
  }, [imageDecoder, data.signature.image]);

  return (
    <Dialog open={isOpen} onClose={hide} fullWidth={true} maxWidth={"md"}>
      <DialogTitle id="alert-dialog-title">
        {"AVALIAÇÃO DO AMBIENTE DE ESTÁGIO"}
      </DialogTitle>
      <DialogContent>
        {data && (
          <div>
            <div className={classes.evaluationSections}>
              <Typography variant="h5">AVALIAÇÃO</Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>Estágio :</span>{" "}
                {data.evaluationCriterias.internshipCount}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  As tarefas atribuídas ao estagiário estão de acordo com as
                  tarefas anunciadas no contrato de estágio :
                </span>{" "}
                {data.evaluationCriterias.workAsAnnoncement}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Medidas de recepção facilitam a integração do novo estagiário
                  :
                </span>{" "}
                {data.evaluationCriterias.easyIntigration}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  O tempo real dedicado à supervisão do estagiário é suficiente
                  :
                </span>{" "}
                {data.evaluationCriterias.sufficientTime}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  O ambiente de trabalho respeita as normas de higiene e
                  segurança no trabalho :
                </span>{" "}
                {data.evaluationCriterias.securityWorkPlace}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  O clima de trabalho é agradável:
                </span>{" "}
                {data.evaluationCriterias.pleasantEnvironnement}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  O ambiente de estágio é acessível por transporte público:
                </span>{" "}
                {data.evaluationCriterias.accessiblePlace}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  O salário oferecido {data.evaluationCriterias.salary} é
                  suficiente para o estagiário:
                </span>{" "}
                {data.evaluationCriterias.goodSalary}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  A comunicação com o supervisor de estágio é boa:
                </span>{" "}
                {data.evaluationCriterias.supervisorFacilitatesIntern}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  O equipamento fornecido é adequado para realizar as tarefas
                  designadas:
                </span>{" "}
                {data.evaluationCriterias.adequateEquipement}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  O volume de trabalho é aceitável:
                </span>{" "}
                {data.evaluationCriterias.accetableWorkload}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Especifique o número de horas por semana :{" "}
                </span>
                Primeiro mês : {data.evaluationCriterias.hoursOfWeekFirstMonth}h
                Segundo mês : {data.evaluationCriterias.hoursOfWeekFirstMonth}h
                Terceiro mês : {data.evaluationCriterias.hoursOfWeekFirstMonth}h
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Comentários adicionais :
                </span>{" "}
                {data.evaluationCriterias.comment}
              </Typography>
            </div>
            <div className={classes.evaluationSections}>
              <Typography variant="h5">OBSERVAÇÕES GERAIS</Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Este ambiente é preferido para:
                </span>{" "}
                {data.observations.preferedInternship}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Este ambiente está aberto ao acolhimento:
                </span>{" "}
                {data.observations.numbersOfInterns}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Este ambiente deseja acolher o mesmo estagiário para um futuro
                  estágio:
                </span>{" "}
                {data.observations.welcomeSameIntern}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Este ambiente oferece turnos de trabalho flexíveis:
                </span>{" "}
                {data.observations.variablesShifts}. De{" "}
                {data.observations.startShiftsOne}h a{" "}
                {data.observations.endShiftsOne}h De{" "}
                {data.observations.startShiftsTwo}h a{" "}
                {data.observations.endShiftsTwo}h De{" "}
                {data.observations.startShiftsThree}h a{" "}
                {data.observations.endShiftsThree}h
              </Typography>
            </div>
            <div className={classes.evaluationSections}>
              <Typography variant="h5">ASSINATURA</Typography>
              {data.signature.image && (
                <img
                  src={imageSrc}
                  alt="signature"
                  className={classes.signature}
                />
              )}
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Professor responsável:
                </span>
                &ensp;{data.signature.name}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>Data :</span>
                &ensp;{parseDate(data.signature.date)}
              </Typography>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            setIsSubmitting(false);
            hide();
          }}
        >
          Voltar ao formulário
        </Button>
        <Button
          color="primary"
          variant="contained"
          disabled={isSubmitting}
          onClick={() => {
            setIsSubmitting(true);
            data.submitForm().then(() => {
              setIsSubmitting(false);
              hide();
            });
          }}
        >
          Enviar avaliação
        </Button>
        {isSubmitting && <CircularProgress size={18} />}
      </DialogActions>
    </Dialog>
  );
}
