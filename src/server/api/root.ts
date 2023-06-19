import { createTRPCRouter } from "~/server/api/trpc";
import { menuRouter } from "~/server/api/routers/menu";
import { menuCategoryRouter } from "./routers/menuCategory";
import { menuCategoryMapRouter } from "./routers/menuCategoryMap";
import { itemRouter } from "./routers/item";
import { itemClassRouter } from "./routers/itemClass";
import { itemCategoryRouter } from "./routers/itemCategory";
import { itemChoiceRouter } from "./routers/itemChoice";
import { choiceItemRouter } from "./routers/choiceItem";
import { itemChoiceMapRouter } from "./routers/itemChoiceMap";
import { menuCategoryItemMapRouter } from "./routers/menuCategoryItemsMap";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  menu: menuRouter,
  menuCategory: menuCategoryRouter,
  menuCategoryMap: menuCategoryMapRouter,
  item: itemRouter,
  itemClass: itemClassRouter,
  itemCategory: itemCategoryRouter,
  itemChoice: itemChoiceRouter,
  choiceItem: choiceItemRouter,
  itemChoiceMap: itemChoiceMapRouter,
  menuCategoryItemMap: menuCategoryItemMapRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
