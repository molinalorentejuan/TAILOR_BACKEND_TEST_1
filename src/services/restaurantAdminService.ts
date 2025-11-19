import { restaurantAdminRepo } from '../repositories/restaurantAdminRepository';

interface RestaurantAdminInput {
  name: string;
  cuisine?: string;
  rating?: number;
  neighborhood?: string;
}

export function createRestaurant(input: RestaurantAdminInput) {
  const { name, cuisine, rating = 0, neighborhood } = input;

  const id = restaurantAdminRepo.insertRestaurant(
    name,
    cuisine ?? null,
    rating,
    neighborhood ?? null
  );

  return { id };
}

export function updateRestaurant(
  id: number,
  input: RestaurantAdminInput
): { type: 'OK' } | { type: 'NOT_FOUND' } {
  if (!restaurantAdminRepo.restaurantExists(id)) {
    return { type: 'NOT_FOUND' };
  }

  const { name, cuisine, rating, neighborhood } = input;

  restaurantAdminRepo.updateRestaurant(
    id,
    name ?? null,
    cuisine ?? null,
    rating ?? null,
    neighborhood ?? null
  );

  return { type: 'OK' };
}

export function deleteRestaurantById(
  id: number
): { type: 'OK' } | { type: 'NOT_FOUND' } {
  if (!restaurantAdminRepo.restaurantExists(id)) {
    return { type: 'NOT_FOUND' };
  }

  restaurantAdminRepo.deleteRestaurant(id);
  return { type: 'OK' };
}