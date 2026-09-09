import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Check,
  ClipboardList,
  Factory,
  LogOut,
  Menu,
  Plus,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculateValues,
  formSections,
  getVisibleFields,
  gradePrototypeValues,
  type FieldDefinition,
  type FormValues,
} from "@/lib/foundry-form";
import {
  defaultUsers,
  formatDate,
  getDropdownOptions,
  getRecords,
  getSession,
  getUsers,
  nextRecordNumber,
  saveDropdownOptions,
  saveRecords,
  saveSession,
  saveUsers,
  type DropdownKey,
  type DropdownOptions,
  type FoundrySession,
  type FoundryUser,
  type ProductionRecord,
} from "@/lib/foundry-storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Foundry Production Control" },
      { name: "description", content: "A focused production record workspace for foundry teams." },
      { property: "og:title", content: "Foundry Production Control" },
      { property: "og:description", content: "Create, review, and track foundry production records." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type View = "new" | "records" | "settings";

function Index() {
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<FoundrySession | null>(null);
  const [view, setView] = useState<View>("new");
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [users, setUsers] = useState<FoundryUser[]>(defaultUsers);
  const [options, setOptions] = useState<DropdownOptions | null>(null);

  useEffect(() => {
    setSession(getSession());
    setRecords(getRecords());
    setUsers(getUsers());
    setOptions(getDropdownOptions());
    setHydrated(true);
  }, []);

  if (!hydrated || !options) return <LoadingScreen />;
  if (!session) return <LoginScreen onLogin={(next) => { saveSession(next); setSession(next); }} />;

  const signOut = () => {
    saveSession(null);
    setSession(null);
    setView("new");
  };

  const updateRecords = (next: ProductionRecord[]) => {
    setRecords(next);
    saveRecords(next);
  };

  const updateOptions = (next: DropdownOptions) => {
    setOptions(next);
    saveDropdownOptions(next);
  };

  const updateUsers = (next: FoundryUser[]) => {
    setUsers(next);
    saveUsers(next);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar session={session} view={view} onView={setView} onSignOut={signOut} />
        <main className="min-w-0 flex-1">
          <TopBar session={session} view={view} />
          <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
            {view === "new" && (
              <ProductionPage options={options} records={records} onSave={updateRecords} />
            )}
            {view === "records" && <RecordsPage session={session} records={records} />}
            {view === "settings" && session.role === "admin" && (
              <SettingsPage options={options} users={users} onOptionsChange={updateOptions} onUsersChange={updateUsers} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">Loading production control…</div>;
}

function LoginScreen({ onLogin }: { onLogin: (session: FoundrySession) => void }) {
  const [email, setEmail] = useState("admin@foundry.local");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = getUsers().find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password);
    if (!user || !user.active) {
      setError(user ? "This account is disabled." : "Check the email and password, then try again.");
      return;
    }
    onLogin({ id: user.id, email: user.email, role: user.role });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-steel-950 text-primary-foreground">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(var(--color-steel-700)_1px,transparent_1px),linear-gradient(90deg,var(--color-steel-700)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative mx-auto grid min-h-screen max-w-[1400px] items-center gap-12 px-6 py-12 lg:grid-cols-[1fr_430px] lg:px-16">
        <section className="max-w-2xl">
          <div className="mb-8 flex items-center gap-3 text-signal-amber">
            <Factory className="size-7" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em]">FND / OPERATIONS</span>
          </div>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.22em] text-steel-300">Production record control</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-[0.98] tracking-tight text-steel-50 sm:text-7xl">Make every heat traceable.</h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-steel-300">A single workspace for production inputs, timing checks, review, and shift handover.</p>
          <div className="mt-12 grid max-w-xl grid-cols-3 border-y border-steel-700/70 py-5">
            <Metric value="03" label="active grades" />
            <Metric value="24/7" label="shift coverage" />
            <Metric value="LOCAL" label="prototype mode" />
          </div>
        </section>
        <form onSubmit={submit} className="border border-steel-600 bg-steel-900/80 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="mb-8 flex items-start justify-between border-b border-steel-700 pb-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal-amber">Secure access</p>
              <h2 className="mt-2 text-2xl font-semibold text-steel-50">Sign in to continue</h2>
            </div>
            <ShieldCheck className="size-6 text-signal-green" />
          </div>
          <div className="space-y-5">
            <label className="block text-sm text-steel-200">Email<input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 flex h-11 w-full border border-steel-600 bg-steel-950 px-3 text-sm text-steel-50 outline-none transition focus:border-signal-blue focus:ring-1 focus:ring-signal-blue" type="email" autoComplete="email" /></label>
            <label className="block text-sm text-steel-200">Password<input value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 flex h-11 w-full border border-steel-600 bg-steel-950 px-3 text-sm text-steel-50 outline-none transition focus:border-signal-blue focus:ring-1 focus:ring-signal-blue" type="password" autoComplete="current-password" /></label>
            {error && <p className="border border-signal-red/50 bg-signal-red/10 px-3 py-2 text-sm text-signal-red">{error}</p>}
            <Button type="submit" className="h-11 w-full rounded-none bg-signal-amber font-semibold text-steel-950 hover:bg-signal-amber/90">Enter production control <ArrowRight /></Button>
          </div>
          <div className="mt-8 border-t border-steel-700 pt-5 text-xs leading-5 text-steel-400">
            <p className="font-mono uppercase tracking-wider text-steel-300">Prototype credentials</p>
            <p className="mt-2">Admin: admin@foundry.local / Admin@123</p>
            <p>User: user@foundry.local / User@123</p>
          </div>
        </form>
      </div>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div><p className="font-mono text-xl text-steel-50">{value}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-steel-400">{label}</p></div>;
}

function Sidebar({ session, view, onView, onSignOut }: { session: FoundrySession; view: View; onView: (view: View) => void; onSignOut: () => void }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-steel-950 text-steel-200 lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-steel-800 px-6"><Factory className="size-5 text-signal-amber" /><span className="font-mono text-sm font-bold tracking-[0.14em] text-steel-50">FND / CTRL</span></div>
      <div className="flex-1 px-3 py-7">
        <p className="px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-steel-500">Workspace</p>
        <nav className="mt-3 space-y-1">
          <NavButton active={view === "new"} icon={<Plus />} onClick={() => onView("new")}>New production record</NavButton>
          <NavButton active={view === "records"} icon={<ClipboardList />} onClick={() => onView("records")}>Production records</NavButton>
          {session.role === "admin" && <NavButton active={view === "settings"} icon={<Settings2 />} onClick={() => onView("settings")}>Admin settings</NavButton>}
        </nav>
      </div>
      <div className="border-t border-steel-800 p-4">
        <div className="flex items-center gap-3 px-2 py-3"><div className="grid size-9 place-items-center bg-steel-800 text-signal-amber"><UserRound className="size-4" /></div><div className="min-w-0"><p className="truncate text-xs text-steel-100">{session.email}</p><p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-signal-green">{session.role} access</p></div></div>
        <Button variant="ghost" onClick={onSignOut} className="mt-2 w-full justify-start rounded-none text-steel-400 hover:bg-steel-800 hover:text-steel-50"><LogOut /> Sign out</Button>
      </div>
    </aside>
  );
}

