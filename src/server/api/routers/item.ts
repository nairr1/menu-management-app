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

export const itemRouter = createTRPCRouter({
    getAllItems: publicProcedure.query(async ({ ctx }) => {
        const items = await ctx.prisma.items.findMany({
            where: {
                active: 1,
            },
            include: {
                category: true,
                class: true,
            },
            orderBy: [{ id: "asc"}],
        });

        const users = (
            await clerkClient.users.getUserList({
                userId: items.map((item) => item.userId),
            })
        ).map(filterUserForClient);

        return items.map((item) => {
            const user = users.find((user) => user.id === item.userId);

            if (!user) 
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "User for menu not found",
                });

            return {
                item,
                user: users.find((user) => user.id === item.userId),
                updatedUser: users.find((user) => user.id === item.updatedUserId)
            };
        });
    }),

    getAllItemsForDropdown: publicProcedure.query(async ({ ctx }) => {
        const items = await ctx.prisma.items.findMany({
            select: {
                id: true,
                itemName: true,
                priceLevelOne: true,
                priceLevelTwo: true,
                priceLevelThree: true,
            },
            where: {
                active: 1,
            },
        })

        return items;
    }),

    getLatestItemId: publicProcedure.query(async ({ ctx }) => {
        const latestItemId = await ctx.prisma.items.findMany({
            where: {
                active: 1,
            },
            select: {
                id: true,
            },
            orderBy: [{ id: "desc"}],
            take: 1,
        });

        return latestItemId;
    }),

    createItem: privateProcedure
        .input(
            z.object({
                name: z.string().min(1).max(50),
                displayName: z.string().min(1).max(50),
                categoryId: z.number().min(1),
                image: z.string().min(0).max(255),
                description: z.string().min(1).max(255),
                energy: z.number().min(0),
                classId: z.number().min(1),
                priceLevelOne: z.string().min(0),
                priceLevelTwo: z.string().min(0),
                priceLevelThree: z.string().min(0),
                awardedLevelOne: z.number().min(0),
                awardedLevelTwo: z.number().min(0),
                awardedLevelThree: z.number().min(0),
                redeemLevelOne: z.number().min(0),
                redeemLevelTwo: z.number().min(0),
                redeemLevelThree: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.userId;
            const updatedUserId = ctx.userId;

            const createItem = await ctx.prisma.items.create({
                data: {
                    userId,
                    updatedUserId,
                    itemName: input.name,
                    itemDisplayName: input.displayName,
                    categoryId: input.categoryId,
                    image: input.image,
                    energy: input.energy,
                    classId: input.classId,
                    description: input.description,
                    priceLevelOne: input.priceLevelOne,
                    priceLevelTwo: input.priceLevelTwo,
                    priceLevelThree: input.priceLevelThree,
                    awardedPointsOne: input.awardedLevelOne,
                    awardedPointsTwo: input.awardedLevelTwo,
                    awardedPointsThree: input.awardedLevelThree,
                    redemptionPointsOne: input.redeemLevelOne,
                    redemptionPointsTwo: input.redeemLevelTwo,
                    redemptionPointsThree: input.redeemLevelThree
                }
            });

            return createItem;
        }),
    
    deleteItem: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const deleteItem = await ctx.prisma.items.update({
                where: {
                    id: input.id,
                },
                data: {
                    active: 0,
                },
            });

            return deleteItem;
        }),

    updateItem: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
                name: z.string().min(1).max(50),
                displayName: z.string().min(1).max(50),
                categoryId: z.number().min(1),
                classId: z.number().min(1),
                image: z.string().min(0).max(255),
                description: z.string().min(1).max(255),
                energy: z.number().min(0),
                priceLevelOne: z.string().min(0),
                priceLevelTwo: z.string().min(0),
                priceLevelThree: z.string().min(0),
                awardedLevelOne: z.number().min(0),
                awardedLevelTwo: z.number().min(0),
                awardedLevelThree: z.number().min(0),
                redeemLevelOne: z.number().min(0),
                redeemLevelTwo: z.number().min(0),
                redeemLevelThree: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const updatedUserId = ctx.userId;

            const updateItem = await ctx.prisma.items.update({
                where: {
                    id: input.id,
                },
                data: {
                    itemName: input.name,
                    itemDisplayName: input.displayName,
                    categoryId: input.categoryId,
                    classId: input.classId,
                    image: input.image,
                    description: input.description,
                    energy: input.energy,
                    priceLevelOne: input.priceLevelOne,
                    priceLevelTwo: input.priceLevelTwo,
                    priceLevelThree: input.priceLevelThree,
                    awardedPointsOne: input.awardedLevelOne,
                    awardedPointsTwo: input.awardedLevelTwo,
                    awardedPointsThree: input.awardedLevelThree,
                    redemptionPointsOne: input.redeemLevelOne,
                    redemptionPointsTwo: input.redeemLevelTwo,
                    redemptionPointsThree: input.redeemLevelThree,
                    updatedUserId
                },
            });

            return updateItem;
        }),
});
