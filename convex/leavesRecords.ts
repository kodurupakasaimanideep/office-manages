import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leavesRecords").collect();
  },
});

export const add = mutation({
  args: {
    type: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    days: v.union(v.number(), v.string()),
    reason: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("leavesRecords", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("leavesRecords"),
    type: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    days: v.optional(v.union(v.number(), v.string())),
    reason: v.optional(v.string()),
    status: v.optional(v.string()),
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
