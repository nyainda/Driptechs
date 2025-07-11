// Re-export from main schema for table definitions and types
export * from "./schema";

// Re-export specific validation schemas to avoid conflicts
export {
  insertUserSchema,
  insertProductSchema,
  insertQuoteSchema,
  insertContactSchema,
  insertTeamMemberSchema,
  insertBlogPostSchema,
  insertSuccessStorySchema,
  insertProjectSchema,
  insertPageViewSchema,
  loginSchema
} from "../server/schema-validation";