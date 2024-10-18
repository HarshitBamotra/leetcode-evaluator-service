import winston from "winston";

const allowedTransports = [];

allowedTransports.push(
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),

            winston.format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss",
            }),
            winston.format.printf(
                (log) => `${log.timestamp} [${log.level}]: ${log.message}`
            )
        ),
    })
);

allowedTransports.push(
    new winston.transports.File({
        filename: `logs/app.log`,
    })
);

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.splat(),
        winston.format.printf((log) => {
            if (typeof log.message === "object") {
                log.message = JSON.stringify(log.message, null, 3);
            }
            return `${log.timestamp} [${log.level}]: ${log.message}`;
        })
    ),
    transports: allowedTransports,
});

export default logger;
