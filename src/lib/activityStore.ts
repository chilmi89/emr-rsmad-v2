export interface ActivityLog {
  id: string;
  timestamp: string;
  eventType: "PAGE_OPENED" | "STEP1_LOGIN" | "OTP_REQUESTED" | "VERIFICATION_SUBMIT" | "DASHBOARD_ACCESS" | "USER_CREATED" | "USER_DELETED";
  actionName: string;
  userIdentifier: string;
  details: string;
  status: "SUCCESS" | "INFO" | "WARNING";
  ipAddress?: string;
  device?: string;
}

// Global in-memory log buffer across hot reloads
const globalForLogs = globalThis as unknown as {
  activityLogs: ActivityLog[] | undefined;
};

export const activityLogs: ActivityLog[] = globalForLogs.activityLogs ?? [
  {
    id: "act_init_1",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    eventType: "PAGE_OPENED",
    actionName: "Buka Halaman Simulasi",
    userIdentifier: "Anonim / Calon Peserta",
    details: "Peserta mengakses halaman awal /auth-emr/login",
    status: "INFO",
    ipAddress: "192.168.10.45",
    device: "Chrome / Windows 11",
  },
  {
    id: "act_init_2",
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    eventType: "STEP1_LOGIN",
    actionName: "Submit Kredensial Langkah 1",
    userIdentifier: "dr_hendra",
    details: "Peserta memasukkan username dr_hendra dan password",
    status: "WARNING",
    ipAddress: "192.168.10.45",
    device: "Chrome / Windows 11",
  },
  {
    id: "act_init_3",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    eventType: "OTP_REQUESTED",
    actionName: "Permintaan OTP ke Email",
    userIdentifier: "hendra.pratama@rsmad.co.id",
    details: "Kode verifikasi dikirimkan ke email tujuan via SMTP",
    status: "SUCCESS",
    ipAddress: "192.168.10.45",
    device: "Chrome / Windows 11",
  },
];

if (process.env.NODE_ENV !== "production") globalForLogs.activityLogs = activityLogs;

export function recordActivity(log: Omit<ActivityLog, "id" | "timestamp">) {
  const newLog: ActivityLog = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...log,
  };

  activityLogs.unshift(newLog);

  // Keep maximum 200 logs
  if (activityLogs.length > 200) {
    activityLogs.pop();
  }

  return newLog;
}
