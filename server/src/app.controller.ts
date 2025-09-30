import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BukkaResponse } from './DomainLayer/Models/BukkaResponse';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): BukkaResponse<any> {
    return this.appService.root();
  }
}
