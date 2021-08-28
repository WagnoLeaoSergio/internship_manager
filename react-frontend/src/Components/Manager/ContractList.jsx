import {Typography, useTheme} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {useApi} from "../../Services/Hooks";
import ApprovalButtons from "../Utils/ApprovalButtons";
import PdfSelectionViewer from "../Utils/PDF/PdfSelectionViewer";
import useStyles from "../Utils/Style/useStyles";

export default function ContractList({count}) {
    const classes = useStyles()
    const theme = useTheme()
    const api = useApi()
    const history = useHistory()
    const [contracts, setContracts] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [disabledDelContractBtn, setDisabledDelContractBtn] = useState(false)

    useEffect(() => {
        api.get("/contract")
            .then(r => setContracts(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (count)
            count(contracts.length)
    })

    function sendDecision(index, isApproved) {
        const nextState = [...contracts]
        const signDto = {}
        signDto.contractId = nextState[index].id
        signDto.isApproved = isApproved

        return api.put("/contractGeneration/sign", signDto)
            .then(r => {
                nextState.splice(index, 1, r.data)
                setContracts(nextState)
            })
    }

    function deleteContract(index) {
        const nextState = [...contracts]
        return api.delete("/contract/" + nextState[index].id)
            .then(() => {
                nextState.splice(index, 1)
                setContracts(nextState)
            })
    }

    function showContractState(index) {
        const nextState = [...contracts]
        const contractState = nextState[index].signatureState

        switch (contractState) {
            case "WAITING_FOR_EMPLOYER_SIGNATURE" :
                return <Typography variant={"body1"} style={{color: theme.palette.info.main}}>
                    Aguardando assinatura do supervisor
                </Typography>
            case "REJECTED_BY_EMPLOYER" :
                return <Typography variant={"body1"} style={{color: theme.palette.error.main}}>
                    Supervisor rejeitou contrato :
                    {nextState[index].reasonForRejection}
                </Typography>
            case "WAITING_FOR_STUDENT_SIGNATURE" :
                return <Typography variant={"body1"} style={{color: theme.palette.info.main}}>
                    Aguardando assinatura do estudante
                    {nextState[index].reasonForRejection}
                </Typography>
            case "SIGNED":
                return <Typography variant={"body1"} style={{color: theme.palette.success.main}}>
                    Contrato assinado
                </Typography>
            default:
                return ""
        }
    }

    function showDeleteContractButtonCondition(i) {
        return contracts[i].signatureState === "WAITING_FOR_EMPLOYER_SIGNATURE" || contracts[i].signatureState === "REJECTED_BY_EMPLOYER"
    }

    function showEvaluationButtonCondition(i) {
        return contracts[i].signatureState === "SIGNED" && contracts[i].businessEvaluation === null
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer
            documents={contracts ? contracts.map(c => c.file ? c.file : "") : []}
            title={"Contratos pendentes"}>
            {(i, setCurrent) =>
                <div key={i}>
                    <Button
                        variant={currentIndex === i ? "contained" : "outlined"}
                        color={"primary"}
                        size={"large"}
                        onClick={() => {
                            setCurrent(i)
                            setCurrentIndex(i)
                        }}
                    >
                        <Typography variant={"button"}>
                            {contracts[i].studentApplication.student.firstName} {contracts[i].studentApplication.student.lastName}
                            &ensp;&mdash;&ensp;{contracts[i].studentApplication.offer.employer.companyName}
                        </Typography>
                    </Button>
                    {contracts[i].signatureState === "PENDING_FOR_ADMIN_REVIEW" &&
                    <ApprovalButtons
                        onApprove={() => sendDecision(i, true)}
                        onDeny={() => deleteContract(i)}
                        approveLabel={"Aprovar contrato"}
                        denyLabel={"Rejeitar contrato"}
                    />
                    }
                    {showContractState(i)}
                    {currentIndex === i && showDeleteContractButtonCondition(i) && <>
                            &ensp;{disabledDelContractBtn && <CircularProgress size={18}/>}
                        <Button
                            variant={"contained"}
                            color={"secondary"}
                            size={"small"}
                            disabled={disabledDelContractBtn}
                            onClick={() => {
                                setDisabledDelContractBtn(true)
                                deleteContract(i)
                            }}>
                            <i className="fa fa-trash"/>&ensp;Supprimer
                        </Button>
                        <Typography variant={"body2"}>
                            Nome do coordenador de estágio : {contracts[i].admin.name}
                        </Typography>
                        </>
                    }
                    {showEvaluationButtonCondition(i) &&
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        size="small"
                        onClick={() => {
                            history.push("/dashboard/businessEvaluation", {...contracts[i]})
                        }}
                    >
                        <i className="fa fa-drivers-license-o"/>&ensp;Avaliar empresa
                    </Button>
                    }
                    <hr className={classes.hrStyle}/>
                </div>}
        </PdfSelectionViewer>
    </div>
}
