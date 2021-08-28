import * as PropTypes from "prop-types";
import React from "react";

export default function TabPanel(props) {
    const {children, value, index, ...other} = props

    return <div hidden={value !== index} {...other} style={{height: "100%"}}>
        {children}
    </div>
}

TabPanel.propTypes = {
    children: PropTypes.node.isRequired,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
}
