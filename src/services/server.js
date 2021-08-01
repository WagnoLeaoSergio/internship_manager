import { createServer, Model } from 'miragejs';
import users from '../_mocks_/user';
import supervisores from '../_mocks_/supervisores';
import relatorios from '../_mocks_/relatorios';

export default function mockServer() {
  createServer({
    models: {
      user: Model,
      supervisor: Model,
      relatorios: Model
    },
    seeds(server) {
      server.db.loadData({
        users,
        supervisores,
        relatorios
      });
    },
    routes() {
      this.namespace = 'mirage';

      this.get('/users', (schema, request) => {
        const { queryParams } = request;
        return schema.users.where(queryParams);
      });

      this.post('/users', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);

        return schema.users.create(attrs);
      });

      this.put('/users/:id', (schema, request) => {
        const newAttrs = JSON.parse(request.requestBody);
        const { id } = request.params;
        const user = schema.users.find(id);

        return user.update(newAttrs);
      });

      this.delete('/users/:id', (schema, request) => {
        const { id } = request.params;

        return schema.users.find(id).destroy();
      });

      this.get('/supervisores', (schema, request) => {
        const { queryParams } = request;
        return schema.supervisores.where(queryParams);
      });

      this.post('/supervisores', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);

        return schema.supervisores.create(attrs);
      });

      this.put('/supervisores/:id', (schema, request) => {
        const newAttrs = JSON.parse(request.requestBody);
        const { id } = request.params;
        const supervisor = schema.supervisores.find(id);

        return supervisor.update(newAttrs);
      });

      this.delete('/supervisores/:id', (schema, request) => {
        const { id } = request.params;

        return schema.supervisores.find(id).destroy();
      });

      this.get('/relatorios', (schema, request) => {
        const { queryParams } = request;
        return schema.relatorios.where(queryParams);
      });

      this.post('/relatorios', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);

        return schema.relatorios.create(attrs);
      });

      this.put('/relatorios/:id', (schema, request) => {
        const newAttrs = JSON.parse(request.requestBody);
        const { id } = request.params;
        const relatorio = schema.relatorios.find(id);

        return relatorio.update(newAttrs);
      });

      this.delete('/relatorios/:id', (schema, request) => {
        const { id } = request.params;

        return schema.relatorios.find(id).destroy();
      });
    }
  });
}
