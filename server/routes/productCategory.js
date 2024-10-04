const router = require('express').Router();
const productCategory = require('../controller/productCategoryController');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/', [verifyAccessToken, isAdmin], productCategory.createCategory);
router.get('/', productCategory.getCategories);
router.put(
    '/:pcid',
    [verifyAccessToken, isAdmin],
    productCategory.updateCategory
);
router.delete(
    '/:pcid',
    [verifyAccessToken, isAdmin],
    productCategory.deleteCategory
);

module.exports = router;
