// src/zoi/controllers/GenericWorkflowController.ts
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ZoiWorkflowService, WorkflowStep, WorkflowStatus } from '../services/ZoiWorkflowService';

@Controller('workflow')
export class ZoiWorkflowController {
  constructor(
    private readonly workflowService: ZoiWorkflowService
  ) {}

  /**
   * Get workflow status for any resource
   * GET /workflow/status/:resourceType/:resourceId
   */
  @Get('status/:resourceType/:resourceId')
  async getWorkflowStatus(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @Query('steps') stepsJson?: string
  ): Promise<WorkflowStatus> {
    
    // Default blood test workflow steps
    let workflowSteps: WorkflowStep[] = [
      { name: "lab_review", required_signatures: 1, roles: ["lab_technician"] },
      { name: "doctor_approval", required_signatures: 1, roles: ["doctor", "pathologist"] },
      { name: "final_release", required_signatures: 1, roles: ["lab_director"] }
    ];

    if (stepsJson) {
      try {
        workflowSteps = JSON.parse(stepsJson);
      } catch (error) {
        // Use default steps
      }
    }

    return await this.workflowService.getWorkflowStatus(resourceType, resourceId, workflowSteps);
  }

  /**
   * Add signature to any resource
   * POST /workflow/sign/:resourceType/:resourceId
   */
  @Post('sign/:resourceType/:resourceId')
  async addSignature(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @Body() signatureData: {
      user_id: string;
      workflow_step: string;
      role: string;
      signature_data?: string;
      notes?: string;
    }
  ): Promise<{ signature: any; newStatus: WorkflowStatus }> {
    
    const signature = await this.workflowService.addSignature(resourceType, resourceId, signatureData);
    
    // Get updated workflow status
    const workflowSteps: WorkflowStep[] = [
      { name: "lab_review", required_signatures: 1, roles: ["lab_technician"] },
      { name: "doctor_approval", required_signatures: 1, roles: ["doctor", "pathologist"] },
      { name: "final_release", required_signatures: 1, roles: ["lab_director"] }
    ];
    
    const newStatus = await this.workflowService.getWorkflowStatus(resourceType, resourceId, workflowSteps);
    
    return { signature, newStatus };
  }

  /**
   * Get pending signatures for user
   * GET /workflow/pending/:userId?resourceType=blood_tests
   */
  @Get('pending/:userId')
  async getPendingSignatures(
    @Param('userId') userId: string,
    @Query('resourceType') resourceType?: string
  ): Promise<{ pending: any[], count: number }> {
    
    const pending = await this.workflowService.getPendingSignatures(userId, resourceType);
    return {
      pending,
      count: pending.length
    };
  }

  /**
   * Get workflow statistics
   * GET /workflow/stats/:resourceType
   */
  @Get('stats/:resourceType')
  async getWorkflowStats(
    @Param('resourceType') resourceType: string
  ): Promise<{
    total: number;
    pending: number;
    completed: number;
    by_step: Record<string, number>;
  }> {
    return await this.workflowService.getWorkflowStats(resourceType);
  }

  /**
   * Initialize workflow for a resource
   * POST /workflow/init/:resourceType/:resourceId
   */
  @Post('init/:resourceType/:resourceId')
  async initializeWorkflow(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @Body() initData: {
      workflowSteps: WorkflowStep[];
      userAssignments?: Record<string, string[]>;
    }
  ): Promise<{ initialized: boolean; signatures: any[] }> {
    
    const signatures = await this.workflowService.initializeWorkflow(
      resourceType, 
      resourceId, 
      initData.workflowSteps,
      initData.userAssignments
    );
    
    return {
      initialized: true,
      signatures
    };
  }
}