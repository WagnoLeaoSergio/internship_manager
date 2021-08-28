import {
  Button,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import PropTypes from "prop-types";
import { default as React, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import AuthenticationService from "../../Services/AuthenticationService";
import { useApi, useModal } from "../../Services/Hooks";
import useStyles from "../Utils/Style/useStyles";

const requiredFieldMsg = "Campo obrigatório";
const tooShortError = (value) =>
  "Deve ter pelo menos " + value.min + " caracteres";

function DataTableHeader() {
  return (
    <TableRow>
      <TableCell>Nome</TableCell>
      <TableCell>E-mail</TableCell>
      <TableCell>Status da conta</TableCell>
      <TableCell>Modificação</TableCell>
    </TableRow>
  );
}

function DataTableBody({ rows, setCurrentManager, openEditModal }) {
  const classes = useStyles();

  return rows.map((admin) => (
    <TableRow key={admin.id}>
      <TableCell>
        {admin.name +
          (AuthenticationService.getCurrentUser().id === admin.id
            ? " (sua conta)"
            : "")}
      </TableCell>
      <TableCell>{admin.email}</TableCell>
      <TableCell>{admin.disabled ? "Inativo" : "Ativo"}</TableCell>
      <TableCell>
        <Button
          className={classes.linkButton}
          onClick={() => {
            setCurrentManager(admin);
            openEditModal();
          }}
        >
          <i className={"fa fa-pencil-square-o"} />
        </Button>
      </TableCell>
    </TableRow>
  ));
}

DataTableBody.propTypes = {
  rows: PropTypes.array.isRequired,
  setCurrentManager: PropTypes.func.isRequired,
  openEditModal: PropTypes.func.isRequired,
};

function DataTable() {
  const api = useApi();
  const [itemCount, setItemCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentManager, setCurrentManager] = useState({});
  const [isEditModalOpen, openEditModal, closeEditModal] = useModal();
  const [isCreateModalOpen, openCreateModal, closeCreateModal] = useModal();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api
      .get("/admins?page=" + currentPage + "&itemsPerPage=" + rowsPerPage)
      .then((response) => {
        setRows(response.data.content);
        setItemCount(response.data.totalElements);
      });
  }, [currentPage, rowsPerPage]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <DataTableHeader />
          </TableHead>
          <TableBody>
            <DataTableBody
              rows={rows}
              setCurrentManager={setCurrentManager}
              openEditModal={openEditModal}
            />
          </TableBody>
          <TableFooter>
            <tr>
              <TablePagination
                component="td"
                count={itemCount}
                page={currentPage}
                onChangePage={(e, page) => setCurrentPage(page)}
                rowsPerPage={rowsPerPage}
                onChangeRowsPerPage={({ target: { value } }) =>
                  setRowsPerPage(parseInt(value))
                }
              />
            </tr>
          </TableFooter>
        </Table>
      </TableContainer>
      <Button
        onClick={openCreateModal}
        style={{ marginLeft: "1em" }}
        type="button"
        variant="contained"
        color="primary"
        size="large"
      >
        Registre um novo administrador
      </Button>
      <EditManager
        manager={currentManager}
        isOpen={isEditModalOpen}
        hide={closeEditModal}
        setRows={setRows}
        setItemCount={setItemCount}
      />
      <CreateManager
        isOpen={isCreateModalOpen}
        hide={closeCreateModal}
        setRows={setRows}
        setItemCount={setItemCount}
      />
    </>
  );
}

