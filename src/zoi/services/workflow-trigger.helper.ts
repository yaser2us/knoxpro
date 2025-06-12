// src/shared/interfaces/event-listener.interface.ts
export interface ModuleEventListener {
    moduleName: string;
    initialize(): Promise<void>;
    handleEvent(event: any): Promise<void>;
    getSubscribedEvents(): string[];
}