import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  sections: defineTable({
    name: v.string(),
    head: v.string(),
    members: v.string(),
    description: v.string(),
    files: v.optional(v.array(v.string())),
  }),
  jayantis: defineTable({
    eventName: v.string(),
    date: v.string(),
    place: v.string(),
    items: v.array(
      v.object({
        name: v.string(),
        amount: v.string(),
      })
    ),
    totalAmount: v.number(),
  }),
  scholarships: defineTable({
    college: v.string(),
    sectionIncharge: v.string(),
    completed: v.string(),
    total: v.string(),
    type: v.string(),
    lastDate: v.string(),
    status: v.string(),
    section: v.string(), // OBC or BC
  }),
  schemes: defineTable({
    name: v.string(),
    headOfSection: v.string(),
    description: v.string(),
    announceDate: v.string(),
    lastDate: v.string(),
    status: v.string(),
    progress: v.number(),
  }),
  dashboardFiles: defineTable({
    idLocal: v.string(),
    name: v.string(),
    category: v.string(),
    status: v.string(),
    details: v.string(),
    size: v.number(),
    uploadDate: v.string(),
    important: v.boolean(),
    dataUrl: v.string(),
  }),
  bankConfirmations: defineTable({
    college: v.string(),
    sectionIncharge: v.string(),
    lastDate: v.string(),
    progress: v.number(),
    status: v.string(),
  }),
  pendingRecords: defineTable({
    recordName: v.string(),
    nameOfWork: v.string(),
    staffName: v.string(),
    summary: v.string(),
    lastDate: v.string(),
    status: v.string(),
    workPending: v.string(),
  }),
  riceIndents: defineTable({
    hostelName: v.string(),
    pendingHostel: v.string(),
    description: v.string(),
    lastDate: v.string(),
    status: v.string(),
  }),
  leavesRecords: defineTable({
    type: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    days: v.union(v.number(), v.string()), // component uses string in reduce but number in state
    reason: v.string(),
    status: v.string(),
  }),
});
