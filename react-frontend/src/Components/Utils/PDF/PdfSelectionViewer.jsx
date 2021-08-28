import {Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import React, {useEffect, useRef, useState} from "react";
import useStyles from "../Style/useStyles";
import PdfDocument from "./PdfDocument";

export default function PdfSelectionViewer({documents, title, children}) {
    const classes = useStyles()
    const [currentDoc, setCurrentDoc] = useState(null)
    const [childs, setChilds] = useState([])
    const container = useRef()

    useEffect(() => {
        if (documents) {
            if (documents[currentDoc] && documents[currentDoc] !== "")
                setCurrentDoc(currentDoc)
            else if (documents[0] && documents[0] !== "")
                setCurrentDoc(0)
        } else
            setCurrentDoc(null)
    }, [documents, currentDoc])

    useEffect(() => setChilds(documents.map((item, i) => children(i, setCurrent))), [children, documents])

    function setCurrent(index) {
        setCurrentDoc(index)
    }

    function getCurrentDoc() {
        return currentDoc >= documents.length ? 0 : currentDoc
    }

    return <Grid
        container
        spacing={0}
        className={classes.main}>
        <Grid item xs={4} className={classes.list}>
            <Typography variant={"h4"} gutterBottom={true} className={classes.title}>
                {title}
            </Typography>
            {childs.length > 0 ? childs : "Nenhum registro encontrado"}
        </Grid>
        <Grid item xs={8} className={classes.viewbox} align="center" ref={container}>
            <PdfDocument document={documents[getCurrentDoc()] ? documents[getCurrentDoc()] : ""}
                         container={container}/>
        </Grid>
    </Grid>
}
