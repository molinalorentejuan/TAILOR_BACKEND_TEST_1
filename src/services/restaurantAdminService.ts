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

  createRestaurant(data: CreateRestaurantInput) {
    const {
      name,
      neighborhood,
      cuisine,
      rating = 0,
      address,
      photograph,
      lat,
      lng,
      image,
    } = data;

    const id = this.repo.insertRestaurant(
      name,
      neighborhood ?? null,
      cuisine ?? null,
      rating,
      address ?? null,
      photograph ?? null,
      lat ?? null,
      lng ?? null,
      image ?? null
    );

    return { id };
  }

  updateRestaurant(id: number, data: UpdateRestaurantInput) {
    if (!this.repo.restaurantExists(id)) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }

    const {
      name,
      neighborhood,
      cuisine,
      rating,
      address,
      photograph,
      lat,
      lng,
      image,
    } = data;

    this.repo.updateRestaurant(
      id,
      name ?? null,
      neighborhood ?? null,
      cuisine ?? null,
      rating ?? null,
      address ?? null,
      photograph ?? null,
      lat ?? null,
      lng ?? null,
      image ?? null
    );

    return { id };
  }

  deleteRestaurant(id: number) {
    if (!this.repo.restaurantExists(id)) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }

    this.repo.deleteRestaurant(id);
    return { id };
  }
}