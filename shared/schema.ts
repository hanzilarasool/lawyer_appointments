import { z } from "zod";

// Appointment schema
export const appointmentSchema = z.object({
  id: z.string().optional(),
  clientName: z.string().min(1, "Name is required"),
  clientEmail: z.string().email("Valid email is required"),
  clientPhone: z.string().min(1, "Phone is required"),
  caseType: z.string().min(1, "Case type is required"),
  caseSummary: z.string().min(1, "Case summary is required"),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
  status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const insertAppointmentSchema = appointmentSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Admin schema
export const adminSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  createdAt: z.date().optional()
});

export const insertAdminSchema = adminSchema.omit({ 
  id: true, 
  createdAt: true 
});

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required")
});

export type Appointment = z.infer<typeof appointmentSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Admin = z.infer<typeof adminSchema>;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type LoginData = z.infer<typeof loginSchema>;
