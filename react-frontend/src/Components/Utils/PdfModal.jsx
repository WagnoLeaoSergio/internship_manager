import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import * as PropTypes from "prop-types";
import React, { useRef } from "react";
import PdfDocument from "./PDF/PdfDocument";
import useStyles from "./Style/useStyles";

export default function PdfModal({ open, onClose, document }) {
  const classes = useStyles();
  const container = useRef();

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"lg"} fullWidth>
      <DialogContent className={classes.viewbox} ref={container}>
        <PdfDocument document={document} container={container} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

PdfModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  document: PropTypes.string.isRequired,
};
