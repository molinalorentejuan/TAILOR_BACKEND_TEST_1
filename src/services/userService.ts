// src/services/UserService.ts
import { injectable, inject } from "tsyringe";
import { UserRepository } from "../repositories/UserRepository";
import { ReviewRepository } from "../repositories/ReviewRepository";
import { FavoriteRepository } from "../repositories/FavoriteRepository";
import { RestaurantRepository } from "../repositories/RestaurantRepository";
import { AppError } from "../errors/AppError";

import {
  UpdateReviewInput,
  ReviewIdParamInput,
} from "../dto/ReviewDTO";

@injectable()
export class UserService {
  constructor(
    @inject(UserRepository)
    private userRepo: UserRepository,

    @inject(ReviewRepository)
    private reviewRepo: ReviewRepository,

    @inject(FavoriteRepository)
    private favoriteRepo: FavoriteRepository,

    @inject(RestaurantRepository)
    private restaurantRepo: RestaurantRepository
  ) {}

  /**
   * Obtener usuario autenticado
   */
  getUserById(id: number) {
    const user = this.userRepo.findUserById(id);
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
    return user;
  }

  /**
   * Listar reviews del usuario
   */
  listReviewsByUser(userId: number) {
    return this.reviewRepo.listReviewsByUser(userId);
  }

  /**
   * Actualizar review del usuario
   */
  updateUserReview(
    reviewParams: ReviewIdParamInput,
    data: UpdateReviewInput,
    userId: number
  ) {
    const existing = this.reviewRepo.findUserReview(reviewParams.id, userId);
    if (!existing) {
      throw new AppError("Review not found", 404, "REVIEW_NOT_FOUND");
    }

    this.reviewRepo.updateReview(
      reviewParams.id,
      data.rating,
      data.comment ?? null
    );

    return { id: reviewParams.id };
  }

  /**
   * Eliminar review del usuario
   */
  deleteUserReview(reviewParams: ReviewIdParamInput, userId: number) {
    const existing = this.reviewRepo.findUserReview(reviewParams.id, userId);
    if (!existing) {
      throw new AppError("Review not found", 404, "REVIEW_NOT_FOUND");
    }

    this.reviewRepo.deleteReview(reviewParams.id);
    return { id: reviewParams.id };
  }

  /**
   * Añadir favorito
   */
  addFavorite(userId: number, restaurantId: number) {
    const restaurant = this.restaurantRepo.findRestaurantById(restaurantId);
    if (!restaurant) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }

    const res = this.favoriteRepo.insertFavorite(userId, restaurantId);

    if (res === "DUPLICATE") {
      throw new AppError("Already in favorites", 409, "ALREADY_FAVORITE");
    }

    return { restaurantId };
  }

  /**
   * Borrar favorito
   */
  removeFavorite(userId: number, restaurantId: number) {
    this.favoriteRepo.deleteFavorite(userId, restaurantId);
    return { restaurantId };
  }

  /**
   * Listar favoritos
   */
  listFavoritesByUser(userId: number) {
    return this.favoriteRepo.listFavoritesByUser(userId);
  }
}