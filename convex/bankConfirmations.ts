import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("bankConfirmations").collect();
  },
});

export const add = mutation({
  args: {
    college: v.string(),
    sectionIncharge: v.string(),
    lastDate: v.string(),
    progress: v.number(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("bankConfirmations", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("bankConfirmations"),
    college: v.optional(v.string()),
    sectionIncharge: v.optional(v.string()),
    lastDate: v.optional(v.string()),
    progress: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("bankConfirmations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
