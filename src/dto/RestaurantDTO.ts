import { z } from "zod";

export const RestaurantsQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  cuisine: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  neighborhood: z.string().optional(),
  sort: z.string().optional(),
});

export const CreateRestaurantDTO = z.object({
  name: z.string(),
  cuisine: z.string(),
  neighborhood: z.string(),
  // si en tu modelo el rating lo calcula solo, puedes quitar esto
  rating: z.number().min(1).max(5).optional(),
});

export const UpdateRestaurantDTO = CreateRestaurantDTO.partial();

export type RestaurantsQueryInput = z.infer<typeof RestaurantsQueryDTO>;
export type CreateRestaurantInput = z.infer<typeof CreateRestaurantDTO>;
export type UpdateRestaurantInput = z.infer<typeof UpdateRestaurantDTO>;