// 🔍 First, let's add debugging to see what's actually being passed
// Update your ZoiDocumentInterceptor to log the full payload:

// src/zoi/zoi-document.interceptor.ts (Updated with debugging)
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { EventBus } from './events/event-bus';

@Injectable()
export class ZoiDocumentInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ZoiDocumentInterceptor.name);

    constructor() {
        // 🎯 No dependencies! Pure event emitter
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const resourceType = request?.body?.data?.type || null;

        return next.handle().pipe(
            tap(async (responseBody) => {
                // 🔍 Debug: Log the complete response structure
                this.logger.debug(`[Zoi] 🔍 Full response body:`, JSON.stringify(responseBody, null, 2));
                this.logger.debug(`[Zoi] 🔍 Resource type from request:`, resourceType);
                this.logger.debug(`[Zoi] 🔍 Method:`, method);

                // 🎯 Handle different response structures
                const documentData = this.extractDocumentData(responseBody, resourceType);
                
                if (!documentData) {
                    this.logger.warn(`[Zoi] ⚠️ Could not extract document data from response`);
                    return;
                }

                const eventType = method === 'POST' ? `document.${documentData.type}.created`
                    : method === 'PATCH' ? `document.${documentData.type}.updated`
                        : null;

                this.logger.debug(`[Zoi] 📡 Event type determined:`, eventType);
                this.logger.debug(`[Zoi] 📄 Document data extracted:`, documentData);

                if (!eventType) {
                    this.logger.debug(`[Zoi] ℹ️ No event type for method ${method}, skipping`);
                    return;
                }

                // 🚀 EMIT EVENT with proper structure
                const documentEvent = {
                    id: this.generateEventId(),
                    type: eventType,
                    timestamp: new Date().toISOString(),
                    source: 'zoi-document-interceptor',
                    payload: {
                        document: documentData,
                        user: request.user || { id: 'system' },
                        method,
                        metadata: {
                            userAgent: request.headers['user-agent'],
                            ip: request.ip,
                            originalUrl: request.originalUrl
                        }
                    }
                };

                this.logger.log(`[Zoi] 🚀 Emitting document.lifecycle event:`, {
                    eventType,
                    documentId: documentData.id,
                    documentType: documentData.type
                });

                // 🎯 Emit the properly structured event
                EventBus.emit('document.lifecycle', documentEvent);
            })
        );
    }

    /**
     * Extract document data from various response formats
     */
    private extractDocumentData(responseBody: any, resourceType?: string): any | null {
        // 🔍 Try different response structures
        
        // Format 1: { data: { id, attributes: {...} } } (JSON:API format)
        if (responseBody?.data?.id && responseBody?.data?.attributes) {
            this.logger.debug(`[Zoi] 📋 Using JSON:API format`);
            return {
                id: responseBody.data.id,
                type: resourceType || responseBody.data.type || 'unknown',
                ...responseBody.data.attributes
            };
        }

        // Format 2: { data: { id, ...otherFields } } (Direct object format)
        if (responseBody?.data?.id) {
            this.logger.debug(`[Zoi] 📋 Using direct object format`);
            return {
                ...responseBody.data,
                type: resourceType || responseBody.data.type || 'unknown'
            };
        }

        // Format 3: { id, ...otherFields } (Response IS the document)
        if (responseBody?.id) {
            this.logger.debug(`[Zoi] 📋 Using response-as-document format`);
            return {
                ...responseBody,
                type: resourceType || responseBody.type || 'unknown'
            };
        }

        // Format 4: Array response - take first item
        if (Array.isArray(responseBody) && responseBody.length > 0 && responseBody[0]?.id) {
            this.logger.debug(`[Zoi] 📋 Using array format (first item)`);
            return {
                ...responseBody[0],
                type: resourceType || responseBody[0].type || 'unknown'
            };
        }

        // Format 5: Nested in result
        if (responseBody?.result?.id) {
            this.logger.debug(`[Zoi] 📋 Using nested result format`);
            return {
                ...responseBody.result,
                type: resourceType || responseBody.result.type || 'unknown'
            };
        }

        this.logger.warn(`[Zoi] ❌ Unknown response format:`, {
            hasData: !!responseBody?.data,
            hasId: !!responseBody?.id,
            hasDataId: !!responseBody?.data?.id,
            hasDataAttributes: !!responseBody?.data?.attributes,
            isArray: Array.isArray(responseBody),
            keys: Object.keys(responseBody || {})
        });

        return null;
    }

    private generateEventId(): string {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

// 🎯 Alternative: More robust document extraction based on common patterns
export class DocumentDataExtractor {
    private static logger = new Logger('DocumentDataExtractor');

    static extract(responseBody: any, request: any): any | null {
        const method = request.method;
        const url = request.url;
        const resourceType = this.extractResourceTypeFromRequest(request);

        this.logger.debug(`[Extract] Processing ${method} ${url} with resource type: ${resourceType}`);

        // Try multiple extraction strategies
        const strategies = [
            () => this.extractJsonApiFormat(responseBody, resourceType),
            () => this.extractDirectFormat(responseBody, resourceType),
            () => this.extractNestedFormat(responseBody, resourceType),
            () => this.extractArrayFormat(responseBody, resourceType),
            () => this.extractFromUrl(responseBody, url, resourceType)
        ];

        for (const strategy of strategies) {
            try {
                const result = strategy();
                if (result?.id) {
                    this.logger.debug(`[Extract] ✅ Successfully extracted:`, result);
                    return result;
                }
            } catch (error) {
                this.logger.debug(`[Extract] Strategy failed:`, error.message);
            }
        }

        this.logger.warn(`[Extract] ❌ All extraction strategies failed for:`, {
            method,
            url,
            bodyKeys: Object.keys(responseBody || {}),
            bodyPreview: JSON.stringify(responseBody)?.slice(0, 200)
        });

        return null;
    }

    private static extractResourceTypeFromRequest(request: any): string {
        // Try multiple sources for resource type
        return (
            request?.body?.data?.type ||           // JSON:API
            request?.body?.type ||                 // Direct body
            request?.params?.type ||               // URL params
            this.extractTypeFromUrl(request.url) || // URL path
            'unknown'
        );
    }

    private static extractTypeFromUrl(url: string): string | null {
        // Extract resource type from URL patterns like:
        // /api/documents -> documents
        // /api/v1/contracts -> contracts
        // /documents/123 -> documents
        const match = url.match(/\/(?:api\/)?(?:v\d+\/)?([a-zA-Z]+)/);
        return match ? match[1] : null;
    }

    private static extractJsonApiFormat(responseBody: any, resourceType: string): any | null {
        if (responseBody?.data?.id && responseBody?.data?.attributes) {
            return {
                id: responseBody.data.id,
                type: resourceType || responseBody.data.type || 'unknown',
                ...responseBody.data.attributes
            };
        }
        return null;
    }

    private static extractDirectFormat(responseBody: any, resourceType: string): any | null {
        if (responseBody?.data?.id) {
            return {
                ...responseBody.data,
                type: resourceType || responseBody.data.type || 'unknown'
            };
        }
        
        if (responseBody?.id) {
            return {
                ...responseBody,
                type: resourceType || responseBody.type || 'unknown'
            };
        }
        
        return null;
    }

    private static extractNestedFormat(responseBody: any, resourceType: string): any | null {
        const nestedPaths = ['result', 'document', 'item', 'entity'];
        
        for (const path of nestedPaths) {
            const nested = responseBody?.[path];
            if (nested?.id) {
                return {
                    ...nested,
                    type: resourceType || nested.type || 'unknown'
                };
            }
        }
        
        return null;
    }

    private static extractArrayFormat(responseBody: any, resourceType: string): any | null {
        if (Array.isArray(responseBody) && responseBody.length > 0 && responseBody[0]?.id) {
            return {
                ...responseBody[0],
                type: resourceType || responseBody[0].type || 'unknown'
            };
        }
        return null;
    }

    private static extractFromUrl(responseBody: any, url: string, resourceType: string): any | null {
        // For cases where ID might be in the URL (like PATCH /documents/123)
        const idMatch = url.match(/\/([0-9a-f-]+)(?:\/|$)/i);
        if (idMatch && responseBody) {
            return {
                id: idMatch[1],
                type: resourceType,
                ...responseBody
            };
        }
        return null;
    }
}

// 🎯 Updated ZoiDocumentInterceptor using the robust extractor
@Injectable()
export class ZoiDocumentInterceptorRobust implements NestInterceptor {
    private readonly logger = new Logger('ZoiDocumentInterceptor');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const eventType = method === 'POST' ? 'document.created' : method === 'PATCH' ? 'document.updated' : null;

        const resourceType = request?.body?.data?.type || null;

        return next.handle().pipe(
            tap(async (responseBody) => {
                try {
                    // 🎯 Use robust document extraction
                    // const documentData = DocumentDataExtractor.extract(responseBody, request);
                    
                    // const method = request.method;


                    const payload = responseBody?.data;
                    if (!payload || !payload.id || !payload.attributes) return;
    
                    const documentData = {
                        id: payload.id,
                        ...payload.attributes,
                        type: resourceType
                    };

                    if (!documentData) {
                        this.logger.warn(`[Zoi] ⚠️ Could not extract document data from ${request.method} ${request.url}`);
                        return;
                    }

                    const method = request.method;
                    const eventType = method === 'POST' ? `document.${documentData.type}.created`
                        : method === 'PATCH' ? `document.${documentData.type}.updated`
                        : method === 'PUT' ? `document.${documentData.type}.updated`
                        : null;

                    if (!eventType) return;

                    // 🚀 Emit properly structured event
                    const documentEvent = {
                        id: this.generateEventId(),
                        type: eventType,
                        timestamp: new Date().toISOString(),
                        source: 'zoi-document-interceptor',
                        payload: {
                            document: documentData,
                            user: request.user || { id: 'system' },
                            method,
                            metadata: {
                                userAgent: request.headers['user-agent'],
                                ip: request.ip,
                                originalUrl: request.originalUrl
                            }
                        }
                    };

                    this.logger.log(`[Zoi] 🚀 Emitting document.lifecycle event for ${documentData.type}:${documentData.id}`);
                    EventBus.emit('document.lifecycle', documentEvent);

                } catch (error) {
                    this.logger.error(`[Zoi] ❌ Error in interceptor:`, error);
                }
            })
        );
    }

    private generateEventId(): string {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

// 🧪 Test the extraction logic
export class InterceptorTester {
    static testExtraction() {
        const testCases = [
            // JSON:API format
            {
                name: 'JSON:API format',
                response: {
                    data: {
                        id: 'doc-123',
                        type: 'document',
                        attributes: {
                            title: 'Test Document',
                            status: 'draft'
                        }
                    }
                },
                request: { method: 'POST', url: '/api/documents', body: { data: { type: 'contract' } } }
            },
            
            // Direct format
            {
                name: 'Direct format',
                response: {
                    data: {
                        id: 'doc-456',
                        title: 'Another Document',
                        type: 'invoice',
                        status: 'pending'
                    }
                },
                request: { method: 'POST', url: '/api/invoices' }
            },
            
            // Response is the document
            {
                name: 'Response as document',
                response: {
                    id: 'doc-789',
                    title: 'Direct Document',
                    status: 'active'
                },
                request: { method: 'PATCH', url: '/documents/doc-789', body: { type: 'contract' } }
            }
        ];

        console.log('🧪 Testing document extraction...\n');

        testCases.forEach(testCase => {
            console.log(`📋 Testing: ${testCase.name}`);
            const result = DocumentDataExtractor.extract(testCase.response, testCase.request);
            console.log(`  ✅ Extracted:`, result);
            console.log(`  🆔 Has ID: ${!!result?.id}`);
            console.log(`  📄 Type: ${result?.type}\n`);
        });
    }
}
// // src/zoi/zoi-document.interceptor.ts
// import {
//     Injectable,
//     NestInterceptor,
//     ExecutionContext,
//     CallHandler
// } from '@nestjs/common';
// import { Observable, tap } from 'rxjs';
// import { EventBus } from './events/event-bus'; // Your event bus implementation

// @Injectable()
// export class ZoiDocumentInterceptor implements NestInterceptor {
//     constructor() {
//         // 🎯 No dependencies! Pure event emitter
//     }

//     intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//         const request = context.switchToHttp().getRequest();
//         const method = request.method;
//         const resourceType = request?.body?.data?.type || null;

//         return next.handle().pipe(
//             tap(async (responseBody) => {
//                 const payload = responseBody?.data;
//                 if (!payload || !payload.id || !payload.attributes) return;

//                 const document = {
//                     id: payload.id,
//                     ...payload.attributes,
//                     type: resourceType
//                 };

//                 const eventType = method === 'POST' ? `document.${document.type}.created`
//                     : method === 'PATCH' ? `document.${document.type}.updated`
//                         : null;

//                 console.log(`[Zoi] 📡 Detected document event:`, eventType, document.id);

//                 if (!eventType) return;

//                 // 🚀 EMIT EVENT instead of direct engine calls
//                 const documentEvent = {
//                     id: this.generateEventId(),
//                     type: eventType,
//                     timestamp: new Date().toISOString(),
//                     source: 'zoi-document-interceptor',
//                     payload: {
//                         document,
//                         method,
//                         user: request.user,
//                         metadata: {
//                             userAgent: request.headers['user-agent'],
//                             ip: request.ip,
//                             originalUrl: request.originalUrl
//                         }
//                     }
//                 };

//                 // 🎯 Pure event emission - zero coupling!
//                 EventBus.emit('document.lifecycle', documentEvent);

//                 console.log(`[Zoi] 🚀 Emitted document.lifecycle event for ${eventType} on document ${document.id}`);
//             })
//         );
//     }

//     private generateEventId(): string {
//         return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//     }
// }