function NavButton({ active, icon, children, onClick }: { active: boolean; icon: React.ReactNode; children: React.ReactNode; onClick: () => void }) {
  return <Button variant="ghost" onClick={onClick} className={`h-11 w-full justify-start rounded-none border-l-2 px-3 ${active ? "border-signal-amber bg-steel-800 text-steel-50" : "border-transparent text-steel-400 hover:bg-steel-900 hover:text-steel-100"}`}>{icon}{children}</Button>;
}

function TopBar({ session, view }: { session: FoundrySession; view: View }) {
  const title = view === "new" ? "New production record" : view === "records" ? "Production records" : "Admin settings";
  return <header className="flex min-h-20 items-center justify-between border-b border-border bg-card/70 px-4 sm:px-8"><div className="flex items-center gap-3"><Menu className="size-5 text-muted-foreground lg:hidden" /><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Foundry / {session.role}</p><h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2></div></div><div className="hidden items-center gap-2 sm:flex"><span className="size-2 pulse-dot bg-signal-green" /><span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Local workspace online</span></div></header>;
}

function ProductionPage({ options, records, onSave }: { options: DropdownOptions; records: ProductionRecord[]; onSave: (records: ProductionRecord[]) => void }) {
  const [values, setValues] = useState<FormValues>({});
  const [step, setStep] = useState(0);
  const [review, setReview] = useState(false);
  const [notice, setNotice] = useState("");
  const calculated = useMemo(() => calculateValues(values), [values]);
  const section = formSections[step];
  const progress = Math.round(((step + 1) / formSections.length) * 100);

  const change = (key: string, value: string) => {
    const next = { ...values, [key]: value };
    if (key === "grade" && gradePrototypeValues[value]) Object.assign(next, gradePrototypeValues[value]);
    setValues(next);
    setNotice("");
  };
  const missing = formSections.flatMap((item) => item.fields.filter((field) => field.required && !values[field.key]).map((field) => field.label));
  const save = (status: ProductionRecord["status"]) => {
    const record: ProductionRecord = { id: `rec-${Date.now()}`, recordNumber: nextRecordNumber(records), heatNo: values.heatNo || "—", grade: values.grade || "—", shift: values.shift || "—", furnaceName: values.furnaceName || "—", createdBy: "current user", createdAt: new Date().toISOString(), status, values };
    onSave([record, ...records]);
    setNotice(`${record.recordNumber} saved as ${status.toLowerCase()}.`);
    setReview(false);
    if (status === "Submitted") setValues({});
  };

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal-blue">Workflow 01 / Capture</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Create a production record</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Capture the heat from identity through inspection. Prototype dependent values are marked clearly.</p></div><div className="flex items-center gap-3 border border-border bg-card px-4 py-3"><Activity className="size-5 text-signal-green" /><div><p className="font-mono text-xs text-foreground">FORM / DRAFT</p><p className="text-xs text-muted-foreground">Autosave is local</p></div></div></div>
    {notice && <div className="flex items-center justify-between border border-signal-green/40 bg-signal-green/10 px-4 py-3 text-sm text-signal-green"><span><Check className="mr-2 inline size-4" />{notice}</span><Button variant="ghost" size="icon" onClick={() => setNotice("")}><X /></Button></div>}
    <div className="grid gap-6 xl:grid-cols-[250px_1fr]">
      <div className="border border-border bg-card p-4"><div className="mb-5 flex items-end justify-between"><span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Progress</span><span className="font-mono text-sm text-signal-amber">{String(step + 1).padStart(2, "0")} / {String(formSections.length).padStart(2, "0")}</span></div><div className="mb-6 h-1 bg-muted"><div className="h-full bg-signal-amber transition-all" style={{ width: `${progress}%` }} /></div><div className="space-y-1">{formSections.map((item, index) => <button type="button" key={item.id} onClick={() => setStep(index)} className={`flex w-full items-center gap-3 px-2 py-3 text-left text-sm transition ${index === step ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60"}`}><span className={`grid size-6 shrink-0 place-items-center font-mono text-[10px] ${index < step ? "bg-signal-green text-steel-950" : index === step ? "bg-signal-amber text-steel-950" : "bg-muted"}`}>{index < step ? <Check className="size-3" /> : index + 1}</span><span className="truncate">{item.title}</span></button>)}</div></div>
      <div className="min-w-0 border border-border bg-card"><div className="border-b border-border bg-muted/30 px-5 py-5 sm:px-7"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p className="font-mono text-[10px] uppercase tracking-wider text-signal-blue">Section {String(step + 1).padStart(2, "0")}</p><h2 className="mt-1 text-xl font-semibold">{section.title}</h2><p className="mt-1 text-sm text-muted-foreground">{section.description}</p></div><span className="border border-signal-amber/50 bg-signal-amber/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-signal-amber">Prototype values</span></div></div><div className="grid gap-x-5 gap-y-5 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">{getVisibleFields(section, values).map((field) => <Field key={field.key} field={field} value={values[field.key] || ""} options={options} onChange={change} />)}</div>{step === 3 && <CalculatedPanel calculated={calculated} />}
        <div className="flex flex-col-reverse justify-between gap-3 border-t border-border bg-muted/20 p-5 sm:flex-row sm:p-7"><Button variant="outline" onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}>Back</Button><div className="flex flex-wrap justify-end gap-2"><Button variant="secondary" onClick={() => save("Draft")}>Save draft</Button>{step < formSections.length - 1 ? <Button onClick={() => setStep(step + 1)}>Continue <ArrowRight /></Button> : <Button onClick={() => setReview(true)} className="bg-signal-amber text-steel-950 hover:bg-signal-amber/90">Review record <ClipboardList /></Button>}</div></div>
      </div>
    </div>
    {review && <ReviewPanel values={values} calculated={calculated} missing={missing} onClose={() => setReview(false)} onSave={save} />}
  </div>;
}

