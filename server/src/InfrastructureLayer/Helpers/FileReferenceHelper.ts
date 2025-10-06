import { BadRequestException, Injectable } from '@nestjs/common';
import { FileReferenceTypeEnum } from 'src/DomainLayer/Enums/FileReferenceTypeEnum';
import { UserDataAgent } from 'src/DataLayer/DataAgents/UserDataAgent';

@Injectable()
export class FileReferenceHelper {
  private readonly referenceAgentMap: Partial<
    Record<FileReferenceTypeEnum, { getById: (id: number) => Promise<any> }>
  >;

  constructor(private readonly userDataAgent: UserDataAgent) {
    this.referenceAgentMap = {
      [FileReferenceTypeEnum.USER]: this.userDataAgent,
    };
  }

  async validateFileReference(
    referenceType: FileReferenceTypeEnum,
    referenceId: number,
  ) {
    const agent = this.referenceAgentMap[referenceType];
    if (!agent) {
      throw new BadRequestException(
        `Unsupported reference type: ${referenceType}`,
      );
    }

    const record = await agent.getById(referenceId);
    if (!record) {
      throw new BadRequestException(
        `${referenceType} with ID ${referenceId} does not exist.`,
      );
    }

    return record;
  }
}
