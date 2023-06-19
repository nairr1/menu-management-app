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
                menuAvailability: true,
                menuCategoriesMenuMapping: {
                    orderBy: [{position: "asc"}],
                    include: {
                        menuCategory: {
                            include: {
                                menuCategoryItems: {
                                    orderBy: [{position: "asc"}],
                                    include: {
                                        item: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
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

    getMenuData: publicProcedure
        .query(async ({ ctx }) => {
            const date = new Date();
            const day = date.getDay();
            const hour = date.getHours();
            const minute = date.getMinutes();
            const time = `${hour.toString().length === 1 ? `0${hour}` : hour}:
            ${minute.toString().length === 1 ? `0${minute}` : minute}`;

            const menuData = await ctx.prisma.menus.findMany({
                where: {
                    active: 1,
                    menuAvailability: {
                        some: {
                            dayOfWeek: day,
                            startTime: {
                                lte: time,
                            },
                            endTime: {
                                gte: time,
                            } ,
                        },
                    },
                },
                include: {
                    menuAvailability: true,
                    menuCategoriesMenuMapping: {
                        where: {
                            menuCategory: {
                                menuCategoryAvailability: {
                                    some: {
                                        dayOfWeek: day,
                                        startTime: {
                                            lte: time,
                                        },
                                        endTime: {
                                            gte: time,
                                        } ,
                                    }
                                }
                            }
                        },
                        orderBy: [{position: "asc"}],
                        include: {
                            menuCategory: {
                                include: {
                                    menuCategoryAvailability: true,
                                    menuCategoryItems: {
                                        orderBy: [{position: "asc"}],
                                        include: {
                                            item: {
                                                include: {
                                                    itemChoiceMapping: {
                                                        include: {
                                                            choice: {
                                                                include: {
                                                                    choiceItems: {
                                                                        include: {
                                                                            childItem: true,
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    }
                                },
                            },
                        },
                    },
                },
                take: 1,
            });

            return menuData;
        }),

    getAllMenuNames: publicProcedure.query(async ({ ctx }) => {
        const menuNames = await ctx.prisma.menus.findMany({
            where: {
                active: 1,
            },
            select: {
                menuName: true,
            }
        });

        return menuNames;
    }),

    getLatestMenuId: publicProcedure.query(async ({ ctx }) => {
        const latestMenuId = await ctx.prisma.menus.findMany({
            where: {
                active: 1,
            },
            select: {
                id: true,
            },
            orderBy: [{ id: "desc"}],
            take: 1,
        });

        return latestMenuId;
    }),

    createMenu: privateProcedure
        .input(
            z.object({
                name: z.string().min(1).max(50),
                displayName: z.string().min(1).max(50),
                menuType: z.number().min(1),
                priceLevel: z.number().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.userId;
            const updatedUserId = ctx.userId;

            const createMenu = await ctx.prisma.menus.create({
                data: {
                    userId,
                    updatedUserId,
                    menuName: input.name,
                    menuDisplayName: input.displayName,
                    menuType: input.menuType,
                    priceLevel: input.priceLevel,
                },
            });

            return createMenu;
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
                displayName: z.string().min(1).max(50),
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
                    menuDisplayName: input.displayName,
                    menuType: input.menuType,
                    priceLevel: input.priceLevel,
                    updatedUserId
                },
            });

            return updateMenu;
        }),

    getMenuAvailabilityRuleByMenuId: publicProcedure
        .input(
            z.object({
                id: z.number().min(0),
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
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const createMenuAvailabilityRule = await ctx.prisma.menuAvailability.create({
                data: {
                    menuId: input.id,
                    dayOfWeek: input.day,
                    startTime: input.startTime,
                    endTime: input.endTime,
                },
            });

            return createMenuAvailabilityRule;
        }),
});
