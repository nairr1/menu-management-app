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

export const menuRouter = createTRPCRouter({
    getAllMenus: publicProcedure.query(async ({ ctx }) => {
        const menus = await ctx.prisma.menus.findMany({
            where: {
                active: 1,
            },
            include: {
                menuCategoriesMenuMapping: true
            },
            orderBy: [{ position: "asc"}]
        });

        const users = (
            await clerkClient.users.getUserList({
                userId: menus.map((menu) => menu.userId),
            })
        ).map(filterUserForClient);

        return menus.map((menu) => {
            const user = users.find((user) => user.id === menu.userId);

            if (!user) 
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "User for menu not found",
                });

            return {
                menu,
                user: users.find((user) => user.id === menu.userId),
                updatedUser: users.find((user) => user.id === menu.updatedUserId)
            };
        });
    }),

    getLatestMenuPosition: publicProcedure.query(async ({ ctx }) => {
        const menuPosition = await ctx.prisma.menus.findMany({
            where: {
                active: 1,
            },
            select: {
                position: true,
            },
            orderBy: [{ position: "desc"}],
            take: 1,
        });

        return menuPosition;
    }),

    createMenu: privateProcedure
        .input(
            z.object({
                name: z.string().min(1).max(50),
                menuType: z.number().min(1),
                priceLevel: z.number().min(1),
                position: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.userId;
            const updatedUserId = ctx.userId;

            const createPost = await ctx.prisma.menus.create({
                data: {
                    userId,
                    updatedUserId,
                    menuName: input.name,
                    menuType: input.menuType,
                    priceLevel: input.priceLevel,
                    position: input.position,
                },
            });

            return createPost;
        }),
    
    deleteMenu: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const deleteMenu = await ctx.prisma.menus.update({
                where: {
                    id: input.id,
                },
                data: {
                    active: 0,
                },
            });

            return deleteMenu;
        }),

    updateMenu: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
                name: z.string().min(1).max(50),
                menuType: z.number().min(1),
                priceLevel: z.number().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const updatedUserId = ctx.userId;

            const updateMenu = await ctx.prisma.menus.update({
                where: {
                    id: input.id,
                },
                data: {
                    menuName: input.name,
                    menuType: input.menuType,
                    priceLevel: input.priceLevel,
                    updatedUserId
                },
            });

            return updateMenu;
        }),

    updateMenuPosition: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
                position: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const updatedUserId = ctx.userId;

            const updateMenuPosition = await ctx.prisma.menus.update({
                where: {
                    id: input.id,
                },
                data: {
                    updatedUserId,
                    position: input.position,
                },
            });

            return updateMenuPosition;
        }),

    getMenuAvailabilityRuleByMenuId: publicProcedure
        .input(
            z.object({
                id: z.number().min(-1),
            }),
        )
        .query(async ({ ctx, input }) => {
            const menuAvailabilityRules = await ctx.prisma.menuAvailability.findMany({
                where: {
                    menuId: input.id,
                },
                orderBy: [{ dayOfWeek: "asc" }]
            });

            return menuAvailabilityRules;
        }),

    createMenuAvailabilityRule: privateProcedure
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
            const createMenuAvailabilityRule = await ctx.prisma.menuAvailability.create({
                data: {
                    menuId: input.id,
                    dayOfWeek: input.day,
                    startTime: input.startTime,
                    endTime: input.endTime,
                    available: input.available,
                },
            });

            return createMenuAvailabilityRule;
        }),
});
