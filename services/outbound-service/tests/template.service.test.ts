import { describe, it, expect } from 'vitest';
import { TemplateService } from '../src/services/template.service.js';

describe('TemplateService Unit Tests', () => {
  it('correctly interpolates single and multiple template variables', () => {
    const template = 'Dear {{studentName}}, your application for {{jobTitle}} at {{companyName}} is confirmed!';
    const context = {
      studentName: 'Arjun Sharma',
      jobTitle: 'Backend Engineer',
      companyName: 'Google'
    };

    const rendered = TemplateService.render(template, context);
    expect(rendered).toBe('Dear Arjun Sharma, your application for Backend Engineer at Google is confirmed!');
  });

  it('leaves placeholders unchanged when keys are missing from context', () => {
    const template = 'Hello {{studentName}}, package: {{packageLpa}} LPA.';
    const context = {
      studentName: 'Priya Nair'
    };

    const rendered = TemplateService.render(template, context);
    expect(rendered).toBe('Hello Priya Nair, package: {{packageLpa}} LPA.');
  });

  it('handles spaces within double curly braces', () => {
    const template = 'Status: {{  status  }} for candidate {{ name }}';
    const context = {
      status: 'SHORTLISTED',
      name: 'Rahul Verma'
    };

    const rendered = TemplateService.render(template, context);
    expect(rendered).toBe('Status: SHORTLISTED for candidate Rahul Verma');
  });
});
