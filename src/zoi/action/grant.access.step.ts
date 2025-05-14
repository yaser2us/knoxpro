// grant-access.step.ts
export class GrantAccessStep {
    static async execute(config: any, run: any, document: any) {
        const to = resolveTarget(config.to, document);
        const permissions = config.permissions;

        console.log(`[Zoi] Granting ${permissions.join(', ')} to ${to} for doc ${document.id}`);
        return { shouldPause: false };
    }
}

function resolveTarget(expr: string, document: any): string {
    if (expr === 'trainer') return document.metadata?.trainer_id;
    if (expr.startsWith('document.')) {
        const path = expr.replace('document.', '').split('.');
        return path.reduce((acc, key) => acc?.[key], document);
    }
    return expr;
}