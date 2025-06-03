const API_BASE = "/api";

// Get available slots for a date
//  export async function getAvailableSlots(date) {
//      const response = await fetch(`${API_BASE}/slots/${date}`);
//      const data = await response.json();
//      console.log('Slots response for', date, ':', data); // Debug log
//      if (!response.ok) {
//        throw new Error("Failed to fetch available slots");
//      }
//      return data;
//    }
export async function getAvailableSlots(date) {
  console.log('Fetching slots for date:', date); // Debug log
  const response = await fetch(`${API_BASE}/slots/${date}`);
  const data = await response.json();
  console.log('Slots response:', data); // Debug log
  if (!response.ok) {
    throw new Error("Failed to fetch available slots");
  }
  return data;
}
// Book an appointment
export async function bookAppointment(appointmentData) {
  console.log('Booking appointment with data:', appointmentData); // Debug log
  const response = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentData),
  });
  
  const data = await response.json();
  console.log('Booking response:', data); // Debug log
  if (!response.ok) {
    throw new Error(data.message || "Failed to book appointment");
  }
  
  return data;
}

// Admin login
export async function adminLogin(credentials) {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }
  
  return response.json();
}

// Get today's appointments (admin)
export async function getTodayAppointments(token) {
  const response = await fetch(`${API_BASE}/admin/appointments/today`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch appointments");
  }
  
  return response.json();
}

// Mark appointment as completed (admin)
export async function markAppointmentCompleted(appointmentId, token) {
  const response = await fetch(`${API_BASE}/admin/appointments/${appointmentId}/complete`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to mark appointment as completed");
  }
  
  return response.json();
}

// Get appointment details (admin)
export async function getAppointmentDetails(appointmentId, token) {
  const response = await fetch(`${API_BASE}/admin/appointments/${appointmentId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch appointment details");
  }
  
  return response.json();
}

// Get admin statistics
export async function getAdminStats(token) {
  const response = await fetch(`${API_BASE}/admin/stats`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch statistics");
  }
  
  return response.json();
}
