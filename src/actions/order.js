'use server'

import { revalidatePath } from 'next/cache'
import db from "@/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"

export async function createOrder(userId, cartId, laundryName) {
    const cartItems = await db.cartItem.findMany({
      where: { cartId }
    })
    
    if (cartItems.length === 0) {
      throw new Error('Cannot create order with empty cart')
    }
    
    const user = await db.user.findUnique({
      where: { id: userId }
    })
    
    if (!user) throw new Error('User not found')
    
    const totalWeight = cartItems.reduce((acc, item) => 
      acc + parseFloat(item.weight.toString()) * item.quantity, 0)
    
    const washesRequired = Math.ceil(totalWeight)
    
    if (user.washes < washesRequired) {
      throw new Error('Insufficient washes available')
    }

    // Delete any existing order for this cart first
    await db.order.deleteMany({
      where: { cartId }
    })

    // Delete the old cart items
    await db.cartItem.deleteMany({
      where: { cartId }
    })

    // Delete the old cart
    await db.cart.delete({
      where: { id: cartId }
    })

    // Create new cart
    const newCart = await db.cart.create({
      data: { userId }
    })
    
    // Create order with the new cart ID
    const order = await db.order.create({
      data: {
        userId,
        cartId: newCart.id,
        orderStatus: "OrderPlaced",
        laundryName
      }
    })
    
    // Update user's washes
    await db.user.update({
      where: { id: userId },
      data: { washes: user.washes - washesRequired }
    })
    
    revalidatePath('/dashboard/user')
    return order
}

export async function getOrders(userId) {
  try {
    // If userId is provided, fetch orders for that user
    if (userId) {
      return await db.order.findMany({
        where: { userId },
        include: {
          user: true,
          cart: {
            include: {
              items: true
            }
          }
        },
        orderBy: { id: 'desc' }
      });
    }
    
    // If no userId is provided, check if user is admin and return all orders
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");
    
    // Admin check - add logic to determine if the user is an admin
    const adminIds = ["AP23110010483", "AP23110010448", "AP23110010401"];
    const isAdmin = adminIds.includes(session.user.admissionNo);
    
    if (!isAdmin) {
      // Not admin - return own orders
      return await db.order.findMany({
        where: { userId: session.user.id },
        include: {
          user: true,
          cart: {
            include: {
              items: true
            }
          }
        },
        orderBy: { id: 'desc' }
      });
    }
    
    // Admin - return all orders
    return await db.order.findMany({
      include: {
        user: true,
        cart: {
          include: {
            items: true
          }
        }
      },
      orderBy: { id: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export async function updateOrderStatus(orderId, orderStatus) {
  try {
    const order = await db.order.update({
      where: { id: orderId },
      data: { orderStatus }
    });
    
    revalidatePath('/dashboard/user');
    revalidatePath('/dashboard/admin');
    return order;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

  