import { Body, Controller, Param, Patch, Post, Req } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto, UpdateMovieDto } from './movie.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  async create(@Req() request: Request, @Body() body: CreateMovieDto) {
    const user = request['user'];

    return await this.movieService.create(user, body);
  }

  @Patch(':id')
  async Update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() body: UpdateMovieDto,
  ) {
    const user = request['user'];

    return await this.movieService.update(user, id, body);
  }
}
