import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("riceIndents").order("desc").collect();
  },
});

export const add = mutation({
  args: {
    hostelName: v.string(),
    pendingHostel: v.string(),
    lastDate: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("riceIndents", args);
  },
});

export const update = mutation({
  args: { 
    id: v.id("riceIndents"),
    hostelName: v.string(),
    pendingHostel: v.string(),
    lastDate: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("riceIndents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
