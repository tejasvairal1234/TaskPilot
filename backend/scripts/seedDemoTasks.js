import "dotenv/config";
import mongoose from "mongoose";
import User from "../src/models/auth/UserModel.js";
import Task from "../src/models/tasks/TaskModel.js";

const TARGET_EMAIL = "test@gmail.com";

// Helper to compute timestamps relative to now
const now = new Date();
const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
const daysFromNow = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

const demoTasksDefinition = [
  {
    demoKey: "demo-task-01",
    title: "Design TaskPilot landing page",
    description:
      "Create the initial landing page layout with hero section, feature cards, and responsive design. Ensure high-converting call-to-action sections with seamless dark and light theme transitions.",
    status: "completed",
    priority: "high",
    startDate: daysAgo(12),
    dueDate: daysAgo(8),
    createdAt: daysAgo(12),
    checklist: [
      { text: "Hero banner with animated CTA", completed: true },
      { text: "Feature grid with 6 core capabilities", completed: true },
      { text: "Interactive pricing calculator table", completed: true },
      { text: "Responsive mobile viewport adjustments", completed: true },
    ],
    attachments: [
      {
        name: "Figma Landing Designs",
        url: "https://figma.com/file/taskpilot-landing",
      },
    ],
  },
  {
    demoKey: "demo-task-02",
    title: "Implement user authentication",
    description:
      "Complete login, registration, logout, and protected route functionality. Includes JWT access and refresh token rotation, secure cookie handling, and password hashing using bcrypt.",
    status: "completed",
    priority: "high",
    startDate: daysAgo(11),
    dueDate: daysAgo(7),
    createdAt: daysAgo(11),
    checklist: [
      { text: "User registration endpoint with Zod validation", completed: true },
      { text: "Login endpoint with access and refresh JWTs", completed: true },
      { text: "Token refresh middleware and cookie storage", completed: true },
      { text: "Frontend AuthContext and protected route guards", completed: true },
    ],
    attachments: [
      {
        name: "Auth Flow Architecture Spec",
        url: "https://github.com/TaskPilot/docs/auth-spec",
      },
    ],
  },
  {
    demoKey: "demo-task-03",
    title: "Build dashboard analytics",
    description:
      "Implement task statistics, task distribution pie charts, priority bar charts, and recent activity streams. Data must aggregate dynamically from MongoDB without client-side lag.",
    status: "in-progress",
    priority: "high",
    startDate: daysAgo(6),
    dueDate: daysFromNow(2), // Due soon
    createdAt: daysAgo(6),
    checklist: [
      { text: "Aggregate query for pending, in-progress, completed counts", completed: true },
      { text: "Priority distribution aggregation pipeline", completed: true },
      { text: "Recharts ResponsiveContainer integration with theme-aware styling", completed: false },
    ],
    attachments: [
      {
        name: "Dashboard Metric Wireframes",
        url: "https://figma.com/file/taskpilot-dashboard",
      },
    ],
  },
  {
    demoKey: "demo-task-04",
    title: "Create task management page",
    description:
      "Build the task listing interface with search, filters and sorting. Includes a responsive multi-column Kanban board allowing smooth visualization of workflow states across columns.",
    status: "in-progress",
    priority: "medium",
    startDate: daysAgo(5),
    dueDate: daysFromNow(4),
    createdAt: daysAgo(5),
    checklist: [
      { text: "Kanban column container components", completed: true },
      { text: "Search bar with 400ms debounce hook", completed: true },
      { text: "Priority dropdown filter integration", completed: false },
      { text: "Sort by due date, created date, and title", completed: false },
    ],
    attachments: [],
  },
  {
    demoKey: "demo-task-05",
    title: "Implement drag and drop",
    description:
      "Allow users to move tasks between Pending, In Progress, and Completed columns. Requires smooth physics, optimistic client-side UI updates, and instant server state synchronization with graceful rollback on failure.",
    status: "in-progress",
    priority: "high",
    startDate: daysAgo(4),
    dueDate: daysFromNow(1), // Due tomorrow
    createdAt: daysAgo(4),
    checklist: [
      { text: "Install and configure @hello-pangea/dnd", completed: true },
      { text: "Setup Droppable columns and Draggable task cards", completed: true },
      { text: "Optimistic status update handler with error rollback", completed: true },
      { text: "Mobile touch-drag accessibility enhancements", completed: false },
    ],
    attachments: [
      {
        name: "DND Implementation PR #42",
        url: "https://github.com/TaskPilot/pull/42",
      },
    ],
  },
  {
    demoKey: "demo-task-06",
    title: "Add dark mode support",
    description:
      "Implement a complete Light/Dark theme system with persistent theme preference stored in localStorage and instant zero-flash stylesheet switching.",
    status: "completed",
    priority: "medium",
    startDate: daysAgo(9),
    dueDate: daysAgo(5),
    createdAt: daysAgo(9),
    checklist: [
      { text: "CSS variable tokens for background, card, border, and text", completed: true },
      { text: "Theme toggle button with smooth micro-interaction", completed: true },
      { text: "ThemeContext provider with system preference fallback", completed: true },
    ],
    attachments: [],
  },
  {
    demoKey: "demo-task-07",
    title: "Improve mobile responsiveness",
    description:
      "Conduct a thorough review and responsive optimization pass across the entire application interface. Ensure all screens (Dashboard, Kanban board, Task Details, Settings, and Auth flows) function smoothly across mobile viewports (320px to 414px) and tablets (768px to 1024px). Specific areas to address include drawer sliding gestures, touch-friendly tap targets of at least 44x44px for action buttons, eliminating horizontal overflow scrolls, preventing sticky viewport issues on mobile Safari, and ensuring modal dialogs adapt properly on smaller devices.",
    status: "pending",
    priority: "high",
    startDate: daysAgo(3),
    dueDate: daysFromNow(3),
    createdAt: daysAgo(3),
    checklist: [
      { text: "Fix drawer slide-over and backdrop blur on mobile viewports", completed: false },
      { text: "Test Kanban horizontal scrolling behavior on touch screens", completed: false },
      { text: "Optimize header mobile hamburger menu and logo spacing", completed: false },
      { text: "Validate 44px touch target compliance for all interactive buttons", completed: false },
    ],
    attachments: [
      {
        name: "Mobile QA Checklist",
        url: "https://docs.taskpilot.io/qa/mobile-responsive",
      },
    ],
  },
  {
    demoKey: "demo-task-08",
    title: "Add account settings",
    description:
      "Allow users to update their name, avatar, and password from the centralized settings panel with instant toast validation feedback.",
    status: "completed",
    priority: "medium",
    startDate: daysAgo(8),
    dueDate: daysAgo(4),
    createdAt: daysAgo(8),
    checklist: [
      { text: "Name update form with minimum length validation", completed: true },
      { text: "Password change form with current password verification", completed: true },
      { text: "Password strength meter with visual indicators", completed: true },
    ],
    attachments: [],
  },
  {
    demoKey: "demo-task-09",
    title: "Implement account deletion",
    description:
      "Add a secure confirmation flow for permanently deleting the user account, cascading task and refresh token cleanup.",
    status: "pending",
    priority: "high",
    startDate: daysAgo(2),
    dueDate: daysFromNow(5),
    createdAt: daysAgo(2),
    checklist: [
      { text: "ConfirmDialog modal with destructive warning styling", completed: false },
      { text: "Cascade delete of user tasks and refresh tokens in DB", completed: false },
      { text: "Cookie invalidation and redirect to /register", completed: false },
    ],
    attachments: [],
  },
  {
    demoKey: "demo-task-10",
    title: "Improve task search",
    description:
      "Allow users to search tasks by title and display matching results instantly with debounced queries.",
    status: "in-progress",
    priority: "medium",
    startDate: daysAgo(4),
    dueDate: daysAgo(2), // Overdue!
    createdAt: daysAgo(4),
    checklist: [
      { text: "MongoDB text search index on title field", completed: true },
      { text: "Backend regex / text query handler in taskController", completed: true },
      { text: "Client search input with clear button and loading spinner", completed: false },
    ],
    attachments: [],
  },
  {
    demoKey: "demo-task-11",
    title: "Add task priority filters",
    description:
      "Add Low, Medium and High priority filtering to the task management page to streamline triage.",
    status: "pending",
    priority: "medium",
    startDate: daysAgo(3),
    dueDate: daysFromNow(6),
    createdAt: daysAgo(3),
    checklist: [
      { text: "Priority filter dropdown in toolbar", completed: false },
      { text: "URL query parameter sync for bookmarkable filter state", completed: false },
    ],
    attachments: [],
  },
  {
    demoKey: "demo-task-12",
    title: "Fix responsive sidebar",
    description:
      "Improve sidebar open, close, collapsed desktop state, and mobile off-canvas drawer animations.",
    status: "in-progress",
    priority: "medium",
    startDate: daysAgo(5),
    dueDate: daysFromNow(3),
    createdAt: daysAgo(5),
    checklist: [
      { text: "Sidebar collapse toggle with tooltip indicators", completed: true },
      { text: "Smooth 250ms CSS width transitions", completed: true },
      { text: "Active route highlight indicator styling", completed: false },
    ],
    attachments: [],
  },
  {
    demoKey: "demo-task-13",
    title: "Improve theme transitions",
    description:
      "Add smooth transitions when switching between Light and Dark Mode.",
    status: "in-progress",
    priority: "low",
    startDate: daysAgo(4),
    dueDate: daysFromNow(7),
    createdAt: daysAgo(4),
    checklist: [
      { text: "CSS transition rules for background-color and border-color", completed: true },
      { text: "Prevent transition flash during initial page hydration", completed: false },
    ],
    attachments: [],
  },
  {
    demoKey: "demo-task-14",
    title: "Add task due dates",
    description:
      "Implement comprehensive date-time handling across task creation, editing, card badges, and calendar sorting. Users must be able to specify a due date, see overdue tasks clearly highlighted with red warning badges, and receive advance indicators for tasks due within the next 24 to 48 hours. Ensure the date pickers conform to local timezones and serialize reliably in ISO-8601 strings to prevent discrepancy between backend MongoDB UTC timestamps and browser display formats.",
    status: "pending",
    priority: "medium",
    startDate: daysAgo(2),
    dueDate: daysFromNow(4),
    createdAt: daysAgo(2),
    checklist: [
      { text: "Date picker component with HTML5 input[type=date]", completed: false },
      { text: "Overdue status calculation helper with relative time formatting", completed: false },
      { text: "Sort tasks by dueDate ascending and descending", completed: false },
    ],
    attachments: [
      {
        name: "Timezone Handling Guidelines",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
      },
    ],
  },
  {
    demoKey: "demo-task-15",
    title: "Improve empty states",
    description:
      "Create polished empty-state components with illustrations and call-to-action buttons for pages with no tasks.",
    status: "completed",
    priority: "low",
    startDate: daysAgo(10),
    dueDate: daysAgo(6),
    createdAt: daysAgo(10),
    checklist: [
      { text: "Empty state for zero tasks created", completed: true },
      { text: "Empty state for filtered search yielding zero results", completed: true },
    ],
    attachments: [],
  },
  {
    demoKey: "demo-task-16",
    title: "Add task validation",
    description:
      "Validate task title, description, priority and status before submission using unified Zod schemas on both frontend and backend.",
    status: "completed",
    priority: "low",
    startDate: daysAgo(9),
    dueDate: daysAgo(5),
    createdAt: daysAgo(9),
    checklist: [
      { text: "Title required check with 200 character cap", completed: true },
      { text: "Enum whitelist validation for status and priority", completed: true },
      { text: "Due date after start date validation check", completed: true },
    ],
    attachments: [],
  },
  {
    demoKey: "demo-task-17",
    title: "Optimize API responses",
    description:
      "Review task API responses, add projection fields, index queries, and measure latency on task listing endpoints.",
    status: "pending",
    priority: "medium",
    startDate: daysAgo(3),
    dueDate: daysAgo(3), // Overdue!
    createdAt: daysAgo(3),
    checklist: [
      { text: "Add compound indexes on { user: 1, status: 1 } and { user: 1, priority: 1 }", completed: true },
      { text: "Implement lean() queries for dashboard statistics", completed: false },
      { text: "Benchmark response times with ApacheBench or k6", completed: false },
    ],
    attachments: [],
  },
  {
    demoKey: "demo-task-18",
    title: "Test logout functionality",
    description:
      "Verify logout behavior, refresh token database revocation, cookie cleanup, and immediate redirect to the login page.",
    status: "completed",
    priority: "low",
    startDate: daysAgo(13),
    dueDate: daysAgo(9),
    createdAt: daysAgo(13),
    checklist: [
      { text: "Delete refresh token from RefreshTokenModel on logout", completed: true },
      { text: "Clear refreshToken httpOnly cookie in response", completed: true },
      { text: "Reset frontend AuthContext user state to null", completed: true },
    ],
    attachments: [],
  },
  {
    demoKey: "demo-task-19",
    title: "Review accessibility",
    description:
      "Audit buttons, forms, keyboard tab sequences, ARIA labels, and color contrast ratios against WCAG AA specifications.",
    status: "pending",
    priority: "low",
    startDate: daysAgo(1),
    dueDate: daysFromNow(8),
    createdAt: daysAgo(1),
    checklist: [
      { text: "Add aria-label attributes to icon-only buttons", completed: false },
      { text: "Ensure focus-visible outlines are distinctly visible in dark mode", completed: false },
      { text: "Test full screen reader flow with NVDA or VoiceOver", completed: false },
    ],
    attachments: [],
  },
  {
    demoKey: "demo-task-20",
    title: "Prepare production deployment",
    description:
      "Finalize production configuration, environment variable templates, containerization configs, and deployment scripts for both frontend and backend services. Verify strict CORS origins, rate limiting policies against brute-force attacks, security headers via Helmet, production database connection pooling with MongoDB Atlas, and build optimization via Vite rollup chunks. Ensure automated continuous integration runs test suites before deploying to production host.",
    status: "pending",
    priority: "high",
    startDate: daysAgo(1),
    dueDate: daysFromNow(10),
    createdAt: daysAgo(1),
    checklist: [
      { text: "Create sanitized .env.example files for frontend and backend", completed: true },
      { text: "Configure secure production CORS whitelist", completed: false },
      { text: "Verify express-rate-limit and express-mongo-sanitize middleware", completed: false },
      { text: "Run production Vite build and test gzip asset distribution", completed: false },
    ],
    attachments: [
      {
        name: "Deployment Checklist & Architecture",
        url: "https://docs.taskpilot.io/deployment/production-guide",
      },
    ],
  },
];

