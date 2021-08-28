import {Divider, Grid, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, {useEffect, useState} from "react";
import {useApi} from "../../Services/Hooks";
import useStyles from "./Style/useStyles";

export default function StudentStatus() {
    const classes = useStyles()
    const api = useApi()
    const [evaluations, setEvaluations] = useState([])
    const [currentEvaluationIndex, setCurrentEvaluationIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [evaluationDeleting, setEvaluationDeleting] = useState(-1)

    useEffect(() => {
        api.get("/internEvaluation").then(r => setEvaluations(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function deleteStudentEvaluation(index) {
        const nextState = [...evaluations]
        return api.delete("/internEvaluation/" + nextState[index].id).then(() => {
            nextState.splice(index, 1)
            setEvaluations(nextState)
        })
    }

    return <Grid
        container
        spacing={0}
        className={classes.main}
        style={{padding: "15px 0 0 15px"}}
    >
        <Grid item xs={5} className={classes.list}>
            <Typography
                variant={"h4"}
                gutterBottom={true}
                className={classes.title}
            >
                Avaliações dos estagiários
            </Typography>
            {evaluations.length > 0 ? evaluations.map((item, i) => <div key={i}>
                <Button
                    variant={currentEvaluationIndex === i ? "contained" : "outlined"}
                    color={"primary"}
                    size={"large"}
                    onClick={() => setCurrentEvaluationIndex(i)}
                >
                    <Typography variant={"button"}>
                        {item.contract.studentApplication.student.firstName +
                        " " + item.contract.studentApplication.student.lastName} -&ensp;
                        {item.contract.studentApplication.offer.title}
                    </Typography>
                </Button>
                &ensp;
                <Button
                    variant={currentEvaluationIndex === i ? "contained" : "outlined"}
                    color={"secondary"}
                    size={"small"}
                    disabled={isDeleting}
                    onClick={() => {
                        setIsDeleting(true)
                        setEvaluationDeleting(i)
                        deleteStudentEvaluation(i).then(() => {
                            setIsDeleting(false)
                            setEvaluationDeleting(-1)
                        })
                    }}
                >
                    <i className="fa fa-trash"/>&ensp;
                    Supprimer l'évaluation
                </Button>
                {isDeleting && evaluationDeleting === i && <CircularProgress size={18}/>}
                <Divider className={classes.dividers}/>
            </div>) : <Typography align="center">Nenhum registro encontrado</Typography>}
        </Grid>
        <Grid
            item
            xs={7}
            align="start"
            style={{overflow: "auto", height: "100%"}}
        >
            {evaluations.map((e, k) => <div key={k}>
                {currentEvaluationIndex === k && <div>
                    <Typography variant="h4">
                        FICHE D’ÉVALUATION DU STAGIAIRE
                    </Typography>
                    <br/>
                    <Typography variant="h5">IDENTIFICATION</Typography>
                    <Typography>
                        <strong>Programme d’études : </strong>
                        {e.infos.studentProgram}
                    </Typography>
                    <Typography>
                        <strong>Nom de l'entreprise : </strong>
                        {e.contract.studentApplication.offer.employer.companyName}
                    </Typography>
                    <Typography>
                        <strong>Nom du superviseur : </strong>
                        {e.contract.admin.name}
                    </Typography>
                    <Typography>
                        <strong>Fonction / poste : </strong>
                        {e.infos.supervisorRole}
                    </Typography>
                    <Typography>
                        <strong>Numéro de téléphone : </strong>
                        {e.infos.phoneNumber}
                    </Typography>
                    <Divider className={classes.dividers}/>
                    <Typography variant="h5">PRODUCTIVITÉ</Typography>
                    <Typography>
                        <strong>Planifier et organiser son travail de façon efficace : </strong>
                        {e.productivity.efficiency}
                    </Typography>
                    <Typography>
                        <strong>Comprendre rapidement les directives relatives à son travail : </strong>
                        {e.productivity.comprehension}
                    </Typography>
                    <Typography>
                        <strong>Maintenir un rythme de travail soutenu : </strong>
                        {e.productivity.rythm}
                    </Typography>
                    <Typography>
                        <strong>Établir ses priorités : </strong>
                        {e.productivity.priorities}
                    </Typography>
                    <Typography>
                        <strong>Respecter ses échéanciers : </strong>
                        {e.productivity.deadlines}
                    </Typography>
                    <Typography>
                        <strong>Commentaire : </strong>
                        {e.productivity.comment}
                    </Typography>
                    <Divider className={classes.dividers}/>
                    <Typography variant="h5">QUALITÉ DU TRAVAIL</Typography>
                    <Typography>
                        <strong>Respecter les mandats qui lui ont été confiés : </strong>
                        {e.quality.followsInstructions}
                    </Typography>
                    <Typography>
                        <strong>Porter attention aux détails dans la réalisation de ses tâches : </strong>
                        {e.quality.detailsAttention}
                    </Typography>
                    <Typography>
                        <strong>Vérifier son travail, s’assurer que rien n’a été oublié : </strong>
                        {e.quality.doubleChecks}
                    </Typography>
                    <Typography>
                        <strong>Rechercher des occasions de s'améliorer : </strong>
                        {e.quality.strivesForPerfection}
                    </Typography>
                    <Typography>
                        <strong>Faire une bonne analyse des problèmes rencontrés : </strong>
                        {e.quality.problemAnalysis}
                    </Typography>
                    <Typography>
                        <strong>Commentaire : </strong>
                        {e.quality.comment}
                    </Typography>
                    <Divider className={classes.dividers}/>
                    <Typography variant="h5">
                        QUALITÉS DES RELATIONS INTERPERSONNELLES
                    </Typography>
                    <Typography>
                        <strong>Établir facilement des contacts avec les gens : </strong>
                        {e.relationships.connectsEasily}
                    </Typography>
                    <Typography>
                        <strong>Contribuer activement au travail d’équipe : </strong>
                        {e.relationships.teamworkContribution}
                    </Typography>
                    <Typography>
                        <strong>S’adapter facilement à la culture de l’entreprise : </strong>
                        {e.relationships.culturalAdaptation}
                    </Typography>
                    <Typography>
                        <strong>Accepter les critiques constructives : </strong>
                        {e.relationships.acceptsCriticism}
                    </Typography>
                    <Typography>
                        <strong>Être respectueux envers les gens : </strong>
                        {e.relationships.respectsOthers}
                    </Typography>
                    <Typography>
                        <strong>Faire preuve d’écoute active en essayant de comprendre le
                            point de vue de l’autre : </strong>
                        {e.relationships.activelyListens}
                    </Typography>
                    <Typography>
                        <strong>Commentaire : </strong>
                        {e.relationships.comment}
                    </Typography>
                    <Divider className={classes.dividers}/>
                    <Typography variant="h5">HABILETÉS PERSONNELLES</Typography>
                    <Typography>{e.skills.connectsEasily}</Typography>
                    <Typography>
                        <strong>Démontrer de l’intérêt et de la motivation au travail : </strong>
                        {e.skills.showsInterest}
                    </Typography>
                    <Typography>
                        <strong>Exprimer clairement ses idées : </strong>
                        {e.skills.expressesOwnIdeas}
                    </Typography>
                    <Typography>
                        <strong>Faire preuve d’initiative : </strong>
                        {e.skills.showsInitiative}
                    </Typography>
                    <Typography>
                        <strong>Travailler de façon sécuritaire : </strong>
                        {e.skills.worksSafely}
                    </Typography>
                    <Typography>
                        <strong>Démontrer un bon sens des responsabilités ne requérant
                            qu’un minimum de supervision : </strong>
                        {e.skills.dependable}
                    </Typography>
                    <Typography>
                        <strong>Être ponctuel et assidu à son travail : </strong>
                        {e.skills.punctual}
                    </Typography>
                    <Typography>
                        <strong>Commentaire : </strong>
                        {e.skills.comment}
                    </Typography>
                    <Divider className={classes.dividers}/>
                    <Typography variant="h5">
                        APPRÉCIATION GLOBALE DU STAGIAIRE
                    </Typography>
                    <Typography>
                        <strong>Expectation : </strong>
                        {e.appreciation.expectations}
                    </Typography>
                    <Typography>
                        <strong>
                            PRÉCISEZ VOTRE APPRÉCIATION : 
                        </strong>
                        {e.appreciation.comment}
                    </Typography>
                    <Typography>
                        <strong>Cette évaluation a été discutée avec le stagiaire : </strong>
                        {e.appreciation.discussedWithIntern}
                    </Typography>
                    <Divider className={classes.dividers}/>
                    <Typography>
                        <strong>Le nombre d’heures réel par semaine d’encadrement accordé au
                            stagiaire : </strong>
                        {e.feedback.weeklySupervisionHours}
                    </Typography>
                    <Divider className={classes.dividers}/>
                    <Typography>
                        <strong>L’entreprise aimerait accueillir cet élève pour son prochain stage : </strong>
                        {e.feedback.hireAgain}
                    </Typography>
                    <Typography>
                        <strong>La formation technique du stagiaire était-elle suffisante
                            pour accomplir le mandat de stage? </strong>
                        {e.feedback.technicalFormationOpinion}
                    </Typography>
                    <Typography>
                        <strong>Fonction / poste : </strong>
                        {e.infos.supervisorRole}
                    </Typography>
                    <Divider className={classes.dividers}/>
                    <Typography variant="h5">
                        Signature :
                    </Typography>
                    <img src={e.signature.image} alt="signature" className={classes.signature}/>
                    <Typography>
                        <strong>Nom : </strong>
                        {e.signature.name}
                    </Typography>
                    <Typography>
                        <strong>Date : </strong>
                        {e.signature.date}
                    </Typography>
                </div>}
            </div>)}
        </Grid>
    </Grid>
}
