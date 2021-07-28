import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgAvatar } from '../utils/mockImages';

// ----------------------------------------------------------------------

const supervisores = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: mockImgAvatar(index + 1),
  name: faker.name.findName(),
  instituicao: faker.company.companyName(),
  documento: faker.datatype.number({ max: 9999999999, min: 1000000000 }),
  telefone: faker.phone.phoneNumber()
}));

export default supervisores;
