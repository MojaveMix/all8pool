import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './store/AuthContext'
import './index.css'
import './i18n'
import App from './App.tsx'

if (typeof window !== "undefined") {
  window.alert = (message: string) => {
    // Create alert overlay
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300";
    
    // Create modal card
    const card = document.createElement("div");
    card.className = "bg-[#181c29] border border-white/10 p-8 w-full max-w-sm rounded-[2.5rem] shadow-2xl relative text-center flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95 duration-300";
    
    // Check if message indicates an error or success to style the icon and buttons
    const isError = message.toLowerCase().includes("fail") || 
                    message.toLowerCase().includes("error") || 
                    message.toLowerCase().includes("invalid") || 
                    message.toLowerCase().includes("weak") || 
                    message.toLowerCase().includes("past") || 
                    message.toLowerCase().includes("large") ||
                    message.toLowerCase().includes("denied") ||
                    message.toLowerCase().includes("suspended") ||
                    message.toLowerCase().includes("not found");
                    
    const isSuccess = message.toLowerCase().includes("success") || 
                      message.toLowerCase().includes("join") || 
                      message.toLowerCase().includes("accept") || 
                      message.toLowerCase().includes("broadcast") || 
                      message.toLowerCase().includes("saved") || 
                      message.toLowerCase().includes("recorded") || 
                      message.toLowerCase().includes("started");
                      
    let title = "Notification";
    let iconColor = "text-emerald-400";
    let iconBg = "bg-emerald-400/10";
    let iconBorder = "border-emerald-400/20";
    let buttonStyle = "bg-[#00ff88] hover:bg-[#00ff88]/80 text-[#0b0f19]";
    let svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
    
    if (isError) {
      title = "Alert";
      iconColor = "text-red-500";
      iconBg = "bg-red-500/10";
      iconBorder = "border-red-500/20";
      buttonStyle = "bg-red-500 hover:bg-red-400 text-white";
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12" y1="16" y2="16"/></svg>`;
    } else if (isSuccess) {
      title = "Success";
      iconColor = "text-emerald-400";
      iconBg = "bg-emerald-400/10";
      iconBorder = "border-emerald-400/20";
      buttonStyle = "bg-[#00ff88] hover:bg-[#00ff88]/80 text-[#0b0f19]";
      svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    }

    card.innerHTML = `
      <div class="p-4 rounded-full ${iconBg} ${iconBorder} border ${iconColor} flex items-center justify-center shrink-0">
        ${svgIcon}
      </div>
      
      <div class="space-y-2">
        <h3 class="text-xl font-black text-white italic uppercase tracking-tight">
          ${title}
        </h3>
        <p class="text-sm font-bold text-gray-400 px-2 leading-relaxed">
          ${message}
        </p>
      </div>

      <button class="w-full py-3 rounded-xl font-black uppercase text-xs tracking-widest ${buttonStyle} transition-all duration-200 hover:scale-[1.02] shadow-lg">
        Got it
      </button>
    `;
    
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    
    const btn = card.querySelector("button");
    btn?.focus();
    btn?.addEventListener("click", () => {
      overlay.remove();
    });
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
