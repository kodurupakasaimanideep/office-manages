import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("scholarships").collect();
  },
});

export const add = mutation({
  args: {
    college: v.string(),
    sectionIncharge: v.string(),
    completed: v.string(),
    total: v.string(),
    type: v.string(),
    lastDate: v.string(),
    status: v.string(),
    section: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("scholarships", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("scholarships"),
    college: v.optional(v.string()),
    sectionIncharge: v.optional(v.string()),
    completed: v.optional(v.string()),
    total: v.optional(v.string()),
    type: v.optional(v.string()),
    lastDate: v.optional(v.string()),
    status: v.optional(v.string()),
    section: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("scholarships") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
