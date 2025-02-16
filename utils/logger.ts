import fs from 'fs'
import path from 'path'
import env from '../config/env'

const logFilePath = path.join(__dirname, '../logs/server.log')

// Only check/create the directory if env.LOG is true
if (env.LOG && !fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), {
        recursive: true,
    })
}

// Write log messages to a file and console if env.LOG is true
export const logger = {
    info: (message: string) => {
        if (env.LOG) {
            const logMessage = `[INFO] [${new Date().toISOString()}]: ${message}`
            console.log(logMessage)
            fs.appendFileSync(logFilePath, `${logMessage}\n`)
        }
    },
    error: (message: string) => {
        if (env.LOG) {
            const logMessage = `[ERROR] [${new Date().toISOString()}]: ${message}`
            console.error(logMessage)
            fs.appendFileSync(logFilePath, `${logMessage}\n`)
        }
    },
    warn: (message: string) => {
        if (env.LOG) {
            const logMessage = `[WARN] [${new Date().toISOString()}]: ${message}`
            console.warn(logMessage)
            fs.appendFileSync(logFilePath, `${logMessage}\n`)
        }
    },
}
