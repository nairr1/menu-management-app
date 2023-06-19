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

export const itemChoiceRouter = createTRPCRouter({
    getAllItemChoices: publicProcedure.query(async ({ ctx }) => {
        const itemChoices = await ctx.prisma.choices.findMany({
            where: {
                active: 1,
            },
            orderBy: [{ position: "asc"}]
        });

        const users = (
            await clerkClient.users.getUserList({
                userId: itemChoices.map((itemChoice) => itemChoice.userId),
            })
        ).map(filterUserForClient);

        return itemChoices.map((itemChoice) => {
            const user = users.find((user) => user.id === itemChoice.userId);

            if (!user) 
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "User for menu not found",
                });

            return {
                itemChoice,
                user: users.find((user) => user.id === itemChoice.userId),
                updatedUser: users.find((user) => user.id === itemChoice.updatedUserId)
            };
        });
    }),

    getAllChoicesForDropdown: publicProcedure.query(async ({ ctx }) => {
        const choices = await ctx.prisma.choices.findMany({
            select: {
                id: true,
                choiceName: true,
            },
            where: {
                active: 1,
            },
        });

        return choices;
    }),

    getLatestItemChoicePosition: publicProcedure.query(async ({ ctx }) => {
        const itemChoicePosition = await ctx.prisma.choices.findMany({
            where: {
                active: 1,
            },
            select: {
                position: true,
            },
            orderBy: [{ position: "desc"}],
            take: 1,
        });

        return itemChoicePosition;
    }),

    getLatestItemChoiceId: publicProcedure.query(async ({ ctx }) => {
        const latestItemChoiceId = await ctx.prisma.choices.findMany({
            where: {
                active: 1,
            },
            select: {
                id: true,
            },
            orderBy: [{ id: "desc"}],
            take: 1,
        });

        return latestItemChoiceId;
    }),

    createItemChoice: privateProcedure
        .input(
            z.object({
                name: z.string().min(1).max(50),
                displayName: z.string().min(1).max(50),
                description: z.string().min(1).max(255),
                position: z.number().min(0),
                required: z.boolean(),
                selections: z.number().min(1)
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.userId;
            const updatedUserId = ctx.userId;

            const createItemChoice = await ctx.prisma.choices.create({
                data: {
                    userId,
                    updatedUserId,
                    choiceDisplayName: input.displayName,
                    choiceName: input.name,
                    description: input.description,
                    position: input.position,
                    required: input.required,
                    selections: input.selections,
                }
            });

            return createItemChoice;
        }),
    
    deleteItemChoice: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const deleteItemChoice = await ctx.prisma.choices.update({
                where: {
                    id: input.id,
                },
                data: {
                    active: 0,
                },
            });

            return deleteItemChoice;
        }),

    updateItemChoice: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
                name: z.string().min(1).max(50),
                displayName: z.string().min(1).max(50),
                description: z.string().min(1).max(255),
                required: z.boolean(),
                selections: z.number().min(1)
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const updatedUserId = ctx.userId;

            const updateItemChoice = await ctx.prisma.choices.update({
                where: {
                    id: input.id,
                },
                data: {
                    choiceDisplayName: input.displayName,
                    choiceName: input.name,
                    description: input.description,
                    required: input.required,
                    selections: input.selections,
                    updatedUserId
                },
            });

            return updateItemChoice;
        }),

    updateItemChoicePosition: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
                position: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const updatedUserId = ctx.userId;

            const updateItemChoicePosition = await ctx.prisma.choices.update({
                where: {
                    id: input.id,
                },
                data: {
                    updatedUserId,
                    position: input.position,
                },
            });

            return updateItemChoicePosition;
        }),
});
