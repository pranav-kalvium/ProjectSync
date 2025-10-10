# S70_Arav_Shreyas_Capstone_OpusSync
# OpusSync - Multi-Tenancy Project Management System

## Project Idea
OpusSync is a multi-tenancy project management system built using the MERN stack. It is designed to help teams and organizations efficiently manage projects, tasks, and collaboration. The system includes role-based authentication, real-time collaboration, analytics, scheduling, and notifications, making it a powerful and scalable project management solution. The platform will be deployed on **Vercel (frontend), Render (backend), and MongoDB Atlas (database)**, with additional technologies like **Tailwind CSS, Socket.io, livekit**.

---

## Key Features
### **1. Authentication & Security**
- Google Sign-In, Email, and Password authentication
- Two-Factor Authentication (Google Authenticator, OTP)
- Cookie Session Management
- Logout & Session Termination
- Role-Based Access Control (Owner, Admin, Member, Read-Only)
- Granular Role-Based Access Control – Custom permissions for different roles

### **2. Workspaces & Project Management**
- Create & Manage Multiple Workspaces
- Invite Members to Workspaces
- Projects & Epics Management
- Tasks (CRUD, Status, Priority, Assignee)
- Task Deadlines & Due Dates – Automatically sync with the calendar
- Activity Logs & Audit Trails – Track who did what in the workspace

### **3. Collaboration & Communication**
- Team Chat & Direct Messaging
- Video Call for Team Meetings using livekit 

### **4. Productivity & Analytics**
- Analytics Dashboard
- Filters & Search (Status, Priority, AssignedTo)
- Pagination & Load More for performance optimization


### **5. Calendar & Scheduling**
- Meeting Scheduling – Book team or one-on-one meetings directly from the calendar
- Email Notifications – Notify users of upcoming meetings
- Task Progress Updates – Auto-update calendar based on task status
- Color-Coded Events & Categories – Differentiate between meetings, tasks, and deadlines

### **6. AI-Powered Assistance**
- AI Task Description Generation: Instantly generate detailed, markdown-formatted task descriptions from just a title using Google's Gemini API. An intelligent review workflow allows users to apply, discard, or regenerate suggestions, ensuring full control.

---

## Tech Stack
### **Frontend**
- React.js – For a dynamic and interactive user interface
- Tailwind CSS – For modern UI styling
- Socket.io – For real-time messaging and notifications


### **Backend**
- Node.js & Express.js – For handling server-side logic
- MongoDB & Mongoose – For database management
- Socket.io – For real-time communication
- Mongoose Transactions – For robust data integrity
- JWT & OAuth – For authentication
- Bcrypt.js – For password hashing
- Nodemailer – For email notifications
- Cloudinary – For media storage (profile pictures, attachments)
- Render – For backend deployment

### **DevOps & Deployment**
- Netlify – For frontend deployment
- MongoDB Atlas – For database hosting
- Render – For backend hosting

---

## Daily Plan & Timeline

### **Week 1: Foundation & Core Setup**
#### **Day 1-4: Project Setup & Core Design**
- Create Low-Fidelity Wireframes
- Create High-Fidelity UI Designs
- Set up GitHub Repository (Add README, Issues, Project Boards)
- Initialize MERN stack (React frontend, Node.js backend, MongoDB)
- Setup Project structure & linting rules

#### **Day 5-7: Authentication & Security**
- Implement Email/Password Authentication (JWT-based)
- Implement Google Sign-In Authentication
- Setup Role-Based Access Control (RBAC)
- Implement Session Management (Cookies, JWT Expiry Handling)
- Deploy Backend to Render

### **Week 2: Workspace & Project Management**
#### **Day 8-11: Workspaces, Projects & Tasks**
- Implement Create, Read, Update, Delete (CRUD) Workspaces
- Implement Project Creation & Management (CRUD)
- Implement Task Management (CRUD, Status, Priority, Assignee)

#### **Day 12-14: Task Dependencies & Timers**
- Implement Task Dependencies
- Implement Task Timer (Track Time Spent on Tasks)

### **Week 3: Collaboration & Advanced Features**
#### **Day 15-18: Collaboration Features**
- Implement Real-time Chat (Socket.io)
- **Capstone Submission:** Submit proof for WebSocket-based Real-time Communication

---

## Deployment 
Frontend: https://opussync.netlify.app
Backend : https://api-opus-sync.onrender.com