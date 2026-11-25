export const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
export const formatTime = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
export const daysLeft = (expiresAt) => Math.max(0, Math.floor((new Date(expiresAt) - Date.now()) / 1000));