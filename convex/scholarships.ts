import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("scholarships").order("desc").collect();
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
    return await ctx.db.insert("scholarships", args);
  },
});

export const update = mutation({
  args: { 
    id: v.id("scholarships"),
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
