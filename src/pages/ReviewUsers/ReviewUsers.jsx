import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './ReviewUser.css';
import { useSelector } from 'react-redux';

export default function ReviewUsers() {
  const [reviews, setReviews] = useState([]);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(1);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    getAllReview();
  }, []);

  async function getAllReview() {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/getAllReview`);
      if (data.success) {
        setReviews(data.data);
        console.log("ReviewsData",data.data)
      }
    } catch (error) {
      toast.error("Failed to fetch reviews");
      console.error(error);
    }
  }

  async function deleteReview(id) {
    try {
      const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/deleteReview/${id}`);
      if (data.success) {
        toast.success("Review is deleted");
        getAllReview();
      }
    } catch (error) {
      toast.error("Failed to delete review");
      console.error(error);
    }
  }

  function openEditModal(review) {
    setEditReviewId(review._id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  }

  async function handleEditSubmit() {
    try {
      const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/updateReview/${editReviewId}`, {
        comment: editComment,
        rating: editRating,
      });

      if (data.success) {
        toast.success("تم تعديل التقييم بنجاح");
        setEditReviewId(null);
        getAllReview();
      }
    } catch (error) {
      toast.error("فشل في تعديل التقييم");
      console.error(error);
    }
  }

  if (!user) return <p className="loading">Loading user data...</p>;

  return (
    <div className="ReviewUsers">
      <h1 className="titleHome">Testimonials</h1>
      <div className="review-container">
        {reviews.filter(review => review.userId).length === 0 ? (
          <p className="no-reviews">No reviews available at the moment.</p>
        ) : (
          reviews
            .filter(review => review.userId)
            .map((review) => (
              <div className="review-card" key={review._id}>
                {review.userId?._id === user?._id && (
  <div className='btnsActionRev'>
    <p className='DeleteRev' onClick={() => deleteReview(review._id)}>x</p>
    <p className='EditRev' onClick={() => openEditModal(review)}>!</p>
  </div>
)}

            <img
  className='user-image'
  src={
    review.userId?.image
      ? review.userId.image.startsWith("http")
        ? review.userId.image
        :`${process.env.REACT_APP_API_URL}${review.userId.image}`
      :`https://ui-avatars.com/api/?name=${review.userId?.name || 'User'}&background=random&color=fff`
  }
  alt={review?.name || "User"}
/>

                <h3 className="user-name">{review.userId.name}</h3>
                <p className="rating">Rating: {review.rating} ⭐</p>
                <p className="comment">“{review.comment}”</p>
                {editReviewId === review._id && (
                  <div className="inline-edit">
                    <h4>تعديل التقييم</h4>
                    <textarea
                      rows="3"
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      placeholder="اكتب تعليقك هنا"
                    />
                    <select value={editRating} onChange={(e) => setEditRating(Number(e.target.value))}>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>{num}⭐</option>
                      ))}
                    </select>
                    <div className="modal-buttons">
                      <button onClick={handleEditSubmit}>حفظ</button>
                      <button onClick={() => setEditReviewId(null)}>إلغاء</button>
                    </div>
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
}