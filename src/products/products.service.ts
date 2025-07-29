import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private currentId = 1;

  create(createProductDto: CreateProductDto): Product {
    const product = new Product({
      id: this.currentId++,
      ...createProductDto,
    });

    this.products.push(product);
    return product;
  }

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto): Product {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const existingProduct = this.products[productIndex];
    const updatedProduct = new Product({
      ...existingProduct,
      ...updateProductDto,
      updatedAt: new Date(),
    });

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  remove(id: number): void {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    this.products.splice(productIndex, 1);
  }
}
