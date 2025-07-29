import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      const result = controller.create(createProductDto);

      expect(result).toBeInstanceOf(Product);
      expect(result.name).toBe(createProductDto.name);
      expect(result.description).toBe(createProductDto.description);
      expect(result.price).toBe(createProductDto.price);
      expect(result.stock).toBe(createProductDto.stock);
    });
  });

  describe('findAll', () => {
    it('should return all products', () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      service.create(createProductDto);
      service.create({ ...createProductDto, name: 'Test Product 2' });

      const result = controller.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Test Product');
      expect(result[1].name).toBe('Test Product 2');
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
      const result = controller.findOne(createdProduct.id);

      expect(result).toEqual(createdProduct);
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

      const result = controller.update(createdProduct.id, updateProductDto);

      expect(result.name).toBe('Updated Product');
      expect(result.price).toBe(150);
      expect(result.description).toBe('Test Description');
      expect(result.stock).toBe(10);
    });
  });

  describe('remove', () => {
    it('should remove a product and return success message', () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      const createdProduct = service.create(createProductDto);
      const result = controller.remove(createdProduct.id);

      expect(result).toEqual({
        message: `Product with ID ${createdProduct.id} has been deleted`,
      });
      expect(service.findAll()).toHaveLength(0);
    });
  });
});
