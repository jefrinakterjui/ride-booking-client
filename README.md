# 🚗 GoSwift - Ride Booking Platform (Frontend)

**GoSwift** holo ekti production-grade, fully responsive, ebong role-based full-stack ride booking application (Uber/Pathao-er moto). Ei repository-te project-er frontend code rakha hoyeche, ja **React**, **TypeScript**, **Redux Toolkit (RTK Query)**, ebong **Tailwind CSS (shadcn/ui)** diye toiri kora.

### ✨ Live Demo

* **Frontend (Live):** `[https://your-frontend-live-url.vercel.app]`
* **Backend (Live):** `[https://your-backend-live-url.vercel.app]`

---

## 📸 Project Screenshot

(Ekhane apnar project-er ekta sundor screenshot jog korben)

`![GoSwift Project Screenshot]([LINK_TO_YOUR_SCREENSHOT.png])`

---

## ✨ Core Features

Ei application-ti 3-ti alada user role (Rider, Driver, ebong Admin) support kore, shobar jonno alada dashboard ebong functionality ache.

### 👤 General & Authentication

* **Role-Based Authentication:** JWT (Access & Refresh Token) mechanism use kore secure authentication.
* **Role Selection:** Registration-er shomoy `Rider` ba `Driver` hishebe select korar shujog.
* **Protected Routes:** User-er role onujayi dashboard ebong page-gulo automatic protect kora thake.
* **Strict Error Handling:** `Zod` ebong `react-hook-form` diye front-end validation ebong `react-hot-toast` (`Sonner`) diye API-er success o error message dekhano.
* **Responsive UI:** Mobile, Tablet, ebong Desktop-e shompurno responsive design.

### 🧍 Rider Features

* **Ride Request:** Pickup o Destination select kore ride request korar form.
* **Ride History:** Nijer purber shob ride-er history (pagination ebong status/date onujayi filter-shoho).
* **Profile Management:** Nijer personal information (name) ebong password update korar sujog.
* **Safety (SOS Button):** Assignment-er requirement onujayi active ride-e ekta SOS button thakar bebostha.

###  lái xe Driver Features

* **Availability Control:** `Online` o `Offline` howar jonno real-time toggle switch.
* **Earnings Dashboard:** Google Charts diye toiri dashboard, jekhane `total earnings` ebong `total rides completed` -er real-time statistics dekhay.
* **Ride Request List:** Shob "Available" ride request-er list dekha ebong "Accept Ride" korar functionality.
* **Ride History:** Nijer shob ride-er history (pagination o filter-shoho) jekhane rider-er info-o dekhay.
* **Profile Management:** Nijer personal info, password, ebong **Vehicle Information** (gari-r model, type) update korar sujog.

###  admin Admin Dashboard

* **Full Analytics Dashboard:** Google Charts (`Line`, `Pie`, `Bar`) use kore platform-er shob statistics (User Growth, Revenue, Ride Status) dekhar bebostha.
* **User Management:** Shob `Rider` o `Driver`-er list dekha. Admin chaile user-der `Block`/`Unblock` korte pare.
* **Driver Approval:** Notun driver-der `Approve` ba `Suspend` korar khomota.
* **Ride Oversight:** Platform-er shob ride-er list dekha (advanced filtering-shoho).

---

## 🛠️ Tech Stack

Ei project-ti ekti complete full-stack application.

| Frontend (Ei Repo) | Backend |
| :--- | :--- |
| **Vite + React** | **Node.js** |
| **TypeScript** | **Express.js** |
| **Redux Toolkit** (State Management) | **MongoDB** (Database) |
| **RTK Query** (API Data Fetching) | **Mongoose** (ODM) |
| **React Router Dom** (Routing) | **JWT** (Authentication) |
| **Tailwind CSS** (Styling) | **Bcrypt.js** (Hashing) |
| **shadcn/ui** (UI Components) | **Zod** (Validation) |
| **React Hook Form** & **Zod** (Form) | **Mongoose Aggregate** |
| **Sonner** (Toast Notifications) | `cookie-parser` |
| **Google Charts** (Data Visualization) | `cors` |

---

## 🚀 Getting Started

Ei project-ti locally run korar jonno niche-r step-gulo follow korun:

### Prerequisites

* Node.js (v18 or higher)
* `npm` or `yarn`

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [[https://your-github-repo-link.git](https://your-github-repo-link.git)]
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd ride-booking-client
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Create Environment File:**
    Project-er root-e `.env.local` name ekta file toiri korun ebong apnar backend API-er URL din:

    ```.env.local
    VITE_BASE_URL=[https://your-backend-live-url.vercel.app/api/v1](https://your-backend-live-url.vercel.app/api/v1)
    ```
    *(**Note:** `/api/v1` path-ti jog kora khub joruri)*

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

6.  Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧑‍💼 Demo Credentials (for Testing)

Assignment test korar jonno niche-r credentials use kora jete pare:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@gofwift.com` | `Admin@123` |
| **Driver** | `driver@gofwift.com` | `Driver@123` |
| **Rider** | `rider@gofwift.com` | `Rider@123` |
