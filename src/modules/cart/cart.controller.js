import { Cart } from "../../../db/models/cart.model.js";
import { Product } from "../../../db/models/product.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

export const addToCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;
    // check product
    const product = await Product.findById(productId);
    if (!product) return next( new Error("The specified product does not found!", { cause: 404 }));
    // check stock
    if (!product.inStock(quantity)) return next(new Error(`Sorry ,only ${product.availableItems} items are available `));

    // check product existence  in cart
    let isProductInCart = await Cart.findOne({
        user: req.user._id,
        "products.productId": productId
    });
    
    if (isProductInCart) {
        const theProduct = isProductInCart.products.find((prd)=>prd.productId.toString() === productId.toString())
    
        if (product.inStock(theProduct.quantity + quantity)) {
            theProduct.quantity = theProduct.quantity+quantity;
            await isProductInCart.save();
            return res.json({success:true , result:{cart: isProductInCart}})
        
        } else {
            return res.json({success:false , message:`sorry, only ${product.availableItems} items are available !`})
    }

    }
 

    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $push: { products: { productId, quantity } } },
        { new: true }
    );
    return res.json({ success: true, result: { cart } });
});

export const userCart = asyncHandler(async (req, res, next) => {
    if (req.user.role == "user") {
        const cart = await Cart.findOne({ user: req.user._id })
        return res.json({ success: true, result: { cart } })
    }
    if (req.user.role == "admin" && !req.body.cartId) return next(new Error("cart id is required!"))
    const cart = await Cart.findById(req.body.cartId);
    return res.json({ success: true, result: { cart } });

});

export const updateCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body
    // check product
    const product = await Product.findById(productId);
    if (!product) return next(new Error("The specified product does not found!", { cause: 404 }));
    // check stock
    
    if (quantity > product.availableItems) return next(new Error(`Sorry ,only ${product.availableItems} items are available `));
    //update cart
    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id, "products.productId": productId, },
        { "products.$.quantity": quantity },
        { new: true }
    );
    return res.json({ success: true, result: { cart } });
});

export const removeFromCart = asyncHandler(async (req, res, next) => {
    const { productId } = req.params
    //check product
    
    const product = await Product.findById(productId)
    if(!product) return  next(new Error("The specified product is not in the cart!", { cause: 409 }))

    const cart = await Cart.findOneAndUpdate(
        // { user: req.user._id },
        // { $pull: { products: { productId } } },
        { user: req.user._id },
        { $pull: { products: { productId } } },
        {new:true}
    );
    
    return res.json({success:true  , result:{cart}})
});

export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { products: [] },
    { new: true }
    )
    return res.json({ success: true, result:{cart}})
});