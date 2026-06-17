import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Store, Mail, Phone, MapPin } from "lucide-react";
import api from "../api";

const OwnerApplicationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    hallName: "",
    city: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await api.post("/owner-requests", formData);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.response?.data?.message || "Failed to submit application. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="bg-secondary rounded-[2rem] p-10 max-w-lg w-full text-center border border-white/5 space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Application Sent!</h2>
          <p className="text-gray-400 font-bold leading-relaxed">
            Thank you for applying to become a Partner Hall. Our administrative team will review your details and contact you shortly.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-8 bg-accent text-primary px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform w-full"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest mb-8"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-secondary rounded-[2rem] p-8 md:p-12 border border-white/5 shadow-2xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase mb-2">
              Partner Application
            </h2>
            <p className="text-gray-400 font-bold">
              Fill out the form below to request owner access for your pool hall.
            </p>
          </div>

          {status === "error" && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl mb-6 font-bold text-sm text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Full Name</label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-primary border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-white focus:border-accent outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-primary border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-white focus:border-accent outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    required
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-primary border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-white focus:border-accent outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-primary border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-white focus:border-accent outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Pool Hall Name</label>
              <input
                required
                type="text"
                value={formData.hallName}
                onChange={(e) => setFormData({ ...formData, hallName: e.target.value })}
                className="w-full bg-primary border border-gray-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-accent outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Additional Message (Optional)</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-primary border border-gray-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-accent outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-accent text-primary py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform disabled:opacity-50 mt-4"
            >
              {status === "loading" ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OwnerApplicationPage;