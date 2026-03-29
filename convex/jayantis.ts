import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("jayantis").order("desc").collect();
  },
});

export const add = mutation({
  args: {
    eventName: v.string(),
    date: v.string(),
    place: v.string(),
    amount: v.float64(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("jayantis", args);
  },
});

export const update = mutation({
  args: { 
    id: v.id("jayantis"),
    eventName: v.string(),
    date: v.string(),
    place: v.string(),
    amount: v.float64(),
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
