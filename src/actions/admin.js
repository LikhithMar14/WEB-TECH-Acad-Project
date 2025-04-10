'use server'

import { revalidatePath } from 'next/cache'
import db from "@/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"

async function isAdmin(userId) {
  const admins = ["AP23110010483", "AP23110010448", "AP23110010401"]
  
  if (!userId) {
    const session = await getServerSession(authOptions)
    if (!session) return false
    userId = session.user?.admissionNo
  }
  
  return admins.includes(userId)
}

export async function getAllUsers() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("Unauthorized")

    const userIsAdmin = await isAdmin(session.user.admissionNo)
    if (!userIsAdmin) throw new Error("Admin access required")

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        admissionNo: true,
        washes: true,
        isSubscribed: true,
      },
      orderBy: {
        id: 'asc'
      }
    })

    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export async function getAllOrders() {
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
  })
}

export async function addWashesToAllUsers(amount) {
  await db.user.updateMany({
    data: {
      washes: {
        increment: amount
      }
    }
  })
  
  revalidatePath('/admin/users')
  return { success: true }
}

export async function updateUserWashes(userId, addWashes) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) throw new Error("Unauthorized")

    const userIsAdmin = await isAdmin(session.user.admissionNo)
    if (!userIsAdmin) throw new Error("Admin access required")

    const user = await db.user.findUnique({
      where: { id: userId },
    })

    if (!user) throw new Error("User not found")

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        washes: user.washes + addWashes,
      },
      select: {
        id: true,
        name: true,
        email: true,
        admissionNo: true,
        washes: true,
        isSubscribed: true,
      },
    })

    revalidatePath('/dashboard/admin')
    return updatedUser
  } catch (error) {
    console.error("Error updating user washes:", error)
    throw error
  }
}

export async function resetAllUserWashes() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const userIsAdmin = await isAdmin(session.user.admissionNo);
    if (!userIsAdmin) throw new Error("Admin access required");
    
    await db.user.updateMany({
      data: {
        washes: 40
      }
    });
    
    revalidatePath('/dashboard/admin');
    return { success: true, message: "All users' washes reset to 40" };
  } catch (error) {
    console.error("Error resetting washes:", error);
    throw error;
  }
}