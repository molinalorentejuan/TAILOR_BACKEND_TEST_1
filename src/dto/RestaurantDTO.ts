import { z } from "zod";

/**
 * QUERY DE LISTADO DE RESTAURANTES
 */
export const RestaurantsQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),

  cuisine_type: z.string().optional(),
  neighborhood: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),

  sort: z
    .string()
    .regex(/^[a-z_]+:(asc|desc)$/i)
    .optional(),
});

export const CreateRestaurantDTO = z.object({
  name: z.string().min(1),
  neighborhood: z.string().nullable().optional(),
  cuisine_type: z.string().nullable().optional(),
  rating: z.coerce.number().min(0).max(5).default(0),
  address: z.string().nullable().optional(),
  photograph: z.string().nullable().optional(),
  lat: z.coerce.number().nullable().optional(),
  lng: z.coerce.number().nullable().optional(),
  image: z.string().nullable().optional(),
});

/**
 * UPDATE = opcional todo
 */
export const UpdateRestaurantDTO = CreateRestaurantDTO.partial();

/**
 * TYPES
 */
export type RestaurantsQueryInput = z.infer<typeof RestaurantsQueryDTO>;
export type CreateRestaurantInput = z.infer<typeof CreateRestaurantDTO>;
export type UpdateRestaurantInput = z.infer<typeof UpdateRestaurantDTO>;