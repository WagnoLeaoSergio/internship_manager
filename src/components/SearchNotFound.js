import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@material-ui/core';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Não encontrado
      </Typography>
      <Typography variant="body2" align="center">
        Nenhum resultado para &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Verifique se não houve erro de digitação ou
        tente usar palavras completas.
      </Typography>
    </Paper>
  );
}
