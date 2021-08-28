import * as PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import useStyles from "../Style/useStyles";

export default function PdfDocument(props) {
    const classes = useStyles()
    const [numPages, setNumPages] = useState(0)
    const [pageWidth, setPageWidth] = useState(0)

    function handleResize() {
        setPageWidth(props.container.current.offsetWidth * .95)
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    });

    return <Document
        onLoadSuccess={async ({numPages}) => await setNumPages(numPages)}
        error={"Erro ao exibir documento"}
        file={props.document}>
        {Array.from(
            new Array(numPages),
            (el, index) => <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                className={classes.page}
                width={pageWidth}
            />
        )}
    </Document>
}

PdfDocument.propTypes = {
    document: PropTypes.any.isRequired
}
