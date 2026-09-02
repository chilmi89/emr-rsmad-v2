export interface SentEmailLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  simulationUrl: string;
  sentAt: string;
  status: "SUCCESS" | "FAILED";
  message?: string;
}

// Global in-memory log buffer for sent emails
const globalForSentEmails = globalThis as unknown as {
  sentEmailsLogs: SentEmailLog[] | undefined;
};

export const sentEmailsLogs: SentEmailLog[] = globalForSentEmails.sentEmailsLogs ?? [
  {
    id: "sent_init_1",
    recipientEmail: "hendra.pratama@rsmad.co.id",
    recipientName: "dr. Hendra Pratama",
    simulationUrl: "https://emr-rsmad-v2.vercel.app/auth-emr/login",
    sentAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    status: "SUCCESS",
    message: "Email terkirim via Gmail SMTP",
  },
];

if (process.env.NODE_ENV !== "production") globalForSentEmails.sentEmailsLogs = sentEmailsLogs;

export function recordSentEmail(log: Omit<SentEmailLog, "id" | "sentAt">) {
  const newLog: SentEmailLog = {
    id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    sentAt: new Date().toISOString(),
    ...log,
  };

  sentEmailsLogs.unshift(newLog);

  // Keep max 200 logs
  if (sentEmailsLogs.length > 200) {
    sentEmailsLogs.pop();
  }

  return newLog;
}
