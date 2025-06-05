// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { useToast } from "@/hooks/use-toast";
// import { CalendarDays, Clock, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
// import Calendar from "./Calendar";
// import TimeSlots from "./TimeSlots";
// import { bookAppointment } from "../lib/api";

// const formSchema = z.object({
//   clientName: z.string().min(1, "Name is required"),
//   clientEmail: z.string().email("Valid email is required"),
//   clientPhone: z.string().min(1, "Phone is required"),
//   caseType: z.string().min(1, "Case type is required"),
//   caseSummary: z.string().min(1, "Case summary is required"),
//   appointmentDate: z.string().min(1, "Date is required"),
//   appointmentTime: z.string().min(1, "Time is required"),
// });

// export default function BookingForm() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const { toast } = useToast();

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       clientName: "",
//       clientEmail: "",
//       clientPhone: "",
//       caseType: "",
//       caseSummary: "",
//       appointmentDate: "",
//       appointmentTime: "",
//     },
//   });

//   const bookingMutation = useMutation({
//     mutationFn: bookAppointment,
//     onSuccess: () => {
//       setShowConfirmation(true);
//       form.reset();
//       setCurrentStep(1);
//     },
//     onError: (error) => {
//       toast({
//         title: "Booking Failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//   });

//   const onSubmit = (data) => {
//     bookingMutation.mutate(data);
//   };

//   const nextStep = () => {
//     if (currentStep < 3) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const getStepClass = (step) => {
//     if (step <= currentStep) {
//       return "w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium";
//     }
//     return "w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium";
//   };

//   const getStepTextClass = (step) => {
//     return step <= currentStep ? "text-primary" : "text-gray-400";
//   };

//   if (showConfirmation) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-slide-in">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="text-2xl text-green-600" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h3>
//             <p className="text-law-slate mb-4">
//               Your appointment has been successfully booked. You will receive a confirmation email shortly.
//             </p>
//             <Button
//               onClick={() => setShowConfirmation(false)}
//               className="w-full bg-primary hover:bg-blue-800"
//             >
//               Close
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <section className="py-12">
//       <div className="bg-white rounded-xl shadow-lg p-8">
//         <div className="mb-8">
//           <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Your Appointment</h3>
//           <p className="text-law-slate">Fill out the form below to schedule your legal consultation</p>
//         </div>

//         {/* Step Indicator */}
//         <div className="flex items-center justify-center mb-8">
//           <div className="flex items-center">
//             <div className={`flex items-center ${getStepTextClass(1)}`}>
//               <div className={getStepClass(1)}>1</div>
//               <span className="ml-2 text-sm font-medium">Personal Info</span>
//             </div>
//             <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
//             <div className={`flex items-center ${getStepTextClass(2)}`}>
//               <div className={getStepClass(2)}>2</div>
//               <span className="ml-2 text-sm font-medium">Case Details</span>
//             </div>
//             <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
//             <div className={`flex items-center ${getStepTextClass(3)}`}>
//               <div className={getStepClass(3)}>3</div>
//               <span className="ml-2 text-sm font-medium">Date & Time</span>
//             </div>
//           </div>
//         </div>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             {/* Step 1: Personal Information */}
//             {currentStep === 1 && (
//               <div className="space-y-6">
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <FormField
//                     control={form.control}
//                     name="clientName"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Full Name *</FormLabel>
//                         <FormControl>
//                           <Input placeholder="Enter your full name" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="clientEmail"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Email Address *</FormLabel>
//                         <FormControl>
//                           <Input type="email" placeholder="your.email@example.com" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//                 <FormField
//                   control={form.control}
//                   name="clientPhone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Phone Number *</FormLabel>
//                       <FormControl>
//                         <Input type="tel" placeholder="(555) 123-4567" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             )}

//             {/* Step 2: Case Details */}
//             {currentStep === 2 && (
//               <div className="space-y-6">
//                 <FormField
//                   control={form.control}
//                   name="caseType"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Case Type *</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select case type..." />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="personal-injury">Personal Injury</SelectItem>
//                           <SelectItem value="criminal-defense">Criminal Defense</SelectItem>
//                           <SelectItem value="family-law">Family Law</SelectItem>
//                           <SelectItem value="business-law">Business Law</SelectItem>
//                           <SelectItem value="real-estate">Real Estate</SelectItem>
//                           <SelectItem value="immigration">Immigration</SelectItem>
//                           <SelectItem value="estate-planning">Estate Planning</SelectItem>
//                           <SelectItem value="other">Other</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="caseSummary"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Case Summary *</FormLabel>
//                       <FormControl>
//                         <Textarea
//                           rows={4}
//                           placeholder="Please provide a brief description of your legal matter..."
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             )}

