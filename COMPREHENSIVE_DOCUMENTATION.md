# Knox Pro - Comprehensive Project Documentation

## Project Overview

Knox Pro is a sophisticated enterprise-grade backend application built with NestJS that provides a comprehensive platform for **document workflow management**, **access control**, and **dynamic entity management**. The system is designed as a modern business process automation platform with advanced security features and multi-tenant architecture.

### Key Capabilities
- **Dynamic Document Workflow Engine** - Automated business process orchestration
- **Advanced Access Control System** - Role-based permissions with policy-driven authorization
- **Multi-tenant Architecture** - Support for isolated tenant environments
- **Dynamic Entity Generation** - Runtime creation of entities from JSON schemas
- **JSON:API Compliance** - Standardized API endpoints following JSON:API specification
- **Real-time Event Processing** - Event-driven architecture for workflow automation
- **Document Management** - Complete document lifecycle management with signatures and approvals

## Architecture Overview

Knox Pro follows a **modular microservices-inspired architecture** within a monolithic NestJS application, organized into several core modules:

### Core Modules

#### 1. **Zoi Module** (Document Workflow Engine)
- **Purpose**: Core workflow automation and document processing engine
- **Key Features**:
  - Dynamic entity creation from JSON schemas
  - Workflow orchestration with step-by-step execution
  - Document lifecycle management
  - Template-based workflow definitions
  - Event-driven workflow triggers

#### 2. **Pulse Module** (Access Control System)
- **Purpose**: Advanced access control and authorization management
- **Key Features**:
  - Role-based access control (RBAC)
  - Policy-driven authorization
  - Dynamic permission grants
  - Workspace-based access management
  - Real-time access insights and analytics

#### 3. **Auth Module** (Authentication & Security)
- **Purpose**: User authentication and security services
- **Key Features**:
  - JWT-based authentication
  - RSA encryption for sensitive data
  - Multi-factor authentication support
  - Session management

#### 4. **Users Module** (User Management)
- **Purpose**: User account and profile management
- **Key Features**:
  - User registration and profile management
  - Role assignment and management
  - Tenant association

## Technical Stack

### Core Technologies
- **Framework**: NestJS (Node.js/TypeScript)
- **Database**: PostgreSQL with TypeORM
- **API Standard**: JSON:API specification
- **Authentication**: JWT with RS256 encryption
- **Event System**: Custom event bus with Redis support
- **Documentation**: OpenAPI/Swagger
- **Process Management**: PM2

### Key Dependencies
```json
{
  "@nestjs/core": "^11.1.0",
  "@nestjs/typeorm": "^11.0.0", 
  "@yaser2us/json-api-nestjs": "^10.0.0-beta.10",
  "@casl/ability": "^6.7.3",
  "typeorm": "^0.3.20",
  "pg": "^8.13.3",
  "passport-jwt": "^4.0.1"
}
```

## Database Architecture

### Core Entity Models

#### User Management Entities
- **User**: Core user accounts with tenant association
- **Role**: System and tenant-specific roles  
- **UserRole**: User-role associations with workspace context
- **Permission**: Granular permission definitions
- **Tenant**: Multi-tenant organization management

#### Document & Workflow Entities
- **Document**: Core document entities with metadata
- **DocumentTemplate**: Templates for document types
- **DocumentSignature**: Digital signature tracking
- **DocumentAttachment**: File attachment management
- **WorkflowTemplate**: Workflow definition templates
- **WorkflowRun**: Active workflow execution instances
- **WorkflowLog**: Detailed workflow execution logging

#### Access Control Entities
- **AccessAction**: Individual access grants/denials
- **AccessEvent**: Access control audit trail
- **AccessPolicy**: Policy-based access rules
- **ResourceType**: Definition of resource types
- **ResourceAction**: Available actions on resources
- **RolePermission**: Role-permission mappings

## Key Features Deep Dive

### 1. Dynamic Workflow Engine (Zoi)

The Zoi module provides a sophisticated workflow automation system:

