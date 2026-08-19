import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { GeneratePromptDto } from './dto/generate-prompt.dto';

@Controller('api/generate')
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async generate(@Body() dto: GeneratePromptDto): Promise<{ result: string }> {
    const result = await this.generatorService.generate(
      dto.prompt,
      dto.integrations,
    );
    return { result };
  }
}
