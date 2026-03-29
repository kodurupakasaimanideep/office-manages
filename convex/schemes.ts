import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("schemes").order("desc").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    headOfSection: v.string(),
    status: v.string(),
    progress: v.float64(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("schemes", args);
  },
});

export const update = mutation({
  args: { 
    id: v.id("schemes"),
    name: v.string(),
    headOfSection: v.string(),
    status: v.string(),
    progress: v.float64(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("schemes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
