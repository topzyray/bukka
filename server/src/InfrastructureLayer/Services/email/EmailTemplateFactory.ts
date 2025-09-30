import { Injectable } from '@nestjs/common';
import { HandlebarsEngine } from './template-engine/HandleBarsEngine';
import { EmailTemplateEngineEnum } from 'src/DomainLayer/Enums/EmailTemplateEngineEnum';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { ManualTemplateEngine } from './template-engine/ManualEngine';
import { IEmailTemplateEngine } from 'src/DataLayer/Abstracts/Interfaces/IEmailTemplateEngine';

@Injectable()
export class EmailTemplateFactory {
  constructor(
    private readonly handlebarsEngine: HandlebarsEngine,
    private readonly manualEngine: ManualTemplateEngine,
    private readonly configService: AppConfigurationService,
  ) {}

  getEngine(): IEmailTemplateEngine {
    const engine = this.configService.emailTemplateEngine;

    switch (engine) {
      case EmailTemplateEngineEnum.HANDLEBARS:
        return this.handlebarsEngine;
      case EmailTemplateEngineEnum.MANUAL:
        return this.manualEngine;
      default:
        throw new Error('Invalid or missing template engine provider');
    }
  }
}
