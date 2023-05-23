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

export const menuCategoryRouter = createTRPCRouter({
    getAllMenuCategories: publicProcedure.query(async ({ ctx }) => {
        const menuCategories = await ctx.prisma.menuCategories.findMany({
            where: {
                active: 1,
            },
            orderBy: [{ position: "asc"}]
        });

        const users = (
            await clerkClient.users.getUserList({
                userId: menuCategories.map((menuCategory) => menuCategory.userId),
            })
        ).map(filterUserForClient);

        return menuCategories.map((menuCategory) => {
            const user = users.find((user) => user.id === menuCategory.userId);

            if (!user) 
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "User for menu not found",
                });

            return {
                menuCategory,
                user: users.find((user) => user.id === menuCategory.userId),
                updatedUser: users.find((user) => user.id === menuCategory.updatedUserId)
            };
            
        });
    }),

    getLatestMenuCategoryPosition: publicProcedure.query(async ({ ctx }) => {
        const menuCategoryPosition = await ctx.prisma.menuCategories.findMany({
            where: {
                active: 1,
            },
            select: {
                position: true,
            },
            orderBy: [{ position: "desc"}],
            take: 1,
        });

        return menuCategoryPosition;
    }),

    createMenuCategory: privateProcedure
        .input(
            z.object({
                name: z.string().min(1).max(50),
                position: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.userId;
            const updatedUserId = ctx.userId;

            const createMenuCategory = await ctx.prisma.menuCategories.create({
                data: {
                    userId,
                    updatedUserId,
                    menuCategoryName: input.name,
                    position: input.position,
                },
            });

            return createMenuCategory;
        }),
    
    deleteMenuCategory: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const deleteMenuCategory = await ctx.prisma.menuCategories.update({
                where: {
                    id: input.id,
                },
                data: {
                    active: 0,
                },
            });

            return deleteMenuCategory;
        }),

    updateMenuCategory: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
                name: z.string().min(1).max(50),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const updatedUserId = ctx.userId;

            const updateMenuCategory = await ctx.prisma.menuCategories.update({
                where: {
                    id: input.id,
                },
                data: {
                    menuCategoryName: input.name,
                    updatedUserId
                },
            });

            return updateMenuCategory;
        }),

    updateMenuCategoryPosition: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
                position: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const updatedUserId = ctx.userId;

            const updateMenuCategoryPosition = await ctx.prisma.menuCategories.update({
                where: {
                    id: input.id,
                },
                data: {
                    updatedUserId,
                    position: input.position,
                },
            });

            return updateMenuCategoryPosition;
        }),

    getMenuCategoryAvailabilityRuleById: publicProcedure
        .input(
            z.object({
                id: z.number().min(-1),
            }),
        )
        .query(async ({ ctx, input }) => {
            const menuCategoryAvailabilityRules = await ctx.prisma.menuCategoryAvailability.findMany({
                where: {
                    menuCategoryId: input.id,
                },
                orderBy: [{ dayOfWeek: "asc" }]
            });

            return menuCategoryAvailabilityRules;
        }),

    createMenuCategoryAvailabilityRule: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
                day: z.number().min(0),
                startTime: z.string().min(4).max(5),
                endTime: z.string().min(4).max(5),
                available: z.boolean(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const createMenuCategoryAvailabilityRule = await ctx.prisma.menuCategoryAvailability.create({
                data: {
                    menuCategoryId: input.id,
                    dayOfWeek: input.day,
                    startTime: input.startTime,
                    endTime: input.endTime,
                    available: input.available,
                },
            });

            return createMenuCategoryAvailabilityRule;
        }),
    
});
