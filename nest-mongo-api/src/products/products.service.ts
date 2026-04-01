import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model, SortOrder } from 'mongoose';
import { FilterProductDto } from './dto/filter-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEventService } from '../product-event/product-event.service';
import { ProductEventType } from '../product-event/product-event.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    private readonly eventService: ProductEventService,
  ) { }

  async create(
    data: CreateProductDto,
    files: Express.Multer.File[],
    user: { email: string },
  ) {
    const imagePaths = files?.map(file => file.filename) || [];

    const product = new this.productModel({
      ...data,
      images: imagePaths,
    });

    const savedProduct = await product.save(); // ✅ FIX

    await this.eventService.createEvent({
      type: ProductEventType.CREATE,
      productId: savedProduct._id.toString(), // ✅ FIX (string)
      productName: savedProduct.name,
      email: user.email, // ✅ dynamic email
      id: 0,
    });

    return savedProduct; // ✅ FIX
  }

  // ✅ FILTER METHOD (FULLY FIXED TYPES)
  async findAll(query: FilterProductDto) {
    const filter: {
      name?: { $regex: string; $options: string };
      stock?: { $gt?: number; $lte?: number };
      createdAt?: { $gte?: Date; $lte?: Date };
    } = {};

    // Name filter
    if (query.name && query.name.trim() !== '') {
      filter.name = {
        $regex: query.name.trim(),
        $options: 'i',
      };
    }

    // Stock filter
    if (query.inStock !== undefined) {
      filter.stock = query.inStock ? { $gt: 0 } : { $lte: 0 };
    }

    // Date filter
    if (query.startDate || query.endDate) {
      const createdAt: { $gte?: Date; $lte?: Date } = {};

      if (query.startDate) {
        const start = new Date(query.startDate);
        if (!isNaN(start.getTime())) {
          start.setHours(0, 0, 0, 0);
          createdAt.$gte = start;
        }
      }

      if (query.endDate) {
        const end = new Date(query.endDate);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          createdAt.$lte = end;
        }
      }

      if (Object.keys(createdAt).length > 0) {
        filter.createdAt = createdAt;
      }
    }

    // Sort
    const sort: Record<string, SortOrder> = {};

    if (query.sortBy) {
      const order: SortOrder = query.order === 'asc' ? 1 : -1;
      sort[query.sortBy] = order;
    } else {
      sort.createdAt = -1;
    }

    const products = await this.productModel.find(filter).sort(sort).lean();

    return products;
  }

  async findOne(id: string) {
    return await this.productModel.findById(id).lean();
  }

async update(
  id: string,
  data: Partial<Product>,
  files?: Express.Multer.File[],
  user?: { email: string }, // ✅ ADD THIS
) {
  const product = await this.productModel.findById(id);

  if (!product) {
    return null;
  }

  let updateData: any = { ...data };

  // ✅ If new images uploaded → delete old ones
  if (files && files.length > 0) {
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        const filePath = path.join(process.cwd(), 'uploads', image);

        try {
          await fs.promises.unlink(filePath);
        } catch (err) {
          console.log('File not found (skip):', filePath);
        }
      }
    }

    const imagePaths = files.map(file => file.filename);
    updateData.images = imagePaths;
  }

  const updatedProduct = await this.productModel
    .findByIdAndUpdate(id, updateData, { new: true })
    .lean();

  // ✅ ADD EVENT (DO NOT BREAK FLOW)
  if (updatedProduct && user?.email) {
    await this.eventService.createEvent({
      type: ProductEventType.UPDATE,
      productId: updatedProduct._id.toString(),
      productName: updatedProduct.name,
      email: user.email,
      id: 0,
    });
  }

  return updatedProduct;
}

async delete(id: string, user?: { email: string }) {
  const product = await this.productModel.findById(id);

  console.log('PRODUCT FOUND:', product);

  if (!product) {
    console.log('No product found');
    return null;
  }

  console.log('IMAGES:', product.images);

  if (product.images && product.images.length > 0) {
    for (const image of product.images) {
      const filePath = path.join(process.cwd(), 'uploads', image);

      console.log('Trying to delete:', filePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Deleted:', filePath);
      } else {
        console.log('File NOT found:', filePath);
      }
    }
  }

  // ✅ ADD EVENT BEFORE DELETE
  if (user?.email) {
    await this.eventService.createEvent({
      type: ProductEventType.DELETE,
      productId: product._id.toString(),
      productName: product.name,
      email: user.email,
      id: 0,
    });
  }

  return await this.productModel.findByIdAndDelete(id).lean();
}
}