//             {/* Step 3: Date & Time Selection */}
//             {currentStep === 3 && (
//               <div className="grid lg:grid-cols-2 gap-8">
//                 <div>
//                   <FormField
//                     control={form.control}
//                     name="appointmentDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="flex items-center mb-4">
//                           <CalendarDays className="mr-2" />
//                           Select Date *
//                         </FormLabel>
//                         <FormControl>
//                           <Calendar
//                             selectedDate={field.value}
//                             onDateSelect={field.onChange}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//                 <div>
//                   <FormField
//                     control={form.control}
//                     name="appointmentTime"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="flex items-center mb-4">
//                           <Clock className="mr-2" />
//                           Available Time Slots *
//                         </FormLabel>
//                         <FormControl>
//                           <TimeSlots
//                             selectedDate={form.watch("appointmentDate")}
//                             selectedTime={field.value}
//                             onTimeSelect={field.onChange}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Form Navigation */}
//             <div className="flex justify-between pt-6 border-t border-gray-200">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={prevStep}
//                 className={currentStep === 1 ? "invisible" : ""}
//               >
//                 <ChevronLeft className="mr-2 h-4 w-4" />
//                 Previous
//               </Button>
//               <div className="flex space-x-4">
//                 {currentStep < 3 ? (
//                   <Button type="button" onClick={nextStep} className="bg-primary hover:bg-blue-800">
//                     Next
//                     <ChevronRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 ) : (
//                   <Button
//                     type="submit"
//                     disabled={bookingMutation.isPending}
//                     className="bg-accent hover:bg-green-700"
//                   >
//                     {bookingMutation.isPending ? "Booking..." : "Book Appointment"}
//                     <CheckCircle className="ml-2 h-4 w-4" />
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </section>
//   );
// }
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Clock, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import Calendar from "./Calendar";
import TimeSlots from "./TimeSlots";
import { bookAppointment } from "../lib/api";

const formSchema = z.object({
  clientName: z.string().min(1, "Name is required"),
  clientEmail: z.string().email("Valid email is required"),
  clientPhone: z.string().min(1, "Phone is required"),
  caseType: z.string().min(1, "Case type is required"),
  caseSummary: z.string().min(1, "Case summary is required"),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
});

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      caseType: "",
      caseSummary: "",
      appointmentDate: "",
      appointmentTime: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      setShowConfirmation(true);
      form.reset();
      setCurrentStep(1);
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    bookingMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepClass = (step) => {
    if (step <= currentStep) {
      return "w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium";
    }
    return "w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium";
  };

  const getStepTextClass = (step) => {
    return step <= currentStep ? "text-primary" : "text-gray-400";
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-slide-in">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h3>
            <p className="text-law-slate mb-4">
              Your appointment has been successfully booked. You will receive a confirmation email shortly.
            </p>
            <Button
              onClick={() => setShowConfirmation(false)}
              className="w-full bg-primary hover:bg-blue-800"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Your Appointment</h3>
          <p className="text-law-slate">Fill out the form below to schedule your legal consultation</p>
        </div>

        {/* Step Indicator */}
     {/* Step Indicator */}
<div className="flex items-center justify-center mb-8 px-4">
  <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-lg space-y-4 sm:space-y-0 sm:space-x-4">
    <div className={`flex items-center ${getStepTextClass(1)} flex-shrink-0`}>
      <div className={getStepClass(1)}>1</div>
      <span className="ml-2 text-xs xs:text-sm font-medium whitespace-nowrap">Personal Info</span>
    </div>
    <div className="hidden sm:block w-8 xs:w-12 sm:w-16 h-0.5 bg-gray-300 mx-2 sm:mx-4 flex-shrink-0"></div>
    <div className={`flex items-center ${getStepTextClass(2)} flex-shrink-0`}>
      <div className={getStepClass(2)}>2</div>
      <span className="ml-2 text-xs xs:text-sm font-medium whitespace-nowrap">Case Details</span>
    </div>
    <div className="hidden sm:block w-8 xs:w-12 sm:w-16 h-0.5 bg-gray-300 mx-2 sm:mx-4 flex-shrink-0"></div>
    <div className={`flex items-center ${getStepTextClass(3)} flex-shrink-0`}>
      <div className={getStepClass(3)}>3</div>
      <span className="ml-2 text-xs xs:text-sm font-medium whitespace-nowrap">Date & Time</span>
    </div>
  </div>
</div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="clientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: Case Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="caseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select case type..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="personal-injury">Personal Injury</SelectItem>
                          <SelectItem value="criminal-defense">Criminal Defense</SelectItem>
                          <SelectItem value="family-law">Family Law</SelectItem>
                          <SelectItem value="business-law">Business Law</SelectItem>
                          <SelectItem value="real-estate">Real Estate</SelectItem>
                          <SelectItem value="immigration">Immigration</SelectItem>
                          <SelectItem value="estate-planning">Estate Planning</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="caseSummary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Summary *</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Please provide a brief description of your legal matter..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Date & Time Selection */}
            {currentStep === 3 && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center mb-4">
                          <CalendarDays className="mr-2" />
                          Select Date *
                        </FormLabel>
                        <FormControl>
                          <Calendar
                            selectedDate={field.value}
                            onDateSelect={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="appointmentTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center mb-4">
                          <Clock className="mr-2" />
                          Available Time Slots *
                        </FormLabel>
                        <FormControl>
                          <TimeSlots
                            selectedDate={form.watch("appointmentDate")}
                            selectedTime={field.value}
                            onTimeSelect={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Form Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className={currentStep === 1 ? "invisible" : ""}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <div className="flex space-x-4">
                {currentStep < 3 ? (
                  <Button type="button" onClick={nextStep} className="bg-primary hover:bg-blue-800">
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={bookingMutation.isPending}
                    className="bg-accent hover:bg-green-700"
                  >
                    {bookingMutation.isPending ? "Booking..." : "Book Appointment"}
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
