const { readFile } = require('fs/promises')
const { error } = require('./constants')
const User = require('./user')

const DEFAULT_OPTIONS = {
    maxLines: 3,
    fields: ['id', 'name', 'profession', 'age']
}

class File {
    static async csvToJSon(filePath) {
        const content = await File.getFileContent(filePath)

        const validation = File.isValid(content)
        if (!validation.valid) throw new Error(validation.error)

        const users = File.parseCsvToJson(content)

        return users
    }

    static async getFileContent(filePath) {
        return (await readFile(filePath)).toString('utf-8')
    }

    static isValid(csvString, options = DEFAULT_OPTIONS) {
        const [header, ...linesWithoutHeader] = csvString.split('\n')

        const isHeaderValid = header === options.fields.join(',')
        if (!isHeaderValid) {
            return {
                error: error.FILE_FIELDS_ERROR_MESSAGE,
                valid: false
            }
        }

        const isContentLengthAccepeted = (
            linesWithoutHeader.length > 0 &&
            linesWithoutHeader.length <= options.maxLines
        )
        if (!isContentLengthAccepeted) {
            return {
                error: error.FILE_LENGTH_ERROR_MESSAGE,
                valid: false
            }
        }

        return { valid: true }
    }

    static parseCsvToJson(csvString) {
        const lines = csvString.split('\n')
        // remove o primeiro item e joga na variável
        const firstLine = lines.shift()
        const header = firstLine.split(',')
        const users = lines.map(line => {
            const columns = line.split(',')

            let user = {}
            for (const index in columns) {
                user[header[index]] = columns[index]
            }

            return new User(user)
        })

        return users
    }
}

module.exports = File