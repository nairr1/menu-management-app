import { z } from "zod";

import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";

export const menuCategoryMapRouter = createTRPCRouter({
    getMappedMenuCategoriesByMenuId: publicProcedure
        .input(
            z.object({
                id: z.number().min(-1),
            }),
        )
        .query(async ({ ctx, input }) => {
            const menuCategoryDropdownList = await ctx.prisma.menuCategories.findMany({
                where: {
                    active: 1,
                },
                select: {
                    id: true,
                    menuCategoryName: true,
                    position: true,
                },
                orderBy: [{ position: "asc"}]
            });

            const mappedMenuCategories = await ctx.prisma.menuCategoriesMenuMapping.findMany({
                where: {
                    menuId: input.id,
                },
            });

            return mappedMenuCategories.map((mappedCategory) => {
                return {
                    mappedMenuCategory: mappedMenuCategories.find(({ menuCategoryId }) => menuCategoryId === mappedCategory.menuCategoryId),
                    menuCategory: menuCategoryDropdownList.find((menuCategory) => menuCategory.id === mappedCategory.menuCategoryId),
                };
            }).sort((a, b) => a.menuCategory!.position - b.menuCategory!.position);
        }),

    getMenuCategoriesForDropdown: publicProcedure
        .input(
            z.object({
                id: z.number().min(-1),
            }),
        )
        .query(async ({ ctx, input }) => {
            const menuCategoryDropdownList = await ctx.prisma.menuCategories.findMany({
                where: {
                    active: 1,
                },
                select: {
                    id: true,
                    menuCategoryName: true
                },
                orderBy: [{ position: "asc"}]
            });

            const mappedMenuCategories = await ctx.prisma.menuCategoriesMenuMapping.findMany({
                where: {
                    menuId: input.id,
                },
            });

            return menuCategoryDropdownList.filter(({ id }) => !mappedMenuCategories.some(({ menuCategoryId }) => menuCategoryId === id));
        }),

    createMenuMappedCategory: privateProcedure
        .input(
            z.object({
                menuId: z.number().min(1),
                menuCategoryId: z.number().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const createMenuMappedCategory = await ctx.prisma.menuCategoriesMenuMapping.create({
                data: {
                    menuId: input.menuId,
                    menuCategoryId: input.menuCategoryId,
                },
            });

            return createMenuMappedCategory
        }),

    deleteMenuMappedCategory: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const createMenuMappedCategory = await ctx.prisma.menuCategoriesMenuMapping.delete({
                where: {
                    id: input.id,
                },
            });

            return createMenuMappedCategory
        }),
    
    
});
