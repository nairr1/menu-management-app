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

export const menuCategoryItemMapRouter = createTRPCRouter({
    getMappedMenuCategoryItemsByMenuCategoryId: publicProcedure
        .input(
            z.object({
                id: z.number().min(0),
            }),
        )
        .query(async ({ ctx, input }) => {
            const mappedMenuCategoryItems = await ctx.prisma.menuCategoryItems.findMany({
                where: {
                    menuCategoryId: input.id,
                },
                include: {
                    item: {
                        include: {
                            class: true,
                            category: true,
                        }
                    },
                },
                orderBy: [{ position: "asc" }]
            });

            const users = (
                await clerkClient.users.getUserList({
                    userId: mappedMenuCategoryItems.map((menuCategoryItem) => menuCategoryItem.userId),
                })
            ).map(filterUserForClient);

            return mappedMenuCategoryItems.map((menuCategoryItem) => {
                const user = users.find((user) => user.id === menuCategoryItem.userId);
    
                if (!user) 
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "User for menu not found",
                    });
    
                return {
                    menuCategoryItem,
                    user: users.find((user) => user.id === menuCategoryItem.userId),
                };
            });
        }),

    getLatestMappedMenuCategoryItemPosition: publicProcedure
        .input(
            z.object({
                id: z.number().min(0),
            }),
        )
        .query(async ({ ctx, input }) => {
            const mappedMenuCategoryItemPosition = await ctx.prisma.menuCategoryItems.findMany({
                select: {
                    position: true,
                },
                where: {
                    menuCategoryId: input.id,
                },
                orderBy: [{ position: "desc"}],
                take: 1,
            });

            return mappedMenuCategoryItemPosition;
        }),

    updateMappedMenuCategoryItemPosition: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
                position: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const updateMappedMenuCategoryItemPosition = await ctx.prisma.menuCategoryItems.update({
                where: {
                    id: input.id,
                },
                data: {
                    position: input.position,
                },
            });

            return updateMappedMenuCategoryItemPosition;
        }),

    createMappedMenuCategoryItem: privateProcedure
        .input(
            z.object({
                menuCategoryId: z.number().min(1),
                itemId: z.number().min(1),
                position: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.userId;

            const createMappedMenuCategoryItem = await ctx.prisma.menuCategoryItems.create({
                data: {
                    userId,
                    menuCategoryId: input.menuCategoryId,
                    itemId: input.itemId,
                    position: input.position,
                },
            });

            return createMappedMenuCategoryItem;
        }),

    deleteMappedMenuCategoryItem: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const deleteMappedMenuCategoryItem = await ctx.prisma.menuCategoryItems.delete({
                where: {
                    id: input.id,
                },
            });

            return deleteMappedMenuCategoryItem;
        }),
    
});
