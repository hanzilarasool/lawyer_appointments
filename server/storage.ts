import { 
  Appointment, 
  InsertAppointment, 
  Admin, 
  InsertAdmin 
} from "@shared/schema";
import { AppointmentModel, AdminModel } from "./db";
import bcrypt from "bcrypt";

export interface IStorage {
  // Appointment methods
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getTodayAppointments(): Promise<Appointment[]>;
  updateAppointmentStatus(id: string, status: "scheduled" | "completed" | "cancelled"): Promise<Appointment | undefined>;
  getAppointmentById(id: string): Promise<Appointment | undefined>;
  deleteExpiredAppointments(): Promise<void>;
  
  // Admin methods
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  
  // Slot availability
  getBookedSlots(date: string): Promise<string[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeAdmin();
  }

  // Initialize default admin user
  private async initializeAdmin() {
    try {
      const existingAdmin = await AdminModel.findOne({ email: "admin@manuellawgroup.com" });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("password", 10);
        await AdminModel.create({
          email: "admin@manuellawgroup.com",
          password: hashedPassword
        });
        console.log("Default admin user created");
      }
    } catch (error) {
      console.error("Error creating default admin:", error);
    }
  }

  // Appointment methods
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const appointment = await AppointmentModel.create(insertAppointment);
    return {
      id: appointment._id.toString(),
      clientName: appointment.clientName,
      clientEmail: appointment.clientEmail,
      clientPhone: appointment.clientPhone,
      caseType: appointment.caseType,
      caseSummary: appointment.caseSummary,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    };
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const appointments = await AppointmentModel.find({ appointmentDate: date });
    return appointments.map(apt => ({
      id: apt._id.toString(),
      clientName: apt.clientName,
      clientEmail: apt.clientEmail,
      clientPhone: apt.clientPhone,
      caseType: apt.caseType,
      caseSummary: apt.caseSummary,
      appointmentDate: apt.appointmentDate,
      appointmentTime: apt.appointmentTime,
      status: apt.status,
      createdAt: apt.createdAt,
      updatedAt: apt.updatedAt
    }));
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getAppointmentsByDate(today);
  }

  async updateAppointmentStatus(
    id: string, 
    status: "scheduled" | "completed" | "cancelled"
  ): Promise<Appointment | undefined> {
    const appointment = await AppointmentModel.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    
    if (!appointment) return undefined;
    
    return {
      id: appointment._id.toString(),
      clientName: appointment.clientName,
      clientEmail: appointment.clientEmail,
      clientPhone: appointment.clientPhone,
      caseType: appointment.caseType,
      caseSummary: appointment.caseSummary,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    };
  }

  async getAppointmentById(id: string): Promise<Appointment | undefined> {
    const appointment = await AppointmentModel.findById(id);
    if (!appointment) return undefined;
    
    return {
      id: appointment._id.toString(),
      clientName: appointment.clientName,
      clientEmail: appointment.clientEmail,
      clientPhone: appointment.clientPhone,
      caseType: appointment.caseType,
      caseSummary: appointment.caseSummary,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    };
  }

  async deleteExpiredAppointments(): Promise<void> {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.getHours() * 100 + now.getMinutes();

    // Delete appointments from previous days
    await AppointmentModel.deleteMany({
      appointmentDate: { $lt: today }
    });

    // Delete appointments from today that are more than 1 hour past
    const todayAppointments = await AppointmentModel.find({
      appointmentDate: today
    });

    for (const appointment of todayAppointments) {
      const [hours, minutes] = appointment.appointmentTime.split(':').map(Number);
      const appointmentTime = hours * 100 + minutes;
      
      if (appointmentTime + 100 < currentTime) {
        await AppointmentModel.findByIdAndDelete(appointment._id);
      }
    }
  }

  // Admin methods
  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const admin = await AdminModel.findOne({ email });
    if (!admin) return undefined;
    
    return {
      id: admin._id.toString(),
      email: admin.email,
      password: admin.password,
      createdAt: admin.createdAt
    };
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const admin = await AdminModel.create(insertAdmin);
    return {
      id: admin._id.toString(),
      email: admin.email,
      password: admin.password,
      createdAt: admin.createdAt
    };
  }

  // Slot availability
  async getBookedSlots(date: string): Promise<string[]> {
    const appointments = await this.getAppointmentsByDate(date);
    return appointments
      .filter(apt => apt.status === "scheduled")
      .map(apt => apt.appointmentTime);
  }
}

export const storage = new DatabaseStorage();
