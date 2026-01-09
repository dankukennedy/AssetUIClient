type LogMetadata =
    | string
    | string[]
    | Record<string, string>
    | Record<string, string[]>;

export interface ISystemLogs {
    event: string;
    message: string;
    level: string;
    userId: string;
    ipAddress: string;
    metadata?: LogMetadata; 
    createdAt: string;
}