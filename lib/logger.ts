type LogMessageType 
    = 'log' 
    | 'error'
    | 'warn'
    ;

export default function createLogger(type : LogMessageType, fileTag : string) {
    return (tag : string, ...message: any[]) => {
        console[type](`[${fileTag}::${tag}::${type}]`, ...message);
    };
}


export type LoggerType = typeof createLogger;