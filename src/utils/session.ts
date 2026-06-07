// Session storage for user credentials and keys
export interface UserSession {
  id: string;
  username: string;
  token: string;
  k1: string; // Secret key for HMAC
  k2: string; // Password key for encryption
  bp: string; // Biometric template
  last_t: number; // Last successful timestamp
  balance: number;
  accountId: string; // Supabase account ID
  daily_limit: number;
  today_spent: number;
  last_spent_reset_date: string;
}

const SESSION_KEY = 'user_session';

export function saveUserSession(session: UserSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getUserSession(): UserSession | null {
  const sessionData = localStorage.getItem(SESSION_KEY);
  return sessionData ? JSON.parse(sessionData) : null;
}

export function clearUserSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function updateUserTimestamp(newT: number): void {
  const session = getUserSession();
  if (session) {
    session.last_t = newT;
    saveUserSession(session);
  }
}

export function updateUserBalance(newBalance: number): void {
  const session = getUserSession();
  if (session) {
    session.balance = newBalance;
    saveUserSession(session);
  }
}

export function updateTodaySpent(amount: number): void {
  const session = getUserSession();
  if (session) {
    session.today_spent += amount;
    saveUserSession(session);
  }
}

