import { useDispatch, useSelector } from 'react-redux'
import {
  addToCart as addToCartAction,
  addPackToCart as addPackToCartAction,
  startOrUpdateInProgressPack as startOrUpdateInProgressPackAction,
  finalizeInProgressPack as finalizeInProgressPackAction,
  removeInProgressPack as removeInProgressPackAction,
  setPincode as setPincodeAction,
  validateAndSetPincode as validateAndSetPincodeAction,
  removeFromCart as removeFromCartAction,
  removePackFromCart as removePackFromCartAction,
  updateQuantity as updateQuantityAction,
  updatePackQuantity as updatePackQuantityAction,
  clearCart as clearCartAction,
  selectCartItems,
  selectPackItems,
  selectInProgressPacks,
  selectPincode,
  selectCartTotal,
  selectCartItemsCount,
} from '../slices/cartSlice'

export const useCart = () => {
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const packItems = useSelector(selectPackItems)
  const inProgressPacks = useSelector(selectInProgressPacks)
  const pincode = useSelector(selectPincode)

  return {
    cartItems,
    packItems,
    inProgressPacks,
    pincode,
    addToCart: (product) => dispatch(addToCartAction(product)),
    addPackToCart: (packData) => dispatch(addPackToCartAction(packData)),
    startOrUpdateInProgressPack: (packData) => dispatch(startOrUpdateInProgressPackAction(packData)),
    finalizeInProgressPack: (packId) => dispatch(finalizeInProgressPackAction(packId)),
    removeInProgressPack: (packId) => dispatch(removeInProgressPackAction(packId)),
    setPincode: (code) => dispatch(setPincodeAction(code)),
    validateAndSetPincode: (code) => dispatch(validateAndSetPincodeAction(code)),
    removeFromCart: (productId, variation = 'default') =>
      dispatch(removeFromCartAction({ productId, variation })),
    removePackFromCart: (instanceId) =>
      dispatch(removePackFromCartAction(instanceId)),
    updateQuantity: (productId, variation = 'default', quantity) =>
      dispatch(updateQuantityAction({ productId, variation, quantity })),
    updatePackQuantity: (instanceId, quantity) =>
      dispatch(updatePackQuantityAction({ instanceId, quantity })),
    clearCart: () => dispatch(clearCartAction()),
    getCartTotal: () => selectCartTotal({ cart: { cartItems, packItems, inProgressPacks, pincode } }),
    getCartItemsCount: () => selectCartItemsCount({ cart: { cartItems, packItems, inProgressPacks, pincode } }),
  }
}
