export type UserRole = "admin" | "user";

export type FoundryUser = {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  active: boolean;
};

export type FoundrySession = Pick<FoundryUser, "id" | "email" | "role">;

export type DropdownOption = {
  id: string;
  label: string;
  active: boolean;
};

export type DropdownKey =
  | "grade"
  | "bomName"
  | "shift"
  | "heatStatus"
  | "furnaceName"
  | "furnaceCapacity"
  | "furnacePatching"
  | "ladleName"
  | "ladleCapacity"
  | "ladlePatching"
  | "ladleStatus"
  | "ladlePreheatMethod"
  | "numberOfTapping"
  | "beforeSampling"
  | "afterSampling"
  | "chargeCondition";

export type DropdownOptions = Record<DropdownKey, DropdownOption[]>;

export type ProductionRecord = {
  id: string;
  recordNumber: string;
  heatNo: string;
  grade: string;
  shift: string;
  furnaceName: string;
  createdBy: string;
  createdAt: string;
  status: "Draft" | "Submitted";
  values: Record<string, string | number>;
};

const USERS_KEY = "foundry-users";
const SESSION_KEY = "foundry-session";
const RECORDS_KEY = "foundry-production-records";
const OPTIONS_KEY = "foundry-dropdown-options";

export const defaultUsers: FoundryUser[] = [
  { id: "usr-admin", email: "admin@foundry.local", password: "Admin@123", role: "admin", active: true },
  { id: "usr-user", email: "user@foundry.local", password: "User@123", role: "user", active: true },
];

const option = (id: string, label = id): DropdownOption => ({ id, label, active: true });

export const defaultDropdownOptions: DropdownOptions = {
  grade: [option("5A"), option("5B"), option("5C")],
  bomName: [option("BOM-5A-STD"), option("BOM-5B-STD"), option("BOM-5C-STD")],
  shift: [option("A", "A · 06:00–14:00"), option("B", "B · 14:00–22:00"), option("C", "C · 22:00–06:00")],
  heatStatus: [option("Scheduled"), option("In Melting"), option("Completed")],
  furnaceName: [option("Furnace A"), option("Furnace B")],
  furnaceCapacity: [option("12000", "12,000 kg"), option("25000", "25,000 kg")],
  furnacePatching: [option("Good"), option("Required"), option("Under Repair")],
  ladleName: [option("Ladle 1"), option("Ladle 2"), option("Ladle 3")],
  ladleCapacity: [option("8500", "8,500 kg"), option("12000", "12,000 kg")],
  ladlePatching: [option("Good"), option("Required")],
  ladleStatus: [option("Available"), option("Preheat"), option("Holding")],
  ladlePreheatMethod: [option("Radiant"), option("Gas"), option("Electric")],
  numberOfTapping: [option("1"), option("2"), option("3")],
  beforeSampling: [option("Not Required"), option("Required")],
  afterSampling: [option("Not Required"), option("Required")],
  chargeCondition: [option("Dry"), option("Wet"), option("Mixed")],
};

const demoRecords: ProductionRecord[] = [
  {
    id: "rec-001",
    recordNumber: "FR-20260908-001",
    heatNo: "H-4471",
    grade: "5B",
    shift: "B",
    furnaceName: "Furnace A",
    createdBy: "user@foundry.local",
    createdAt: "2026-09-08T08:20:00.000Z",
    status: "Submitted",
    values: { plannedLiquidWeight: 1240 },
  },
  {
    id: "rec-002",
    recordNumber: "FR-20260908-002",
    heatNo: "H-4472",
    grade: "5A",
    shift: "B",
    furnaceName: "Furnace B",
    createdBy: "admin@foundry.local",
    createdAt: "2026-09-08T09:05:00.000Z",
    status: "Draft",
    values: { plannedLiquidWeight: 980 },
  },
  {
    id: "rec-003",
    recordNumber: "FR-20260907-014",
    heatNo: "H-4469",
    grade: "5C",
    shift: "A",
    furnaceName: "Furnace A",
    createdBy: "user@foundry.local",
    createdAt: "2026-09-07T07:45:00.000Z",
    status: "Submitted",
    values: { plannedLiquidWeight: 1120 },
  },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() {
  const users = read<FoundryUser[]>(USERS_KEY, defaultUsers);
  if (!window.localStorage.getItem(USERS_KEY)) write(USERS_KEY, users);
  return users;
}

export function saveUsers(users: FoundryUser[]) {
  write(USERS_KEY, users);
}

export function getSession() {
  return read<FoundrySession | null>(SESSION_KEY, null);
}

export function saveSession(session: FoundrySession | null) {
  if (session) write(SESSION_KEY, session);
  else if (typeof window !== "undefined") window.localStorage.removeItem(SESSION_KEY);
}

export function getRecords() {
  const records = read<ProductionRecord[]>(RECORDS_KEY, demoRecords);
  if (!window.localStorage.getItem(RECORDS_KEY)) write(RECORDS_KEY, records);
  return records;
}

export function saveRecords(records: ProductionRecord[]) {
  write(RECORDS_KEY, records);
}

export function getDropdownOptions() {
  const options = read<DropdownOptions>(OPTIONS_KEY, defaultDropdownOptions);
  if (!window.localStorage.getItem(OPTIONS_KEY)) write(OPTIONS_KEY, options);
  return options;
}

export function saveDropdownOptions(options: DropdownOptions) {
  write(OPTIONS_KEY, options);
}

export function nextRecordNumber(records: ProductionRecord[]) {
  const day = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const count = records.filter((record) => record.recordNumber.startsWith(`FR-${day}`)).length + 1;
  return `FR-${day}-${String(count).padStart(3, "0")}`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}