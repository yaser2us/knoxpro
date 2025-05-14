// send-email.step.ts
export class SendEmailStep {
    static async execute(config: any, run: any, document: any) {
        console.log(`[Zoi] Sending email to ${config.to} with template: ${config.template}`);
        return { shouldPause: false };
    }
}
