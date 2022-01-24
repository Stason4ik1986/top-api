import { Module } from '@nestjs/common';

import { TypegooseModule } from 'nestjs-typegoose';

import { TelegramModule } from 'src/telegram/telegram.module';
import { ReviewModel } from './review.model';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  imports: [
    TelegramModule,
    TypegooseModule.forFeature([{
      typegooseClass: ReviewModel,
      schemaOptions: {
        collection: 'Review',
      }
    }])
  ],
  providers: [ReviewService]
})
export class ReviewModule {}
