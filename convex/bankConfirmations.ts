import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getLabels = query({
  handler: async (ctx) => {
    return await ctx.db.query("bankConfirmations").order("desc").collect();
  },
});

export const addLabel = mutation({
  args: {
    bankName: v.string(),
    accountNumber: v.string(),
    status: v.string(),
    lastUpdated: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bankConfirmations", args);
  },
});

export const updateLabel = mutation({
  args: { 
    id: v.id("bankConfirmations"),
    bankName: v.string(),
    accountNumber: v.string(),
    status: v.string(),
    lastUpdated: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const removeLabel = mutation({
  args: { id: v.id("bankConfirmations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
