// src/zoi/services/GenericWorkflowService.ts
import { Injectable } from '@nestjs/common';
import { Repository, IsNull, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentSignature } from '../../zoi/entity/document.signatures.entity';
import { User } from '../../pulse/entity';

export interface WorkflowStep {
  name: string;
  required_signatures?: number;
  roles?: string[];
}

export interface WorkflowStatus {
  current_step: string;
  required: number;
  completed: number;
  status: 'pending' | 'completed' | 'blocked';
  next_step?: string;
}

@Injectable()
export class ZoiWorkflowService {
  constructor(
    @InjectRepository(DocumentSignature)
    private readonly signatureRepo: Repository<DocumentSignature>,
    
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  /**
   * 🎯 Get workflow status for ANY resource type
   */
  async getWorkflowStatus(
    resourceType: string,
    resourceId: string,
    workflowSteps: WorkflowStep[]
  ): Promise<WorkflowStatus> {
    console.log(`[generic-workflow] Checking status for ${resourceType}:${resourceId}`);
    
    for (const step of workflowSteps) {
      const signatures = await this.signatureRepo.count({
        where: {
          resource_type: resourceType,
          resource_id: resourceId,
          workflow_step: step.name,
          signed_at_nullable: Not(IsNull())
        }
      });

      const required = step.required_signatures || 0;
      
      console.log(`[generic-workflow] Step ${step.name}: ${signatures}/${required} signatures`);
      
      if (signatures < required) {
        return {
          current_step: step.name,
          required,
          completed: signatures,
          status: 'pending'
        };
      }
    }

    return { 
      current_step: 'completed',
      required: 0,
      completed: 0,
      status: 'completed' 
    };
  }

  /**
   * 🎯 Check if workflow is complete
   */
  async isWorkflowComplete(
    resourceType: string,
    resourceId: string,
    workflowSteps: WorkflowStep[]
  ): Promise<boolean> {
    const status = await this.getWorkflowStatus(resourceType, resourceId, workflowSteps);
    return status.status === 'completed';
  }

  /**
   * 🎯 Add signature for ANY resource type
   */
  async addSignature(
    resourceType: string,
    resourceId: string,
    signatureData: {
      user_id: string;
      workflow_step: string;
      role: string;
      signature_data?: string;
      notes?: string;
    }
  ): Promise<DocumentSignature> {
    console.log(`[generic-workflow] Adding signature for ${resourceType}:${resourceId}, step: ${signatureData.workflow_step}`);
    
    const signature = this.signatureRepo.create({
      resource_type: resourceType,
      resource_id: resourceId,
      workflow_step: signatureData.workflow_step,
      role: signatureData.role,
      action: signatureData.workflow_step, // Keep for backward compatibility
      signature: signatureData.signature_data,
      notes: signatureData.notes,
      signed_at_nullable: new Date(),
      signedAt: new Date(), // Keep for backward compatibility
      user_id: signatureData.user_id,
      
      // Backward compatibility for documents
      document_id: resourceType === 'documents' ? resourceId : null
    });

    const saved = await this.signatureRepo.save(signature);
    console.log(`[generic-workflow] ✅ Signature saved with ID: ${saved.id}`);
    
    return saved;
  }

  /**
   * 🎯 Get pending signatures for user across ALL resource types
   */
  async getPendingSignatures(
    userId: string,
    resourceType?: string
  ): Promise<DocumentSignature[]> {
    const whereClause: any = {
      user_id: userId,
      signed_at_nullable: IsNull()
    };
    
    if (resourceType) {
      whereClause.resource_type = resourceType;
    }
    
    console.log(`[generic-workflow] Getting pending signatures for user ${userId}, type: ${resourceType || 'all'}`);
    
    return await this.signatureRepo.find({
      where: whereClause,
      relations: ['user']
    });
  }

  /**
   * 🎯 Get workflow statistics for any resource type
   */
  async getWorkflowStats(
    resourceType: string,
    workspaceId?: string
  ): Promise<{
    total: number;
    pending: number;
    completed: number;
    by_step: Record<string, number>;
  }> {
    console.log(`[generic-workflow] Getting stats for ${resourceType}`);
    
    const allSignatures = await this.signatureRepo.find({
      where: { resource_type: resourceType }
    });
    
    // Group by resource_id to get unique resources
    const resourceIds = [...new Set(allSignatures.map(s => s.resource_id))];
    
    // Count by workflow step
    const stepCounts = {};
    allSignatures.forEach(sig => {
      const step = sig.workflow_step;
      if (step) {
        stepCounts[step] = (stepCounts[step] || 0) + 1;
      }
    });
    
    const pending = allSignatures.filter(s => !s.signed_at_nullable).length;
    const completed = allSignatures.filter(s => s.signed_at_nullable).length;
    
    return {
      total: resourceIds.length,
      pending,
      completed,
      by_step: stepCounts
    };
  }

  /**
   * 🎯 Get all signatures for a specific resource
   */
  async getResourceSignatures(
    resourceType: string,
    resourceId: string
  ): Promise<DocumentSignature[]> {
    return await this.signatureRepo.find({
      where: {
        resource_type: resourceType,
        resource_id: resourceId
      },
      relations: ['user'],
      order: { signedAt: 'ASC' }
    });
  }

  /**
   * 🎯 Initialize workflow for a resource (create pending signature records)
   */
  async initializeWorkflow(
    resourceType: string,
    resourceId: string,
    workflowSteps: WorkflowStep[],
    userAssignments?: Record<string, string[]> // step -> userIds
  ): Promise<DocumentSignature[]> {
    console.log(`[generic-workflow] Initializing workflow for ${resourceType}:${resourceId}`);
    
    const signatures: DocumentSignature[] = [];
    
    for (const step of workflowSteps) {
      const requiredSignatures = step.required_signatures || 1;
      const assignedUsers = userAssignments?.[step.name] || [];
      
      // Create signature records (initially unsigned)
      for (let i = 0; i < requiredSignatures; i++) {
        const assignedUserId = assignedUsers[i] || null;
        
        const signature = this.signatureRepo.create({
          resource_type: resourceType,
          resource_id: resourceId,
          workflow_step: step.name,
          role: step.roles?.[0] || 'unknown',
          action: step.name,
          user_id: assignedUserId,
          signed_at_nullable: null, // Pending
          signedAt: new Date(), // Keep for compatibility but this will be updated when actually signed
        });
        
        const saved = await this.signatureRepo.save(signature);
        signatures.push(saved);
      }
    }
    
    console.log(`[generic-workflow] ✅ Initialized ${signatures.length} signature records`);
    return signatures;
  }
}