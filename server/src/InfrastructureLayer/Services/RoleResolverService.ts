import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from 'src/BusinessLayer/UserRepository';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';

/**
 * RoleResolverService
 * - Resolves a role name (e.g., 'ADMIN', 'VENDOR', 'BUSINESS_OWNER') into userId[].
 * - You must provide implementations to query your Users DB / RBAC service.
 * - This implementation uses an injected UserRepository-like interface (pseudo-coded).
 */
@Injectable()
export class RoleResolverService {
  private readonly logger = new Logger(RoleResolverService.name);
  constructor(private readonly userRepo: UserRepository) {}

  async resolveRoleToUserIds(role: UserRoleEnum): Promise<number[]> {
    const users = await this.userRepo.findUsersByRole(role);
    const userIds: number[] | [] =
      (users.length && users?.map((u) => u.id as number)) || [];
    this.logger.log(`[RoleResolver] Resolving role ${role} to user ids`);
    return userIds || [];
  }

  /**
   * Resolve multiple roles (or mix of role names & explicit user ids).
   * Accepts items like 'ADMIN', 'VENDOR', or numeric user ids in the array.
   */
  async expandTargets(targets: Array<string | number>): Promise<number[]> {
    const ids: number[] = [];
    for (const t of targets) {
      if (typeof t === 'number') {
        ids.push(t);
      } else if (typeof t === 'string') {
        const resolved = await this.resolveRoleToUserIds(t as UserRoleEnum);
        ids.push(...resolved);
      }
    }
    // dedupe
    return Array.from(new Set(ids));
  }
}