function Field({ field, value, options, onChange }: { field: FieldDefinition; value: string; options: DropdownOptions; onChange: (key: string, value: string) => void }) {
  const label = <span className="mb-2 flex items-center justify-between gap-2 text-xs font-medium text-foreground"><span>{field.label}{field.required && <span className="ml-1 text-signal-amber">*</span>}</span>{field.unit && <span className="font-mono text-[10px] text-muted-foreground">{field.unit}</span>}</span>;
  if (field.type === "select") {
    const items = options[field.optionKey as DropdownKey] || [];
    return <label className="block">{label}<Select value={value} onValueChange={(next) => onChange(field.key, next)}><SelectTrigger><SelectValue placeholder="Select value" /></SelectTrigger><SelectContent>{items.filter((item) => item.active).map((item) => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}</SelectContent></Select></label>;
  }
  if (field.type === "textarea") return <label className="block sm:col-span-2 lg:col-span-3">{label}<Textarea value={value} onChange={(event) => onChange(field.key, event.target.value)} placeholder="Add a traceable note" /></label>;
  return <label className="block">{label}<Input type={field.type} value={value} onChange={(event) => onChange(field.key, event.target.value)} placeholder={field.type === "number" ? "0.00" : "Enter value"} /></label>;
}

function CalculatedPanel({ calculated }: { calculated: Record<string, string> }) {
  return <div className="border-t border-border bg-steel-950 px-5 py-5 text-steel-50 sm:px-7"><div className="mb-4 flex items-center gap-2"><SlidersHorizontal className="size-4 text-signal-amber" /><h3 className="font-mono text-xs uppercase tracking-wider text-steel-200">Calculated checks</h3></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(calculated).map(([key, value]) => <div key={key} className="border border-steel-700 bg-steel-900 px-3 py-3"><p className="text-[10px] uppercase tracking-wider text-steel-400">{key.replaceAll(/([A-Z])/g, " $1")}</p><p className="mt-1 font-mono text-lg text-signal-green">{value}</p></div>)}</div></div>;
}

