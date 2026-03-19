import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/api/axiosInstance";
import ProductDetailCard from "../ProductDetailCard/ProductDetailCard";
import ProductTabs from "../ProductTabs/ProductTabs";
import RelatedProduct from "../RelatedProduct/RelatedProduct";
import ReviewSection from "../ReviewSection/ReviewSection";
import { getReviewsByProduct, addReview } from "../../../utils/api/reviewApi";
import { useAuth } from "../../../context/AuthContext";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const { user, isLoggedIn } = useAuth();

  // fetch product
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // fetch reviews
  useEffect(() => {
    if (!id) return;
    setReviewsLoading(true);
    getReviewsByProduct(id)
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setReviewsLoading(false));
  }, [id]);

  // submit review
  const handleAddReview = async ({ review, customerRating }) => {
    if (!isLoggedIn) return false;
    try {
      const newReview = await addReview({
        customerId: user.id,
        customerName: user.name,
        review,
        customerRating,
        productId: id,
      });
      setReviews((prev) => [newReview, ...prev]);
      return true;
    } catch (err) {
      console.error("Review submit error:", err);
      return false;
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-gray-100 animate-pulse h-[400px]" />
        <div className="space-y-4 pt-2">
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
          <div className="h-8 w-1/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-24 bg-gray-100 rounded animate-pulse" />
          <div className="h-12 w-1/2 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
      Product not found.
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <ProductDetailCard product={product} />
      <ProductTabs product={product} />
      <ReviewSection
        reviews={reviews}
        reviewsLoading={reviewsLoading}
        onAddReview={handleAddReview}
        isLoggedIn={isLoggedIn}
        currentUser={user}
      />
      <RelatedProduct categoryId={product?.category?._id} currentProductId={product._id} />
    </div>
  );
};

export default ProductDetailsPage;









