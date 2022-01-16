import { Controller, HttpCode, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { MFile } from './mfile.class';
import { FileElementResponse } from './dto/file-element.response';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {

  constructor(private readonly _filesService: FilesService) {

  }

  @Post('upload')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse[]> {
    const saveArray: MFile[] = [new MFile(file)];
    if (file.mimetype.includes('image')) {
      const buffer = await this._filesService.convertToWebP(file.buffer);
      saveArray.push(
        new MFile(
          { buffer, originalname: `${file.originalname.split('.')[0]}.webp` }
        )
      )
    }

    return this._filesService.saveFiles(saveArray);
  }
}
