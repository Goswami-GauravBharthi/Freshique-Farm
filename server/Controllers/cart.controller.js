import { User } from "../models/user.model.js";

export const add_to_cart = async (req, res) => {
  const { product } = req.body;
  try {
    // Step 1: Try to update quantity if the product already exists

    if (!req.user._id) {
      return res
        .status(402)
        .json({ success: false, message: "Not Authorized ,Login Again.." });
    }
    const existing = await User.findOneAndUpdate(
      {
        _id: req.user._id,
        "cartItems.productId": product.productId, // find user having this product in cart
      },
      {
        $inc: { "cartItems.$.quantity": product.quantity || 1 }, // increment quantity
      },
      { new: true } // return updated document
    );

    if (existing) {
      // ✅ Item already existed, quantity updated
      return res.json({ success: true, cartItems: existing.cartItems });
    }

    // Step 2: If product was not found, push a new one
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { cartItems: product },
      },
      { new: true }
    );

    res.json({ success: true, cartItems: updatedUser.cartItems });
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const remove_to_cart = async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user._id);
    user.cartItems = user.cartItems.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();
    res.json({ success: true, cartItems: user.cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const get_cart_data = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let cartItems = user.cartItems;
    if (!cartItems) {
      return res.json({ success: true, cartItems: [] });
    } else {
      return res.json({ success: true, cartItems });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Internal server error" });
  }
};

export const update_cart_data = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(req.user._id); // or req.params.userId

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const itemIndex = user.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      if (quantity > 0) {
        // Update quantity
        user.cartItems[itemIndex].quantity = quantity;
      } else {
        // Remove item if quantity is 0
        user.cartItems.splice(itemIndex, 1);
      }
    } else {
      // Optional: Add new item if not found
      if (quantity > 0) {
        user.cartItems.push({ productId, quantity });
      }
    }

    await user.save();
    res.status(200).json({ success: true, cartItems: user.cartItems });
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
