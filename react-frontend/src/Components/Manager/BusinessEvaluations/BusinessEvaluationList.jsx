import { Divider } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useApi } from "../../../Services/Hooks";
import useStyles from "../../Utils/Style/useStyles";

export default function BusinessEvaluationList() {
  const classes = useStyles();
  const api = useApi();
  const [businessEvaluations, setBusinessEvaluations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [evaluationDeleting, setEvaluationDeleting] = useState(-1);

  useEffect(() => {
    api
      .get("/businessEvaluation")
      .then((r) => setBusinessEvaluations(r ? r.data : []));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function deleteBusinessEvaluation(index) {
    const nextState = [...businessEvaluations];
    return api.delete("/businessEvaluation/" + nextState[index].id).then(() => {
      nextState.splice(index, 1);
      setBusinessEvaluations(nextState);
    });
  }

  return (
    <Grid
      container
      spacing={0}
      className={classes.main}
      style={{ padding: "15px 0 0 15px" }}
    >
      <Grid item xs={5} className={classes.list}>
        <Typography
          variant={"h4"}
          gutterBottom={true}
          className={classes.title}
        >
          Avaliações do ambiente de estágio
        </Typography>
        {businessEvaluations.length > 0 ? (
          businessEvaluations.map((item, i) => (
            <div key={i}>
              <Button
                variant={currentIndex === i ? "contained" : "outlined"}
                color={"primary"}
                size={"large"}
                onClick={() => {
                  setCurrentIndex(i);
                }}
              >
                <Typography variant={"button"} display={"block"}>
                  {item.contract.studentApplication.student.firstName +
                    " " +
                    item.contract.studentApplication.student.lastName}{" "}
                  -&ensp;
                  {item.contract.studentApplication.offer.employer.companyName}
                </Typography>
              </Button>
              &ensp;
              <Button
                variant={currentIndex === i ? "contained" : "outlined"}
                color={"secondary"}
                size={"small"}
                disabled={isDeleting}
                onClick={() => {
                  setIsDeleting(true);
                  setEvaluationDeleting(i);
                  deleteBusinessEvaluation(i).then(() => {
                    setIsDeleting(false);
                    setEvaluationDeleting(-1);
                  });
                }}
              >
                <i className="fa fa-trash" style={{ color: "white" }} />
                &ensp; Excluir a avaliação
              </Button>
              {isDeleting && evaluationDeleting === i && (
                <CircularProgress size={18} />
              )}
              <Divider className={classes.dividers} />
            </div>
          ))
        ) : (
          <Typography align="center">Nenhum registro encontrado</Typography>
        )}
      </Grid>
      <Grid
        item
        xs={7}
        align="start"
        style={{ overflow: "auto", height: "100%" }}
      >
        <div>
          {businessEvaluations.map((item, i) => (
            <div key={i}>
              {currentIndex === i && (
                <div>
                  <Typography variant="h5">IDENTIFICAÇÃO DA EMPRESA</Typography>
                  <Typography>
                    <strong>Nome da Empresa : </strong>
                    {
                      businessEvaluations[currentIndex].contract
                        .studentApplication.offer.employer.companyName
                    }
                  </Typography>
                  <Typography>
                    <strong>Representante : </strong>
                    {
                      businessEvaluations[currentIndex].contract
                        .studentApplication.offer.employer.contactName
                    }
                  </Typography>
                  <Typography>
                    <strong>Endereço : </strong>
                    {
                      businessEvaluations[currentIndex].contract
                        .studentApplication.offer.employer.address
                    }
                  </Typography>
                  <Typography>
                    <strong>E-mail : </strong>
                    {
                      businessEvaluations[currentIndex].contract
                        .studentApplication.offer.employer.email
                    }
                  </Typography>
                  <Typography>
                    <strong>Telefone : </strong>
                    {
                      businessEvaluations[currentIndex].contract
                        .studentApplication.offer.employer.phoneNumber
                    }
                  </Typography>
                  <Divider className={classes.dividers} />
                  <Typography>
                    <strong>Oferta : </strong>
                    {item.contract.studentApplication.offer.title}
                  </Typography>
                  <Divider className={classes.dividers} />
                  <Typography variant="h5">
                    IDENTIFICAÇÃO DO ESTAGIÁRIO
                  </Typography>
                  <Typography>
                    <strong>Nome do estagiário : </strong>
                    {
                      businessEvaluations[currentIndex].contract
                        .studentApplication.student.firstName
                    }{" "}
                    {
                      businessEvaluations[currentIndex].contract
                        .studentApplication.student.lastName
                    }
                  </Typography>
                  <Typography>
                    <strong>Data do estágio : </strong>
                    {
                      businessEvaluations[currentIndex].contract
                        .studentApplication.offer.details.internshipStartDate
                    }
                  </Typography>
                  <Typography>
                    <strong>Estágio : </strong>
                    {
                      businessEvaluations[currentIndex].evaluationCriterias
                        .internshipCount
                    }
                  </Typography>
                  <Divider className={classes.dividers} />
                  <Typography variant="h5">ÉVALUATION</Typography>
                  <Typography>
                    <strong>
                      As tarefas atribuídas ao trainee são consistentes com as
                      tarefas anunciado no acordo de estágio :{" "}
                    </strong>
                    {
                      businessEvaluations[currentIndex].evaluationCriterias
                        .workAsAnnoncement
                    }
                  </Typography>
                  <Typography>
                    <strong>
                      Medidas de recepção facilitam a integração do novo
                      estagiário :{" "}
                    </strong>
                    {
                      businessEvaluations[currentIndex].evaluationCriterias
                        .easyIntigration
                    }
                  </Typography>
                  <Typography>
                    <strong>
                      O tempo real dedicado à supervisão do estagiário é
                      suficiente :{" "}
                    </strong>
                    {
                      businessEvaluations[currentIndex].evaluationCriterias
                        .sufficientTime
                    }
                  </Typography>
                  <Typography>
                    <strong>
                      O ambiente de trabalho respeita as normas de higiene e
                      segurança no trabalho :{" "}
                    </strong>
                    {
                      businessEvaluations[currentIndex].evaluationCriterias
                        .securityWorkPlace
                    }
                  </Typography>
                  <Typography>
                    <strong>O clima de trabalho é agradável : </strong>
                    {
                      businessEvaluations[currentIndex].evaluationCriterias
                        .pleasantEnvironnement
                    }
                  </Typography>
                  <Typography>
                    <strong>
                      O ambiente de estágio é acessível por transporte público :{" "}
                    </strong>
                    {
                      businessEvaluations[currentIndex].evaluationCriterias
                        .accessiblePlace
                    }
                  </Typography>
                  <Typography>
                    <strong>
                      O salário oferecido{" "}
                      {
                        businessEvaluations[currentIndex].evaluationCriterias
                          .salary
                      }
                      é suficiente para o estagiário :{" "}
                    </strong>
                    {
                      businessEvaluations[currentIndex].evaluationCriterias
                        .goodSalary
                    }
                  </Typography>
                  <Typography>
                    <strong>
                      A comunicação com o supervisor de estágio facilita
                      progresso do estágio :{" "}
                    </strong>
                    {
                      businessEvaluations[currentIndex].evaluationCriterias
                        .supervisorFacilitatesIntern
                    }
                  </Typography>
                  <Typography>
                    <strong>
                      O equipamento fornecido é adequado para realizar as
                      tarefas confiado :{" "}
                    </strong>
                    {
                      businessEvaluations[currentIndex].evaluationCriterias
                        .adequateEquipement
                    }
                  </Typography>
                  <Typography>
                    <strong>O volume de trabalho é aceitável : </strong>
                    {
                      businessEvaluations[currentIndex].evaluationCriterias
                        .accetableWorkload
                    }
                  </Typography>
                  <Typography>
                    <strong>Especifique o número de horas por semana : </strong>
                    Primeiro mês :
                    {
                      businessEvaluations[currentIndex].evaluationCriterias
                        .hoursOfWeekFirstMonth
                    }
                    h. Segundo mês :
                    {
                      businessEvaluations[currentIndex].evaluationCriterias
                        .hoursOfWeekFirstMonth
                    }
                    h. Terceiro mês :
                    {
                      businessEvaluations[currentIndex].evaluationCriterias
                        .hoursOfWeekFirstMonth
                    }
                    h.
                  </Typography>
                  <Typography>
                    <strong>Comentários adicionais : </strong>
                    {
                      businessEvaluations[currentIndex].evaluationCriterias
                        .comment
                    }
                  </Typography>
                  <Divider className={classes.dividers} />
                  <Typography variant="h5">OBSERVAÇÕES GERAIS</Typography>
                  <Typography>
                    <strong>Este ambiente é o preferido para o : </strong>
                    {
                      businessEvaluations[currentIndex].observations
                        .preferedInternship
                    }
                  </Typography>
                  <Typography>
                    <strong>Este ambiente está aberto ao acolhimento : </strong>
                    {
                      businessEvaluations[currentIndex].observations
                        .numbersOfInterns
                    }
                  </Typography>
                  <Typography>
                    <strong>
                      Este ambiente deseja receber o mesmo estagiário por um
                      próximo estágio :{" "}
                    </strong>
                    {
                      businessEvaluations[currentIndex].observations
                        .welcomeSameIntern
                    }
                  </Typography>
                  <Typography>
                    <strong>Este ambiente oferece turnos flexíveis: </strong>
                    {
                      businessEvaluations[currentIndex].observations
                        .variablesShifts
                    }
                    . De{" "}
                    {
                      businessEvaluations[currentIndex].observations
                        .startShiftsOne
                    }
                    h a{" "}
                    {
                      businessEvaluations[currentIndex].observations
                        .endShiftsOne
                    }
                    h De{" "}
                    {
                      businessEvaluations[currentIndex].observations
                        .startShiftsTwo
                    }
                    h a{" "}
                    {
                      businessEvaluations[currentIndex].observations
                        .endShiftsTwo
                    }
                    h De{" "}
                    {
                      businessEvaluations[currentIndex].observations
                        .startShiftsThree
                    }
                    h a{" "}
                    {
                      businessEvaluations[currentIndex].observations
                        .endShiftsThree
                    }
                    h
                  </Typography>
                  <Divider className={classes.dividers} />
                  <Typography variant="h5">
                    Assinatura do coordenador de estágio
                  </Typography>
                  <img
                    src={businessEvaluations[currentIndex].signature.image}
                    alt="signature"
                    className={classes.signature}
                  />
                  <Divider className={classes.dividers} />
                  <Typography>
                    <strong>Professor responsável : </strong>
                    {businessEvaluations[currentIndex].signature.name}
                  </Typography>
                  <Typography>
                    <strong>Data : </strong>
                    {businessEvaluations[currentIndex].signature.date}
                  </Typography>
                </div>
              )}
            </div>
          ))}
        </div>
      </Grid>
    </Grid>
  );
}