#### Workflow Definition
```json
{
  "name": "Employee Onboarding",
  "version": "1.0",
  "steps": [
    {
      "id": "hr_review",
      "type": "approval",
      "assignee": "hr_manager",
      "timeout": "2d"
    },
    {
      "id": "system_setup", 
      "type": "automation",
      "action": "create_accounts"
    }
  ]
}
```

#### Key Capabilities
- **Template-Based Workflows**: Reusable workflow definitions
- **Step Orchestration**: Sequential and parallel step execution
- **Conditional Logic**: Dynamic routing based on conditions
- **Event Triggers**: Automatic workflow initiation on document events
- **Approval Chains**: Multi-step approval processes
- **Timeout Handling**: Automatic escalation and timeout management

#### Workflow Trigger System
```typescript
// Document events automatically trigger matching workflows
EventBus.on('document.lifecycle', (event) => {
  // Find matching workflow templates
  // Evaluate trigger conditions  
  // Start workflow execution
});
```

### 2. Dynamic Entity Generation

Knox Pro features a sophisticated dynamic entity system that creates TypeORM entities at runtime:

#### Schema-to-Entity Conversion
```typescript
// JSON Schema input
const schema = {
  "type": "employee_review",
  "fields": {
    "employee_id": { "type": "uuid", "required": true },
    "rating": { "type": "number", "min": 1, "max": 5 },
    "comments": { "type": "text" }
  },
  "workflow": {
    "type": "approval_chain",
    "steps": ["manager_review", "hr_approval"]
  }
};

// Automatically generates TypeORM entity and JSON:API endpoints
```

#### Features
- **Runtime Entity Creation**: Entities created from JSON schemas
- **Automatic API Generation**: JSON:API endpoints auto-generated
- **Workflow Integration**: Entities automatically integrated with workflow system
- **Relationship Mapping**: Dynamic relationship creation between entities

### 3. Advanced Access Control (Pulse)

The Pulse module provides enterprise-grade access control:

#### Role-Based Access Control
```typescript
// Dynamic permission evaluation
@UseGuards(JwtAuthGuard, AccessContextGuard)
@ApiTags('Protected Resource')
async getResource(@Req() req: AuthenticatedRequest) {
  // Access automatically validated based on:
  // - User roles
  // - Workspace context  
  // - Resource permissions
  // - Policy rules
}
```

#### Access Policy Engine
- **Policy-Based Authorization**: Complex rules beyond simple RBAC
- **Conditional Access**: Context-aware permission evaluation
- **Temporal Permissions**: Time-based access control
- **Resource-Level Security**: Fine-grained resource protection

### 4. JSON:API Compliance

All API endpoints follow JSON:API specification:

#### Standardized Endpoints
```http
GET /api/document?include=signatures,attachments
POST /api/workflow-template
PATCH /api/user/123
```

#### Features
- **Relationship Loading**: Efficient include/exclude of related data
- **Filtering & Sorting**: Advanced query capabilities
- **Pagination**: Consistent pagination across all endpoints
- **Sparse Fields**: Client-specified field selection

## API Architecture

### Endpoint Categories

#### Core Resource APIs
- `/api/document` - Document management
- `/api/workflow-template` - Workflow template management
- `/api/user` - User management
- `/api/workspace` - Workspace/tenant management

#### Security & Auth APIs
- `/api/auth/login` - User authentication
- `/api/auth/register` - User registration  
- `/api/public-key` - RSA public key retrieval
- `/api/decrypt` - Secure data decryption

#### Access Control APIs
- `/api/pulse/access-insight` - Access analytics
- `/api/pulse/access-grants` - Permission management
- `/api/pulse/simulate-access` - Access simulation

#### Utility APIs
- `/api/upload/{resource}` - File upload handling
- `/api/pipe-test` - System diagnostics

### Security Features

#### Encryption & Data Protection
- **RSA Encryption**: Client-server encrypted communication
- **AES Payload Encryption**: Sensitive data protection
- **JWT Security**: Stateless authentication with RS256
- **Field-Level Encryption**: Sensitive field protection

