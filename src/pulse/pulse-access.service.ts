// pulse-access.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Raw } from 'typeorm';
import { AccessAction } from './entity/access.action.entity';
import { RolePermission } from './entity/role.permission.entity';
import { UserRole } from './entity/user.role.entity';
import { AccessPolicy } from './entity/access.policy.entity';
import { User } from './entity';


// Add this interface to your existing interfaces
interface WorkspaceAccessResult {
  id: string;
  accessType: 'individual' | 'policy';
  sourceTable: 'access_actions' | 'access_policies';
  userId?: string;
  userName?: string;
  userEmail?: string;
  resourceId: string;
  actionType: string;
  expiresAt?: Date;
  conditions?: Record<string, any>;
  policyName?: string;
}

interface AccessInsightDto {
  userId: string;
  name: string;
  actions: string[];
  grantedBy: 'access_action' | 'role_permission' | 'policy' | 'workspace_policy';
  role?: string;
  matchedPolicy?: string;
  expiresAt?: Date;
}

export class AccessCheckInputDto {
  actorId: string;

  workspaceId: string;

  resourceId?: string;

  resourceType: string;

  actionType: string;

  userMetadata?: Record<string, any>;

  resourceMetadata?: Record<string, any>;
}

interface SimulatedAccessResult {
  granted: boolean;
  grantedBy?: 'access_action' | 'role_permission' | 'policy';
  details: {
    direct: boolean;
    roleMatched: boolean;
    roles: string[];
    matchedPolicy?: string;
    failedPolicyConditions?: Array<{
      policy: string;
      context: Record<string, any>;
      conditions: Record<string, any>;
    }>;
    matchedPolicyConditions?: Array<{
      key: string;
      expected: any;
      actual: any;
      result: boolean;
    }>;
  };
}
//

@Injectable()
export class PulseAccessService {
  constructor(
    @InjectRepository(AccessAction)
    private readonly accessActionRepo: Repository<AccessAction>,

    @InjectRepository(UserRole)
    public readonly userRoleRepo: Repository<UserRole>,

    @InjectRepository(RolePermission)
    private readonly rolePermissionRepo: Repository<RolePermission>,

    @InjectRepository(AccessPolicy)
    private readonly policyRepo: Repository<AccessPolicy>,

    @InjectRepository(User)
    public readonly userRepo: Repository<User>,
  ) { }

  public evaluateConditions(
    user: Record<string, any>,
    resource: Record<string, any>,
    conditions: Record<string, any>
  ): boolean {
    const getValue = (key: string) => user[key] ?? resource[key];

    const evaluate = (condition: any): boolean => {
      if (typeof condition !== 'object' || condition === null) return false;

      if ('$and' in condition) {
        return Array.isArray(condition['$and']) && condition['$and'].every(evaluate);
      }

      if ('$or' in condition) {
        return Array.isArray(condition['$or']) && condition['$or'].some(evaluate);
      }

      if ('$not' in condition) {
        return evaluate(condition['$not']) === false;
      }

      return Object.entries(condition).every(([key, rule]) => {
        const value = getValue(key);

        // 🔒 Handle null or unexpected rule
        if (rule === null || rule === undefined) return false;

        // 🔁 Support old shorthand: "geo": ["MY", "SG"]
        if (Array.isArray(rule)) {
          return rule.includes(value);
        }

        // 🔍 Ensure rule is an object
        if (typeof rule === 'object' && rule !== null) {
          if ('$eq' in rule && rule['$eq'] !== undefined) return value === rule['$eq'];
          if ('$ne' in rule && rule['$ne'] !== undefined) return value !== rule['$ne'];
          if ('$in' in rule && Array.isArray(rule['$in'])) return rule['$in'].includes(value);
          if ('$gte' in rule && typeof rule['$gte'] === 'number') return value >= rule['$gte'];
          if ('$lte' in rule && typeof rule['$lte'] === 'number') return value <= rule['$lte'];
        }

        // Fallback exact match
        return value === rule;
      });
    };

    return evaluate(conditions);
  }

