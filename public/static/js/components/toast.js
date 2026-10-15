/**
 * Toast Notifications
 */

export function showToast(message, type = "success") {
  const root = document.getElementById("toast-root");
  if (!root) return;

  const toast = document.createElement("div");
  const isError = type === "error";
  const isInfo = type === "info";
  
  const borderColor = isError ? "border-red-500" : (isInfo ? "border-[#9C8AFF]" : "border-[#D8FF3E]");
  const textColor = isError ? "text-red-400" : (isInfo ? "text-[#9C8AFF]" : "text-[#D8FF3E]");
  const icon = isError ? "alert-circle" : (isInfo ? "sparkles" : "check-circle-2");

  toast.className = `pointer-events-auto flex items-center space-x-3 bg-[#1B1E19]/95 backdrop-blur-md border ${borderColor} px-4 py-3 rounded-xl shadow-xl transition-all duration-300 transform translate-y-4 opacity-0`;
  toast.innerHTML = `
    <i data-lucide="${icon}" class="w-5 h-5 ${textColor}"></i>
    <span class="text-sm font-medium text-[#F4F5EF]">${message}</span>
  `;

  root.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-4", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
  });

  // Remove after 3.5s
  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-4", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
