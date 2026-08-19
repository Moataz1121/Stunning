import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorService } from './generator.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('GeneratorService', () => {
  let service: GeneratorService;
  const originalEnv = process.env;

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...originalEnv };

    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratorService],
    }).compile();

    service = module.get<GeneratorService>(GeneratorService);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException if GEMINI_API_KEY is not set', async () => {
    delete process.env.GEMINI_API_KEY;
    await expect(service.generate('Build a billing app', ['Stripe'])).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
