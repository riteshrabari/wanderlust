const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controller/reviews.js");


router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;