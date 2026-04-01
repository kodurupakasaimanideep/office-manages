import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("dashboardFiles").collect();
  },
});

export const add = mutation({
  args: {
    idLocal: v.string(),
    name: v.string(),
    category: v.string(),
    status: v.string(),
    details: v.string(),
    size: v.number(),
    uploadDate: v.string(),
    important: v.boolean(),
    dataUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("dashboardFiles", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("dashboardFiles"),
    important: v.optional(v.boolean()),
    status: v.optional(v.string()),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("dashboardFiles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
