
import {
  Appointment, 
  InsertAppointment, 
  Admin, 
  InsertAdmin 
} from "@shared/schema";
import { AppointmentModel, AdminModel } from "./db";
import bcrypt from "bcrypt";
import moment from 'moment-timezone';

export interface IStorage {
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getTodayAppointments(): Promise<Appointment[]>;
  updateAppointmentStatus(id: string, status: "scheduled" | "completed" | "cancelled"): Promise<Appointment | undefined>;
  getAppointmentById(id: string): Promise<Appointment | undefined>;
  deleteExpiredAppointments(): Promise<void>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  getBookedSlots(date: string): Promise<string[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeAdmin();
  }

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
    console.log('Querying appointments for date:', date); // Debug log
    const appointments = await AppointmentModel.find({ appointmentDate: date });
    console.log('Appointments found:', appointments); // Debug log
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
    const today = moment.tz('Asia/Karachi').format('YYYY-MM-DD');
    console.log('Fetching appointments for date:', today); // Debug log
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
      caseType: apt.caseType,
      caseSummary: apt.caseSummary,
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
    const now = moment.tz('Asia/Karachi');
    const yesterday = now.clone().subtract(1, 'days');
    const yesterdayFormatted = yesterday.format('YYYY-MM-DD');
    const expiredAppointments = await AppointmentModel.find({
      appointmentDate: { $lte: yesterdayFormatted }
    });
    console.log('Deleting expired appointments:', expiredAppointments);
    await AppointmentModel.deleteMany({
      appointmentDate: { $lte: yesterdayFormatted }
    });
  }

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

  async getBookedSlots(date: string): Promise<string[]> {
    const appointments = await this.getAppointmentsByDate(date);
    const bookedSlots = appointments
      .filter(apt => ['scheduled', 'completed'].includes(apt.status.toLowerCase()))
      .map(apt => apt.appointmentTime);
    console.log('Booked slots for', date, ':', bookedSlots); // Debug log
    return bookedSlots;
  }
}

export const storage = new DatabaseStorage();
