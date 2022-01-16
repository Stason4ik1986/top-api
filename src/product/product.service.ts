import { Injectable } from '@nestjs/common';

import { InjectModel } from 'nestjs-typegoose';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';

import { ReviewModel } from './../review/review.model';
import { ProductModel } from './product.model';
import { FindProductDto } from './dto/find-product.dto';
import { CreateProductDto } from './dto/create-product.dto';


@Injectable()
export class ProductService {
  constructor(@InjectModel(ProductModel) private readonly _productModel: ModelType<ProductModel>) { }

  async create(dto: CreateProductDto): Promise<DocumentType<ProductModel>> {
    return this._productModel.create(dto);
  }

  async findById(id: string): Promise<DocumentType<ProductModel> | null> {
    return this._productModel.findById(id).exec();
  }

  async deleteById(id: string): Promise<DocumentType<ProductModel> | null> {
    return this._productModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: ProductModel): Promise<DocumentType<ProductModel> | null> {
    return this._productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findWithReviews(dto: FindProductDto) {
    return this._productModel.aggregate([
      {
        $match: {
          categories: dto.category
        }
      },
      {
        $sort: {
          _id: 1,
        }
      },
      {
        $limit: dto.limit
      },
      {
        $lookup: {
          from: 'Review',
          localField: '_id',
          foreignField: 'productId',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          reviewAvg: { $avg: '$reviews.rating' },
          reviewCount: { $size: '$reviews' },
          reviews: {
            $function: {
              body: `function (reviews) {
                reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                return reviews;
              }`,
              args: ['$reviews'],
              lang: 'js'
            }
          }
        }
      },
    ]).exec() as Promise<(ProductModel & { reviews: ReviewModel[], reviewAvg: number, reviewCount: number })[]>;
  }

}
