import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("sections").order("desc").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    head: v.string(),
    members: v.string(),
    description: v.string(),
    files: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sections", args);
  },
});

export const update = mutation({
  args: { 
    id: v.id("sections"),
    name: v.string(),
    head: v.string(),
    members: v.string(),
    description: v.string(),
    files: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("sections") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
