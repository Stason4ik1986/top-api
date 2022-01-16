import { Module } from '@nestjs/common';

import { path } from 'app-root-path';
import { ServeStaticModule } from '@nestjs/serve-static';

import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: `${path}/uploads`,
    serveRoot: '/static'
  })],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule {}
