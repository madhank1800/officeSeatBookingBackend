const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const slugify = require("slugify");
const { get } = require("mongoose");

//create a product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//get a product

const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);

    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//get all products

const getAllProucts = asyncHandler(async (req, res) => {
  try {
    const findAllProducts = await Product.find();

    //const findAllProducts=await Product.where('category').equals('req.query.category');
    //const findAllProducts=await Product.find({
    //brand:req.query.brand,
    //category:req.query.category
    //});
    //res.json(findAllProducts);

    const queryObj = { ...req.query };
    console.log(queryObj);
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((eliminate) => delete queryObj[eliminate]);

    let queryStr = JSON.stringify(queryObj);
    console.log("queryStr", queryStr);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    console.log(queryStr);
    let query = Product.find(JSON.parse(queryStr));
    res.json(query);

    //sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }
    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

//add products to wishlist of user logged in

const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.params;
  try {
    const user = User.findById(_id);
    const alreadyadded = user?.wishlist?.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        { _id },
        {
          $pull: {
            wishlist: prodId,
          },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );

      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

//ratings of the product given by user

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);

    let alreadyadded = product.ratings.findById(
      (userId) => userId.toString() === _id.toString()
    );

    if (alreadyadded) {
      const updateRating = Product.updateOne(
        {
          rating: { $elemMatch: alreadyadded },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedBy: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }

    //average the ratings of a product by all users.

    const getallratings = Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.rating
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//update products
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    // const updateProduct =await Product.findOneAndUpdate({id},req.body,{
    //     new:true
    // })

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          title: req.body.title,
          slug: slugify(req.body.title),
        },
      },
      {
        new: true,
      }
    );
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getaProduct,
  getAllProucts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
};
