"use server"

import { revalidatePath } from "next/cache"
import db from "@/db"

export async function getUser(admissionNo) {
    return await db.user.findUnique({
      where: { admissionNo },
      include: {
        carts: {
          include: {
            items: true
          }
        },
        orders: true
      }
    })
}

export async function getUserById(id) {
    return await db.user.findUnique({
      where: { id },
      include: {
        carts: {
          include: {
            items: true
          }
        },
        orders: {
          include: {
            cart: {
              include: {
                items: true
              }
            }
          }
        }
      }
    })
}

export async function updateUserWashes(userId, washes) {
    const user = await db.user.update({
      where: { id: userId },
      data: { washes }
    })
    
    revalidatePath('/dashboard/user')
    return user
}

export async function toggleSubscription(userId) {
    const user = await db.user.findUnique({ where: { id: userId } })
    
    if (!user) throw new Error('User not found')
    
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { isSubscribed: !user.isSubscribed }
    })
    
    revalidatePath('/dashboard/user')
    return updatedUser
}
