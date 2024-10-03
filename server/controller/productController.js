const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing Inputs');
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const newProduct = await Product.create(req.body);
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Cannot create new product',
    });
});

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const product = await Product.findById(pid);
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product',
    });
});

// Filtering, sorting && pagination
const getProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    //Separate special fields from query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);

    // Format operators follow mongoose syntax
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        matchedEl => `$${matchedEl}`
    );
    const formattedQueries = JSON.parse(queryString);

    // Filtering
    if (queries?.title)
        formattedQueries.title = { $regex: queries.title, $options: 'i' };
    let queryCommand = Product.find(formattedQueries);

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    // Fields limit
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }
    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    // Execute the query
    try {
        const response = await queryCommand.exec();
        const counts = await Product.find(formattedQueries).countDocuments();
        return res.status(200).json({
            success: !!response,
            counts,
            products: response || 'Cannot get products',
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedData: updatedProduct ? updatedProduct : 'Cannot update product',
    });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
    const deletedProduct = await Product.findByIdAndDelete(pid, req.body, {
        new: true,
    });
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedData: deletedProduct ? deletedProduct : 'Cannot delete product',
    });
});

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid } = req.body;
    if (!star || !pid) throw new Error('Missing inputs');
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find(
        el => el.postedBy.toString() === _id
    );
    console.log(alreadyRating);
    if (alreadyRating) {
        // Update star & comment
        await Product.updateOne(
            {
                ratings: { $elemMatch: alreadyRating },
            },
            {
                $set: { 'ratings.$.star': star, 'ratings.$.comment': comment },
            },
            { new: true }
        );
    } else {
        // Add star & comment
        const response = await Product.findByIdAndUpdate(
            pid,
            {
                $push: { ratings: { star, comment, postedBy: _id } },
            },
            { new: true }
        );
        console.log(response);
    }

    // Average rating
    const updatedProduct = await Product.findById(pid);
    const ratingCount = updatedProduct.ratings.length;
    const sumRatings = updatedProduct.ratings.reduce(
        (sum, el) => sum + +el.star,
        0
    );
    updatedProduct.totalRating =
        Math.round((sumRatings * 10) / ratingCount) / 10;

    await updatedProduct.save();

    return res.status(200).json({
        status: true,
        updatedProduct,
    });
});

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
};
