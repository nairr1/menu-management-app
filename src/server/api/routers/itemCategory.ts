import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
    return { 
        id: user.id, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        profileImageUrl: user.profileImageUrl,
    };
};

export const itemCategoryRouter = createTRPCRouter({
    getAllItemCategories: publicProcedure.query(async ({ ctx }) => {
        const itemCategories = await ctx.prisma.itemCategories.findMany({
            where: {
                active: 1,
            },
            orderBy: [{ id: "asc"}],
        });

        const users = (
            await clerkClient.users.getUserList({
                userId: itemCategories.map((itemCategory) => itemCategory.userId),
            })
        ).map(filterUserForClient);

        return itemCategories.map((itemCategory) => {
            const user = users.find((user) => user.id === itemCategory.userId);

            if (!user) 
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "User for item category not found",
                });

            return {
                itemCategory,
                user: users.find((user) => user.id === itemCategory.userId),
                updatedUser: users.find((user) => user.id === itemCategory.updatedUserId)
            };
        });
    }),

    getLatestItemCategoryId: publicProcedure.query(async ({ ctx }) => {
        const latestItemCategoryId = await ctx.prisma.itemCategories.findMany({
            where: {
                active: 1,
            },
            select: {
                id: true,
            },
            orderBy: [{ id: "desc"}],
            take: 1,
        });

        return latestItemCategoryId;
    }),

    getAllItemCategoriesForDropdown: publicProcedure.query(async ({ ctx }) => {
        const itemCategories = await ctx.prisma.itemCategories.findMany({
            select: {
                id: true,
                categoryName: true,
            },
            where: {
                active: 1,
            },
        })

        return itemCategories;
    }),

    createItemCategory: privateProcedure
        .input(
            z.object({
                name: z.string().min(1).max(50),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.userId;
            const updatedUserId = ctx.userId;

            const createItemCategory = await ctx.prisma.itemCategories.create({
                data: {
                    userId,
                    updatedUserId,
                    categoryName: input.name,
                }
            });

            return createItemCategory;
        }),

    updateItemCategory: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
                name: z.string().min(1).max(50),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const updatedUserId = ctx.userId;

            const updateItemCategory = await ctx.prisma.itemCategories.update({
                where: {
                    id: input.id,
                },
                data: {
                    updatedUserId,
                    categoryName: input.name,
                }
            });

            return updateItemCategory;
        }),

    deleteItemCategory: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const deleteItemCategory = await ctx.prisma.itemCategories.update({
                where: {
                    id: input.id,
                },
                data: {
                    active: 0,
                },
            });

            return deleteItemCategory;
        }),
});
