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

    // User can only update the movie created by him
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
    const { page, limit } = query;
    let skip;

    if (page && limit) {
      skip = (page - 1) * limit;
    }

    const [movies, count] = await Promise.all([
      this.movieRepository.find({
        where: query.query_string
          ? { name: ILike(`%${query.query_string}%`) }
          : null,
        skip,
        take: limit,
      }),
      this.movieRepository.count({
        where: query.query_string
          ? { name: ILike(`%${query.query_string}%`) }
          : null,
      }),
    ]);

    return { movies, count, page, limit };
  }

  async findOne(id: string) {
    // Check for valid movie
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['reviews'],
    });

    if (!movie) {
      throw new CustomException('Movie not found', 'id', HttpStatus.NOT_FOUND);
    }

    return movie;
  }
}
