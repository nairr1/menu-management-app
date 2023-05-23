import { createTRPCRouter } from "~/server/api/trpc";
import { menuRouter } from "~/server/api/routers/menu";
import { menuCategoryRouter } from "./routers/menuCategory";
import { menuCategoryMapRouter } from "./routers/menuCategoryMap";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  menu: menuRouter,
  menuCategory: menuCategoryRouter,
  menuCategoryMap: menuCategoryMapRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
