import { HttpStatus, Injectable } from '@nestjs/common';
import { BukkaResponse } from './DomainLayer/Models/BukkaResponse';

@Injectable()
export class AppService {
  root(): BukkaResponse<any> {
    return BukkaResponse.customResponse('', HttpStatus.OK, true, {
      message: 'Welcome to Bukka API - The First of Its Kind!',
    });
  }
}
