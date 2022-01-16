import { Injectable } from '@nestjs/common';

import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';

import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewModel } from './review.model';

@Injectable()
export class ReviewService {

  constructor(@InjectModel(ReviewModel) private readonly _reviewModel: ModelType<ReviewModel>) { }

  async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
    return this._reviewModel.create(dto);
  }

  async delete(id: string): Promise<DocumentType<ReviewModel> | null> {
    return this._reviewModel.findByIdAndDelete(id).exec();
  }

  async findByProductId(productId: string): Promise<DocumentType<ReviewModel>[]> {
    return this._reviewModel.find({ productId: new Types.ObjectId(productId) }).exec();
  }

  async deleteByProductId(productId: string) {
    return this._reviewModel.deleteMany({ productId: new Types.ObjectId(productId) }).exec();
  }
}
