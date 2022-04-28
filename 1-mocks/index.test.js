const { error } = require('./src/constants')
const File = require('./src/file')
const { rejects, deepStrictEqual } = require('assert')

    ;
(async () => {
    {
        const filePath = './mocks/invalid-empty-file.csv'
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
        const result = File.csvToJSon(filePath)
        await rejects(result, rejection)
    }
    {
        const filePath = './mocks/invalid-four-items.csv'
        const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
        const result = File.csvToJSon(filePath)
        await rejects(result, rejection)
    }
    {
        /*
        UPDATE: 22/03/2022
        Se estiver executando esse código após o ano de 2022. 
        O calculo para saber o ano de nascimento da pessoa vai ser diferente do esperado.
        
        Nos próximos exemplos resolveremos este problema usando fakeTimers. 
        Mas por agora, adicionei o código abaixo para mockar o Date.
        */
        Date.prototype.getFullYear = () => 2022
        const filePath = './mocks/valid-three-items.csv'
        const result = await File.csvToJSon(filePath)
        const expected = [
            {
                "id": 123,
                "name": "Luiz Henrique",
                "profession": "Software Engineer",
                "birthYear": 1997
            },
            {
                "id": 321,
                "name": "Jean Lineker",
                "profession": "Electrical Engineer",
                "birthYear": 1996
            },
            {
                "id": 231,
                "name": "Cáliton Gonçalves",
                "profession": "Software Engineer",
                "birthYear": 1996
            }
        ]
        deepStrictEqual(JSON.stringify(result), JSON.stringify(expected))
    }
})()