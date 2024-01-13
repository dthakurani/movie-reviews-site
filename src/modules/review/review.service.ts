import { HttpStatus, Injectable } from '@nestjs/common';
import { Review } from './review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { CreateReviewDto, UpdateReviewDto } from './review.dto';
import { Movie } from '../movie/movie.entity';
import { CustomException } from 'src/utilities/custom-exception.utility';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,

    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async create(user: User, body: CreateReviewDto) {
    // Check for valid movie
    const movie = this.movieRepository.findOne({
      where: { id: body.movie_id },
    });

    if (!movie) {
      throw new CustomException(
        'Movie not found',
        'movie_id',
        HttpStatus.NOT_FOUND,
      );
    }

    const review = await this.reviewRepository.save({
      ...body,
      user_id: user.id,
    });

    return review;
  }

  async update(user: User, id: string, body: UpdateReviewDto) {
    // Check for valid review
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new CustomException(
        'Review not found',
        'review_id',
        HttpStatus.NOT_FOUND,
      );
    }

    // User can only update his review
    if (review.user_id !== user.id) {
      throw new CustomException(
        'Invalid user',
        'user_id',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Check for valid movie, if present
    if (body.movie_id) {
      const movie = this.movieRepository.findOne({
        where: { id: body.movie_id },
      });

      if (!movie) {
        throw new CustomException(
          'Movie not found',
          'movie_id',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    await this.reviewRepository.update({ id }, body);
  }
}
