import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Movie is required' })
  movie_id: string;

  @IsNotEmpty({ message: 'Rating is required' })
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(10, { message: 'Rating must be at most 10' })
  rating: number;

  @IsOptional()
  comment: string;
}

export class UpdateReviewDto {
  @IsOptional()
  movie_id: string;

  @IsOptional()
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(10, { message: 'Rating must be at most 10' })
  rating: number;

  @IsOptional()
  comment: string;
}
