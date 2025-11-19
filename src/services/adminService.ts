// src/services/adminService.ts
import { adminRepo } from '../repositories/adminRepository';

export function getAdminStats() {
  const usersCount = adminRepo.countUsers();
  const reviewsCount = adminRepo.countReviews();
  const restaurantsCount = adminRepo.countRestaurants();

  const topRated = adminRepo.getTopRated();
  const mostReviewed = adminRepo.getMostReviewed();

  return {
    usersCount,
    reviewsCount,
    restaurantsCount,
    topRated,
    mostReviewed,
  };
}