'use server'

import { revalidatePath } from 'next/cache'
import db from "@/db"

export async function getOrCreateCart(userId) {
  let cart = await db.cart.findUnique({
    where: { userId },
    include: { items: true }
  })
    
  if (!cart) {
    cart = await db.cart.create({
      data: { userId },
      include: { items: true }
    })
  }
    
  if (cart.items && cart.items.length > 0) {
    cart.items = cart.items.map(item => ({
      ...item,
      weight: Number(item.weight) 
    }))
  }
    
  return cart
}

export async function addItemToCart(
  userId,
  item,
  weight,
  quantity=1
) {
  const cart = await getOrCreateCart(userId)
    
  const cartItem = await db.cartItem.create({
    data: {
      cartId: cart.id,
      item,
      weight: weight,
      quantity
    }
  })
  

  return {
    ...cartItem,
    weight: Number(cartItem.weight)
  }
    
  revalidatePath('/create-order')
}


export async function removeCartItem(cartItemId) {
  const cartItem = await db.cartItem.delete({
    where: { id: cartItemId }
  })
    
  revalidatePath('/create-order')
  return cartItem
}

export async function updateCartItemQuantity(cartItemId, quantity) {
  const cartItem = await db.cartItem.update({
    where: { id: cartItemId },
    data: { quantity }
  })
    
  revalidatePath('/create-order')
  return cartItem
}

export async function clearCart(cartId) {
  await db.cartItem.deleteMany({
    where: { cartId }
  })
    
  revalidatePath('/create-order')
  return { success: true }
}