#### Authentication Flow
```typescript
// 1. Client requests public key
const publicKey = await fetch('/api/public-key');

// 2. Client encrypts sensitive data
const encryptedPayload = encrypt(sensitiveData, publicKey);

// 3. Server decrypts and processes
const decryptedData = await decrypt(encryptedPayload, privateKey);
```

## Event-Driven Architecture

### Event Bus System
Knox Pro uses a sophisticated event system for loose coupling:

#### Event Categories
- **Document Events**: `document.created`, `document.updated`, `document.signed`
- **Workflow Events**: `workflow.started`, `workflow.completed`, `workflow.paused`
- **Access Events**: `access.granted`, `access.denied`, `permission.changed`
- **User Events**: `user.registered`, `user.role.assigned`

#### Event Processing
```typescript
// Event listeners across modules
@Injectable()
export class PulseWorkflowListener implements ModuleEventListener {
  getSubscribedEvents(): string[] {
    return [
      'document.employee_onboarding.*',
      'workflow.pulse.*',
      'document.lifecycle'
    ];
  }

  async handleEvent(event: any): Promise<void> {
    // Process event and trigger appropriate actions
  }
}
```

## Deployment & Configuration

### Environment Setup
```bash
# Development
npm run start:dev

# Production with PM2
npm run pm2:love

# Build
npm run build
```

### Database Configuration
```typescript
// PostgreSQL connection
const config = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.DB_LOGGING === 'true'
};
```

### Security Configuration
Knox Pro requires RSA key pair generation:
```bash
# Generate RSA keys
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private.pem -out public.pem
```

## Development & Testing

### Development Scripts
- `npm run start` - Start application
- `npm run love` - Development with file watching
- `npm run test` - Run unit tests
- `npm run test:e2e` - End-to-end tests
- `npm run lint` - Code linting
- `npm run format` - Code formatting

### Testing Strategy
- **Unit Tests**: Jest-based component testing
- **E2E Tests**: Full application workflow testing
- **API Testing**: JSON:API compliance validation
- **Security Testing**: Access control validation

## Monitoring & Observability

### Logging System
- **Winston Integration**: Structured logging
- **Request Tracking**: Full request lifecycle logging
- **Error Monitoring**: Comprehensive error tracking
- **Performance Metrics**: Response time and throughput monitoring

### Workflow Monitoring
```typescript
// Detailed workflow execution tracking
await this.logWorkflowStep(workflowRunId, stepId, {
  status: 'completed',
  executionTime: Date.now() - startTime,
  result: stepResult,
  metadata: { processor: 'workflow-orchestrator' }
});
```

## Use Cases & Applications

### Document-Centric Workflows
- **Employee Onboarding**: Multi-step approval and system setup
- **Contract Management**: Legal review and signature workflows  
- **Performance Reviews**: Structured evaluation processes
- **Compliance Documentation**: Audit trail and approval chains

### Access Control Scenarios
- **Multi-tenant SaaS**: Isolated tenant data access
- **Enterprise Security**: Complex organizational permission structures
- **Project-based Access**: Dynamic team and resource permissions
- **Compliance Requirements**: Audit-ready access control

### Dynamic Business Processes
- **Custom Document Types**: Runtime entity creation for new business needs
- **Workflow Adaptation**: Dynamic workflow modification without deployment
- **Integration Scenarios**: API-driven external system integration

## Future Roadmap

### Planned Enhancements
- **GraphQL Support**: Alternative to JSON:API
- **Real-time Notifications**: WebSocket-based event streaming
- **Advanced Analytics**: Workflow performance dashboards
- **Plugin Architecture**: Extensible workflow step types
- **Mobile API**: Optimized mobile endpoints
- **Microservices Migration**: Gradual decomposition options

## License & Attribution

**License**: MIT License  
**Author**: Yasser Batoie (@yaser2us)  
**Framework**: Built on NestJS  
**Repository**: knoxpro

This project demonstrates advanced enterprise application architecture with sophisticated workflow automation, dynamic entity management, and comprehensive security features suitable for modern business process automation platforms.