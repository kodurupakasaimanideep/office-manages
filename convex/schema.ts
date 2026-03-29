import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  dashboardFiles: defineTable({
    name: v.string(),
    category: v.string(),
    uploadDate: v.string(),
    size: v.number(),
    important: v.boolean(),
    dataUrl: v.string(),
    status: v.string(),
  }),
  scholarships: defineTable({
    college: v.string(),
    sectionIncharge: v.string(),
    completed: v.string(),
    total: v.string(),
    type: v.string(),
    lastDate: v.string(),
    status: v.string(),
    section: v.string(),
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
  schemes: defineTable({
    name: v.string(),
    headOfSection: v.string(),
    status: v.string(),
    progress: v.float64(),
  }),
  bankConfirmations: defineTable({
    bankName: v.string(),
    accountNumber: v.string(),
    status: v.string(),
    lastUpdated: v.string(),
  }),
  jayantis: defineTable({
    eventName: v.string(),
    date: v.string(),
    place: v.string(),
    amount: v.float64(),
  }),
  riceIndents: defineTable({
    hostelName: v.string(),
    pendingHostel: v.string(),
    lastDate: v.string(),
    status: v.string(),
  }),
  leavesRecords: defineTable({
    type: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    days: v.float64(),
    reason: v.string(),
    status: v.string(),
  }),
  sections: defineTable({
    name: v.string(),
    head: v.string(),
    members: v.string(),
    description: v.string(),
    files: v.optional(v.array(v.string())),
  }),
});
