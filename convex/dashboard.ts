import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getFiles = query({
  handler: async (ctx) => {
    return await ctx.db.query("dashboardFiles").order("desc").collect();
  },
});

export const addFile = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    uploadDate: v.string(),
    size: v.number(),
    important: v.boolean(),
    dataUrl: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("dashboardFiles", args);
  },
});

export const updateFile = mutation({
  args: { id: v.id("dashboardFiles"), important: v.boolean() },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const deleteFile = mutation({
  args: { id: v.id("dashboardFiles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
