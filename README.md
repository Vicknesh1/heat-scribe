# FoundryFlow Dynamics

Build a simple functional  Foundry Production Dynamic Form web app prototype.

### Login

Create a login page with 2 roles:

**Admin**

* email: `admin@foundry.local`
* password: `Admin@123`

**User**

* email: `user@foundry.local`
* password: `User@123`

Admin can access everything.
User can only create and submit production forms and view their own records.

 Main Pages

1. Login
2. Dashboard
3. New Production Record
4. Production Records
5. Admin Settings

### Dynamic Form

Create a sectioned form with these fields:

**Dropdowns**

* Grade
* BOM Name
* Shift
* Heat Status
* Furnace Name
* Furnace Capacity
* Furnace Patching
* Ladle Name
* Ladle Capacity
* Ladle Patching
* Ladle Status
* Ladle Preheat Method
* Number of Tapping
* Before Sampling
* After Sampling

For prototype, Grade options must be:
`5A, 5B, 5C`

**User Entry / Real-Time Fields**

* Heat No.
* Planned Liquid Weight (kg)
* Proposed Increased Weight (%)
* Power Rating (kW)
* GLD (mA)
* Initial Power (kWh)
* Final Power (kWh)
* Ladle Jam (kg)
* Sample Result (%)
* Product Result (%)
* Spillage (kg)
* No. of Persons
* Melting Supervisor
* Remarks
* Furnace On Time
* Furnace Off Time
* 1st Tapping Start Time
* 2nd Tapping Start Time
* 3rd Tapping Start Time
* 1st Preheat Start Time
* 1st Preheat End Time
* 2nd Preheat Start Time
* 2nd Preheat End Time
* 3rd Preheat Start Time
* 3rd Preheat End Time
* Stopper Rod Setting Start Time
* Stopper Rod Setting End Time
* Metal Holding Time
* Ladle Holding Time
* De-Slagging Sampling Time
* 1st Tapping Temperature (°C)
* 2nd Tapping Temperature (°C)
* 3rd Tapping Temperature (°C)
* 1st Preheat Temperature (°C)
* 2nd Preheat Temperature (°C)
* 3rd Preheat Temperature (°C)
* Actual Pouring Weight (kg)
* Planned Weight (Casting and TestBar) (kg)
* Total Number of TestBar
* Actual Charge (kg)
* Target Melting Loss (%)
* Target Spillage Loss (%)
* Actual Liquid Metal Tapped (kg)
* Ingot Weight (kg)

**Calculated fields**

* Proposed Weight (kg)
* 1st Preheat Duration
* 2nd Preheat Duration
* 3rd Preheat Duration
* BOM %
* Total BOM Charge (kg)
* BOM Charge (kg)
* Total Actual Charge (kg)
* Total Actual Charge (%)
* Actual Charge (%)
* Pouring Weight Deviation (%)
* Actual Melting Loss (kg)
* Calculated Melting Loss (kg)
* Melting Loss %
* Target Spillage (kg)
* Actual Spillage Loss
* Total Furnace Time
* Man Hours
* Man Power / Ton
* Deviation
* Correction

Add:

* Charge Condition

### Dynamic behavior

The form must support:

* dropdowns
* number inputs
* time inputs
* text inputs
* textarea
* read-only calculated fields
* conditional field visibility
* auto-populated fields

For now, do NOT invent real foundry formulas or metallurgical values.

Demonstrate one simple prototype dependency:

When Grade is selected, show that dependent fields can be auto-populated using sample prototype values. Clearly label these as prototype values.

Implement simple time-duration calculations:

* Preheat Duration = End Time - Start Time
* Total Furnace Time = Furnace Off Time - Furnace On Time

Leave the remaining complex calculations as placeholders showing `—` until formulas are provided.

### Form behavior

* Group fields into logical sections.
* Show progress through the form.
* Add Save Draft and Submit buttons.
* Validate required fields.
* Show a Review Before Submit screen.
* Generate a simple record number such as `FR-20260908-001`.

### Records

Create a Production Records table showing:

* Record Number
* Heat No.
* Grade
* Shift
* Furnace
* Created By
* Date
* Status

Users see their own records.
Admins see all records.

### Admin

Admin can:

* Add/edit/disable dropdown options
* Add/edit/disable users
* View all records

### Data

Use localStorage for:

* users
* login session
* production records
* dropdown options

Keep the implementation simple and modular.

Do NOT build a backend, cloud database, Docker setup, analytics, IoT integration or advanced reporting yet.

Focus on making the prototype functional, clean and easy to expand later into React + FastAPI + SQLite.

Use a professional industrial/factory-style UI with a clean dashboard, sidebar navigation and responsive form layout.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cf5d35f8-a4af-4588-8295-381e74458af8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
