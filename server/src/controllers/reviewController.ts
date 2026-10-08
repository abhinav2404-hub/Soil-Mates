import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { store } from '../models/store';

export async function getProductReviews(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const reviews = await store.listReviews(id);

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch reviews.'
    });
  }
}

export async function addProductReview(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { rating, comment, farmerName, reviewerName, reviewerLocation } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required.'
      });
    }

    const product = await store.getProductById(id);
    const resolvedFarmer = farmerName || product?.farmName || 'Farmer';
    const resolvedReviewer = reviewerName || req.user?.name || 'Verified Buyer';

    const review = await store.createReview({
      productId: id,
      farmerName: resolvedFarmer,
      reviewerName: resolvedReviewer,
      reviewerLocation: reviewerLocation || 'India',
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment,
      verifiedBuyer: true,
      helpfulCount: 0
    });

    // Update product rating summary
    const allProductReviews = await store.listReviews(id);
    if (product && allProductReviews.length > 0) {
      const avg = Number(
        (allProductReviews.reduce((sum, r) => sum + r.rating, 0) / allProductReviews.length).toFixed(1)
      );
      await store.updateProduct(id, {
        rating: avg,
        reviewsCount: allProductReviews.length
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review posted successfully.',
      data: review
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to post review.'
    });
  }
}
