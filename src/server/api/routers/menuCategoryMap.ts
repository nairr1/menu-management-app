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

export const menuCategoryMapRouter = createTRPCRouter({
    getMappedMenuCategoriesByMenuId: publicProcedure
        .input(
            z.object({
                id: z.number().min(0),
            }),
        )
        .query(async ({ ctx, input }) => {
            const mappedMenuCategory = await ctx.prisma.menuCategoriesMenuMapping.findMany({
                where: {
                    menuId: input.id,
                },
                include: {
                    menuCategory: true,
                },
                orderBy: [{ position: "asc" }]
            });

            const users = (
                await clerkClient.users.getUserList({
                    userId: mappedMenuCategory.map((menuCategory) => menuCategory.userId),
                })
            ).map(filterUserForClient);

            return mappedMenuCategory.map((menuCategory) => {
                const user = users.find((user) => user.id === menuCategory.userId);
    
                if (!user) 
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "User for menu not found",
                    });
    
                return {
                    menuCategory,
                    user: users.find((user) => user.id === menuCategory.userId),
                };
            });
        }),

    getLatestMappedMenuCategoryPosition: publicProcedure
        .input(
            z.object({
                id: z.number().min(0),
            }),
        )
        .query(async ({ ctx, input }) => {
            const mappedMenuCategoryPosition = await ctx.prisma.menuCategoriesMenuMapping.findMany({
                select: {
                    position: true,
                },
                where: {
                    menuId: input.id,
                },
                orderBy: [{ position: "desc"}],
                take: 1,
            });

            return mappedMenuCategoryPosition;
        }),

    updateMappedMenuCategoryPosition: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
                position: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const updateMappedMenuCategoryPosition = await ctx.prisma.menuCategoriesMenuMapping.update({
                where: {
                    id: input.id,
                },
                data: {
                    position: input.position,
                },
            });

            return updateMappedMenuCategoryPosition;
        }),

    createMappedMenuCategory: privateProcedure
        .input(
            z.object({
                menuId: z.number().min(1),
                menuCategoryId: z.number().min(1),
                position: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.userId;

            const createMappedMenuCategory = await ctx.prisma.menuCategoriesMenuMapping.create({
                data: {
                    userId,
                    menuId: input.menuId,
                    menuCategoryId: input.menuCategoryId,
                    position: input.position,
                },
            });

            return createMappedMenuCategory;
        }),

    deleteMappedMenuCategory: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const deleteMappedMenuCategory = await ctx.prisma.menuCategoriesMenuMapping.delete({
                where: {
                    id: input.id,
                },
            });

            return deleteMappedMenuCategory;
        }),
});