function ReviewPanel({ values, calculated, missing, onClose, onSave }: { values: FormValues; calculated: Record<string, string>; missing: string[]; onClose: () => void; onSave: (status: ProductionRecord["status"]) => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-steel-950/70 p-4 backdrop-blur-sm"><div className="max-h-[90vh] w-full max-w-2xl overflow-auto border border-border bg-card shadow-2xl"><div className="flex items-start justify-between border-b border-border p-5"><div><p className="font-mono text-[10px] uppercase tracking-wider text-signal-amber">Final check</p><h2 className="mt-1 text-2xl font-semibold">Review before submission</h2></div><Button variant="ghost" size="icon" onClick={onClose}><X /></Button></div><div className="space-y-5 p-5"><div className="grid gap-3 sm:grid-cols-2">{[["Heat No.", values.heatNo || "—"], ["Grade", values.grade || "—"], ["Shift", values.shift || "—"], ["Furnace", values.furnaceName || "—"], ["Furnace time", calculated.totalFurnaceTime]].map(([label, value]) => <div key={label} className="border border-border bg-muted/30 px-3 py-3"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 font-mono text-sm">{value}</p></div>)}</div>{missing.length > 0 && <div className="border border-signal-amber/50 bg-signal-amber/10 px-4 py-3 text-sm text-foreground"><p className="font-medium">Required fields still need attention</p><p className="mt-1 text-muted-foreground">{missing.join(", ")}</p></div>}<div className="flex flex-col-reverse justify-end gap-2 border-t border-border pt-4 sm:flex-row"><Button variant="outline" onClick={onClose}>Continue editing</Button><Button onClick={() => onSave("Submitted")} disabled={missing.length > 0} className="bg-signal-green text-steel-950 hover:bg-signal-green/90"><Check /> Submit production record</Button></div></div></div></div>;
}

