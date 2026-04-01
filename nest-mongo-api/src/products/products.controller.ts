import { diskStorage } from 'multer';
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorator/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  // ✅ CREATE
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + file.originalname.replace(/\s/g, '');
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Images are required');
    }

    return await this.productService.create(dto, files, req.user); // ✅ PASS USER
  }

  // ✅ GET ALL
  @Get()
  async findAll(@Query() query: FilterProductDto) {
    return await this.productService.findAll(query);
  }

  // ✅ GET ONE
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  // ✅ UPDATE
  @Roles('admin')
  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + file.originalname.replace(/\s/g, '');
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() data,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    return await this.productService.update(id, data, files, req.user); // ✅ PASS USER
  }

  // ✅ DELETE
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req) {
    return await this.productService.delete(id, req.user); // ✅ PASS USER
  }
}