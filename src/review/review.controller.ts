import { ReviewService } from './review.service';
import {
  Get,
  Post,
  Delete,
  Body,
  Param,
  Controller,
  UsePipes,
  UseGuards,
  HttpStatus,
  HttpException,
  ValidationPipe,
} from '@nestjs/common';

import { UserEmail } from '../decorators/user-email.decorator';
import { JwtAuthGuard } from './../auth/guards/jwt.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constants';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TelegramService } from 'src/telegram/telegram.service';

@Controller('review')
export class ReviewController {

  constructor(
    private readonly _reviewService: ReviewService,
    private readonly _telegramService: TelegramService,
  ) { }

  @UsePipes(new ValidationPipe())
  @Post('notify')
  async notify(@Body() dto: CreateReviewDto) {
    const message = `Name: ${dto.name}\n` +
      `Title: ${dto.title}\n` +
      `Description: ${dto.description}\n` +
      `Rating: ${dto.rating}\n` +
      `Product ID: ${dto.productId}\n`;
    return this._telegramService.sendMessage(message);
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this._reviewService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this._reviewService.delete(id);

    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('byProduct/:productId')
  async getByProduct(@Param('productId', IdValidationPipe) productId: string, @UserEmail() email: string) {
    return this._reviewService.findByProductId(productId);
  }

}