  async canAccess(params: {
    role: string,
    actorId: string;
    workspaceId: string;
    resourceId?: string;
    resourceType: string;
    actionType: string;
    userMetadata?: Record<string, any>;
    resourceMetadata?: Record<string, any>;
  }): Promise<{ granted: boolean; policy: {}, grantedBy?: 'access_action' | 'role_permission' | 'policy' | 'root' }> {
    let {
      role,
      actorId,
      workspaceId,
      resourceId,
      resourceType,
      actionType,
      userMetadata = {},
      resourceMetadata = {}
    } = params;

    let resource = resourceType;

    if (role === 'admin') {
      resource = '*';
      actionType = '*';
    }

    console.log('[canAccess]', resource, resourceType)

    // 1. Direct access check
    if (resourceId) {
      const direct = await this.accessActionRepo.findOne({
        where: {
          actor: { id: actorId },
          resourceId,
          resourceType: resource,
          actionType,
          enabled: true,
          expiresAt: Raw(alias => `${alias} IS NULL OR ${alias} > NOW()`)
        }
      });
      if (direct) {
        return { granted: true, grantedBy: 'access_action', policy: direct };
      }
    }

    // 2. Role-based permission check
    const userRoles = await this.userRoleRepo.find({
      where: {
        user: { id: actorId },
        workspace: { id: workspaceId }
      },
      relations: ['role']
    });

    console.log('[userRoles]', userRoles, actorId, workspaceId)

    const roleIds = userRoles.map(r => r.role.id);
    const roleNames = userRoles.map(r => r.role.name);

    if (roleIds.length > 0) {
      const permission = await this.rolePermissionRepo.findOne({
        where: {
          role: { id: In(roleIds) },
          resourceType: { name: resourceType },
          actionName: actionType
        },
        relations: ['role', 'resourceType']
      });

      if (permission) {
        return { granted: true, grantedBy: 'role_permission', policy: permission };
      }
    }

    // 3. ABAC policy check
    const policies = await this.policyRepo.find({
      where: {
        resourceType: resource,
        // resourceType,
        actionType
      }
    });

    // console.log('[policies]', policies, resourceType, actionType)

    for (const policy of policies) {
      for (const roleName of roleNames) {
        const context = {
          ...userMetadata,
          role: role === 'admin' ? 'admin' : roleName,
          workspaceId
        };

        // console.log('[policy]', policy, context, resourceMetadata, policy.conditions);

        if (this.evaluateConditions(context, resourceMetadata, policy.conditions)) {
          return { granted: true, grantedBy: 'policy', policy: policy.conditions };
        }
      }
    }

    console.log('[canAccess] No direct access, role permission or policy matched',)

    // Fallback
    return { granted: false, grantedBy: 'root', policy: {} };
  }

  async getAccessInsight(params: {
    resourceId: string;
    resourceType: string;
    actionType?: string;
  }): Promise<AccessInsightDto[]> {
    const { resourceId, resourceType, actionType } = params;
    const insights: AccessInsightDto[] = [];

    // 1. Direct access grants
    const directGrants = await this.accessActionRepo.find({
      where: {
        resourceId,
        resourceType,
        ...(actionType ? { actionType } : {}),
        enabled: true
      },
      relations: ['actor']
    });

    for (const grant of directGrants) {
      insights.push({
        userId: grant.actor.id,
        name: grant.actor.name,
        actions: [grant.actionType],
        grantedBy: 'access_action',
        expiresAt: grant.expiresAt
      });
    }

    // 2. Role-based permission matches
    const rolesWithAccess = await this.rolePermissionRepo.find({
      where: {
        resourceType: { name: resourceType },
        ...(actionType ? { actionName: actionType } : {})
      },
      relations: ['role', 'resourceType']
    });

    for (const rolePerm of rolesWithAccess) {
      const userRoles = await this.userRoleRepo.find({
        where: { role: { id: rolePerm.role.id } },
        relations: ['user', 'role']
      });

      for (const ur of userRoles) {
        insights.push({
          userId: ur.user.id,
          name: ur.user.name,
          actions: [rolePerm.actionName],
          grantedBy: 'role_permission',
          role: ur.role.name
        });
      }
    }

    // 3. ABAC policies
    const policies = await this.policyRepo.find({
      where: {
        resourceType,
        ...(actionType ? { actionType } : {})
      }
    });

    const allUsers = await this.userRepo.find(); // optional: filter by workspace?

    for (const user of allUsers) {
      const roles = await this.userRoleRepo.find({
        where: { user: { id: user.id } },
        relations: ['role']
      });

      const roleNames = roles.map(r => r.role.name);

      for (const roleName of roleNames) {
        const context = {
          ...user.metadata,
          role: roleName,
          workspaceId: roles[0]?.workspace?.id ?? null
        };

        for (const policy of policies) {
          if (this.evaluateConditions(context, {}, policy.conditions)) {
            insights.push({
              userId: user.id,
              name: user.name,
              actions: [policy.actionType],
              grantedBy: 'policy',
              matchedPolicy: policy.name
            });
          }
        }
      }
    }

    // 4. Workspace-based inferred access (optional/future)
    // Could use logic to match workspaceId to doc metadata if needed

    return insights;
  }

