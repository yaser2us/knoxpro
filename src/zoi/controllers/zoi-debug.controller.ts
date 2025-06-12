// src/zoi/controllers/zoi-debug.controller.ts
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ZoiWorkflowTriggerService } from '../services/zoi-workflow-trigger.service';
import { EventBus } from '../events/event-bus';
import { EventBusTestUtils } from '../events/event-bus.testing';

@Controller('zoi/debug')
export class ZoiDebugController {
    constructor(
        private readonly triggerService: ZoiWorkflowTriggerService
    ) {}

    @Get('test-event-flow')
    async testEventFlow() {
        await this.triggerService.testDocumentEventFlow();
        return { message: 'Test event flow initiated. Check logs for details.' };
    }

    @Post('emit-document-event')
    async emitDocumentEvent(@Body() eventData: any) {
        // Create a properly structured document event
        const documentEvent = {
            id: `debug_${Date.now()}`,
            type: eventData.type || 'document.contract.created',
            timestamp: new Date().toISOString(),
            source: 'debug-controller',
            payload: {
                document: {
                    id: eventData.document?.id || `doc_${Date.now()}`,
                    type: eventData.document?.type || 'contract',
                    title: eventData.document?.title || 'Debug Document',
                    status: eventData.document?.status || 'draft',
                    ...eventData.document
                },
                user: {
                    id: eventData.user?.id || 'debug-user',
                    name: eventData.user?.name || 'Debug User',
                    ...eventData.user
                },
                method: eventData.method || 'POST',
                metadata: {
                    source: 'debug-controller',
                    ...eventData.metadata
                }
            }
        };

        console.log('🚀 Emitting debug document event:', JSON.stringify(documentEvent, null, 2));
        EventBus.emit('document.lifecycle', documentEvent);
        
        return { 
            message: 'Document event emitted',
            event: documentEvent
        };
    }

    @Get('analyze-event-structure/:eventType')
    async analyzeEventStructure(@Param('eventType') eventType: string) {
        // Create sample events to analyze
        const sampleEvents = {
            'json-api': {
                type: eventType,
                payload: {
                    document: {
                        id: 'doc-123',
                        type: 'contract',
                        title: 'Sample Document'
                    },
                    user: { id: 'user-456' }
                }
            },
            'missing-document': {
                type: eventType,
                payload: {
                    user: { id: 'user-456' }
                    // document missing
                }
            },
            'missing-document-id': {
                type: eventType,
                payload: {
                    document: {
                        // id missing
                        type: 'contract',
                        title: 'Sample Document'
                    },
                    user: { id: 'user-456' }
                }
            }
        };

        const results = {};
        
        for (const [scenario, event] of Object.entries(sampleEvents)) {
            console.log(`\n🔍 Testing scenario: ${scenario}`);
            await this.triggerService.debugEventStructure(event);
            results[scenario] = 'completed - check logs';
        }

        return {
            message: 'Event structure analysis completed',
            scenarios: results
        };
    }

    @Get('capture-events')
    async startCapturingEvents() {
        EventBusTestUtils.startCapturing();
        return { message: 'Started capturing events. Use /stop-capture to view results.' };
    }

    @Get('stop-capture')
    async stopCapturingEvents() {
        const capturedEvents = EventBusTestUtils.stopCapturing();
        return {
            message: 'Stopped capturing events',
            eventCount: capturedEvents.length,
            events: capturedEvents.map(e => ({
                type: e.type,
                timestamp: e.timestamp,
                documentId: e.payload?.document?.id,
                source: e.source
            }))
        };
    }

    @Get('workflow-stats')
    async getWorkflowStats() {
        const stats = await this.triggerService.getExecutionStats();
        return {
            message: 'Workflow execution statistics',
            stats
        };
    }

    @Post('test-trigger-conditions/:templateId')
    async testTriggerConditions(
        @Param('templateId') templateId: string,
        @Body() testData: {
            document: any;
            user?: any;
            eventType?: string;
        }
    ) {
        const result = await this.triggerService.testTriggerConditions(
            templateId,
            testData.document,
            testData.user,
            testData.eventType || 'document.test.created'
        );

        return {
            message: 'Trigger condition test completed',
            templateId,
            result
        };
    }

    @Post('refresh-cache')
    async refreshTriggerCache() {
        await this.triggerService.refreshTriggerCache();
        return { message: 'Trigger cache refreshed' };
    }

    @Get('simulate-interceptor/:method')
    async simulateInterceptor(
        @Param('method') method: string,
        @Query('responseFormat') responseFormat: string = 'json-api'
    ) {
        const sampleResponses = {
            'json-api': {
                data: {
                    id: 'doc-123',
                    type: 'document',
                    attributes: {
                        title: 'Sample Contract',
                        status: 'draft',
                        type: 'contract'
                    }
                }
            },
            'direct': {
                data: {
                    id: 'doc-456',
                    title: 'Direct Document',
                    status: 'pending',
                    type: 'invoice'
                }
            },
            'response-is-document': {
                id: 'doc-789',
                title: 'Response Document',
                status: 'active',
                type: 'contract'
            },
            'missing-id': {
                data: {
                    title: 'No ID Document',
                    status: 'draft'
                }
            }
        };

        const response = sampleResponses[responseFormat] || sampleResponses['json-api'];
        
        console.log(`🎭 Simulating ${method} interceptor with ${responseFormat} format`);
        console.log(`📄 Sample response:`, JSON.stringify(response, null, 2));

        // Simulate what the interceptor would do
        const mockRequest = {
            method: method.toUpperCase(),
            url: '/api/documents',
            body: { data: { type: 'contract' } },
            user: { id: 'test-user' },
            headers: { 'user-agent': 'test-agent' },
            ip: '127.0.0.1',
            originalUrl: '/api/documents'
        };

        // You would call your document extraction logic here
        // const extractedData = DocumentDataExtractor.extract(response, mockRequest);

        return {
            message: 'Interceptor simulation completed',
            mockRequest,
            mockResponse: response,
            // extractedData,
            nextStep: 'Check logs for event emission details'
        };
    }

    @Get('health-check')
    async healthCheck() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            eventBusListeners: 'Check logs for details',
            triggerCacheSize: (await this.triggerService.getExecutionStats()).cacheSize
        };
    }
}