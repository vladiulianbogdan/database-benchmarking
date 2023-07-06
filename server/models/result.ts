import { connection } from "mongoose"

export type Result = {
    success: boolean;
    metrics?: Metrics;
    error?: string;
}

export type Metrics = {
    queryTime: number,
    connectionTime: number,
}