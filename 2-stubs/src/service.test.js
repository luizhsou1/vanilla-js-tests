const sinon = require('sinon')
const { deepStrictEqual } = require('assert')

const Service = require('./service');

const URL_1 = 'https://swapi.dev/api/planets/1/'
const URL_2 = 'https://swapi.dev/api/planets/2/'

const mocks = {
    tatooine: require('../mocks/tatooine.json'),
    alderaan: require('../mocks/alderaan.json')
}

;(async () => {
    // {
    //     // vai para internet
    //     const service = new Service()
    //     const withoutStub = await service.makeRequest(URL_2)
    //     console.log(JSON.stringify(withoutStub))
    // }
    const service = new Service()
    const stub = sinon.stub(service, service.makeRequest.name)

    stub.withArgs(URL_1).resolves(mocks.tatooine)
    stub.withArgs(URL_2).resolves(mocks.alderaan)

    {
        const expected = {
            'name': 'Tatooine',
            surfaceWater: '1',
            appearedIn: 5
        }
        const results = await service.getPlanets(URL_1)
        deepStrictEqual(results, expected)
    }
    {
        const expected = {
            'name': 'Alderaan',
            surfaceWater: '40',
            appearedIn: 2
        }
        const results = await service.getPlanets(URL_2)
        deepStrictEqual(results, expected)
    }
})()