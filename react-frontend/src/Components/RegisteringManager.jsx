import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import RegisterEmployer from "./RegisterEmployer";
import RegisterStudent from "./RegisterStudent";
import useStyles from "./Utils/Style/useStyles";
import TabPanel from "./Utils/TabPanel";

export default function RegisteringManager() {
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = React.useState(0);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12} md={6} xl={3}>
        <Container component="main" maxWidth="sm" className={classes.container}>
          <div className={classes.paper}>
            <Typography variant="h1" className={classes.logo}>
              Gerenciador de Estágio
            </Typography>
            <Typography variant="h2" className={classes.subtitle}>
              Plataforma de Gestão de Estágio da Universidade Federal de Juiz de
              Fora
            </Typography>
            <Typography component="h1" variant="h5">
              Cadastro
            </Typography>
          </div>
          <AppBar position={"relative"}>
            <Tabs
              value={value}
              onChange={(event, newValue) => setValue(newValue)}
              centered
            >
              <Tab label="Aluno" id={`simple-tab-0`} />
              <Tab label="Empregador" id={`simple-tab-1`} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <RegisterStudent classes={classes} history={history} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <RegisterEmployer classes={classes} history={history} />
          </TabPanel>
          <Grid container justify="flex-end" className={classes.link}>
            <Grid item>
              <Link component={RouterLink} to={"/"} variant="body2">
                já possui uma conta? Entrar
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
}
