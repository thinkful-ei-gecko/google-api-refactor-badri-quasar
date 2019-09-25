const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../app');

describe('App', () => {
    it('should return status 400 if sort is not app or rating', () => {
        return supertest(app)
            .get('/apps')
            .query({sort: 'SOMETHING_ELSE'})
            .expect(400, 'Sort must be one of app or rating')
    })

    it('should return status 400 if genre is not Action, Puzzle, Strategy, Casual, Arcade, Card', () => {
        return supertest(app)
            .get('/apps')
            .query({genre: 'SOMETHING_ELSE'})
            .expect(400, 'Genre must be Action, Puzzle, Strategy, Casual, Arcade, Card')
    })

    it('should sort the apps in alphabetical order when sort is app', () => {
        return supertest(app)
            .get('/apps')
            .query({sort: 'app'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then( res => {
                expect(res.body).to.be.an('array');
                let i = 0;
                let sorted = true;
                while (i<res.body.length -1) {
                    if (res.body[i+1].App < res.body[i].App ) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            })
    })
})