  async getGrantedResourceTypes(
    userId: string,
    workspaceId: string
  ): Promise<{ resourceType: string; actionType: string; grantedBy: string }[]> {
    const result: Array<{ resourceType: string; actionType: string; grantedBy: string }> = [];

    // 1. Direct access grants
    const accessActions = await this.accessActionRepo.find({
      where: {
        actor: { id: userId },
        enabled: true,
        expiresAt: Raw(alias => `${alias} IS NULL OR ${alias} > NOW()`)
      }
    });

    for (const grant of accessActions) {
      result.push({
        resourceType: grant.resourceType,
        actionType: grant.actionType,
        grantedBy: 'access_action'
      });
    }

    // 2. Role-based grants
    const roles = await this.userRoleRepo.find({
      where: {
        user: { id: userId },
        workspace: { id: workspaceId }
      },
      relations: ['role']
    });

    const roleIds = roles.map(r => r.role.id);
    const rolePermissions = await this.rolePermissionRepo.find({
      where: { role: { id: In(roleIds) } },
      relations: ['resourceType']
    });

    for (const rp of rolePermissions) {
      result.push({
        resourceType: rp.resourceType.name,
        actionType: rp.actionName,
        grantedBy: 'role_permission'
      });
    }

    // 3. ABAC policies
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const userMetadata = user?.metadata || {};

    const policies = await this.policyRepo.find();
    const roleNames = roles.map(r => r.role.name);

    for (const policy of policies) {
      for (const role of roleNames) {
        const context = {
          ...userMetadata,
          role,
          workspaceId
        };

        const matched = this.evaluateConditions(context, {}, policy.conditions);
        if (matched) {
          result.push({
            resourceType: policy.resourceType,
            actionType: policy.actionType,
            grantedBy: 'policy'
          });
        }
      }
    }

    // Deduplicate if needed (optional)
    const seen = new Set();
    const deduped = result.filter(({ resourceType, actionType }) => {
      const key = `${resourceType}:${actionType}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return deduped;
  }

  async getAccessGrantsGrouped(): Promise<any[]> {
    const grouped: Record<string, any> = {};

    // 1. Get all direct grants (access_actions)
    const actions = await this.accessActionRepo.find({
      where: { enabled: true },
      relations: ['actor']
    });

    for (const a of actions) {
      const key = `${a.resourceType}:${a.resourceId}`;
      if (!grouped[key]) {
        grouped[key] = {
          resourceType: a.resourceType,
          resourceId: a.resourceId,
          grants: []
        };
      }

      const existing = grouped[key].grants.find(g => g.userId === a.actor.id && g.grantedBy === 'access_action');
      if (existing) {
        existing.actions.push(a.actionType);
      } else {
        grouped[key].grants.push({
          userId: a.actor.id,
          name: a.actor.name,
          actions: [a.actionType],
          grantedBy: 'access_action',
          expiresAt: a.expiresAt
        });
      }
    }

    // 2. Role-based grants (role_permissions + user_roles)
    const rolePerms = await this.rolePermissionRepo.find({ relations: ['role', 'resourceType'] });
    for (const rp of rolePerms) {
      const userRoles = await this.userRoleRepo.find({
        where: { role: { id: rp.role.id } },
        relations: ['user', 'workspace', 'role']
      });

      for (const ur of userRoles) {
        const key = `${rp.resourceType.name}:*`; // wildcard - not resourceId specific
        if (!grouped[key]) {
          grouped[key] = {
            resourceType: rp.resourceType.name,
            resourceId: '*',
            grants: []
          };
        }

        const existing = grouped[key].grants.find(g => g.userId === ur.user.id && g.grantedBy === 'role_permission');
        if (existing) {
          existing.actions.push(rp.actionName);
        } else {
          grouped[key].grants.push({
            userId: ur.user.id,
            name: ur.user.name,
            actions: [rp.actionName],
            grantedBy: 'role_permission',
            role: ur.role.name
          });
        }
      }
    }

    // 3. ABAC policies
    const users = await this.userRepo.find();
    const policies = await this.policyRepo.find();

    for (const user of users) {
      const userRoles = await this.userRoleRepo.find({ where: { user: { id: user.id } }, relations: ['role', 'workspace'] });
      const roleNames = userRoles.map(r => r.role.name);

      for (const policy of policies) {
        for (const role of roleNames) {
          const context = {
            ...user.metadata,
            role,
            workspaceId: userRoles[0]?.workspace?.id
          };

          const passed = this.evaluateConditions(context, {}, policy.conditions);
          if (!passed) continue;

          const key = `${policy.resourceType}:*`;
          if (!grouped[key]) {
            grouped[key] = {
              resourceType: policy.resourceType,
              resourceId: '*',
              grants: []
            };
          }

          const existing = grouped[key].grants.find(g => g.userId === user.id && g.grantedBy === 'policy');
          if (existing) {
            existing.actions.push(policy.actionType);
          } else {
            grouped[key].grants.push({
              userId: user.id,
              name: user.name,
              actions: [policy.actionType],
              grantedBy: 'policy',
              matchedPolicy: policy.name
            });
          }
        }
      }
    }

    // 4. Group ABAC policies by resourceType + actionType
    for (const policy of policies) {
      const key = `${policy.resourceType}:*`;

      if (!grouped[key]) {
        grouped[key] = {
          resourceType: policy.resourceType,
          resourceId: '*',
          grants: [],
          policies: []
        };
      }

      if (!grouped[key].policies) {
        grouped[key].policies = [];
      }

      grouped[key].policies.push({
        name: policy.name,
        actionType: policy.actionType,
        conditions: policy.conditions
      });
    }

    return Object.values(grouped);
  }

  async getAccessGrantsGroupedByResource(params: { resourceType?: string }): Promise<any[]> {
    const { resourceType } = params;
    const grouped: Record<string, any> = {};

    // 1. Direct access grants
    const accessActions = await this.accessActionRepo.find({
      where: { enabled: true },
      relations: ['actor']
    });

    for (const action of accessActions) {
      if (resourceType && action.resourceType !== resourceType) continue;

      const key = `${action.resourceType}:${action.resourceId}`;
      if (!grouped[key]) {
        grouped[key] = {
          resourceType: action.resourceType,
          resourceId: action.resourceId,
          grants: [],
          policies: []
        };
      }

      const existing = grouped[key].grants.find(g => g.userId === action.actor.id && g.grantedBy === 'access_action');
      if (existing) {
        existing.actions.push(action.actionType);
      } else {
        grouped[key].grants.push({
          userId: action.actor.id,
          name: action.actor.name,
          actions: [action.actionType],
          grantedBy: 'access_action',
          expiresAt: action.expiresAt
        });
      }
    }

    // 2. Role-based permission grants
    const rolePerms = await this.rolePermissionRepo.find({
      relations: ['role', 'resourceType']
    });

    for (const rp of rolePerms) {
      if (resourceType && rp.resourceType.name !== resourceType) continue;

      const userRoles = await this.userRoleRepo.find({
        where: { role: { id: rp.role.id } },
        relations: ['user', 'workspace', 'role']
      });

      for (const ur of userRoles) {
        const key = `${rp.resourceType.name}:*`;
        if (!grouped[key]) {
          grouped[key] = {
            resourceType: rp.resourceType.name,
            resourceId: '*',
            grants: [],
            policies: []
          };
        }

        const existing = grouped[key].grants.find(g => g.userId === ur.user.id && g.grantedBy === 'role_permission');
        if (existing) {
          existing.actions.push(rp.actionName);
        } else {
          grouped[key].grants.push({
            userId: ur.user.id,
            name: ur.user.name,
            actions: [rp.actionName],
            grantedBy: 'role_permission',
            role: ur.role.name
          });
        }
      }
    }

    // 3. ABAC policy-based access
    const policies = await this.policyRepo.find({
      where: resourceType ? { resourceType } : {}
    });

    const users = await this.userRepo.find();

    for (const policy of policies) {
      const key = `${policy.resourceType}:*`;

      if (!grouped[key]) {
        grouped[key] = {
          resourceType: policy.resourceType,
          resourceId: '*',
          grants: [],
          policies: []
        };
      }

      const matchedUsersMap = new Map<string, { userId: string; name: string; role: string }>();
      let appliesToWorkspace: string | undefined;

      for (const user of users) {
        const userRoles = await this.userRoleRepo.find({
          where: { user: { id: user.id } },
          relations: ['role', 'workspace']
        });

        for (const ur of userRoles) {
          const context = {
            ...user.metadata,
            role: ur.role.name,
            workspaceId: ur.workspace?.id
          };

          const passed = this.evaluateConditions(context, {}, policy.conditions);
          if (passed && !matchedUsersMap.has(user.id)) {
            matchedUsersMap.set(user.id, {
              userId: user.id,
              name: user.name,
              role: ur.role.name
            });

            if (!appliesToWorkspace && ur.workspace?.id) {
              appliesToWorkspace = ur.workspace.id;
            }
          }
        }
      }

      grouped[key].policies.push({
        name: policy.name,
        actionType: policy.actionType,
        conditions: policy.conditions,
        matchedUsers: Array.from(matchedUsersMap.values()),
        evaluationStatus: matchedUsersMap.size > 0 ? '✅ Live' : '⏳ Conditional',
        appliesToWorkspace
      });
    }

    return Object.values(grouped);
  }

  private evaluateWithTrace(
    userAttrs: Record<string, any>,
    resourceAttrs: Record<string, any>,
    conditions: Record<string, any>
  ): { passed: boolean; matchedConditions: any[] } {
    const matchedConditions: any[] = [];

    const getValue = (key: string): any => {
      return userAttrs[key] ?? resourceAttrs[key];
    };

    const evaluate = (cond: any): boolean => {
      if (typeof cond !== 'object' || cond === null) return false;

      return Object.entries(cond).every(([key, rule]) => {
        const actual = getValue(key);

        if (Array.isArray(rule)) {
          const result = rule.includes(actual);
          matchedConditions.push({ key, expected: rule, actual, result });
          return result;
        }

        if (typeof rule === 'object' && rule !== null) {
          if ('$in' in rule) {
            const result = Array.isArray(rule.$in) && rule.$in.includes(actual);
            matchedConditions.push({ key, expected: rule.$in, actual, result });
            return result;
          }
          if ('$eq' in rule) {
            const result = actual === rule.$eq;
            matchedConditions.push({ key, expected: rule.$eq, actual, result });
            return result;
          }
          if ('$ne' in rule) {
            const result = actual !== rule.$ne;
            matchedConditions.push({ key, expected: rule.$ne, actual, result });
            return result;
          }
        }

        const result = actual === rule;
        matchedConditions.push({ key, expected: rule, actual, result });
        return result;
      });
    };

    return {
      passed: evaluate(conditions),
      matchedConditions
    };
  }


  async simulateAccess(params: {
    actorId: string;
    workspaceId: string;
    resourceId?: string;
    resourceType: string;
    actionType: string;
    userMetadata?: Record<string, any>;
    resourceMetadata?: Record<string, any>;
  }): Promise<{
    granted: boolean;
    grantedBy?: 'access_action' | 'role_permission' | 'policy';
    details: {
      direct: boolean;
      roleMatched: boolean;
      roles: string[];
      matchedPolicy?: string;
      failedPolicyConditions?: any[];
      matchedPolicyConditions?: any[]
    };
  }> {
    const {
      actorId,
      workspaceId,
      resourceId,
      resourceType,
      actionType,
      userMetadata = {},
      resourceMetadata = {}
    } = params;

    const result: SimulatedAccessResult = {
      granted: false,
      details: {
        direct: false,
        roleMatched: false,
        roles: [],
        matchedPolicy: undefined,
        failedPolicyConditions: []
      }
    };

    // 1. Direct access check
    if (resourceId) {
      const direct = await this.accessActionRepo.findOne({
        where: {
          actor: { id: actorId },
          resourceId,
          resourceType,
          actionType,
          enabled: true,
          expiresAt: Raw(alias => `${alias} IS NULL OR ${alias} > NOW()`)
        }
      });

      if (direct) {
        return {
          granted: true,
          grantedBy: 'access_action',
          details: { ...result.details, direct: true }
        };
      }
    }

    // 2. Role check
    const roles = await this.userRoleRepo.find({
      where: {
        user: { id: actorId },
        workspace: { id: workspaceId }
      },
      relations: ['role']
    });

    console.log('[roles] simulate', roles, actorId, workspaceId)

    const roleNames = roles.map(r => r.role.name);
    result.details.roles = roleNames;

    const roleIds = roles.map(r => r.role.id);
    if (roleIds.length > 0) {
      const perm = await this.rolePermissionRepo.findOne({
        where: {
          role: { id: In(roleIds) },
          resourceType: { name: resourceType },
          actionName: actionType
        },
        relations: ['role', 'resourceType']
      });

      if (perm) {
        return {
          granted: true,
          grantedBy: 'role_permission',
          details: { ...result.details, roleMatched: true }
        };
      }
    }

    // 3. ABAC policy evaluation
    const policies = await this.policyRepo.find({
      where: { resourceType, actionType }
    });

    // console.log('[policies] simulate', policies, resourceType, actionType)

    for (const policy of policies) {
      // console.log('[policy] roleNames', roleNames);
      for (const roleName of roleNames) {
        const context = {
          ...userMetadata,
          role: roleName,
          workspaceId
        };

        // const passed = this.evaluateConditions(context, resourceMetadata, policy.conditions);
        const { passed, matchedConditions } = this.evaluateWithTrace(
          context,
          resourceMetadata,
          policy.conditions
        );
        console.log('[policy evaluation]', policy.name, passed, matchedConditions);
        if (passed) {
          return {
            granted: true,
            grantedBy: 'policy',
            details: {
              ...result.details,
              matchedPolicy: policy.name,
              matchedPolicyConditions: matchedConditions
            }
          };
        } else {
          result.details.failedPolicyConditions?.push({
            policy: policy.name,
            context,
            conditions: policy.conditions
          });
        }
      }
    }

    return result;
  }

  /**
   * Get all accesses for a specific resource type within a workspace
   * Returns both individual user access and workspace policies
   */
  async getAccessesByWorkspaceAndResource(params: {
    workspaceId: string;
    resourceType: string;
  }): Promise<WorkspaceAccessResult[]> {
    const { workspaceId, resourceType } = params;

    // Using raw SQL query for better performance with complex joins
    const query = `
      -- Individual Access Actions (users in workspace who have specific resource access)
      SELECT 
          aa.id,
          'individual' as access_type,
          'access_actions' as source_table,
          u.id as user_id,
          u.name as user_name,
          u.email as user_email,
          aa.resource_id,
          aa.action_type,
          aa.expires_at,
          aa.conditions,
          NULL as policy_name
      FROM access_actions aa
      JOIN users u ON aa.actor_id = u.id
      JOIN user_roles ur ON u.id = ur.user_id
      WHERE ur.workspace_id = $1
        AND aa.resource_type = $2
        AND aa.enabled = true
        AND (aa.expires_at IS NULL OR aa.expires_at > NOW())
      
      UNION ALL
      
      -- Policy-based Access (workspace policies that grant access to resource type)
      SELECT 
          ap.id,
          'policy' as access_type,
          'access_policies' as source_table,
          NULL as user_id,
          NULL as user_name,
          NULL as user_email,
          '*' as resource_id,
          ap.action_type,
          CASE 
              WHEN ap.expires_in_days IS NOT NULL 
              THEN ap.created_at + (ap.expires_in_days || ' days')::INTERVAL
              ELSE NULL 
          END as expires_at,
          ap.conditions,
          ap.name as policy_name
      FROM access_policies ap
      WHERE ap.workspace_id = $1
        AND ap.resource_type = $2
      
      ORDER BY access_type, user_name
    `;

    const rawResults = await this.accessActionRepo.query(query, [workspaceId, resourceType]);

    // Transform raw results to typed interface
    return rawResults.map(row => ({
      id: row.id,
      accessType: row.access_type,
      sourceTable: row.source_table,
      userId: row.user_id,
      userName: row.user_name,
      userEmail: row.user_email,
      resourceId: row.resource_id,
      actionType: row.action_type,
      expiresAt: row.expires_at,
      conditions: row.conditions,
      policyName: row.policy_name
    }));
  }

  /**
   * Simplified version that returns just the IDs as requested
   */
  // async getAccessIdsByWorkspaceAndResource(params: {
  //   workspaceId: string;
  //   resourceType: string;
  // }): Promise<string[]> {
  //   const results = await this.getAccessesByWorkspaceAndResource(params);
  //   return results.map(r => r.id);
  // }

  /**
   * Check if a user has access to a specific resource type in workspace
   * Useful for quick permission checks
   */
  async hasAccessToResourceType(params: {
    userId: string;
    workspaceId: string;
    resourceType: string;
    actionType: string;
  }): Promise<{
    hasAccess: boolean;
    grantedBy: 'individual' | 'policy' | null;
    accessId?: string;
  }> {
    const { userId, workspaceId, resourceType, actionType } = params;

    const allAccesses = await this.getAccessesByWorkspaceAndResource({
      workspaceId,
      resourceType
    });

    // Check individual access first
    const individualAccess = allAccesses.find(
      access => access.accessType === 'individual' &&
        access.userId === userId &&
        access.actionType === actionType
    );

    if (individualAccess) {
      return {
        hasAccess: true,
        grantedBy: 'individual',
        accessId: individualAccess.id
      };
    }

    // Check policy-based access
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['metadata']
    });

    const userRoles = await this.userRoleRepo.find({
      where: { user: { id: userId }, workspace: { id: workspaceId } },
      relations: ['role']
    });

    const policyAccesses = allAccesses.filter(
      access => access.accessType === 'policy' && access.actionType === actionType
    );

    for (const policyAccess of policyAccesses) {
      if (!policyAccess.conditions) continue;

      for (const userRole of userRoles) {
        const context = {
          ...user?.metadata,
          role: userRole.role.name,
          workspaceId
        };

        if (this.evaluateConditions(context, {}, policyAccess.conditions)) {
          return {
            hasAccess: true,
            grantedBy: 'policy',
            accessId: policyAccess.id
          };
        }
      }
    }

    return { hasAccess: false, grantedBy: null };
  }

  //////////////////////////////////
  /**
   * Get actual resource IDs (not grant IDs) that a user can access
   * This is what you actually want for filtering your data
   */
  async getUserAccessibleResourceIds(params: {
    userId: string;
    workspaceId: string;
    resourceType: string;
  }): Promise<string[]> {
    const { userId, workspaceId, resourceType } = params;

    try {
      // Use the corrected SQL function
      const result = await this.accessActionRepo.query(
        'SELECT get_user_accessible_resource_ids($1, $2, $3)',
        [userId, workspaceId, resourceType]
      );

      return result[0]?.get_user_accessible_resource_ids || [];
    } catch (error) {
      console.error('Error getting user accessible resource IDs:', error);
      return [];
    }
  }

  /**
   * Get detailed access information showing which users can access which resources
   */
  async getAccessibleResourceDetails(params: {
    workspaceId: string;
    resourceType: string;
    userId?: string;
  }): Promise<Array<{
    resourceId: string;
    accessType: 'individual' | 'policy';
    actionType: string;
    grantedBy: string;
    userId: string;
    userName: string;
  }>> {
    const { workspaceId, resourceType, userId } = params;

    try {
      const query = `
        SELECT * FROM get_accessible_resource_ids_by_workspace_and_resource($1, $2, $3)
      `;
      
      const results = await this.accessActionRepo.query(query, [
        workspaceId, 
        resourceType, 
        userId || null
      ]);

      return results.map(row => ({
        resourceId: row.resource_id,
        accessType: row.access_type,
        actionType: row.action_type,
        grantedBy: row.granted_by,
        userId: row.user_id,
        userName: row.user_name
      }));
    } catch (error) {
      console.error('Error getting accessible resource details:', error);
      return [];
    }
  }

  /**
   * CORRECTED: Get access grant IDs (your original function)
   * Renamed to be clear about what it returns
   */
  async getAccessGrantIdsByWorkspaceAndResource(params: {
    workspaceId: string;
    resourceType: string;
  }): Promise<string[]> {
    const { workspaceId, resourceType } = params;

    const query = `
      -- Individual Access Grant IDs
      SELECT aa.id
      FROM access_actions aa
      JOIN users u ON aa.actor_id = u.id
      JOIN user_roles ur ON u.id = ur.user_id
      WHERE ur.workspace_id = $1
        AND aa.resource_type = $2
        AND aa.enabled = true
        AND (aa.expires_at IS NULL OR aa.expires_at > NOW())
      
      UNION ALL
      
      -- Policy Access Grant IDs
      SELECT ap.id
      FROM access_policies ap
      WHERE ap.workspace_id = $1
        AND ap.resource_type = $2
    `;

    try {
      const results = await this.accessActionRepo.query(query, [workspaceId, resourceType]);
      return results.map(row => row.id);
    } catch (error) {
      console.error('Error getting access grant IDs:', error);
      return [];
    }
  }

  /**
   * UPDATED: This should now return actual resource IDs, not grant IDs
   */
  async getAccessIdsByWorkspaceAndResource(params: {
    workspaceId: string;
    resourceType: string;
  }): Promise<string[]> {
    // This method should return resource IDs, not grant IDs
    // We'll get all users who have access and their accessible resource IDs
    
    const { workspaceId, resourceType } = params;

    try {
      // Get all users in this workspace
      const usersInWorkspace = await this.userRoleRepo.find({
        where: { workspace: { id: workspaceId } },
        relations: ['user']
      });

      const allAccessibleResourceIds = new Set<string>();

      // For each user, get their accessible resource IDs
      for (const userRole of usersInWorkspace) {
        const userResourceIds = await this.getUserAccessibleResourceIds({
          userId: userRole.user.id,
          workspaceId,
          resourceType
        });

        userResourceIds.forEach(id => allAccessibleResourceIds.add(id));
      }

      return Array.from(allAccessibleResourceIds);
    } catch (error) {
      console.error('Error getting all accessible resource IDs:', error);
      return [];
    }
  }

  /**
   * Check if a specific resource ID is accessible by a user
   */
  async canAccessResource(params: {
    userId: string;
    workspaceId: string;
    resourceType: string;
    resourceId: string;
  }): Promise<boolean> {
    const { userId, workspaceId, resourceType, resourceId } = params;

    try {
      const accessibleIds = await this.getUserAccessibleResourceIds({
        userId,
        workspaceId,
        resourceType
      });

      // Check if user has access to this specific resource or wildcard access
      return accessibleIds.includes(resourceId) || accessibleIds.includes('*') || 
             accessibleIds.length === 0; // If function returns all resources
    } catch (error) {
      console.error('Error checking resource access:', error);
      return false;
    }
  }

  /**
   * Get paginated resources that a user can access
   * This is useful for your actual API endpoints
   */
  async getUserAccessibleResources(params: {
    userId: string;
    workspaceId: string;
    resourceType: string;
    page?: number;
    limit?: number;
  }): Promise<{
    resourceIds: string[];
    hasWildcardAccess: boolean;
    totalAccessible: number;
  }> {
    const { userId, workspaceId, resourceType, page = 1, limit = 50 } = params;

    try {
      const accessibleIds = await this.getUserAccessibleResourceIds({
        userId,
        workspaceId,
        resourceType
      });

      const hasWildcardAccess = accessibleIds.includes('*');

      if (hasWildcardAccess) {
        // User has access to all resources - get them from the actual resource table
        let allResourceIds: string[] = [];
        
        switch (resourceType) {
          case 'school':
            const schools = await this.accessActionRepo.query(
              'SELECT id FROM school ORDER BY id LIMIT $1 OFFSET $2',
              [limit, (page - 1) * limit]
            );
            allResourceIds = schools.map(s => s.id.toString());
            break;
          // Add other resource types as needed
        }

        return {
          resourceIds: allResourceIds,
          hasWildcardAccess: true,
          totalAccessible: -1 // -1 indicates all resources
        };
      }

      // User has access to specific resources
      const startIndex = (page - 1) * limit;
      const paginatedIds = accessibleIds.slice(startIndex, startIndex + limit);

      return {
        resourceIds: paginatedIds,
        hasWildcardAccess: false,
        totalAccessible: accessibleIds.length
      };

    } catch (error) {
      console.error('Error getting user accessible resources:', error);
      return {
        resourceIds: [],
        hasWildcardAccess: false,
        totalAccessible: 0
      };
    }
  }

}
