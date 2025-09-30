export interface IEmailTemplateEngine {
  render(template: string, context: Record<string, any>): Promise<string>;
}
