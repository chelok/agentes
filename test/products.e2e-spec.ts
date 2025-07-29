import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { ProductsModule } from '../src/products/products.module';
import { Product } from '../src/products/entities/product.entity';

describe('ProductsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/products (POST)', () => {
    it('should create a product', () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      return request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(201)
        .expect((res) => {
          const product = res.body as Product;
          expect(product.id).toBeDefined();
          expect(product.name).toBe(createProductDto.name);
          expect(product.description).toBe(createProductDto.description);
          expect(product.price).toBe(createProductDto.price);
          expect(product.stock).toBe(createProductDto.stock);
          expect(product.createdAt).toBeDefined();
          expect(product.updatedAt).toBeDefined();
        });
    });
  });

  describe('/products (GET)', () => {
    it('should return empty array when no products exist', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect([]);
    });

    it('should return all products', async () => {
      const createProductDto1 = {
        name: 'Test Product 1',
        description: 'Test Description 1',
        price: 100,
        stock: 10,
      };

      const createProductDto2 = {
        name: 'Test Product 2',
        description: 'Test Description 2',
        price: 200,
        stock: 20,
      };

      // Create two products
      await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto1)
        .expect(201);

      await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto2)
        .expect(201);

      // Get all products
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect((res) => {
          const products = res.body as Product[];
          expect(products).toHaveLength(2);
          expect(products[0].name).toBe('Test Product 1');
          expect(products[1].name).toBe('Test Product 2');
        });
    });
  });

  describe('/products/:id (GET)', () => {
    it('should return a product by id', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      // Create a product
      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(201);

      const productId = (createResponse.body as Product).id;

      // Get the product by id
      return request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200)
        .expect((res) => {
          const product = res.body as Product;
          expect(product.id).toBe(productId);
          expect(product.name).toBe(createProductDto.name);
          expect(product.description).toBe(createProductDto.description);
          expect(product.price).toBe(createProductDto.price);
          expect(product.stock).toBe(createProductDto.stock);
        });
    });

    it('should return 404 when product not found', () => {
      return request(app.getHttpServer()).get('/products/999').expect(404);
    });
  });

  describe('/products/:id (PATCH)', () => {
    it('should update a product', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      // Create a product
      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(201);

      const productId = (createResponse.body as Product).id;

      const updateProductDto = {
        name: 'Updated Product',
        price: 150,
      };

      // Update the product
      return request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .send(updateProductDto)
        .expect(200)
        .expect((res) => {
          const product = res.body as Product;
          expect(product.id).toBe(productId);
          expect(product.name).toBe('Updated Product');
          expect(product.description).toBe('Test Description'); // unchanged
          expect(product.price).toBe(150);
          expect(product.stock).toBe(10); // unchanged
        });
    });

    it('should return 404 when updating non-existent product', () => {
      const updateProductDto = {
        name: 'Updated Product',
      };

      return request(app.getHttpServer())
        .patch('/products/999')
        .send(updateProductDto)
        .expect(404);
    });
  });

  describe('/products/:id (DELETE)', () => {
    it('should delete a product', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      // Create a product
      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(201);

      const productId = (createResponse.body as Product).id;

      // Delete the product
      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .expect(200)
        .expect((res) => {
          const response = res.body as { message: string };
          expect(response.message).toBe(
            `Product with ID ${productId} has been deleted`,
          );
        });

      // Verify the product is deleted
      return request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent product', () => {
      return request(app.getHttpServer()).delete('/products/999').expect(404);
    });
  });
});
