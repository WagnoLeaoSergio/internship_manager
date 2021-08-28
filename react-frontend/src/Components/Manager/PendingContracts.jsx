import { Table, TableBody, TableContainer, TableHead, TableRow } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import TableCell from "@material-ui/core/TableCell"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useApi, useModal } from "../../Services/Hooks"
import SignModal from "../Utils/Modal/SignModal"

function ContextButton({application}) {
    const history = useHistory()
    const [contract, setContract] = useState([])
    const [isSignModalOpen, openSignModal, closeSignModal] = useModal()

    if (!application.contract)
        return <Button
            onClick={() => history.push("/dashboard/contractForm", {...application})}
            variant={"contained"}
            color={"primary"}
            style={{marginTop: 15}}
            fullWidth
        >
            <i className="fa fa-pencil-square-o"/>&ensp;Gerar contrato
        </Button>
    else
        return <>
            <Button
                onClick={() => {
                    setContract(application.contract)
                    openSignModal()
                }}
                variant={"contained"}
                color={"primary"}
                style={{marginTop: 15}}
                fullWidth
            >
                <i className="fa fa-pencil-square-o"/>&ensp;Assinar contrato
            </Button>
            <SignModal isOpen={isSignModalOpen}
                       hide={closeSignModal}
                       title={"Por favor, assine o contrato"}
                       contract={contract}
            />
        </>
}

function DataTableHeader() {
    return <TableRow>
        <TableCell>Estudante</TableCell>
        <TableCell>Oferta</TableCell>
        <TableCell>Empresa</TableCell>
        <TableCell>Gerar contrato</TableCell>
    </TableRow>
}

function DataTableBody({rows}) {
    if (rows.length > 0)
        return rows.map(appli =>
            <TableRow key={appli.id}>
                <TableCell>{appli.student.firstName + " " + appli.student.lastName}</TableCell>
                <TableCell>{appli.offer.title}</TableCell>
                <TableCell>{appli.offer.employer.companyName}</TableCell>
                <TableCell>
                    <ContextButton application={appli}/>
                </TableCell>
            </TableRow>)
    else
        return <TableRow>
            <TableCell>Nenhum registro encontrado</TableCell>
            <TableCell/>
            <TableCell/>
            <TableCell/>
        </TableRow>
}

DataTableBody.propTypes = {
    rows: PropTypes.array.isRequired
}

export default function PendingContracts({count}) {
    const api = useApi()
    const [applications, setApplications] = useState([])

    useEffect(() => {
        api.get("/applications/pending")
            .then(r => setApplications(r ? r.data : []))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (count)
            count(applications.length)
    })

    return <div style={{height: "100%"}}>
        <TableContainer>
            <Table>
                <TableHead>
                    <DataTableHeader/>
                </TableHead>
                <TableBody>
                    <DataTableBody rows={applications}/>
                </TableBody>
            </Table>
        </TableContainer>
    </div>
}