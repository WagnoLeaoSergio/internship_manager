import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgAvatar } from '../utils/mockImages';

// ----------------------------------------------------------------------

const supervisores = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  name: faker.name.title(),
  descricao: faker.lorem.sentence()
}));

export default supervisores;
