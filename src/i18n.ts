import { Request } from 'express';

type Lang = 'en' | 'es' | 'fr';

const messages: Record<Lang, Record<string, string>> = {
  en: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    EMAIL_IN_USE: 'Email already used',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    RESTAURANT_NOT_FOUND: 'Restaurant not found',
    REVIEW_NOT_FOUND: 'Review not found',
    TOO_MANY_REQUESTS: 'Too many requests, please try again later',
    INTERNAL_ERROR: 'Internal server error',
    REVIEW_UPDATED: 'Review updated',
    FAVORITE_ADDED: 'Added to favorites',
    RESTAURANT_UPDATED: 'Restaurant updated successfully',
    INVALID_PAYLOAD: 'Invalid payload',
  },
  es: {
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    EMAIL_IN_USE: 'El email ya está en uso',
    UNAUTHORIZED: 'No autorizado',
    FORBIDDEN: 'Prohibido',
    RESTAURANT_NOT_FOUND: 'Restaurante no encontrado',
    REVIEW_NOT_FOUND: 'Reseña no encontrada',
    TOO_MANY_REQUESTS: 'Demasiadas peticiones, inténtalo de nuevo más tarde',
    INTERNAL_ERROR: 'Error interno del servidor',
    REVIEW_UPDATED: 'Reseña actualizada',
    FAVORITE_ADDED: 'Añadido a favoritos',
    RESTAURANT_UPDATED: 'Restaurante actualizado correctamente',
    INVALID_PAYLOAD: 'Payload inválido',
  },
  fr: {
    INVALID_CREDENTIALS: "Identifiants invalides",
    EMAIL_IN_USE: "L'email est déjà utilisé",
    UNAUTHORIZED: "Non autorisé",
    FORBIDDEN: "Interdit",
    RESTAURANT_NOT_FOUND: "Restaurant introuvable",
    REVIEW_NOT_FOUND: "Avis introuvable",
    TOO_MANY_REQUESTS: "Trop de requêtes, réessayez plus tard",
    INTERNAL_ERROR: "Erreur interne du serveur",
    REVIEW_UPDATED: "Avis mis à jour",
    FAVORITE_ADDED: "Ajouté aux favoris",
    RESTAURANT_UPDATED: 'Restaurant mis à jour avec succès',
    INVALID_PAYLOAD: 'Données invalides',
  },
};

function getLangFromRequest(req: Request): Lang {
  const header = req.headers['accept-language'];
  if (typeof header === 'string' && header.toLowerCase().startsWith('es')) {
    return 'es';
  }
  if (typeof header === 'string' && header.toLowerCase().startsWith('fr')) {
    return 'fr';
  }
  return 'en';
}

export function t(req: Request, key: string): string {
  const lang = getLangFromRequest(req);
  return messages[lang][key] ?? messages.en[key] ?? key;
}