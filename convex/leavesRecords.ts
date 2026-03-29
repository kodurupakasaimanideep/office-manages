import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("leavesRecords").order("desc").collect();
  },
});

export const add = mutation({
  args: {
    type: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    days: v.float64(),
    reason: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("leavesRecords", args);
  },
});

export const update = mutation({
  args: { 
    id: v.id("leavesRecords"),
    type: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    days: v.float64(),
    reason: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("leavesRecords") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
