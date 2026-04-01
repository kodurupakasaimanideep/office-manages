import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("jayantis").collect();
  },
});

export const add = mutation({
  args: {
    eventName: v.string(),
    date: v.string(),
    place: v.string(),
    items: v.array(
      v.object({
        name: v.string(),
        amount: v.string(),
      })
    ),
    totalAmount: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("jayantis", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("jayantis"),
    eventName: v.optional(v.string()),
    date: v.optional(v.string()),
    place: v.optional(v.string()),
    items: v.optional(
      v.array(
        v.object({
          name: v.string(),
          amount: v.string(),
        })
      )
    ),
    totalAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("jayantis") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
