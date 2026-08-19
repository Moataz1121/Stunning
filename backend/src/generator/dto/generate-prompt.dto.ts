import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export const ALLOWED_INTEGRATIONS = [
  'Stripe',
  'Shopify',
  'Gmail',
  'Slack',
  'Google Sheets',
] as const;

export type IntegrationType = (typeof ALLOWED_INTEGRATIONS)[number];

export class GeneratePromptDto {
  @IsString()
  @IsNotEmpty({ message: 'Prompt is required.' })
  @MinLength(10, { message: 'Prompt must be at least 10 characters long.' })
  @MaxLength(2000, { message: 'Prompt cannot exceed 2000 characters.' })
  prompt!: string;

  @IsOptional()
  @IsArray({ message: 'Integrations must be an array of strings.' })
  @IsString({ each: true, message: 'Each integration must be a string.' })
  @IsIn(ALLOWED_INTEGRATIONS, {
    each: true,
    message:
      'Integration must be one of: Stripe, Shopify, Gmail, Slack, Google Sheets.',
  })
  integrations?: string[];
}
