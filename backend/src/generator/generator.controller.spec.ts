import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './generator.service';

describe('GeneratorController', () => {
  let controller: GeneratorController;
  let service: GeneratorService;

  const mockGeneratorService = {
    generate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneratorController],
      providers: [
        {
          provide: GeneratorService,
          useValue: mockGeneratorService,
        },
      ],
    }).compile();

    controller = module.get<GeneratorController>(GeneratorController);
    service = module.get<GeneratorService>(GeneratorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call generatorService.generate and return { result }', async () => {
    const mockResult = 'Generated architecture specification';
    mockGeneratorService.generate.mockResolvedValue(mockResult);

    const dto = {
      prompt: 'Build a checkout system',
      integrations: ['Stripe', 'Slack'],
    };

    const response = await controller.generate(dto);

    expect(service.generate).toHaveBeenCalledWith(dto.prompt, dto.integrations);
    expect(response).toEqual({ result: mockResult });
  });
});
