import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import * as PropTypes from "prop-types";
import React from "react";
import { useDateParser, useTimeFormatter } from "../../Services/Hooks";

export default function OfferDetails(props) {
  const parseDate = useDateParser();
  const parseTime = useTimeFormatter();

  return (
    <div>
      <Typography variant={"body1"}>
        {"Descrição : " + props.offer.details.description}
      </Typography>
      <Divider style={{ maxWidth: "30%" }} />
      <Typography variant={"body1"} display={"block"}>
        {"Número de estagiários : " + props.offer.details.nbStudentToHire}
      </Typography>
      <Typography variant={"body1"} display={"block"}>
        {`Prazo para inscrição : ${parseDate(
          props.offer.details.limitDateToApply
        )}`}
      </Typography>
      <Typography variant={"body1"} display={"block"}>
        {`De ${parseDate(
          props.offer.details.internshipStartDate
        )} a ${parseDate(props.offer.details.internshipEndDate)}`}
      </Typography>
      <Typography variant={"body1"} display={"block"}>
        {"Horário : " +
          parseTime(props.offer.details.startTime) +
          " a " +
          parseTime(props.offer.details.endTime)}
      </Typography>
      <Typography variant={"body1"} display={"block"}>
        {"Hora trabalhada : $ " + props.offer.details.salary}
      </Typography>
      <Divider style={{ maxWidth: "30%" }} />
      <Typography variant={"body2"} color={"textSecondary"} display={"block"}>
        {`Data de criação : ${parseDate(props.offer.details.creationDate)}`}
      </Typography>
    </div>
  );
}

OfferDetails.propTypes = {
  offer: PropTypes.any.isRequired,
};
