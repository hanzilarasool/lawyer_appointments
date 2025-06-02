import { 
  Appointment, 
  InsertAppointment, 
  Admin, 
  InsertAdmin 
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private appointments: Map<string, Appointment>;
  private admins: Map<string, Admin>;
  private currentAppointmentId: number;
  private currentAdminId: number;

  constructor() {
    this.appointments = new Map();
    this.admins = new Map();
    this.currentAppointmentId = 1;
    this.currentAdminId = 1;
    
    // Create default admin user
    this.createAdmin({
      email: "admin@manuellawgroup.com",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" // password: "password"
    });
  }

  // Appointment methods
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentAppointmentId.toString();
    this.currentAppointmentId++;
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      status: "scheduled",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      appointment => appointment.appointmentDate === date
    );
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getAppointmentsByDate(today);
  }

  async updateAppointmentStatus(
    id: string, 
    status: "scheduled" | "completed" | "cancelled"
  ): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (appointment) {
      appointment.status = status;
      appointment.updatedAt = new Date();
      this.appointments.set(id, appointment);
      return appointment;
    }
    return undefined;
  }

  async getAppointmentById(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async deleteExpiredAppointments(): Promise<void> {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const appointmentEntries = Array.from(this.appointments.entries());
    for (const [id, appointment] of appointmentEntries) {
      if (appointment.appointmentDate < today) {
        this.appointments.delete(id);
      } else if (appointment.appointmentDate === today) {
        const [hours, minutes] = appointment.appointmentTime.split(':').map(Number);
        const appointmentTime = hours * 100 + minutes;
        
        // Delete if appointment time has passed by more than 1 hour
        if (appointmentTime + 100 < currentTime) {
          this.appointments.delete(id);
        }
      }
    }
  }

  // Admin methods
  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(admin => admin.email === email);
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = this.currentAdminId.toString();
    this.currentAdminId++;
    const admin: Admin = {
      ...insertAdmin,
      id,
      createdAt: new Date()
    };
    this.admins.set(id, admin);
    return admin;
  }

  // Slot availability
  async getBookedSlots(date: string): Promise<string[]> {
    const appointments = await this.getAppointmentsByDate(date);
    return appointments
      .filter(apt => apt.status === "scheduled")
      .map(apt => apt.appointmentTime);
  }
}

export const storage = new MemStorage();
