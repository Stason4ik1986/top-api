import { JwtAuthGuard } from './../auth/guards/jwt.guard';
import {
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  Controller,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';

import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TopPageModel } from './top-page.model';
import { PAGE_NOT_FOUND } from './top-page.constants';
import { TopPageService } from './top-page.service';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Controller('top-page')
export class TopPageController {

  constructor(private _topPageService: TopPageService) { }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this._topPageService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const page = await this._topPageService.findById(id);

    if (!page) {
      throw new NotFoundException(PAGE_NOT_FOUND);
    }

    return page;

  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const page = await this._topPageService.findByAlias(alias);

    if (!page) {
      throw new NotFoundException(PAGE_NOT_FOUND);
    }

    return page;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedPage = await this._topPageService.deleteById(id);

    if (!deletedPage) {
      throw new NotFoundException(PAGE_NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTopPageDto) {
    const updatedPage = await this._topPageService.updateById(id, dto);

    if (!updatedPage) {
      throw new NotFoundException(PAGE_NOT_FOUND);
    }

    return updatedPage;

  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this._topPageService.findByCategory(dto.firstCategory);
  }

  @Post('textSearch/:text')
  async textSearch(@Param('text') text: string,) {
    return this._topPageService.findByText(text);
  }

}
