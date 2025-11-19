// src/services/adminService.ts
import { adminRepository } from '../repositories/adminRepository';

export function getAdminStats() {
  const usersCount = adminRepository.countUsers();
  const reviewsCount = adminRepository.countReviews();
  const restaurantsCount = adminRepository.countRestaurants();

  const topRated = adminRepository.getTopRated();
  const mostReviewed = adminRepository.getMostReviewed();

  return {
    usersCount,
    reviewsCount,
    restaurantsCount,
    topRated,
    mostReviewed,
  };
}