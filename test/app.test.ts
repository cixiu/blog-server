import * as request from 'supertest';
import app from '../src/app';

describe('GET /random-url', () => {
  test('should return 404', (done) => {
    request(app.callback())
      .get('/reset')
      .expect(404, done);
  });
});
