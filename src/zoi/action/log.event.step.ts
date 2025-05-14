// log-event.step.ts
export class LogEventStep {
    static async execute(config: any, run: any, document: any) {
        console.log(`[Zoi] LogEvent: ${config.message}`);
        return { shouldPause: false };
    }
}