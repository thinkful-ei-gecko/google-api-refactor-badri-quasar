const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../app');

describe('App', () => {
  it('should return status 400 if sort is not app or rating', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'SOMETHING_ELSE' })
      .expect(400, 'Sort must be one of app or rating')
  });

  it('should return status 400 if genre is not Action, Puzzle, Strategy, Casual, Arcade, Card', () => {
    return supertest(app)
      .get('/apps')
      .query({ genre: 'SOMETHING_ELSE' })
      .expect(400, 'Genre must be Action, Puzzle, Strategy, Casual, Arcade, Card')
  });

  ['App', 'Rating'].forEach(sort => {
    it(`should sort the apps by ${sort}`, () => {
      return supertest(app)
        .get('/apps')
        .query({ sort: sort.toLowerCase() })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('array');

          let i = 0;
          let sorted = true;
          while (i < res.body.length - 1) {
            if (res.body[i + 1][sort] < res.body[i][sort]) {
              sorted = false;
              break;
            }
            i++;
          }
          expect(sorted).to.be.true;
        });
    });
  });

  it('should only contain Action genre apps if filtering by Action', () => {
    return supertest(app)
      .get('/apps')
      .query({ genre: 'Action' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        let filtered = true;
        res.body.forEach(app => {
          !app.Genres.includes('Action') ? filtered = false : '';
        });

        expect(filtered).to.be.true;
      });
  });

  it('should return an array of apps', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
      });
  });

});