async function seedDemoTasks() {
  const mongoUrl =
    process.env.MONGODB_URL || "mongodb://localhost:27017/taskpilot";

  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB.");

    // 1. Locate the existing user
    const user = await User.findOne({ email: TARGET_EMAIL.toLowerCase() });
    if (!user) {
      console.error(
        `\n[ERROR] User "${TARGET_EMAIL}" was not found in the database.`
      );
      console.error("Please register this user first before seeding demo data.");
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`Found target user: ${user.email} (ID: ${user._id})`);

    // 2. Query existing demo tasks to enforce idempotency
    const existingDemoTasks = await Task.find({
      user: user._id,
      isDemo: true,
    }).lean();

    const existingKeys = new Set(existingDemoTasks.map((t) => t.demoKey));
    console.log(`Found ${existingDemoTasks.length} existing demo task(s).`);

    let createdCount = 0;
    let skippedCount = 0;

    for (const taskDef of demoTasksDefinition) {
      if (existingKeys.has(taskDef.demoKey)) {
        skippedCount++;
        continue;
      }

      await Task.create({
        ...taskDef,
        user: user._id,
        isDemo: true,
      });
      createdCount++;
    }

    // 3. Query all demo tasks for summary reporting
    const allDemoTasks = await Task.find({
      user: user._id,
      isDemo: true,
    }).lean();

    const stats = {
      pending: allDemoTasks.filter((t) => t.status === "pending").length,
      inProgress: allDemoTasks.filter((t) => t.status === "in-progress").length,
      completed: allDemoTasks.filter((t) => t.status === "completed").length,
      high: allDemoTasks.filter((t) => t.priority === "high").length,
      medium: allDemoTasks.filter((t) => t.priority === "medium").length,
      low: allDemoTasks.filter((t) => t.priority === "low").length,
    };

    console.log("\n==================================================");
    console.log("Demo data seeding completed.");
    console.log("==================================================");
    console.log(`User:\n${TARGET_EMAIL}\n`);
    console.log(`Demo tasks:\n${allDemoTasks.length}\n`);
    console.log(`Pending:\n${stats.pending}\n`);
    console.log(`In Progress:\n${stats.inProgress}\n`);
    console.log(`Completed:\n${stats.completed}\n`);
    console.log(`High:\n${stats.high}\n`);
    console.log(`Medium:\n${stats.medium}\n`);
    console.log(`Low:\n${stats.low}`);
    console.log("==================================================");
    console.log(`New tasks inserted: ${createdCount}`);
    console.log(`Existing tasks skipped (idempotent): ${skippedCount}`);
    console.log("==================================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed demo tasks:", err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

seedDemoTasks();
