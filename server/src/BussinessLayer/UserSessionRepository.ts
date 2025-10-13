import { ConflictException, Injectable } from '@nestjs/common';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';
import { UserSession } from 'src/DomainLayer/Models/UserSession';
import { UserSessionDataAgent } from 'src/DataLayer/DataAgents/UserSessionDataAgent';
import { CreateUserSessionDto } from 'src/DomainLayer/Dtos/UserSessionDto';

@Injectable()
export class UserSessionRepository {
  constructor(private readonly _userSessionDataAgent: UserSessionDataAgent) {}

  async createUserSession(dto: CreateUserSessionDto): Promise<UserSession> {
    const existingSession =
      await this._userSessionDataAgent.getSessionByUserIdAndDeviceId(
        dto.userId,
        dto.deviceId,
      );

    if (existingSession) {
      throw new ConflictException('There is an active session on this device!');
    }

    const result = await this._userSessionDataAgent.createSession(
      dto as Partial<UserSession>,
    );

    return result;
  }

  async findSessionById(
    personalizationId: number,
  ): Promise<UserSession | null> {
    return await this._userSessionDataAgent.getSessionById(personalizationId);
  }

  async getLoggedInUserSession(): Promise<BukkaResponse<UserSession>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const data = await this._userSessionDataAgent.getAllSessions(
      loggedInUser?.id,
    );
    return BukkaResponse.GetSingleDataResponse('User session', data);
  }

  async findUserSessionBy(userId: number): Promise<UserSession[] | []> {
    return this._userSessionDataAgent.getAllSessions(userId);
  }

  async findByRefreshToken(
    encryptedToken: string,
  ): Promise<UserSession | null> {
    return this._userSessionDataAgent.getSessionByRefreshToken(encryptedToken);
  }

  async findActiveSession(
    userId: number,
    deviceId: string,
  ): Promise<BukkaResponse<UserSession>> {
    const activeSesison =
      this._userSessionDataAgent.getSessionByUserIdAndDeviceId(
        userId,
        deviceId,
      );

    return BukkaResponse.deleteResponse(
      'Session',
      true,
      undefined,
      activeSesison,
    );
  }

  async updateUserSession(
    sessionId: number,
    updateData: Partial<UserSession>,
  ): Promise<BukkaResponse<UserSession>> {
    const session = await this._userSessionDataAgent.getSessionById(sessionId);

    if (!session) {
      return BukkaResponse.GetSingleDataResponse('User session', null);
    }

    const updatedSession = await this._userSessionDataAgent.updateSession(
      sessionId,
      updateData,
    );
    return BukkaResponse.updateResponse('User session', updatedSession);
  }

  async deleteSessionById(id: number): Promise<void> {
    await this._userSessionDataAgent.deleteSessionById(id);
  }

  async deleteSessionByUserIdAndDeviceId(
    userId: number,
    deviceId: string,
  ): Promise<BukkaResponse<UserSession>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    await UserHelper.hasAccess(loggedInUser.id);

    const userSession =
      await this._userSessionDataAgent.getSessionByUserIdAndDeviceId(
        userId,
        deviceId,
      );

    if (!userSession) {
      return BukkaResponse.GetSingleDataResponse('User session', null);
    }

    const deletedSession = this._userSessionDataAgent.deleteSessionById(
      userSession.id,
    );

    return BukkaResponse.deleteResponse(
      'Session',
      true,
      undefined,
      deletedSession,
    );
  }

  async deleteAllSession(): Promise<BukkaResponse<UserSession>> {
    const loggedInUser = await UserHelper.getLoggedInUser();
    await UserHelper.hasAccess(loggedInUser.id);

    const deletedSession = this._userSessionDataAgent.deleteAllSessions(
      loggedInUser.id,
    );

    // if (!deletedSession) {
    //   return BukkaResponse.GetSingleDataResponse("Session", null)
    // }

    return BukkaResponse.deleteResponse(
      'Session',
      true,
      undefined,
      deletedSession,
    );
  }
}
