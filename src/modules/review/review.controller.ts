import { Body, Controller, Param, Patch, Post, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from './review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(@Req() request: Request, @Body() body: CreateReviewDto) {
    const user = request['user'];

    return await this.reviewService.create(user, body);
  }

  @Patch(':id')
  async update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() body: UpdateReviewDto,
  ) {
    const user = request['user'];

    return await this.reviewService.update(user, id, body);
  }
}
