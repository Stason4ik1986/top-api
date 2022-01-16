import { Injectable } from '@nestjs/common';

import { InjectModel } from 'nestjs-typegoose';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';

import { TopLevelCategory, TopPageModel } from './top-page.model';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(@InjectModel(TopPageModel) private readonly _topPageModel: ModelType<TopPageModel>) { }

  async create(dto: CreateTopPageDto): Promise<DocumentType<TopPageModel>> {
    return this._topPageModel.create(dto);
  }

  async findById(id: string): Promise<DocumentType<TopPageModel> | null> {
    return this._topPageModel.findById(id).exec();
  }

  async findByAlias(alias: string): Promise<DocumentType<TopPageModel> | null> {
    return this._topPageModel.findOne({ alias }).exec();
  }

  async findByCategory(firstCategory: TopLevelCategory) {
    return this._topPageModel
      .aggregate([
        {
          $match: {
            firstCategory
          }
        },
        {
          $group: {
            _id: {
              secondCategory: '$secondCategory'
            },
            pages: { $push: { alias: '$alias', title: '$title' } }
          }
        }
      ])
      .exec();
  }

  async findByText(text: string) {
    return this._topPageModel.find({ $text: { $search: text, $caseSensitive: false } }).exec();
  }

  async deleteById(id: string): Promise<DocumentType<TopPageModel> | null> {
    return this._topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDto): Promise<DocumentType<TopPageModel> | null> {
    return this._topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

}
