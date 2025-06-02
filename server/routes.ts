import type { Express } from "express";
import { createServer, type Server } from "http";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { storage } from "./storage";
import { 
  insertAppointmentSchema, 
  loginSchema, 
  appointmentSchema 
} from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const EMAIL_USER = process.env.EMAIL_USER || "noreply@manuellawgroup.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "your-email-password";
const LAWYER_EMAIL = process.env.LAWYER_EMAIL || "lawyer@manuellawgroup.com";

// Email transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Middleware to verify JWT token
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get available time slots for a date
  app.get("/api/slots/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const bookedSlots = await storage.getBookedSlots(date);
      
      // Available time slots (9 AM to 5 PM, hourly)
      const allSlots = [
        "09:00", "10:00", "11:00", "12:00", 
        "13:00", "14:00", "15:00", "16:00", "17:00"
      ];
      
      const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
      
      res.json({ 
        availableSlots, 
        bookedSlots 
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching slots" });
    }
  });

  // Book an appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      
      // Check if slot is already booked
      const bookedSlots = await storage.getBookedSlots(validatedData.appointmentDate);
      if (bookedSlots.includes(validatedData.appointmentTime)) {
        return res.status(400).json({ message: "Time slot is already booked" });
      }
      
      // Clean up expired appointments first
      await storage.deleteExpiredAppointments();
      
      // Create appointment
      const appointment = await storage.createAppointment(validatedData);
      
      // Send email notifications
      try {
        // Email to lawyer
        await transporter.sendMail({
          from: EMAIL_USER,
          to: LAWYER_EMAIL,
          subject: "New Appointment Booking",
          html: `
            <h2>New Appointment Booked</h2>
            <p><strong>Client:</strong> ${appointment.clientName}</p>
            <p><strong>Email:</strong> ${appointment.clientEmail}</p>
            <p><strong>Phone:</strong> ${appointment.clientPhone}</p>
            <p><strong>Date:</strong> ${appointment.appointmentDate}</p>
            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            <p><strong>Case Type:</strong> ${appointment.caseType}</p>
            <p><strong>Case Summary:</strong> ${appointment.caseSummary}</p>
          `
        });

        // Email to client
        await transporter.sendMail({
          from: EMAIL_USER,
          to: appointment.clientEmail,
          subject: "Appointment Confirmation - Manuel De Santiago Law Group",
          html: `
            <h2>Appointment Confirmed</h2>
            <p>Dear ${appointment.clientName},</p>
            <p>Your appointment has been successfully booked with Manuel De Santiago Law Group.</p>
            <p><strong>Date:</strong> ${appointment.appointmentDate}</p>
            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            <p><strong>Case Type:</strong> ${appointment.caseType}</p>
            <p>We will contact you if any changes are needed.</p>
            <p>Thank you for choosing Manuel De Santiago Law Group.</p>
          `
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Continue with success response even if email fails
      }
      
      res.status(201).json(appointment);
    } catch (error) {
      if (error.name === 'ZodError') {
        res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating appointment" });
      }
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const token = jwt.sign(
        { adminId: admin.id, email: admin.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ 
        token, 
        admin: { id: admin.id, email: admin.email } 
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        res.status(400).json({ message: "Invalid login data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Login error" });
      }
    }
  });

  // Get today's appointments (admin only)
  app.get("/api/admin/appointments/today", authenticateToken, async (req, res) => {
    try {
      await storage.deleteExpiredAppointments();
      const appointments = await storage.getTodayAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching appointments" });
    }
  });

  // Mark appointment as completed (admin only)
  app.patch("/api/admin/appointments/:id/complete", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const appointment = await storage.updateAppointmentStatus(id, "completed");
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Error updating appointment" });
    }
  });

  // Get appointment details (admin only)
  app.get("/api/admin/appointments/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const appointment = await storage.getAppointmentById(id);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Error fetching appointment" });
    }
  });

  // Get appointment statistics (admin only)
  app.get("/api/admin/stats", authenticateToken, async (req, res) => {
    try {
      await storage.deleteExpiredAppointments();
      const todayAppointments = await storage.getTodayAppointments();
      
      const stats = {
        todayTotal: todayAppointments.length,
        completed: todayAppointments.filter(apt => apt.status === "completed").length,
        scheduled: todayAppointments.filter(apt => apt.status === "scheduled").length,
        cancelled: todayAppointments.filter(apt => apt.status === "cancelled").length
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
