import { HttpStatus, Injectable } from '@nestjs/common';
import { Movie } from './movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { CreateMovieDto, FindAllMoviesDto, UpdateMovieDto } from './movie.dto';
import { CustomException } from 'src/utilities/custom-exception.utility';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async create(user: User, body: CreateMovieDto) {
    // Check if movie already exists
    const movie = await this.movieRepository.findOne({
      where: { name: ILike(body.name) },
    });

    if (movie) {
      throw new CustomException(
        'Movie with this name already exists',
        'name',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create new
    const newMovie = await this.movieRepository.save({
      ...body,
      user_id: user.id,
    });

    return newMovie;
  }

  async update(user: User, id: string, body: UpdateMovieDto) {
    // Check for valid movie
    const movie = await this.movieRepository.findOne({ where: { id } });

    if (!movie) {
      throw new CustomException('Movie not found', 'id', HttpStatus.NOT_FOUND);
    }

    // User can only update the movie created by him/her
    if (movie.user_id !== user.id) {
      throw new CustomException(
        'Invalid user',
        'user_id',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.movieRepository.update({ id }, body);
  }

  async findAll(query: FindAllMoviesDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const movies = await this.movieRepository.find({
      where: { name: ILike(`%${query.query_string}%`) },
      skip,
      take: limit,
    });

    return movies;
  }
}
