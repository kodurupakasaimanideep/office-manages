import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  riceIndents: defineTable({
    fileName: v.optional(v.string()),
    hostelName: v.string(),
    pendingHostel: v.string(),
    description: v.string(),
    lastDate: v.string(),
    status: v.string(),
  }),
  pendingRecords: defineTable({
    recordName: v.string(),
    nameOfWork: v.optional(v.string()),
    staffName: v.string(),
    summary: v.string(),
    lastDate: v.string(),
    status: v.string(),
    workPending: v.optional(v.string()),
  }),
  schemes: defineTable({
    name: v.string(),
    headOfSection: v.string(),
    description: v.string(),
    announceDate: v.string(),
    lastDate: v.string(),
    status: v.string(),
    progress: v.optional(v.number()),
  }),
});
