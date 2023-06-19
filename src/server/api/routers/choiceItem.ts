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

export const choiceItemRouter = createTRPCRouter({
    getChoiceItemsByItemChoiceId: publicProcedure
        .input(
            z.object({
                id: z.number().min(0),
            }),
        )
        .query(async ({ ctx, input }) => {
            const choiceItems = await ctx.prisma.choiceItems.findMany({
                where: {
                    choiceId: input.id,
                },
                include: {
                    childItem: true,
                },
                orderBy: [{ position: "asc" }]
            });

            const users = (
                await clerkClient.users.getUserList({
                    userId: choiceItems.map((choiceItem) => choiceItem.userId),
                })
            ).map(filterUserForClient);

            return choiceItems.map((choiceItem) => {
                const user = users.find((user) => user.id === choiceItem.userId);
    
                if (!user) 
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "User for menu not found",
                    });
    
                return {
                    choiceItem,
                    user: users.find((user) => user.id === choiceItem.userId),
                };
            });
        }),

    getLatestChoiceItemPosition: publicProcedure
        .input(
            z.object({
                id: z.number().min(0),
            }),
        )
        .query(async ({ ctx, input }) => {
            const choiceItemPosition = await ctx.prisma.choiceItems.findMany({
                select: {
                    position: true,
                },
                where: {
                    choiceId: input.id,
                },
                orderBy: [{ position: "desc"}],
                take: 1,
            });

            return choiceItemPosition;
        }),

    updateChoiceItemPosition: privateProcedure
        .input(
            z.object({
                id: z.number().min(1),
                position: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const updateChoiceItemPosition = await ctx.prisma.choiceItems.update({
                where: {
                    id: input.id,
                },
                data: {
                    position: input.position,
                },
            });

            return updateChoiceItemPosition;
        }),

    createChoiceItem: privateProcedure
        .input(
            z.object({
                choiceId: z.number().min(1),
                childItemId: z.number().min(1),
                priceOne: z.string().max(100),
                priceTwo: z.string().max(100),
                priceThree: z.string().max(100),
                position: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.userId;

            const createChoiceItem = await ctx.prisma.choiceItems.create({
                data: {
                    userId,
                    choiceId: input.choiceId,
                    childItemId: input.childItemId,
                    position: input.position,
                    updatedPriceLevelOne: input.priceOne,
                    updatedPriceLevelTwo: input.priceTwo,
                    updatedPriceLevelThree: input.priceThree,
                },
            });

            return createChoiceItem
        }),

    deleteChoiceItem: privateProcedure
        .input(
            z.object({
                id: z.number().min(0),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const deleteChoiceItem = await ctx.prisma.choiceItems.delete({
                where: {
                    id: input.id,
                },
            });

            return deleteChoiceItem;
        }),
    
});
