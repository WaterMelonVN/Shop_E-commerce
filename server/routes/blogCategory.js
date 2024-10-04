const router = require('express').Router();
const blogCategory = require('../controller/blogCategoryController');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/', [verifyAccessToken, isAdmin], blogCategory.createCategory);
router.get('/', blogCategory.getCategories);
router.put('/:bcid', [verifyAccessToken, isAdmin], blogCategory.updateCategory);
router.delete(
    '/:bcid',
    [verifyAccessToken, isAdmin],
    blogCategory.deleteCategory
);

module.exports = router;
