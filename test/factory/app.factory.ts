import { Test } from '@nestjs/testing';
import { ModuleMetadata } from '@nestjs/common';

export const appFactory = async (module: ModuleMetadata) => {
  const moduleFixture = await Test.createTestingModule(module).compile();
  const app = moduleFixture.createNestApplication();
  app.init();

  return app;
};
