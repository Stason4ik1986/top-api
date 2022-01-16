import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Max(5, { message: 'Should be less or equal than 5' })
  @Min(1, { message: 'Should be more or equal than 1' })
  @IsNumber()
  rating: number;

  @IsString()
  productId: string;
}