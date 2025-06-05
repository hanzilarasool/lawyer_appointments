import { useState } from "react";
import BookingForm from "../components/BookingForm";
import { Shield, Clock, Award } from "lucide-react";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-10 rounded-xl mb-2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 lg:text-2xl">Schedule Your Legal Consultation</h2>
          <p className="text-xl text-blue-100 mb-8">
            Professional legal services with convenient online appointment booking
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 text-blue-100">
            <div className="flex items-center">
              <Shield className="text-2xl mr-3" />
              <span>Confidential</span>
            </div>
            <div className="flex items-center">
              <Clock className="text-2xl mr-3" />
              <span>Flexible Scheduling</span>
            </div>
            <div className="flex items-center">
              <Award className="text-2xl mr-3" />
              <span>Expert Legal Team</span>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <BookingForm />

      {/* Trust Indicators */}
      <section className="bg-white rounded-xl shadow-lg p-8 mt-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <Shield className="text-law-blue text-3xl mb-4 mx-auto" />
            <h4 className="font-semibold text-gray-900 mb-2">Confidential & Secure</h4>
            <p className="text-law-slate">Your information is protected with attorney-client privilege</p>
          </div>
          <div>
            <Clock className="text-law-blue text-3xl mb-4 mx-auto" />
            <h4 className="font-semibold text-gray-900 mb-2">Quick Response</h4>
            <p className="text-law-slate">We'll confirm your appointment within 2 hours</p>
          </div>
          <div>
            <Shield className="text-law-blue text-3xl mb-4 mx-auto" />
            <h4 className="font-semibold text-gray-900 mb-2">Experienced Team</h4>
            <p className="text-law-slate">Over 15 years of legal expertise</p>
          </div>
        </div>
      </section>
    </main>
  );
}