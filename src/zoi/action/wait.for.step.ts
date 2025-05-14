// wait-for.step.ts
export class WaitForStep {
    static async execute(config: any, run: any, document: any) {
        return {
            shouldPause: true,
            updatedContext: {
                ...run.context,
                waitFor: {
                    action: config.action,
                    by: config.by,
                    timeoutAt: calculateTimeout(config.timeoutDays)
                }
            }
        };
    }
}

function calculateTimeout(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
}
