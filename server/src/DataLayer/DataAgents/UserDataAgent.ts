import { PrismaService } from 'src/InfrastructureLayer/Services/PrismaService';
import { FileCategory, User, UserRole, UserStatus } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { IUser } from '../Abstracts/Interface/IUser';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';

@Injectable()
export class UserDataAgent {
  constructor(private readonly prisma: PrismaService) {}

  async CreateUserAsync(data: IUser): Promise<User> {
    const createdUser = await this.prisma.user.create({ data: data });
    return createdUser;
  }

  async GetUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        location: true,
        userFiles: {
          where: {
            category: FileCategory.USER_PROFILE_IMAGE,
          },
          select: {
            id: true,
            fullPath: true,
          },
        },
        followers: true,
        followees: true,
        _count: {
          select: {
            followers: true,
            followees: true,
            comments: true,
            userPins: true,
          },
        },
      },
    });

    if (!user) return null;

    const { _count, ...userWithoutCount } = user;

    return {
      user: userWithoutCount,
      isFollowing: user.followers.length > 0, // I follow them
      isFollower: user.followees.length > 0, // They follow me
      counts: {
        followers: _count.followers,
        followees: _count.followees,
        comments: _count.comments,
        recommendations: _count.userPins, // renamed for clarity
      },
    };
  }

  async GetUserById(userId: number): Promise<any | null> {
    const loggedInUser = await UserHelper.getLoggedInUser();

    const user = await this.prisma.user.findUnique({
      where: { id: userId, isDeleted: false },
      include: {
        userFiles: true,
        userPins: true,
        location: true,
        followers: {
          where: { followerId: loggedInUser?.userId }, // I follow them
        },
        followees: {
          where: { followeeId: loggedInUser?.userId }, // They follow me
        },
        _count: {
          select: {
            followers: true,
            followees: true,
            comments: true,
            userPins: true,
          },
        },
      },
    });

    if (!user) return null;

    const { _count, ...userWithoutCount } = user;

    return {
      ...userWithoutCount,
      isFollowing: user.followers.length > 0,
      isFollower: user.followees.length > 0,
      counts: {
        followers: _count.followers,
        followees: _count.followees,
        comments: _count.comments,
        recommendations: _count.userPins, // renamed for clarity
      },
    };
  }

  async GetAdminUserById(userId: number): Promise<any | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, role: UserRole.ADMIN, isDeleted: false },
    });
    return user;
  }

  async GetAdminUserByRole(): Promise<any | null> {
    const user = await this.prisma.user.findFirst({
      where: { role: UserRole.ADMIN, isDeleted: false },
    });
    return user;
  }

  async UpdateUser(userId: number, data: Partial<User>): Promise<User> {
    const { id, ...updateData } = data;
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
      },
      include: { userFiles: true, location: true, userPins: true },
    });
    return updatedUser;
  }

  async DeleteUser(userId: number) {
    const deletedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        userStatus: UserStatus.DELETED,
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    return deletedUser;
  }

  async GetUsersByFilter(
    filters: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<IUser[]>> {
    const skip = (pageNumber - 1) * pageSize;

    const pageData = new PagedData<IUser[]>();
    pageData.page = Number(pageNumber);

    const finalFilters = { ...filters, isDeleted: false };

    const loggedInUser = await UserHelper.getLoggedInUser();
    filters['userId'] = filters?.userId ?? loggedInUser?.userId;

    const [totalUsers, filteredCount, users] = await Promise.all([
      this.prisma.user.count({ where: { isDeleted: false } }),
      this.prisma.user.count({ where: finalFilters }),
      this.prisma.user.findMany({
        where: {
          ...finalFilters,
          id: { not: filters?.userId }, // Exclude the logged-in user from the result
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(pageSize),
        include: {
          userPins: true,
          userFiles: {
            where: {
              category: FileCategory.USER_PROFILE_IMAGE,
            },
          },
          followers: {
            where: { followerId: filters?.userId }, // I follow them
          },
          followees: {
            where: { followeeId: filters?.userId }, // They follow me
          },
          _count: {
            select: {
              followers: true,
              followees: true,
              comments: true,
              userPins: true,
            },
          },
        },
      }),
    ]);

    pageData.total = totalUsers;
    pageData.pageSize = filteredCount;

    pageData.data = users.map((user) => ({
      ...user,
      isFollowing: user.followers.length > 0, // I follow them
      isFollower: user.followees.length > 0, // They follow me
      counts: {
        followers: user._count.followers,
        followees: user._count.followees,
        comments: user._count.comments,
        recommendations: user._count.userPins, // Renamed for clarity
      },
    }));

    return pageData;
  }

  async AdminGetUsersByFilter(
    filters: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<IUser[]>> {
    const skip = (pageNumber - 1) * pageSize;

    const pageData = new PagedData<IUser[]>();
    pageData.page = Number(pageNumber);

    const finalFilters = { ...filters, isDeleted: false };

    const [totalUsers, filteredCount, users] = await Promise.all([
      this.prisma.user.count({ where: { isDeleted: false } }),
      this.prisma.user.count({ where: finalFilters }),
      this.prisma.user.findMany({
        where: {
          ...finalFilters,
          id: { not: filters?.userId },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(pageSize),
        include: {
          userPins: true,
          userFiles: {
            where: {
              category: FileCategory.USER_PROFILE_IMAGE,
            },
          },
          followers: true,
          followees: true,
          _count: {
            select: {
              followers: true,
              followees: true,
              comments: true,
            },
          },
        },
      }),
    ]);

    pageData.total = totalUsers;
    pageData.pageSize = filteredCount;

    pageData.data = users.map((user) => ({
      ...user,
      isFollower: user.followers.length > 0,
      isFollowing: user.followees.length > 0,
      followers: user._count.followers,
      followees: user._count.followees,
      comments: user._count.comments,
    }));

    return pageData;
  }

  async ConnectUserFile(userId: number, fileId: number) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        userFiles: {
          connect: { id: fileId },
        },
      },
      include: {
        userFiles: true,
      },
    });
  }

  async getAdminOverview() {
    const totalUsers = await this.prisma.user.count({});

    const newSignups = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)), // Last 7 days
        },
      },
    });

    const activeAccounts = await this.prisma.user.count({
      where: {
        userStatus: UserStatus.ACTIVE,
      },
    });

    const deletedAccounts = await this.prisma.user.count({
      where: {
        userStatus: UserStatus.DELETED,
      },
    });

    return {
      numberOfUsers: totalUsers,
      newSignups: newSignups,
      activeAccounts: activeAccounts,
      deletedAccounts: deletedAccounts,
    };
  }
}

