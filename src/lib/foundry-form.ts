export type FormValues = Record<string, string>;

export type FieldDefinition = {
  key: string;
  label: string;
  type: "text" | "number" | "time" | "textarea" | "select";
  optionKey?: string;
  required?: boolean;
  unit?: string;
  readOnly?: boolean;
};

export type FormSection = {
  id: string;
  title: string;
  description: string;
  fields: FieldDefinition[];
};

const select = (key: string, label: string, optionKey: string, required = false): FieldDefinition => ({ key, label, type: "select", optionKey, required });
const text = (key: string, label: string, required = false): FieldDefinition => ({ key, label, type: "text", required });
const number = (key: string, label: string, unit?: string, required = false): FieldDefinition => ({ key, label, type: "number", unit, required });
const time = (key: string, label: string): FieldDefinition => ({ key, label, type: "time" });

export const formSections: FormSection[] = [
  {
    id: "identity",
    title: "Heat identity & grade",
    description: "Start with the traceable production identity and grade selection.",
    fields: [
      text("heatNo", "Heat No.", true),
      select("grade", "Grade", "grade", true),
      select("bomName", "BOM Name", "bomName"),
      select("shift", "Shift", "shift", true),
      select("heatStatus", "Heat Status", "heatStatus"),
      text("meltingSupervisor", "Melting Supervisor"),
    ],
  },
  {
    id: "furnace",
    title: "Furnace & ladle setup",
    description: "Capture equipment condition before the heat starts.",
    fields: [
      select("furnaceName", "Furnace Name", "furnaceName", true),
      select("furnaceCapacity", "Furnace Capacity", "furnaceCapacity"),
      select("furnacePatching", "Furnace Patching", "furnacePatching"),
      select("ladleName", "Ladle Name", "ladleName"),
      select("ladleCapacity", "Ladle Capacity", "ladleCapacity"),
      select("ladlePatching", "Ladle Patching", "ladlePatching"),
      select("ladleStatus", "Ladle Status", "ladleStatus"),
      select("ladlePreheatMethod", "Ladle Preheat Method", "ladlePreheatMethod"),
      select("chargeCondition", "Charge Condition", "chargeCondition"),
    ],
  },
  {
    id: "inputs",
    title: "Production inputs",
    description: "Enter planned, power, charge, and sampling inputs.",
    fields: [
      number("plannedLiquidWeight", "Planned Liquid Weight", "kg", true),
      number("proposedIncreasedWeight", "Proposed Increased Weight", "%"),
      number("powerRating", "Power Rating", "kW"),
      number("gld", "GLD", "mA"),
      number("initialPower", "Initial Power", "kWh"),
      number("finalPower", "Final Power", "kWh"),
      select("numberOfTapping", "Number of Tapping", "numberOfTapping"),
      select("beforeSampling", "Before Sampling", "beforeSampling"),
      select("afterSampling", "After Sampling", "afterSampling"),
      number("actualCharge", "Actual Charge", "kg"),
      number("targetMeltingLoss", "Target Melting Loss", "%"),
      number("targetSpillageLoss", "Target Spillage Loss", "%"),
      number("actualLiquidMetalTapped", "Actual Liquid Metal Tapped", "kg"),
      number("ingotWeight", "Ingot Weight", "kg"),
    ],
  },
  {
    id: "timings",
    title: "Timing & tapping log",
    description: "Use time inputs to generate the simple duration calculations.",
    fields: [
      time("furnaceOnTime", "Furnace On Time"),
      time("furnaceOffTime", "Furnace Off Time"),
      time("tapping1Start", "1st Tapping Start Time"),
      time("tapping2Start", "2nd Tapping Start Time"),
      time("tapping3Start", "3rd Tapping Start Time"),
      time("preheat1Start", "1st Preheat Start Time"),
      time("preheat1End", "1st Preheat End Time"),
      time("preheat2Start", "2nd Preheat Start Time"),
      time("preheat2End", "2nd Preheat End Time"),
      time("preheat3Start", "3rd Preheat Start Time"),
      time("preheat3End", "3rd Preheat End Time"),
      time("stopperStart", "Stopper Rod Setting Start Time"),
      time("stopperEnd", "Stopper Rod Setting End Time"),
      time("metalHoldingTime", "Metal Holding Time"),
      time("ladleHoldingTime", "Ladle Holding Time"),
      time("deSlaggingSamplingTime", "De-Slagging Sampling Time"),
    ],
  },
  {
    id: "results",
    title: "Temperature & results",
    description: "Record tapping, preheat, pouring, test bar, and inspection notes.",
    fields: [
      number("tapping1Temperature", "1st Tapping Temperature", "°C"),
      number("tapping2Temperature", "2nd Tapping Temperature", "°C"),
      number("tapping3Temperature", "3rd Tapping Temperature", "°C"),
      number("preheat1Temperature", "1st Preheat Temperature", "°C"),
      number("preheat2Temperature", "2nd Preheat Temperature", "°C"),
      number("preheat3Temperature", "3rd Preheat Temperature", "°C"),
      number("actualPouringWeight", "Actual Pouring Weight", "kg"),
      number("plannedCastingWeight", "Planned Weight (Casting and TestBar)", "kg"),
      number("totalTestBar", "Total Number of TestBar"),
      number("spillage", "Spillage", "kg"),
      number("noOfPersons", "No. of Persons"),
      number("ladleJam", "Ladle Jam", "kg"),
      text("sampleResult", "Sample Result"),
      text("productResult", "Product Result"),
      { key: "remarks", label: "Remarks", type: "textarea" },
    ],
  },
];

