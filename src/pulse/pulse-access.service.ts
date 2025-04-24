// pulse-access.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Raw } from 'typeorm';
import { AccessAction } from './entity/access.action.entity';
import { RolePermission } from './entity/role.permission.entity';
import { UserRole } from './entity/user.role.entity';
import { AccessPolicy } from './entity/access.policy.entity';
import { User } from './entity';

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
    private readonly userRoleRepo: Repository<UserRole>,

    @InjectRepository(RolePermission)
    private readonly rolePermissionRepo: Repository<RolePermission>,

    @InjectRepository(AccessPolicy)
    private readonly policyRepo: Repository<AccessPolicy>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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


  // private evaluateConditions(
  //   userAttrs: Record<string, any>,
  //   resourceAttrs: Record<string, any>,
  //   conditions: Record<string, any>
  // ): boolean {
  //   return Object.entries(conditions).every(([key, expected]) => {

  //     const actual = userAttrs[key] ?? resourceAttrs[key];
  //     console.log('[evaluateConditions]', { key, expected, actual });
  //     if (Array.isArray(expected)) {
  //       return expected.includes(actual);
  //     }
  //     return actual === expected;
  //   });
  // }

  // async canAccess(params: {
  //   actorId: string;
  //   workspaceId: string;
  //   resourceId?: string;
  //   resourceType: string;
  //   actionType: string;
  //   userMetadata?: Record<string, any>;
  //   resourceMetadata?: Record<string, any>;
  // }): Promise<boolean> {
  //   const {
  //     actorId,
  //     workspaceId,
  //     resourceId,
  //     resourceType,
  //     actionType,
  //     userMetadata = {},
  //     resourceMetadata = {}
  //   } = params;

  //   // 1. Direct access check (access_actions)
  //   if (resourceId) {
  //     const direct = await this.accessActionRepo.findOne({
  //       where: {
  //         actor: { id: actorId },
  //         resourceId,
  //         resourceType,
  //         actionType,
  //         enabled: true,
  //         expiresAt: Raw(alias => `${alias} IS NULL OR ${alias} > NOW()`)
  //       }
  //     });
  //     if (direct) return true;
  //   }

  //   // 2. Role-based permission check
  //   const roles = await this.userRoleRepo.find({
  //     where: {
  //       user: { id: actorId },
  //       workspace: { id: workspaceId },
  //     },
  //     relations: ['role']
  //   });

  //   const roleIds = roles.map(r => r.role.id);

  //   if (roleIds.length > 0) {
  //     const permission = await this.rolePermissionRepo.findOne({
  //       where: {
  //         role: { id: In(roleIds) },
  //         resourceType: { name: resourceType },
  //         actionName: actionType,
  //       },
  //       relations: ['role', 'resourceType']
  //     });

  //     if (permission) return true;
  //   }

  //   // 3. ABAC policy check
  //   const policies = await this.policyRepo.find({
  //     where: {
  //       resourceType,
  //       actionType,
  //     }
  //   });

  //   console.log('[policies]', policies, resourceType, actionType)

  //   for (const policy of policies) {
  //     if (this.evaluateConditions(userMetadata, resourceMetadata, policy.conditions)) {
  //       return true;
  //     }
  //   }

  //   return false;
  // }


  // async canAccess(params: {
  //   actorId: string;
  //   workspaceId: string;
  //   resourceId?: string;
  //   resourceType: string;
  //   actionType: string;
  //   userMetadata?: Record<string, any>;
  //   resourceMetadata?: Record<string, any>;
  // }): Promise<boolean> {
  //   const {
  //     actorId,
  //     workspaceId,
  //     resourceId,
  //     resourceType,
  //     actionType,
  //     userMetadata = {},
  //     resourceMetadata = {}
  //   } = params;

  //   let hasAccess = false;

  //   // 1. Direct access check (access_actions)
  //   if (resourceId) {
  //     const direct = await this.accessActionRepo.findOne({
  //       where: {
  //         actor: { id: actorId },
  //         resourceId,
  //         resourceType,
  //         actionType,
  //         enabled: true,
  //         expiresAt: Raw(alias => `${alias} IS NULL OR ${alias} > NOW()`)
  //       }
  //     });
  //     if (direct) {
  //       console.log('[GRANTED] via direct access');
  //       hasAccess = true;
  //     }
  //   }

  //   // 2. Role-based permission check
  //   if (!hasAccess) {
  //     const roles = await this.userRoleRepo.find({
  //       where: {
  //         user: { id: actorId },
  //         workspace: { id: workspaceId },
  //       },
  //       relations: ['role']
  //     });

  //     const roleIds = roles.map(r => r.role.id);

  //     if (roleIds.length > 0) {
  //       const permission = await this.rolePermissionRepo.findOne({
  //         where: {
  //           role: { id: In(roleIds) },
  //           resourceType: { name: resourceType },
  //           actionName: actionType,
  //         },
  //         relations: ['role', 'resourceType']
  //       });

  //       if (permission) {
  //         console.log('[GRANTED] via permission access');
  //         hasAccess = true;
  //       }
  //     }
  //   }

  //   // 3. ABAC policy check
  //   const enforceAbacAlways = true;

  //   if (enforceAbacAlways || !hasAccess) {
  //     const policies = await this.policyRepo.find({
  //       where: {
  //         resourceType,
  //         actionType,
  //         workspace: { id: workspaceId }
  //       }
  //     });
  //     console.log('[policies]', policies, resourceType, actionType)

  //     for (const policy of policies) {
  //       const passed = this.evaluateConditions(userMetadata, resourceMetadata, policy.conditions);
  //       if (passed) {
  //         console.log('[GRANTED] via ABAC access');
  //         if (!hasAccess) hasAccess = true; // ABAC grants access
  //       } else if (enforceAbacAlways && hasAccess) {
  //         console.log('[GRANTED] via enforceAbacAlways ABAC access', passed);
  //         // ABAC blocked access that would've been allowed
  //         hasAccess = false;
  //       }
  //     }
  //   }

  //   return hasAccess;
  // }


  async canAccess(params: {
    actorId: string;
    workspaceId: string;
    resourceId?: string;
    resourceType: string;
    actionType: string;
    userMetadata?: Record<string, any>;
    resourceMetadata?: Record<string, any>;
  }): Promise<{ granted: boolean; grantedBy?: 'access_action' | 'role_permission' | 'policy' }> {
    const {
      actorId,
      workspaceId,
      resourceId,
      resourceType,
      actionType,
      userMetadata = {},
      resourceMetadata = {}
    } = params;

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
        return { granted: true, grantedBy: 'access_action' };
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
        return { granted: true, grantedBy: 'role_permission' };
      }
    }

    // 3. ABAC policy check
    const policies = await this.policyRepo.find({
      where: {
        resourceType,
        actionType
      }
    });

    for (const policy of policies) {
      for (const roleName of roleNames) {
        const context = {
          ...userMetadata,
          role: roleName,
          workspaceId
        };

        if (this.evaluateConditions(context, resourceMetadata, policy.conditions)) {
          return { granted: true, grantedBy: 'policy' };
        }
      }
    }

    // Fallback
    return { granted: false };
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
  
    for (const policy of policies) {
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
  
}