function RecordsPage({ session, records }: { session: FoundrySession; records: ProductionRecord[] }) {
  const visible = session.role === "admin" ? records : records.filter((record) => record.createdBy === session.email || record.createdBy === "current user");
  return <div className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal-blue">Workflow 02 / Traceability</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Production records</h1><p className="mt-2 text-sm text-muted-foreground">{visible.length} record{visible.length === 1 ? "" : "s"} available in this workspace.</p></div><div className="border border-border bg-card px-4 py-3"><p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Visibility</p><p className="mt-1 text-sm">{session.role === "admin" ? "All production records" : "Your submitted records"}</p></div></div><div className="overflow-x-auto border border-border bg-card"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-muted/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><tr>{["Record", "Heat", "Grade", "Shift", "Furnace", "Created", "Status"].map((head) => <th key={head} className="px-5 py-4 font-medium">{head}</th>)}</tr></thead><tbody className="divide-y divide-border">{visible.map((record) => <tr key={record.id} className="transition hover:bg-accent/40"><td className="px-5 py-4 font-mono text-xs text-signal-blue">{record.recordNumber}</td><td className="px-5 py-4 font-mono text-xs">{record.heatNo}</td><td className="px-5 py-4">{record.grade}</td><td className="px-5 py-4">{record.shift}</td><td className="px-5 py-4">{record.furnaceName}</td><td className="px-5 py-4 text-muted-foreground">{formatDate(record.createdAt)}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-2 px-2 py-1 font-mono text-[10px] uppercase tracking-wider ${record.status === "Submitted" ? "bg-signal-green/15 text-signal-green" : "bg-signal-amber/15 text-signal-amber"}`}><span className="size-1.5 rounded-full bg-current" />{record.status}</span></td></tr>)}</tbody></table>{visible.length === 0 && <div className="p-12 text-center text-sm text-muted-foreground">No records are visible for this account yet.</div>}</div></div>;
}

function SettingsPage({ options, users, onOptionsChange, onUsersChange }: { options: DropdownOptions; users: FoundryUser[]; onOptionsChange: (options: DropdownOptions) => void; onUsersChange: (users: FoundryUser[]) => void }) {
  const [activeKey, setActiveKey] = useState<DropdownKey>("grade");
  const [newOption, setNewOption] = useState("");
  const optionKeys = Object.keys(options) as DropdownKey[];
  const addOption = () => { if (!newOption.trim()) return; onOptionsChange({ ...options, [activeKey]: [...options[activeKey], { id: newOption.trim(), label: newOption.trim(), active: true }] }); setNewOption(""); };
  return <div className="space-y-6"><div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal-blue">Workflow 03 / Administration</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Admin settings</h1><p className="mt-2 text-sm text-muted-foreground">Keep the local prototype’s dropdowns and demo accounts ready for the floor.</p></div><div className="grid gap-6 xl:grid-cols-2"><section className="border border-border bg-card"><div className="border-b border-border px-5 py-5"><h2 className="font-semibold">Dropdown options</h2><p className="mt-1 text-sm text-muted-foreground">Disable an option without removing existing records.</p></div><div className="p-5"><label className="block text-xs font-medium">Option group<Select value={activeKey} onValueChange={(value) => setActiveKey(value as DropdownKey)}><SelectTrigger className="mt-2"><SelectValue /></SelectTrigger><SelectContent>{optionKeys.map((key) => <SelectItem key={key} value={key}>{key}</SelectItem>)}</SelectContent></Select></label><div className="mt-5 space-y-2">{options[activeKey].map((item) => <div key={item.id} className="flex items-center justify-between gap-3 border border-border px-3 py-3"><span className={`text-sm ${item.active ? "" : "text-muted-foreground line-through"}`}>{item.label}</span><Button variant="outline" size="sm" onClick={() => onOptionsChange({ ...options, [activeKey]: options[activeKey].map((option) => option.id === item.id ? { ...option, active: !option.active } : option) })}>{item.active ? "Disable" : "Enable"}</Button></div>)}</div><div className="mt-5 flex gap-2"><Input value={newOption} onChange={(event) => setNewOption(event.target.value)} placeholder="Add an option" /><Button onClick={addOption}><Plus /> Add</Button></div></div></section><section className="border border-border bg-card"><div className="border-b border-border px-5 py-5"><h2 className="font-semibold">Demo users</h2><p className="mt-1 text-sm text-muted-foreground">Use these accounts to test role visibility.</p></div><div className="space-y-2 p-5">{users.map((user) => <div key={user.id} className="flex items-center justify-between gap-3 border border-border px-3 py-3"><div className="min-w-0"><p className="truncate text-sm">{user.email}</p><p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-signal-blue">{user.role} · {user.active ? "active" : "disabled"}</p></div><Button variant="outline" size="sm" onClick={() => onUsersChange(users.map((item) => item.id === user.id ? { ...item, active: !item.active } : item))}>{user.active ? "Disable" : "Enable"}</Button></div>)}</div></section></div></div>;
}