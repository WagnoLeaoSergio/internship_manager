import { Divider, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Field, Form, Formik } from "formik";
import { Checkbox } from "formik-material-ui";
import React, { useEffect, useState } from "react";
import { useApi } from "../../Services/Hooks";
import PdfSelectionViewer from "../Utils/PDF/PdfSelectionViewer";
import useStyles from "../Utils/Style/useStyles";

export default function OfferAssignements() {
    const classes = useStyles()
    const api = useApi()
    const [students, setStudents] = useState([])
    const [offers, setOffers] = useState([])
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0)

    useEffect(() => {
        api.get("/offers/approved")
            .then(r => setOffers(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        api.get("/students")
            .then(r => {
                if (r) {
                    r.data.forEach(s => {
                        delete s.resumes
                        delete s.appliedOffers
                    })
                    setStudents(r.data)
                } else
                    setStudents([])
            })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function isStudentAllowedInOffer(offer, student) {
        return offer.allowedStudents.find(s => s.id === student.id) !== undefined && offer.allowedStudents.length !== 0
    }

    function sendDecision(values, i) {
        return api.put("/offers/" + values.offerId + "/addRemoveStudent/" + values.studentId, {})
                .then(r => {
                    const nextState = [...offers]
                    nextState.splice(i, 1, r.data)
                    setOffers(nextState)
                })
    }

    return <div style={{height: "100%"}}>
        <PdfSelectionViewer documents={offers.map(o => o.file)} title={"Atribuição de ofertas a alunos"}>
            {(i, setCurrent) =>
                <div key={i}>
                    <Button
                        variant={i === currentOfferIndex ? "contained" : "outlined"}
                        color={"primary"}
                        onClick={() => {
                            setCurrent(i)
                            setCurrentOfferIndex(i)
                        }}
                    >
                        <Typography variant={"body1"}>
                            {offers[i].title}&ensp;
                        </Typography>
                        <Typography variant={"body2"}>
                            {offers[i].employer.companyName}
                        </Typography>
                    </Button>
                    {currentOfferIndex === i &&
                    students.map((student, j) =>
                        <div key={j}>
                            <Formik
                                    initialValues={{
                                        offerId: offers[i].id,
                                        studentId: student.id,
                                        allowed: false
                                    }}
                                    onSubmit={values => sendDecision(values, i)}>
                                {({submitForm, isSubmitting}) =>
                                        <Form style={{display: "inline", marginLeft: 16}}>
                                            <Field name={"offerId"} type={"hidden"}/>
                                            <Field name={"studentId"} type={"hidden"}/>
                                            <Field id={"allowed"} name={"allowed"} component={Checkbox}
                                                   type="checkbox" onChange={submitForm} disabled={isSubmitting}
                                                   checked={isStudentAllowedInOffer(offers[i], student)}/>
                                            <label
                                                    htmlFor={"allowed"}>{student.firstName} {student.lastName}</label>
                                            {isSubmitting && <CircularProgress size={18}/>}
                                    </Form>}
                            </Formik>
                        </div>
                    )}
                    <Divider className={classes.dividers}/>
                </div>
            }
        </PdfSelectionViewer>
    </div>
}