function EditManager({ manager, isOpen, hide, setRows, setItemCount }) {
  const api = useApi();
  const classes = useStyles();
  const history = useHistory();

  function toggleManagerDisabledState() {
    hide();
    return api.put("admins/toggle/" + manager.id, {}).then(() => {
      return api.get("admins").then((response) => {
        setRows(response.data.content);
        setItemCount(response.data.totalElements);
      });
    });
  }

  return (
    isOpen && (
      <Dialog open={isOpen} onClose={hide}>
        <DialogTitle>{"Editar o administrador : " + manager.name}</DialogTitle>
        <DialogContent>
          {AuthenticationService.getCurrentUser().id === manager.id ? (
            <>
              <Typography style={{ fontStyle: "italic" }}>
                Você não pode desativar sua conta
              </Typography>
              <br />
            </>
          ) : (
            ""
          )}
          <Formik onSubmit={toggleManagerDisabledState} initialValues={{}}>
            {({ isSubmitting }) => (
              <Form>
                Status : {manager.disabled ? "Inativo" : "Ativo"}&emsp;
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={
                    AuthenticationService.getCurrentUser().id === manager.id ||
                    isSubmitting
                  }
                >
                  {manager.disabled ? "Ativar" : "Desativar"}
                  {isSubmitting && <CircularProgress size={18} />}
                </Button>
              </Form>
            )}
          </Formik>
          <br />
          Mudar senha :
          <Formik
            onSubmit={async (values) => {
              const dto = { ...values };
              dto.username = manager.email;
              delete dto.newConfirm;
              api.put("admins/password", dto).then(() => {
                hide();
                if (manager.id === AuthenticationService.getCurrentUser().id) {
                  AuthenticationService.logout();
                  history.push("/");
                }
              });
            }}
            validationSchema={yup.object().shape({
              oldPassword: yup.string().trim().required(requiredFieldMsg),
              newPassword: yup
                .string()
                .trim()
                .min(8, tooShortError)
                .required(requiredFieldMsg),
              newConfirm: yup
                .string()
                .oneOf(
                  [yup.ref("newPassword"), null],
                  "As senhas devem ser idênticas"
                )
                .required(requiredFieldMsg),
            })}
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={{
              oldPassword: "",
              newPassword: "",
              newConfirm: "",
            }}
          >
            {({ isSubmitting }) => (
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Field
                      component={TextField}
                      name="oldPassword"
                      id="oldPassword"
                      variant="outlined"
                      label="Senha atual"
                      type={"password"}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      component={TextField}
                      name="newPassword"
                      id="newPassword"
                      variant="outlined"
                      label="Nova senha"
                      type={"password"}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      component={TextField}
                      name="newConfirm"
                      id="newConfirm"
                      variant="outlined"
                      label="Confirmação de senha"
                      type={"password"}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <br />
                {isSubmitting && <LinearProgress />}
                <Button
                  type={"submit"}
                  fullWidth
                  variant="contained"
                  color="primary"
                  size={"large"}
                  className={classes.submit}
                  disabled={isSubmitting}
                >
                  Mudar senha
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button onClick={hide} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    )
  );
}

function CreateManager({ isOpen, hide, setRows, setItemCount }) {
  const api = useApi();
  const classes = useStyles();

  return (
    isOpen && (
      <Dialog open={isOpen} onClose={hide}>
        <DialogTitle>{"Criar um novo administrador"}</DialogTitle>
        <DialogContent>
          <Formik
            onSubmit={async (values) =>
              api.post("admins", values).then(() => {
                hide();
                return api.get("admins").then((response) => {
                  setRows(response.data.content);
                  setItemCount(response.data.totalElements);
                });
              })
            }
            validationSchema={yup.object().shape({
              name: yup.string().trim().required(requiredFieldMsg),
              email: yup
                .string()
                .trim()
                .email("O endereço de e-mail é inválido")
                .required(requiredFieldMsg),
              password: yup
                .string()
                .trim()
                .min(8, tooShortError)
                .required(requiredFieldMsg),
              confirm: yup
                .string()
                .oneOf(
                  [yup.ref("password"), null],
                  "As senhas devem ser idênticas"
                )
                .required(requiredFieldMsg),
            })}
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirm: "",
            }}
          >
            {({ isSubmitting }) => (
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="name"
                      id="name"
                      variant="outlined"
                      label="Nome completo"
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      name="email"
                      id="email"
                      variant="outlined"
                      label="E-mail"
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      component={TextField}
                      name="password"
                      id="password"
                      variant="outlined"
                      label="Nova senha"
                      type={"password"}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      component={TextField}
                      name="confirm"
                      id="confirm"
                      variant="outlined"
                      label="Confirmação"
                      type={"password"}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <br />
                {isSubmitting && <LinearProgress />}
                <Button
                  type={"submit"}
                  fullWidth
                  variant="contained"
                  color="primary"
                  size={"large"}
                  className={classes.submit}
                  disabled={isSubmitting}
                >
                  Cadastrar novo administrador
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button onClick={hide} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    )
  );
}

EditManager.propTypes = {
  manager: PropTypes.object.isRequired,
  isOpen: PropTypes.any.isRequired,
  hide: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
  setItemCount: PropTypes.func.isRequired,
};

CreateManager.propTypes = {
  isOpen: PropTypes.any.isRequired,
  hide: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
  setItemCount: PropTypes.func.isRequired,
};

export default function Managers() {
  const classes = useStyles();

  return (
    <div className={classes.main} style={{ overflowY: "auto" }}>
      <Typography variant={"h5"} display={"block"} style={{ marginTop: 10 }}>
        &ensp;Administrador da coordenação
      </Typography>
      <DataTable />
    </div>
  );
}
