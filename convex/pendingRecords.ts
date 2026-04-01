import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pendingRecords").collect();
  },
});

export const add = mutation({
  args: {
    recordName: v.string(),
    nameOfWork: v.string(),
    staffName: v.string(),
    summary: v.string(),
    lastDate: v.string(),
    status: v.string(),
    workPending: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("pendingRecords", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("pendingRecords"),
    recordName: v.optional(v.string()),
    nameOfWork: v.optional(v.string()),
    staffName: v.optional(v.string()),
    summary: v.optional(v.string()),
    lastDate: v.optional(v.string()),
    status: v.optional(v.string()),
    workPending: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("pendingRecords") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
