import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      const product = service.create(createProductDto);

      expect(product).toBeDefined();
      expect(product.id).toBe(1);
      expect(product.name).toBe(createProductDto.name);
      expect(product.description).toBe(createProductDto.description);
      expect(product.price).toBe(createProductDto.price);
      expect(product.stock).toBe(createProductDto.stock);
      expect(product.createdAt).toBeInstanceOf(Date);
      expect(product.updatedAt).toBeInstanceOf(Date);
    });

    it('should increment id for each new product', () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      const product1 = service.create(createProductDto);
      const product2 = service.create(createProductDto);

      expect(product1.id).toBe(1);
      expect(product2.id).toBe(2);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no products exist', () => {
      const products = service.findAll();
      expect(products).toEqual([]);
    });

    it('should return all products', () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      service.create(createProductDto);
      service.create({ ...createProductDto, name: 'Test Product 2' });

      const products = service.findAll();
      expect(products).toHaveLength(2);
      expect(products[0].name).toBe('Test Product');
      expect(products[1].name).toBe('Test Product 2');
    });
  });

  describe('findOne', () => {
    it('should return a product by id', () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      const createdProduct = service.create(createProductDto);
      const foundProduct = service.findOne(createdProduct.id);

      expect(foundProduct).toEqual(createdProduct);
    });

    it('should throw NotFoundException when product not found', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
      expect(() => service.findOne(999)).toThrow(
        'Product with ID 999 not found',
      );
    });
  });

  describe('update', () => {
    it('should update a product', () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      const createdProduct = service.create(createProductDto);
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 150,
      };

      const updatedProduct = service.update(
        createdProduct.id,
        updateProductDto,
      );

      expect(updatedProduct.id).toBe(createdProduct.id);
      expect(updatedProduct.name).toBe('Updated Product');
      expect(updatedProduct.description).toBe('Test Description'); // unchanged
      expect(updatedProduct.price).toBe(150);
      expect(updatedProduct.stock).toBe(10); // unchanged
      expect(updatedProduct.createdAt).toEqual(createdProduct.createdAt);
      expect(updatedProduct.updatedAt.getTime()).toBeGreaterThanOrEqual(
        createdProduct.updatedAt.getTime(),
      );
    });

    it('should throw NotFoundException when product not found', () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
      };

      expect(() => service.update(999, updateProductDto)).toThrow(
        NotFoundException,
      );
      expect(() => service.update(999, updateProductDto)).toThrow(
        'Product with ID 999 not found',
      );
    });
  });

  describe('remove', () => {
    it('should remove a product', () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      const createdProduct = service.create(createProductDto);
      expect(service.findAll()).toHaveLength(1);

      service.remove(createdProduct.id);
      expect(service.findAll()).toHaveLength(0);
    });

    it('should throw NotFoundException when product not found', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
      expect(() => service.remove(999)).toThrow(
        'Product with ID 999 not found',
      );
    });
  });
});