export const calculatedLabels = [
  ["proposedWeight", "Proposed Weight", "kg"],
  ["preheat1Duration", "1st Preheat Duration", ""],
  ["preheat2Duration", "2nd Preheat Duration", ""],
  ["preheat3Duration", "3rd Preheat Duration", ""],
  ["bomPercent", "BOM %", "%"],
  ["totalBomCharge", "Total BOM Charge", "kg"],
  ["bomCharge", "BOM Charge", "kg"],
  ["totalActualCharge", "Total Actual Charge", "kg"],
  ["totalActualChargePercent", "Total Actual Charge", "%"],
  ["actualChargePercent", "Actual Charge", "%"],
  ["pouringWeightDeviation", "Pouring Weight Deviation", "%"],
  ["actualMeltingLoss", "Actual Melting Loss", "kg"],
  ["calculatedMeltingLoss", "Calculated Melting Loss", "kg"],
  ["meltingLossPercent", "Melting Loss", "%"],
  ["targetSpillage", "Target Spillage", "kg"],
  ["actualSpillageLoss", "Actual Spillage Loss", "kg"],
  ["totalFurnaceTime", "Total Furnace Time", ""],
  ["manHours", "Man Hours", ""],
  ["manPowerPerTon", "Man Power / Ton", ""],
  ["deviation", "Deviation", ""],
  ["correction", "Correction", ""],
] as const;

export const gradePrototypeValues: Record<string, Record<string, string>> = {
  "5A": { bomName: "BOM-5A-STD", furnaceCapacity: "12000", ladleCapacity: "8500", bomPercent: "62", targetMeltingLoss: "2.0", targetSpillageLoss: "0.5" },
  "5B": { bomName: "BOM-5B-STD", furnaceCapacity: "25000", ladleCapacity: "12000", bomPercent: "64", targetMeltingLoss: "2.2", targetSpillageLoss: "0.6" },
  "5C": { bomName: "BOM-5C-STD", furnaceCapacity: "25000", ladleCapacity: "12000", bomPercent: "66", targetMeltingLoss: "2.4", targetSpillageLoss: "0.7" },
};

export function durationBetween(start?: string, end?: string) {
  if (!start || !end) return "—";
  const toMinutes = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
  };
  let difference = toMinutes(end) - toMinutes(start);
  if (difference < 0) difference += 24 * 60;
  return `${String(Math.floor(difference / 60)).padStart(2, "0")}:${String(difference % 60).padStart(2, "0")}:00`;
}

export function calculateValues(values: FormValues) {
  return {
    preheat1Duration: durationBetween(values.preheat1Start, values.preheat1End),
    preheat2Duration: durationBetween(values.preheat2Start, values.preheat2End),
    preheat3Duration: durationBetween(values.preheat3Start, values.preheat3End),
    totalFurnaceTime: durationBetween(values.furnaceOnTime, values.furnaceOffTime),
    proposedWeight: "—",
  };
}

export function getVisibleFields(section: FormSection, values: FormValues) {
  return section.fields.filter((field) => {
    if (["tapping2Start", "tapping2Temperature"].includes(field.key)) return values.numberOfTapping === "2" || values.numberOfTapping === "3";
    if (["tapping3Start", "tapping3Temperature"].includes(field.key)) return values.numberOfTapping === "3";
    return true;
  });
}