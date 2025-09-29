import { Injectable } from '@nestjs/common';
import { IUserNotification } from '../Abstracts/Interface/IUserNotification';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { PrismaService } from 'src/InfrastructureLayer/Services/PrismaService';
import { FileCategory, UserNotification } from '@prisma/client';

@Injectable()
export class UserNotificationDataAgent {
  constructor(private readonly prisma: PrismaService) {}

  async DropUserNotificationsByUserId(userId: number) {
    await this.prisma.userNotification.deleteMany({ where: { id: userId } });
    return null;
  }

  async CreateUserNotification(
    data: IUserNotification,
  ): Promise<UserNotification> {
    const result = await this.prisma.userNotification.create({ data });

    return result;
  }

  async CreateUsersNotification(data: IUserNotification[]) {
    const results = await this.prisma.userNotification.createMany({ data });
    return results;
  }

  async UpdateUserNotification(data: Partial<UserNotification>) {
    const { id: notificationId, ...updateData } = data;
    return await this.prisma.userNotification.update({
      where: {
        id: notificationId,
      },
      data: updateData,
    });
  }

  async GetUserNotificationById(
    notificaitonId: number,
  ): Promise<UserNotification | null> {
    return await this.prisma.userNotification.findUnique({
      where: {
        id: notificaitonId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            userFiles: {
              where: {
                category: FileCategory.USER_PROFILE_IMAGE,
              },
            },
          },
        },
      },
    });
  }

  async GetUserNotificationByUserId(
    filters: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<IUserNotification[]>> {
    const { userId, ...otherFilters } = filters;
    const skip = (pageNumber - 1) * pageSize;
    const pageData = new PagedData<IUserNotification[]>();

    pageData.page = Number(pageNumber);

    const totalNotificationsForUser = await this.prisma.userNotification.count({
      where: {
        userId,
      },
    });
    pageData.total = totalNotificationsForUser;

    const filteredCount = await this.prisma.userNotification.count({
      where: otherFilters,
    });

    const notificationsForUser = await this.prisma.userNotification.findMany({
      where: {
        userId,
        ...otherFilters,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(pageSize),
    });

    pageData.pageSize = filteredCount;
    pageData.data = notificationsForUser;

    return pageData;
  }

  async GetUserNotificationsByFilter(
    filters: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<IUserNotification[]>> {
    const skip = (pageNumber - 1) * pageSize;
    const pageData = new PagedData<IUserNotification[]>();

    pageData.page = Number(pageNumber);

    const totalNotifications = await this.prisma.userNotification.count();
    pageData.total = totalNotifications;

    const filteredCount = await this.prisma.userNotification.count({
      where: filters,
    });

    const userNotifications = await this.prisma.userNotification.findMany({
      where: filters,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            userFiles: {
              where: {
                category: FileCategory.USER_PROFILE_IMAGE,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(pageSize),
    });

    pageData.pageSize = filteredCount;
    pageData.data = userNotifications;

    return pageData;
  }

  async ViewUserNotification(
    userNotification: UserNotification,
  ): Promise<UserNotification> {
    userNotification.isRead = true;
    return await this.UpdateUserNotification(userNotification);
  }

  async ViewAllUserNotification(userId: number) {
    await this.prisma.userNotification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return null;
  }

  async DeleteUserNotification(
    userNotification: UserNotification,
  ): Promise<UserNotification> {
    return await this.UpdateUserNotification(userNotification);
  }
}

