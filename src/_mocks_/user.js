import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgAvatar } from '../utils/mockImages';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: mockImgAvatar(index + 1),
  name: faker.name.findName(),
  matricula: `${faker.date.past(5).getFullYear()}
    ${faker.datatype.number({ min: 10000, max: 100000 })}
    ${faker.random.alpha({ upcase: true })}`,
  inicio: faker.date.past(5).getFullYear(),
  supervisor: faker.name.findName(),
  documento: faker.datatype.boolean(),
  avaliacao: faker.datatype.boolean()
}));

export default users;
