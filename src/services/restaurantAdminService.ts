// src/services/RestaurantAdminService.ts
import { injectable, inject } from "tsyringe";
import { RestaurantAdminRepository } from "../repositories/RestaurantAdminRepository";
import { AppError } from "../errors/AppError";
import {
  CreateRestaurantInput,
  UpdateRestaurantInput,
} from "../dto/RestaurantDTO";

@injectable()
export class RestaurantAdminService {
  constructor(
    @inject(RestaurantAdminRepository)
    private repo: RestaurantAdminRepository
  ) {}

  /**
   * Crear restaurante (DTO ya validado)
   */
  createRestaurant(data: CreateRestaurantInput) {
    const { name, cuisine, rating = 0, neighborhood } = data;

    const id = this.repo.insertRestaurant(
      name,
      cuisine ?? null,
      rating,
      neighborhood ?? null
    );

    return { id };
  }

  /**
   * Actualizar restaurante
   */
  updateRestaurant(id: number, data: UpdateRestaurantInput) {
    if (!this.repo.restaurantExists(id)) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }

    const { name, cuisine, rating, neighborhood } = data;

    this.repo.updateRestaurant(
      id,
      name ?? null,
      cuisine ?? null,
      rating ?? null,
      neighborhood ?? null
    );

    return { id };
  }

  /**
   * Eliminar restaurante
   */
  deleteRestaurant(id: number) {
    if (!this.repo.restaurantExists(id)) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }

    this.repo.deleteRestaurant(id);

    return { id };
  }
}