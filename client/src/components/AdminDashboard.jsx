import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";


import { 
  CalendarDays, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Eye,
  Check,
  LogOut,
  RefreshCw
} from "lucide-react";
import { getTodayAppointments, markAppointmentCompleted, getAdminStats } from "../lib/api";

export default function AdminDashboard({ token, onLogout }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading: appointmentsLoading, refetch: refetchAppointments } = useQuery({
    queryKey: ['/api/admin/appointments/today'],
    queryFn: () => getTodayAppointments(token),
  });

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: () => getAdminStats(token),
  });

  const completeMutation = useMutation({
    mutationFn: (appointmentId) => markAppointmentCompleted(appointmentId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/appointments/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Success",
        description: "Appointment marked as completed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatCaseType = (caseType) => {
    return caseType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-law-neutral">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-law-slate">Manage appointments and client consultations</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  refetchAppointments();
                  queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
                }}
                className="text-sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={onLogout}
                className="text-sm text-law-slate hover:text-gray-900"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CalendarDays className="text-law-blue h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-law-slate">Today's Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats.todayTotal || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-law-success h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-law-slate">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats.completed || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="text-yellow-600 h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-law-slate">Scheduled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats.scheduled || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="text-red-600 h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-law-slate">Cancelled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats.cancelled || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <div className="text-center py-8">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No appointments scheduled for today
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Case Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatTime(appointment.appointmentTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.clientName}
                          </div>
                          <div className="text-sm text-law-slate">
                            {appointment.clientEmail}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="text-xs">
                            {formatCaseType(appointment.caseType)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appointment.clientPhone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(appointment.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-law-blue hover:text-blue-800"
                              title="View Details"
                              onClick={() => {
                                toast({
                                  title: "Appointment Details",
                                  description: `Case Summary: ${appointment.caseSummary}`,
                                });
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {appointment.status === "scheduled" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-law-success hover:text-green-800"
                                title="Mark as Completed"
                                onClick={() => completeMutation.mutate(appointment.id)}
                                disabled={completeMutation.isPending}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
