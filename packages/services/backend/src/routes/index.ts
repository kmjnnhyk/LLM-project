/**
 * API 라우트
 */

import type { Express } from 'express';
import { getNutritionRecommendations } from './nutrition';
import { validateNutritionRequest } from '../middleware/validateRequest';

export function setupRoutes(app: Express) {
  // 영양제 추천 API
  app.post(
    '/api/nutrition/recommendations',
    validateNutritionRequest,
    getNutritionRecommendations
  );

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });
}




