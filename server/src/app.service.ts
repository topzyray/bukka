import { HttpStatus, Injectable } from '@nestjs/common';
import { BukkaResponse } from './DomainLayer/Models/BukkaResponse';

@Injectable()
export class AppService {
  root(): BukkaResponse<any> {
    return BukkaResponse.CustomResponse('', HttpStatus.OK, true, {
      message: 'Welcome to Bukka Server!',
    });
  }
}
