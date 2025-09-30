import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IEmailTemplateEngine } from 'src/DataLayer/Abstracts/Interfaces/IEmailTemplateEngine';

@Injectable()
export class ManualTemplateEngine implements IEmailTemplateEngine {
  async render(
    template: string,
    context: Record<string, any>,
  ): Promise<string> {
    const templatePath = path.resolve(
      'src',
      `UtilityLayer/Views/Templates/${template}.html`,
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template not found: ${templatePath}`);
    }

    let html = fs.readFileSync(templatePath, 'utf8');

    // Replace simple {{key}} placeholders
    if (context) {
      for (const key of Object.keys(context)) {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), context[key]);
      }
    }

    // Handle {{#each}} loops manually
    html = html.replace(
      /{{#each (\w+)}}([\s\S]*?){{\/each}}/g,
      (_, arrayName, block) => {
        const items = context[arrayName];
        if (!Array.isArray(items)) return '';
        return items.map((item) => block.replace(/{{this}}/g, item)).join('');
      },
    );

    return html;
  }
}
