import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgAvatar } from '../utils/mockImages';

// ----------------------------------------------------------------------

const relatorios = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  name: faker.name.title(),
  descricao: faker.lorem.sentence(),
  dataEntrega: faker.date.past(5).getFullYear(),
  dataEnvio: faker.date.future(5).getFullYear()
}));

export default relatorios;
