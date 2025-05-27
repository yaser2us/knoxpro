import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

export const winstonConfig: winston.LoggerOptions = {
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
        }),
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                // winston.format.colorize(),
                winston.format.printf(({ level, message, timestamp, context, ...meta }) => {
                    return `${timestamp} [${context}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
                }),
                nestWinstonModuleUtilities.format.nestLike('Zoi', {
                    colors: true,
                    prettyPrint: true,
                    processId: true,
                    appName: true,
                }),
            ),
        }),
    ],
};
