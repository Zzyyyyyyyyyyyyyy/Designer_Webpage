import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();

  if (!isOpen) return null;

  const totalPrice = getTotalPrice();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-black border-l border-white/10 z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">Your cart is empty</p>
              <p className="text-gray-500 text-sm mt-2">Add items to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  {/* Product Image */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{item.title}</h3>
                    {item.designerUsername && (
                      <p className="text-gray-400 text-sm">by @{item.designerUsername}</p>
                    )}
                    <p className="text-white font-semibold mt-1">{item.price}</p>
                    <p className="text-gray-400 text-sm">Size: {item.size}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      <span className="text-white font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="self-start p-2 hover:bg-white/10 rounded transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-white/10 p-6 space-y-4">
            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear Cart
            </button>

            {/* Total */}
            <div className="flex items-center justify-between text-lg">
              <span className="text-gray-400">Total:</span>
              <span className="text-white font-bold">${totalPrice.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <button className="w-full py-4 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
