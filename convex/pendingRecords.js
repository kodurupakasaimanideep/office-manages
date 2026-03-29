import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pendingRecords").order("desc").collect();
  },
});

export const add = mutation({
  args: {
    recordName: v.string(),
    nameOfWork: v.optional(v.string()),
    staffName: v.string(),
    summary: v.string(),
    lastDate: v.string(),
    status: v.string(),
    workPending: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("pendingRecords", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("pendingRecords"),
    recordName: v.string(),
    nameOfWork: v.optional(v.string()),
    staffName: v.string(),
    summary: v.string(),
    lastDate: v.string(),
    status: v.string(),
    workPending: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    return await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("pendingRecords") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
