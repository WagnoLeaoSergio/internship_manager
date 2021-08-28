import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { useEffect, useState } from "react";
import { useDateParser, useFileReader } from "../../../Services/Hooks";
import useStyles from "../../Utils/Style/useStyles";

export default function StudentEvaluationModal({ isOpen, data, hide }) {
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
        {"Sumário de avaliação"}
      </DialogTitle>
      <DialogContent>
        {data && (
          <div>
            <div className={classes.evaluationSections}>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Programa de estudo :
                </span>
                {data.infos.studentProgram}
              </Typography>
            </div>
            <div className={classes.evaluationSections}>
              Produtividade
              <Typography>
                <span className={classes.evaluationCriterias}>
                  a) Planeja e organize seu trabalho de maneira eficaz :
                </span>
                {data.productivity.efficiency}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  b) Compreende rapidamente as diretrizes para o seu trabalho :
                </span>
                {data.productivity.comprehension}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  c) Mantém um ritmo de trabalho consistente :
                </span>
                {data.productivity.rythm}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  d) Estabelece suas prioridades de forma assertiva :
                </span>
                {data.productivity.priorities}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  e) Respeita seus prazos :
                </span>
                {data.productivity.deadlines}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Comentários adicionais:
                </span>
                {data.productivity.comment}
              </Typography>
            </div>
            <div className={classes.evaluationSections}>
              Qualidade do trabalho
              <Typography>
                <span className={classes.evaluationCriterias}>
                  a) Respeita o que lhe é delegado :
                </span>
                {data.quality.followsInstructions}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  b) Presta atenção aos detalhes ao realizar as tarefas :
                </span>
                {data.quality.detailsAttention}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  c) Revisa seu trabalho, certifica-se de que nada foi esquecido
                  :
                </span>
                {data.quality.doubleChecks}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  d) Procura oportunidades para melhorar suas habilidades :
                </span>
                {data.quality.strivesForPerfection}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  e) Faz uma boa análise dos problemas encontrados :
                </span>
                {data.quality.problemAnalysis}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Comentários adicionais :
                </span>
                {data.quality.comment}
              </Typography>
            </div>
            <div className={classes.evaluationSections}>
              QUALIDADES DOS RELACIONAMENTOS INTERPESSOAIS
              <Typography>
                <span className={classes.evaluationCriterias}>
                  a) Relaciona-se facilmente com as pessoas :
                </span>
                {data.relationships.connectsEasily}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  b) Contribui ativamente para o trabalho em equipe :
                </span>
                {data.relationships.teamworkContribution}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  c) Se adapta facilmente à cultura da empresa :
                </span>
                {data.relationships.culturalAdaptation}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  d) Aceita críticas construtivas :
                </span>
                {data.relationships.acceptsCriticism}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  e) É respeitoso com as pessoas :
                </span>
                {data.relationships.respectsOthers}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  f) Ouve de forma ativa enquanto tenta entender ponto de vista
                  do outro :
                </span>
                {data.relationships.activelyListens}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Comentários adicionais :
                </span>
                {data.relationships.comment}
              </Typography>
            </div>
            <div className={classes.evaluationSections}>
              HABILIDADES INTERPESSOAIS
              <Typography> {data.skills.connectsEasily}</Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  a) Mostra interesse e motivação no trabalho :
                </span>
                {data.skills.showsInterest}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  b) Expressa suas próprias ideias :
                </span>
                {data.skills.expressesOwnIdeas}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  c) Demonstra iniciativa em novos desafios :
                </span>
                {data.skills.showsInitiative}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  d) Trabalha com segurança :
                </span>
                {data.skills.worksSafely}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  e) Demonstra um bom senso de responsabilidade, não exigindo
                  maior supervisão do que necessário :
                </span>
                {data.skills.dependable}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  f) É pontual no trabalho :
                </span>
                {data.skills.punctual}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Comentários adicionais
                </span>
                {data.skills.comment}
              </Typography>
            </div>
            <div className={classes.evaluationSections}>
              SATISFAÇÃO GERAL DO ESTAGIÁRIO
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Expectativas :
                </span>
                {data.appreciation.expectations}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  JUSTIFICATIVA :
                </span>
                {data.appreciation.comment}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Essa avaliação foi repassado ao estágiario por meio de
                  feedback :
                </span>
                {data.appreciation.discussedWithIntern}
              </Typography>
            </div>
            <div className={classes.evaluationSections}>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  O número real de horas por semana de supervisão concedidas ao
                  estagiário :
                </span>
                {data.feedback.weeklySupervisionHours}
              </Typography>
            </div>
            <div className={classes.evaluationSections}>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  A empresa gostaria de dar as boas-vindas a este aluno em seu
                  próximo estágio :
                </span>
                : {data.feedback.hireAgain}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>
                  A formação técnica do estagiário foi suficiente para
                  cumprir o período de estágio?
                </span>
                {data.feedback.technicalFormationOpinion}
              </Typography>
            </div>
            <div className={classes.evaluationSections}>
              {data.signature.image && (
                <img
                  src={imageSrc}
                  alt="signature"
                  className={classes.signature}
                />
              )}
              <Typography>
                <span className={classes.evaluationCriterias}>
                  Professor responsável :{" "}
                </span>
                &ensp;{data.signature.name}
              </Typography>
              <Typography>
                <span className={classes.evaluationCriterias}>Data : </span>
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
