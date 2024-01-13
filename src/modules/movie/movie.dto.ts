import { Transform } from 'class-transformer';
import { IsISO8601, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty({ message: 'Movie name is required' })
  name: string;

  @IsNotEmpty({ message: 'Release date of movie is required' })
  @IsISO8601({ strict: true }, { message: 'Invalid date' })
  release_date: string;
}

export class UpdateMovieDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsISO8601({ strict: true }, { message: 'Invalid date' })
  release_date: string;
}

export class FindAllMoviesDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @IsOptional()
  query_string: string;
}
