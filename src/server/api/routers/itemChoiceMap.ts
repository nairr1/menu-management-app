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

export const itemChoiceMapRouter = createTRPCRouter({
    getMappedItemChoicesByItemId: publicProcedure
        .input(
            z.object({
                id: z.number().min(0),
            }),
        )
        .query(async ({ ctx, input }) => {
            const mappedItemChoice = await ctx.prisma.itemChoiceMapping.findMany({
                where: {
                    parentItemId: input.id,
                },
                include: {
                    choice: true,
                },
                orderBy: [{ position: "asc" }]
            });

            const users = (
                await clerkClient.users.getUserList({
                    userId: mappedItemChoice.map((itemChoice) => itemChoice.userId),
                })
            ).map(filterUserForClient);

            return mappedItemChoice.map((itemChoice) => {
                const user = users.find((user) => user.id === itemChoice.userId);
    
                if (!user) 
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "User for menu not found",
                    });
    
                return {
                    itemChoice,
                    user: users.find((user) => user.id === itemChoice.userId),
                };
            });
        }),

    getLatestMappedItemChoicePosition: publicProcedure
        .input(
            z.object({
                id: z.number().min(0),
            }),
        )
        .query(async ({ ctx, input }) => {
            const mappedItemChoicePosition = await ctx.prisma.itemChoiceMapping.findMany({
                select: {
                    position: true,
                },
                where: {
                    parentItemId: input.id,
                },
                orderBy: [{ position: "desc"}],
                take: 1,
            });

            return mappedItemChoicePosition;
        }),

    updateMappedItemChoicePosition: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
                position: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const updatedUserId = ctx.userId;

            const updateMappedItemChoicePosition = await ctx.prisma.itemChoiceMapping.update({
                where: {
                    id: input.id,
                },
                data: {
                    position: input.position,
                },
            });

            return updateMappedItemChoicePosition;
        }),

    createMappedItemChoice: privateProcedure
        .input(
            z.object({
                choiceId: z.number().min(1),
                itemId: z.number().min(1),
                position: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.userId;

            const createMappedItemChoice = await ctx.prisma.itemChoiceMapping.create({
                data: {
                    userId,
                    choiceId: input.choiceId,
                    parentItemId: input.itemId,
                    position: input.position,
                },
            });

            return createMappedItemChoice;
        }),

    deleteMappedItemChoice: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const deleteMappedItemChoice = await ctx.prisma.itemChoiceMapping.delete({
                where: {
                    id: input.id,
                },
            });

            return deleteMappedItemChoice
        }),
    
});
