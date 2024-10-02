const router = require('express').Router();
const Product = require('../controller/productController');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/', [verifyAccessToken, isAdmin], Product.createProduct);
router.get('/', Product.getProducts);

router.put('/:pid', [verifyAccessToken, isAdmin], Product.updateProduct);
router.delete('/:pid', [verifyAccessToken, isAdmin], Product.deleteProduct);
router.get('/:pid', Product.getProduct);

module.exports = router;
