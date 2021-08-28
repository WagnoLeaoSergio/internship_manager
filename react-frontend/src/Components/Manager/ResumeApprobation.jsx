import { Divider, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React, { useEffect, useState } from "react";
import { useApi, useModal } from "../../Services/Hooks";
import ApprovalButtons from "../Utils/ApprovalButtons";
import TextboxModal from "../Utils/Modal/TextboxModal";
import PdfSelectionViewer from "../Utils/PDF/PdfSelectionViewer";
import useStyles from "../Utils/Style/useStyles";

export default function ResumeApprobation({count}) {
    const classes = useStyles()
    const api = useApi()
    const [resumes, setResumes] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isReasonModalOpen, openReasonModal, closeReasonModal] = useModal()

    useEffect(() => {
        api.get("/resumes/pending")
            .then(r => setResumes(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => count(resumes.length))

    function sendDecision(index, reviewState, reason = "") {
        const nextState = [...resumes]
        nextState[index].reviewState = reviewState
        nextState[index].reasonForRejection = reason
        return api.put("/resumes/" + nextState[index].id, nextState[index])
            .then(() => {
                nextState.splice(index, 1)
                setResumes(nextState)

                if (currentIndex >= nextState.length)
                    setCurrentIndex(0)

                closeReasonModal()
            })
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer documents={resumes.map(o => o.file)} title={"Currículos pendentes"}>
            {(i, setCurrent) => <div key={i}>
                <Button
                    onClick={() => {
                        setCurrentIndex(i)
                        setCurrent(i)
                    }}
                    variant={i === currentIndex ? "contained" : "outlined"}
                    color={"primary"}
                >
                    <Typography variant={"body1"} display={"inline"}>
                        {resumes[i].name}&ensp;
                    </Typography>
                    <Typography variant={"body2"} display={"inline"}>
                        {resumes[i].owner.firstName} {resumes[i].owner.lastName}
                    </Typography>
                </Button>
                <ApprovalButtons
                    onApprove={() => sendDecision(i, "APPROVED")}
                    onDeny={() => {
                        setCurrentIndex(i)
                        openReasonModal()
                    }}
                    approveLabel={"Aprovar"}
                    denyLabel={"Recusar"}
                />
                <Divider className={classes.dividers}/>
            </div>}
        </PdfSelectionViewer>
        <TextboxModal
            isOpen={isReasonModalOpen}
            hide={closeReasonModal}
            title={"Justificativa de recusa"}
            onSubmit={async values => sendDecision(currentIndex, "DENIED", values.message)}
        />
    </div>
}
