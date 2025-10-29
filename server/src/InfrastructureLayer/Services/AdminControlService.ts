import { Injectable } from '@nestjs/common';
import { deleteAllCache } from './cache/CacheUtils';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';

@Injectable()
export class AdminControlService {
  async clearAllCache(): Promise<BukkaResponse<any>> {
    const result = await deleteAllCache();
    return BukkaResponse.DeleteResponse('Cache', true, undefined, result);
  }
}
