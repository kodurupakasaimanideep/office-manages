import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("schemes").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    headOfSection: v.string(),
    description: v.string(),
    announceDate: v.string(),
    lastDate: v.string(),
    status: v.string(),
    progress: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("schemes", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("schemes"),
    name: v.optional(v.string()),
    headOfSection: v.optional(v.string()),
    description: v.optional(v.string()),
    announceDate: v.optional(v.string()),
    lastDate: v.optional(v.string()),
    status: v.optional(v.string()),
    progress: v.optional(v.number()),
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
