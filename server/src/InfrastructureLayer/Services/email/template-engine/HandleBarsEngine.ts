import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { IEmailTemplateEngine } from 'src/DataLayer/Abstracts/Interfaces/IEmailTemplateEngine';

@Injectable()
export class HandlebarsEngine implements IEmailTemplateEngine {
  async render(
    template: string,
    context: Record<string, any>,
  ): Promise<string> {
    const templatesDir =
      process.env.EMAIL_TEMPLATES_DIR ||
      path.join(__dirname, '../../../Views/Templates');
    const templatePath = path.join(templatesDir, `${template}.hbs`);
    const fileContent = await fs.readFile(templatePath, 'utf-8');
    const compile = Handlebars.compile(fileContent);
    return compile(context);
  }
}
