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

export const itemClassRouter = createTRPCRouter({
    getAllItemClasses: publicProcedure.query(async ({ ctx }) => {
        const itemClasses = await ctx.prisma.itemClasses.findMany({
            where: {
                active: 1,
            },
            orderBy: [{ position: "asc"}],
        });

        const users = (
            await clerkClient.users.getUserList({
                userId: itemClasses.map((itemClass) => itemClass.userId),
            })
        ).map(filterUserForClient);

        return itemClasses.map((itemClass) => {
            const user = users.find((user) => user.id === itemClass.userId);

            if (!user) 
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "User for item class not found",
                });

            return {
                itemClass,
                user: users.find((user) => user.id === itemClass.userId),
                updatedUser: users.find((user) => user.id === itemClass.updatedUserId)
            };
        });
    }),

    getLatestItemClassPosition: publicProcedure.query(async ({ ctx }) => {
        const itemClassPosition = await ctx.prisma.itemClasses.findMany({
            where: {
                active: 1,
            },
            select: {
                position: true,
            },
            orderBy: [{ position: "desc"}],
            take: 1,
        });

        return itemClassPosition;
    }),

    getLatestItemClassId: publicProcedure.query(async ({ ctx }) => {
        const latestItemClassId = await ctx.prisma.itemClasses.findMany({
            where: {
                active: 1,
            },
            select: {
                id: true,
            },
            orderBy: [{ id: "desc"}],
            take: 1,
        });

        return latestItemClassId;
    }),

    getAllItemClassesForDropdown: publicProcedure.query(async ({ ctx }) => {
        const itemClasses = await ctx.prisma.itemClasses.findMany({
            select: {
                id: true,
                className: true,
            },
            where: {
                active: 1,
            },
        })

        return itemClasses;
    }),

    createItemClass: privateProcedure
        .input(
            z.object({
                name: z.string().min(1).max(50),
                position: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.userId;
            const updatedUserId = ctx.userId;

            const createItemClass = await ctx.prisma.itemClasses.create({
                data: {
                    userId,
                    updatedUserId,
                    className: input.name,
                    position: input.position,
                }
            });

            return createItemClass;
        }),

    updateItemClass: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
                name: z.string().min(1).max(50),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const updatedUserId = ctx.userId;

            const updateItemClass = await ctx.prisma.itemClasses.update({
                where: {
                    id: input.id,
                },
                data: {
                    updatedUserId,
                    className: input.name,
                }
            });

            return updateItemClass;
        }),

    updateItemClassPosition: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
                position: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const updatedUserId = ctx.userId;

            const updateItemClassPosition = await ctx.prisma.itemClasses.update({
                where: {
                    id: input.id,
                },
                data: {
                    updatedUserId,
                    position: input.position,
                },
            });

            return updateItemClassPosition;
        }),

    deleteItemClass: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const deleteItemClass = await ctx.prisma.itemClasses.update({
                where: {
                    id: input.id,
                },
                data: {
                    active: 0,
                },
            });

            return deleteItemClass;
        }),
});
