import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

const API_URL = "https://task-management-system-az2z.onrender.com/api";

function getUser() {
  try {
    const value = localStorage.getItem("user");
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

/* =========================================================
   AUTH — UNCHANGED
   ========================================================= */

function AuthPage({ mode }) {
  const navigate = useNavigate();
  const isLogin = mode === "login";

  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, loginData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.error || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/register`, {
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
      });

      alert("Account created successfully.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow glow-one" />
      <div className="auth-glow glow-two" />

      <div className="auth-container">
        <section className="auth-left">
          <div className="tech-grid" />
          <div className="tech-orb tech-orb-one" />
          <div className="tech-orb tech-orb-two" />

          <div className="code-particle particle-one">{"</>"}</div>
          <div className="code-particle particle-two">{"{}"}</div>
          <div className="code-particle particle-three">{"01"}</div>

          <div className="auth-brand">
            <div className="auth-logo-box">
              <div className="logo-ring" />
              <img src={logo} alt="TaskFlow" />
            </div>

            <span className="brand-name">TaskFlow</span>

            <span className="brand-status">
              <i />
              SYSTEM ONLINE
            </span>
          </div>

          <div className="auth-intro">
            <span className="eyebrow">
              <i className="eyebrow-dot" />
              SMART TASK MANAGEMENT
            </span>

            <h1>
              Turn your plans
              <br />
              into <span>progress.</span>
            </h1>

            <p>
              Organize your work, track your progress and stay focused with
              everything in one simple workspace.
            </p>
          </div>

          <div className="auth-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <p>
                <strong>Organize effortlessly</strong>
                <small>Keep every task in one place.</small>
              </p>
              <span className="feature-arrow">→</span>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <p>
                <strong>Track your progress</strong>
                <small>Know exactly what needs attention.</small>
              </p>
              <span className="feature-arrow">→</span>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <p>
                <strong>Stay productive</strong>
                <small>Focus on completing what matters.</small>
              </p>
              <span className="feature-arrow">→</span>
            </div>
          </div>

          <div className="auth-footer">
            <span>TaskFlow</span>
            <span>•</span>
            <span>Productivity made simple</span>
            <span className="footer-tech">v1.0 / SECURE</span>
          </div>
        </section>

        <section className="auth-right">
          <div className="right-tech-line" />
          <div className="right-tech-dot dot-one" />
          <div className="right-tech-dot dot-two" />

          <div className="auth-form-wrap">
            <div className="auth-heading">
              <span>
                <i className="heading-status" />
                {isLogin ? "WELCOME BACK" : "GET STARTED"}
              </span>

              <h2>
                {isLogin
                  ? "Sign in to your account"
                  : "Create your account"}
              </h2>

              <p>
                {isLogin
                  ? "Enter your details to continue to TaskFlow."
                  : "Create your account and start managing your tasks."}
              </p>
            </div>

            {isLogin ? (
              <form onSubmit={handleLogin}>
                <div className="field">
                  <label>Email address</label>

                  <div className="input-wrap">
                    <span className="input-icon">@</span>

                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          email: e.target.value,
                        })
                      }
                      required
                    />

                    <span className="input-status">●</span>
                  </div>
                </div>

                <div className="field">
                  <div className="field-label-row">
                    <label>Password</label>
                    <span>Secure login</span>
                  </div>

                  <div className="input-wrap">
                    <span className="input-icon">◆</span>

                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        })
                      }
                      required
                    />

                    <span className="input-status">●</span>
                  </div>
                </div>

                <button
                  className="primary-auth-button"
                  type="submit"
                  disabled={loading}
                >
                  <span className="button-shine" />

                  <span className="button-content">
                    {loading ? "Signing in..." : "Sign In"}
                    {!loading && <span className="button-arrow">→</span>}
                  </span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup}>
                <div className="field">
                  <label>Username</label>

                  <div className="input-wrap">
                    <span className="input-icon">◉</span>

                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={signupData.username}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          username: e.target.value,
                        })
                      }
                      required
                    />

                    <span className="input-status">●</span>
                  </div>
                </div>

                <div className="field">
                  <label>Email address</label>

                  <div className="input-wrap">
                    <span className="input-icon">@</span>

                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          email: e.target.value,
                        })
                      }
                      required
                    />

                    <span className="input-status">●</span>
                  </div>
                </div>

                <div className="field">
                  <label>Password</label>

                  <div className="input-wrap">
                    <span className="input-icon">◆</span>

                    <input
                      type="password"
                      placeholder="Create a password"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />

                    <span className="input-status">●</span>
                  </div>
                </div>

                <div className="field">
                  <label>Confirm password</label>

                  <div className="input-wrap">
                    <span className="input-icon">◆</span>

                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />

                    <span className="input-status">●</span>
                  </div>
                </div>

                <button
                  className="primary-auth-button"
                  type="submit"
                  disabled={loading}
                >
                  <span className="button-shine" />

                  <span className="button-content">
                    {loading ? "Creating account..." : "Create Account"}
                    {!loading && <span className="button-arrow">→</span>}
                  </span>
                </button>
              </form>
            )}

            <div className="auth-switch">
              <span>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>

              <button
                type="button"
                onClick={() =>
                  navigate(isLogin ? "/signup" : "/login")
                }
              >
                {isLogin ? "Create Account" : "Sign In"}
                <span className="switch-arrow">↗</span>
              </button>
            </div>

            <div className="security-note">
              <span className="security-icon">✓</span>
              <span>Protected workspace</span>
              <span className="security-line" />
              <span>Encrypted connection</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(getUser);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [view, setView] = useState("dashboard");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    dueDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const metadataKey = `taskflow_metadata_${user?.email || "guest"}`;
  const activityKey = `taskflow_activity_${user?.email || "guest"}`;

  const getMetadata = () => {
    try {
      return JSON.parse(localStorage.getItem(metadataKey) || "{}");
    } catch {
      return {};
    }
  };

  const getActivities = () => {
    try {
      return JSON.parse(localStorage.getItem(activityKey) || "[]");
    } catch {
      return [];
    }
  };

  const [metadata, setMetadata] = useState(getMetadata);
  const [activities, setActivities] = useState(getActivities);

  const addActivity = (message, type = "action") => {
    const item = {
      id: Date.now(),
      message,
      type,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const next = [item, ...getActivities()].slice(0, 7);

    setActivities(next);
    localStorage.setItem(activityKey, JSON.stringify(next));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  const fetchTasks = async () => {
    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      logout();
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        logout();
      } else {
        console.error("Failed to fetch tasks:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setMetadata(getMetadata());
    setActivities(getActivities());
  }, [user]);

  const getTaskMeta = (task) => {
    return metadata[String(task.id)] || {
      priority: task.priority || "Medium",
      dueDate: task.dueDate || "",
    };
  };

  const updateTaskMeta = (taskId, values) => {
    const next = {
      ...metadata,
      [String(taskId)]: {
        ...(metadata[String(taskId)] || {}),
        ...values,
      },
    };

    setMetadata(next);
    localStorage.setItem(metadataKey, JSON.stringify(next));
  };

  const openAdd = () => {
    setEditingTask(null);

    setTaskData({
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
    });

    setModalOpen(true);
  };

  const openEdit = (task) => {
    const meta = getTaskMeta(task);

    setEditingTask(task);

    setTaskData({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "To Do",
      priority: meta.priority || "Medium",
      dueDate: meta.dueDate || "",
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingTask(null);

    setTaskData({
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
    });
  };

  const saveTask = async (e) => {
    e.preventDefault();

    const title = taskData.title.trim();

    if (!title) {
      alert("Task title is required.");
      return;
    }

    setSaving(true);

    try {
      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        logout();
        return;
      }

      const payload = {
        title,
        description: taskData.description.trim(),
        status: taskData.status,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      };

      let savedId;

      if (editingTask) {
        await axios.put(
          `${API_URL}/tasks/${editingTask.id}`,
          payload,
          config
        );

        savedId = editingTask.id;

        addActivity(`task.update("${title}")`, "update");
      } else {
        const res = await axios.post(
          `${API_URL}/tasks`,
          payload,
          config
        );

        savedId = res.data?.id;

        addActivity(`task.create("${title}")`, "create");
      }

      if (savedId) {
        updateTaskMeta(savedId, {
          priority: taskData.priority,
          dueDate: taskData.dueDate,
        });
      }

      setSaving(false);
      setModalOpen(false);
      setEditingTask(null);

      setTaskData({
        title: "",
        description: "",
        status: "To Do",
        priority: "Medium",
        dueDate: "",
      });

      await fetchTasks();
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Something went wrong."
      );

      setSaving(false);
    }
  };

  const deleteTask = async (id) => {
    const task = tasks.find((item) => item.id === id);

    if (!window.confirm("Delete this task permanently?")) return;

    try {
      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        logout();
        return;
      }

      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (task) {
        addActivity(`task.delete("${task.title}")`, "delete");
      }

      const nextMetadata = { ...metadata };
      delete nextMetadata[String(id)];

      setMetadata(nextMetadata);
      localStorage.setItem(
        metadataKey,
        JSON.stringify(nextMetadata)
      );

      await fetchTasks();
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Unable to delete the task."
      );
    }
  };

  const changeStatus = async (task, status) => {
    try {
      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        logout();
        return;
      }

      await axios.put(
        `${API_URL}/tasks/${task.id}`,
        {
          title: task.title,
          description: task.description || "",
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      addActivity(
        `task.status("${task.title}" → "${status}")`,
        "status"
      );

      await fetchTasks();
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Unable to change task status."
      );
    }
  };

  const counts = useMemo(() => {
    let total = tasks.length;
    let todo = 0;
    let progress = 0;
    let completed = 0;

    tasks.forEach((task) => {
      if (task.status === "To Do") todo++;
      if (task.status === "In Progress") progress++;
      if (task.status === "Completed") completed++;
    });

    return {
      total,
      todo,
      progress,
      completed,
      pending: todo + progress,
    };
  }, [tasks]);

  const globalSearch = search.trim().toLowerCase();

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const meta = getTaskMeta(task);

      const matchesStatus =
        filter === "All" || task.status === filter;

      const matchesPriority =
        priorityFilter === "All" ||
        meta.priority === priorityFilter;

      const title = String(task.title || "").toLowerCase();
      const description = String(
        task.description || ""
      ).toLowerCase();

      const matchesSearch =
        !globalSearch ||
        title.includes(globalSearch) ||
        description.includes(globalSearch);

      return (
        matchesStatus &&
        matchesPriority &&
        matchesSearch
      );
    });
  }, [
    tasks,
    filter,
    priorityFilter,
    globalSearch,
    metadata,
  ]);

  const completionPercentage =
    counts.total === 0
      ? 0
      : Math.round(
          (counts.completed / counts.total) * 100
        );

  const formatDate = (date) => {
    if (!date) return "No due date";

    const d = new Date(`${date}T00:00:00`);

    return d.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusClass = (status) =>
    String(status || "To Do")
      .toLowerCase()
      .replace(/\s+/g, "-");

  const priorityClass = (priority) =>
    String(priority || "Medium").toLowerCase();

  const navigateView = (nextView) => {
    setView(nextView);
    setMobileSidebar(false);
    setProfileMenu(false);
  };

  const handleGlobalKey = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      document.querySelector(".tf-global-search input")?.focus();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKey);
    return () =>
      window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  const today = new Date();
  const monthStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );
  const firstDay = monthStart.getDay();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const calendarDays = Array.from(
    { length: firstDay + daysInMonth },
    (_, index) => {
      if (index < firstDay) return null;
      return index - firstDay + 1;
    }
  );

  const tasksForDay = (day) => {
    if (!day) return [];

    const date = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return tasks.filter(
      (task) => getTaskMeta(task).dueDate === date
    );
  };

  return (
    <div className="tf-app">
      <aside
        className={`tf-sidebar ${
          mobileSidebar ? "tf-sidebar-open" : ""
        }`}
      >
        <div className="tf-sidebar-top">
          <div className="tf-brand">
            <div className="tf-brand-icon">
              <img src={logo} alt="TaskFlow" />
            </div>

            <div>
              <strong>TaskFlow</strong>
              <span>DEV WORKSPACE</span>
            </div>
          </div>

          <button
            className="tf-mobile-close"
            onClick={() => setMobileSidebar(false)}
          >
            ×
          </button>
        </div>

        <div className="tf-system">
          <span className="tf-online-dot" />
          SYSTEM ONLINE
          <span className="tf-system-version">v1.0</span>
        </div>

        <nav className="tf-nav">
          <button
            className={
              view === "dashboard"
                ? "tf-nav-item active"
                : "tf-nav-item"
            }
            onClick={() => navigateView("dashboard")}
          >
            <span>⌂</span>
            <b>Dashboard</b>
            <i>01</i>
          </button>

          <button
            className={
              view === "tasks"
                ? "tf-nav-item active"
                : "tf-nav-item"
            }
            onClick={() => navigateView("tasks")}
          >
            <span>☷</span>
            <b>My Tasks</b>
            <i>{counts.total}</i>
          </button>

          <button
            className="tf-nav-item"
            onClick={openAdd}
          >
            <span>＋</span>
            <b>Add Task</b>
            <i>+</i>
          </button>

          <button
            className={
              view === "calendar"
                ? "tf-nav-item active"
                : "tf-nav-item"
            }
            onClick={() => navigateView("calendar")}
          >
            <span>▣</span>
            <b>Calendar</b>
            <i>→</i>
          </button>

          <button
            className={
              view === "settings"
                ? "tf-nav-item active"
                : "tf-nav-item"
            }
            onClick={() => navigateView("settings")}
          >
            <span>⚙</span>
            <b>Settings</b>
            <i>→</i>
          </button>
        </nav>

        <div className="tf-side-code">
          <div className="tf-code-line">
            <span>01</span> const focus =
          </div>
          <div className="tf-code-line">
            <span>02</span> productivity
          </div>
          <div className="tf-code-line">
            <span>03</span> = true;
          </div>
          <div className="tf-code-symbol">{"</>"}</div>
        </div>

        <div className="tf-motivation">
          <span className="tf-motivation-label">
            DAILY BUILD
          </span>
          <strong>
            Better Tasks.
            <br />
            Bigger Dreams.
          </strong>
          <div className="tf-motivation-line">
            <span />
          </div>
          <small>01 / 04 — KEEP SHIPPING</small>
        </div>

        <button
          className="tf-sidebar-logout"
          onClick={logout}
        >
          <span>↪</span>
          Sign out
        </button>
      </aside>

      {mobileSidebar && (
        <div
          className="tf-sidebar-overlay"
          onClick={() => setMobileSidebar(false)}
        />
      )}

      <section className="tf-center">
        <header className="tf-header">
          <button
            className="tf-hamburger"
            onClick={() => setMobileSidebar(true)}
          >
            ☰
          </button>

          <div className="tf-global-search">
            <span>⌕</span>

            <input
              placeholder="Search tasks, projects, or anything..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <kbd>Ctrl K</kbd>
          </div>

          <div className="tf-header-actions">
            <button
              className="tf-icon-button"
              onClick={() =>
                setNotifications(!notifications)
              }
            >
              ◌
              <i />
            </button>

            <div className="tf-profile-wrap">
              <button
                className="tf-profile"
                onClick={() =>
                  setProfileMenu(!profileMenu)
                }
              >
                <div className="tf-avatar">
                  {user?.username?.charAt(0)?.toUpperCase() ||
                    "U"}
                </div>

                <div>
                  <strong>{user?.username || "User"}</strong>
                  <span>{user?.email || ""}</span>
                </div>

                <b>⌄</b>
              </button>

              {profileMenu && (
                <div className="tf-profile-menu">
                  <button
                    onClick={() =>
                      navigateView("settings")
                    }
                  >
                    ⚙ Settings
                  </button>

                  <button onClick={logout}>
                    ↪ Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {notifications && (
            <div className="tf-notification-panel">
              <strong>Notifications</strong>
              <span>
                ● {counts.total} tasks in workspace
              </span>
              <span>
                ● {counts.completed} completed
              </span>
              <span>
                ● {counts.pending} still active
              </span>
            </div>
          )}
        </header>

        <main className="tf-main-scroll">
          {view === "dashboard" && (
            <>
              <section className="tf-hero">
                <div className="tf-hero-grid" />

                <div className="tf-hero-copy">
                  <div className="tf-hero-eyebrow">
                    <span />
                    WELCOME BACK / {user?.username || "USER"}
                  </div>

                  <h1>
                    Good to see you,{" "}
                    <span>{user?.username || "there"}.</span>
                  </h1>

                  <p>
                    Build your day, one task at a time.
                    <br />
                    Plan it. Code it. Track it. Complete it.
                  </p>

                  <div className="tf-journey">
                    <div className="tf-journey-item active">
                      <span>01</span>
                      <b>PLAN</b>
                    </div>

                    <div className="tf-journey-line" />

                    <div className="tf-journey-item">
                      <span>02</span>
                      <b>CODE</b>
                    </div>

                    <div className="tf-journey-line" />

                    <div className="tf-journey-item">
                      <span>03</span>
                      <b>TRACK</b>
                    </div>

                    <div className="tf-journey-line" />

                    <div className="tf-journey-item">
                      <span>04</span>
                      <b>ACHIEVE</b>
                    </div>
                  </div>
                </div>

                <div className="tf-hero-terminal">
                  <div className="tf-window-top">
                    <span />
                    <span />
                    <span />
                    <label>taskflow.workspace</label>
                  </div>

                  <div className="tf-terminal-body">
                    <div className="tf-terminal-code">
                      <span className="purple">const</span>{" "}
                      <span className="cyan">today</span> = {"{"}
                      <br />
                      &nbsp;&nbsp;focus:{" "}
                      <span className="green">
                        "build"
                      </span>
                      ,
                      <br />
                      &nbsp;&nbsp;tasks:{" "}
                      <span className="blue">
                        {counts.total}
                      </span>
                      ,
                      <br />
                      &nbsp;&nbsp;completed:{" "}
                      <span className="pink">
                        {completionPercentage}%
                      </span>
                      <br />
                      {"};"}
                    </div>

                    <div className="tf-terminal-orb">
                      <div>⌘</div>
                    </div>
                  </div>

                  <div className="tf-hero-object">
                    <span>☕</span>
                    <span>⌨</span>
                    <span>▱</span>
                  </div>
                </div>
              </section>

              <section className="tf-stats">
                <StatCard
                  className="purple"
                  icon="◈"
                  label="TOTAL TASKS"
                  value={counts.total}
                  text="Everything on your board"
                  graph="▁▃▂▅▆"
                  onClick={() => setFilter("All")}
                />

                <StatCard
                  className="cyan"
                  icon="○"
                  label="TO DO"
                  value={counts.todo}
                  text="Ready for execution"
                  graph="▂▃▅▃▆"
                  onClick={() => setFilter("To Do")}
                />

                <StatCard
                  className="amber"
                  icon="◐"
                  label="IN PROGRESS"
                  value={counts.progress}
                  text="Currently being worked on"
                  graph="▁▅▃▆▅"
                  onClick={() =>
                    setFilter("In Progress")
                  }
                />

                <StatCard
                  className="pink"
                  icon="✓"
                  label="COMPLETED"
                  value={counts.completed}
                  text="Successfully shipped"
                  graph="▂▃▅▇▆"
                  onClick={() =>
                    setFilter("Completed")
                  }
                />
              </section>

              <section className="tf-task-panel">
                <div className="tf-section-heading">
                  <div>
                    <span>WORK QUEUE / 04</span>
                    <h2>Your Tasks</h2>
                    <p>
                      Manage and track everything you're
                      working on.
                    </p>
                  </div>

                  <button
                    className="tf-primary-button"
                    onClick={openAdd}
                  >
                    <span>＋</span>
                    New Task
                  </button>
                </div>

                <TaskControls
                  search={search}
                  setSearch={setSearch}
                  filter={filter}
                  setFilter={setFilter}
                  priorityFilter={priorityFilter}
                  setPriorityFilter={setPriorityFilter}
                />

                <TaskList
                  loading={loading}
                  tasks={filteredTasks}
                  getTaskMeta={getTaskMeta}
                  openAdd={openAdd}
                  openEdit={openEdit}
                  deleteTask={deleteTask}
                  changeStatus={changeStatus}
                  onView={setSelectedTask}
                  formatDate={formatDate}
                  statusClass={statusClass}
                  priorityClass={priorityClass}
                />
              </section>
            </>
          )}

          {view === "tasks" && (
            <section className="tf-page-section">
              <div className="tf-page-title">
                <div>
                  <span>WORKSPACE / TASKS</span>
                  <h1>My Tasks</h1>
                  <p>
                    All your tasks, organized in one place.
                  </p>
                </div>

                <button
                  className="tf-primary-button"
                  onClick={openAdd}
                >
                  ＋ Add Task
                </button>
              </div>

              <div className="tf-task-overview-strip">
                <div>
                  <strong>{counts.total}</strong>
                  <span>Total</span>
                </div>

                <div>
                  <strong>{counts.todo}</strong>
                  <span>To Do</span>
                </div>

                <div>
                  <strong>{counts.progress}</strong>
                  <span>In Progress</span>
                </div>

                <div>
                  <strong>{counts.completed}</strong>
                  <span>Completed</span>
                </div>
              </div>

              <section className="tf-task-panel standalone">
                <TaskControls
                  search={search}
                  setSearch={setSearch}
                  filter={filter}
                  setFilter={setFilter}
                  priorityFilter={priorityFilter}
                  setPriorityFilter={setPriorityFilter}
                />

                <TaskList
                  loading={loading}
                  tasks={filteredTasks}
                  getTaskMeta={getTaskMeta}
                  openAdd={openAdd}
                  openEdit={openEdit}
                  deleteTask={deleteTask}
                  changeStatus={changeStatus}
                  onView={setSelectedTask}
                  formatDate={formatDate}
                  statusClass={statusClass}
                  priorityClass={priorityClass}
                />
              </section>
            </section>
          )}

          {view === "calendar" && (
            <section className="tf-page-section">
              <div className="tf-page-title">
                <div>
                  <span>PLANNING / CALENDAR</span>
                  <h1>
                    {today.toLocaleString([], {
                      month: "long",
                    })}{" "}
                    {today.getFullYear()}
                  </h1>
                  <p>
                    Your tasks organized by due date.
                  </p>
                </div>

                <button
                  className="tf-primary-button"
                  onClick={openAdd}
                >
                  ＋ Add Task
                </button>
              </div>

              <div className="tf-calendar">
                <div className="tf-calendar-head">
                  {[
                    "SUN",
                    "MON",
                    "TUE",
                    "WED",
                    "THU",
                    "FRI",
                    "SAT",
                  ].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                <div className="tf-calendar-grid">
                  {calendarDays.map((day, index) => {
                    const dayTasks = tasksForDay(day);
                    const isToday =
                      day === today.getDate();

                    return (
                      <div
                        className={`tf-calendar-day ${
                          isToday ? "today" : ""
                        }`}
                        key={index}
                      >
                        {day && (
                          <>
                            <div className="tf-day-number">
                              {day}
                            </div>

                            <div className="tf-day-tasks">
                              {dayTasks.map((task) => (
                                <button
                                  key={task.id}
                                  onClick={() =>
                                    setSelectedTask(task)
                                  }
                                  className={`tf-calendar-task ${statusClass(
                                    task.status
                                  )}`}
                                >
                                  {task.title}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="tf-calendar-note">
                <span>◉</span>
                Tasks without a due date will not appear
                on the calendar.
              </div>
            </section>
          )}

          {view === "settings" && (
            <section className="tf-page-section">
              <div className="tf-page-title">
                <div>
                  <span>SYSTEM / CONFIGURATION</span>
                  <h1>Settings</h1>
                  <p>
                    Workspace and account information.
                  </p>
                </div>
              </div>

              <div className="tf-settings-grid">
                <div className="tf-settings-card">
                  <span className="tf-settings-icon">
                    ◉
                  </span>
                  <div>
                    <small>ACCOUNT</small>
                    <h3>{user?.username || "User"}</h3>
                    <p>{user?.email || "No email"}</p>
                  </div>
                </div>

                <div className="tf-settings-card">
                  <span className="tf-settings-icon">
                    ◈
                  </span>
                  <div>
                    <small>WORKSPACE</small>
                    <h3>TaskFlow</h3>
                    <p>
                      {counts.total} tasks currently
                      stored.
                    </p>
                  </div>
                </div>

                <div className="tf-settings-card">
                  <span className="tf-settings-icon">
                    ✓
                  </span>
                  <div>
                    <small>COMPLETION</small>
                    <h3>
                      {completionPercentage}% complete
                    </h3>
                    <p>
                      {counts.completed} of{" "}
                      {counts.total} tasks completed.
                    </p>
                  </div>
                </div>

                <div className="tf-settings-card">
                  <span className="tf-settings-icon">
                    {"</>"}
                  </span>
                  <div>
                    <small>SYSTEM</small>
                    <h3>System online</h3>
                    <p>TaskFlow dashboard v1.0</p>
                  </div>
                </div>
              </div>

              <button
                className="tf-danger-button"
                onClick={logout}
              >
                ↪ Sign out of TaskFlow
              </button>
            </section>
          )}
        </main>
      </section>

      <aside className="tf-analytics">
        <div className="tf-analytics-header">
          <div>
            <span>LIVE SYSTEM</span>
            <h2>Analytics</h2>
          </div>

          <div className="tf-live-dot">
            <i />
            LIVE
          </div>
        </div>

        <div className="tf-progress-card">
          <div className="tf-card-label">
            <span>PROJECT PROGRESS</span>
            <b>{completionPercentage}%</b>
          </div>

          <div className="tf-progress-circle">
            <svg viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="48"
                className="track"
              />

              <circle
                cx="60"
                cy="60"
                r="48"
                className="value"
                strokeDasharray={`${
                  completionPercentage * 3.0159
                } 301.59`}
              />
            </svg>

            <div>
              <strong>{counts.completed}</strong>
              <span>of {counts.total}</span>
            </div>
          </div>

          <div className="tf-progress-caption">
            <span>
              <i />
              Completed
            </span>

            <span>
              <i />
              Remaining
            </span>
          </div>
        </div>

        <div className="tf-chart-card">
          <div className="tf-card-label">
            <span>TASK OVERVIEW</span>
            <b>REALTIME</b>
          </div>

          <div className="tf-donut-wrap">
            <svg viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="42"
                className="tf-donut-bg"
              />

              {(() => {
                const total = Math.max(counts.total, 1);
                const radius = 42;
                const circumference =
                  2 * Math.PI * radius;

                const todo =
                  (counts.todo / total) * circumference;

                const progress =
                  (counts.progress / total) *
                  circumference;

                const completed =
                  (counts.completed / total) *
                  circumference;

                return (
                  <>
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      className="tf-donut-segment todo"
                      strokeDasharray={`${todo} ${circumference}`}
                      strokeDashoffset="0"
                    />

                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      className="tf-donut-segment progress"
                      strokeDasharray={`${progress} ${circumference}`}
                      strokeDashoffset={`-${todo}`}
                    />

                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      className="tf-donut-segment completed"
                      strokeDasharray={`${completed} ${circumference}`}
                      strokeDashoffset={`-${
                        todo + progress
                      }`}
                    />
                  </>
                );
              })()}
            </svg>

            <div className="tf-donut-center">
              <strong>{counts.total}</strong>
              <span>TASKS</span>
            </div>
          </div>

          <div className="tf-chart-legend">
            <span>
              <i className="todo-dot" />
              To Do <b>{counts.todo}</b>
            </span>

            <span>
              <i className="progress-dot" />
              Progress <b>{counts.progress}</b>
            </span>

            <span>
              <i className="complete-dot" />
              Done <b>{counts.completed}</b>
            </span>
          </div>
        </div>

        <div className="tf-quick-card">
          <div className="tf-card-label">
            <span>QUICK STATS</span>
            <b>STATUS</b>
          </div>

          <div className="tf-quick-row">
            <span>
              <i className="purple-dot" />
              Total
            </span>
            <strong>{counts.total}</strong>
          </div>

          <div className="tf-quick-row">
            <span>
              <i className="green-dot" />
              Completed
            </span>
            <strong>{counts.completed}</strong>
          </div>

          <div className="tf-quick-row">
            <span>
              <i className="amber-dot" />
              In Progress
            </span>
            <strong>{counts.progress}</strong>
          </div>

          <div className="tf-quick-row">
            <span>
              <i className="cyan-dot" />
              Pending
            </span>
            <strong>{counts.pending}</strong>
          </div>
        </div>

        <div className="tf-activity-card">
          <div className="tf-card-label">
            <span>RECENT ACTIVITY</span>
            <b>TERMINAL</b>
          </div>

          <div className="tf-terminal-activity">
            <div className="tf-terminal-status">
              <span>●</span> System online
            </div>

            {activities.length === 0 ? (
              <div className="tf-activity-empty">
                $ waiting_for_activity...
              </div>
            ) : (
              activities.slice(0, 4).map((item) => (
                <div
                  className="tf-activity-line"
                  key={item.id}
                >
                  <span>&gt;</span>
                  <div>
                    <code>{item.message}</code>
                    <small>{item.time}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="tf-quote-card">
          <span>01 / MINDSET</span>
          <strong>
            Discipline
            <br />
            builds freedom.
          </strong>
          <small>{"</>"} keep building</small>
        </div>
      </aside>

      {selectedTask && (
        <div
          className="tf-view-backdrop"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="tf-view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tf-modal-window-top">
              <span />
              <span />
              <span />
              <b>task.preview</b>

              <button
                onClick={() => setSelectedTask(null)}
              >
                ×
              </button>
            </div>

            <div className="tf-view-content">
              <span className="tf-view-eyebrow">
                TASK / {selectedTask.id}
              </span>

              <h2>{selectedTask.title}</h2>

              <p>
                {selectedTask.description ||
                  "No description provided."}
              </p>

              <div className="tf-view-meta">
                <span
                  className={`tf-status ${statusClass(
                    selectedTask.status
                  )}`}
                >
                  {selectedTask.status}
                </span>

                <span
                  className={`tf-priority ${priorityClass(
                    getTaskMeta(selectedTask).priority
                  )}`}
                >
                  {getTaskMeta(selectedTask).priority}
                </span>

                <span>
                  Due:{" "}
                  {formatDate(
                    getTaskMeta(selectedTask).dueDate
                  )}
                </span>
              </div>

              <div className="tf-view-actions">
                <button
                  onClick={() => {
                    setSelectedTask(null);
                    openEdit(selectedTask);
                  }}
                >
                  Edit Task
                </button>

                <button
                  className="danger"
                  onClick={() => {
                    setSelectedTask(null);
                    deleteTask(selectedTask.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="tf-modal-backdrop">
          <div className="tf-task-modal">
            <div className="tf-modal-top">
              <div>
                <span>
                  {editingTask
                    ? "TASK / EDIT"
                    : "TASK / CREATE"}
                </span>

                <h2>
                  {editingTask
                    ? "Edit task"
                    : "Create a new task"}
                </h2>
              </div>

              <button
                onClick={closeModal}
                type="button"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveTask}>
              <div className="tf-modal-field">
                <label>Task title</label>

                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={taskData.title}
                  onChange={(e) =>
                    setTaskData({
                      ...taskData,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="tf-modal-field">
                <label>Description</label>

                <textarea
                  placeholder="Add some details..."
                  value={taskData.description}
                  onChange={(e) =>
                    setTaskData({
                      ...taskData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="tf-modal-two">
                <div className="tf-modal-field">
                  <label>Status</label>

                  <select
                    value={taskData.status}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">
                      In Progress
                    </option>
                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>

                <div className="tf-modal-field">
                  <label>Priority</label>

                  <select
                    value={taskData.priority}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        priority: e.target.value,
                      })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="tf-modal-field">
                <label>Due date</label>

                <input
                  type="date"
                  value={taskData.dueDate}
                  onChange={(e) =>
                    setTaskData({
                      ...taskData,
                      dueDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className="tf-modal-actions">
                <button
                  type="button"
                  className="tf-cancel"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="tf-save"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingTask
                    ? "Update Task"
                    : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   COMPONENTS
   ========================================================= */

function StatCard({
  className,
  icon,
  label,
  value,
  text,
  graph,
  onClick,
}) {
  return (
    <button
      className={`tf-stat-card ${className}`}
      onClick={onClick}
    >
      <div className="tf-stat-top">
        <span className="tf-stat-icon">{icon}</span>
        <span className="tf-stat-label">{label}</span>
      </div>

      <strong>{value}</strong>

      <div className="tf-stat-bottom">
        <span>{text}</span>
        <b>{graph}</b>
      </div>
    </button>
  );
}

function TaskControls({
  search,
  setSearch,
  filter,
  setFilter,
  priorityFilter,
  setPriorityFilter,
}) {
  return (
    <div className="tf-task-controls">
      <div className="tf-task-search">
        <span>⌕</span>

        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="All">All Status</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        value={priorityFilter}
        onChange={(e) =>
          setPriorityFilter(e.target.value)
        }
      >
        <option value="All">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
  );
}

function TaskList({
  loading,
  tasks,
  getTaskMeta,
  openAdd,
  openEdit,
  deleteTask,
  changeStatus,
  onView,
  formatDate,
  statusClass,
  priorityClass,
}) {
  if (loading) {
    return (
      <div className="tf-empty">
        <div className="tf-loader" />
        <strong>Loading workspace...</strong>
        <span>syncing task database</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="tf-empty">
        <div className="tf-empty-visual">
          <div className="tf-clipboard">
            <span>✓</span>
            <i />
            <i />
            <i />
          </div>
          <b>{"</>"}</b>
        </div>

        <strong>Your workspace is empty</strong>

        <span>
          Create your first task to get started.
        </span>

        <button onClick={openAdd}>
          ＋ Create First Task
        </button>
      </div>
    );
  }

  return (
    <div className="tf-task-list">
      {tasks.map((task) => {
        const meta = getTaskMeta(task);

        return (
          <article
            className="tf-task-row"
            key={task.id}
          >
            <button
              className={`tf-task-status-icon ${statusClass(
                task.status
              )}`}
              onClick={() => {
                const next =
                  task.status === "To Do"
                    ? "In Progress"
                    : task.status === "In Progress"
                    ? "Completed"
                    : "To Do";

                changeStatus(task, next);
              }}
              title="Change status"
            >
              {task.status === "Completed" ? "✓" : "•"}
            </button>

            <div
              className="tf-task-info"
              onClick={() => onView(task)}
            >
              <div className="tf-task-name-row">
                <h3>{task.title}</h3>

                <span
                  className={`tf-status ${statusClass(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>

                <span
                  className={`tf-priority ${priorityClass(
                    meta.priority
                  )}`}
                >
                  {meta.priority}
                </span>
              </div>

              <p>
                {task.description ||
                  "No description provided."}
              </p>

              <div className="tf-task-meta">
                <span>
                  ◷ {formatDate(meta.dueDate)}
                </span>

                <span>
                  #TASK-{String(task.id).slice(-4)}
                </span>
              </div>
            </div>

            <div className="tf-task-actions">
              <button
                className="tf-view-btn"
                onClick={() => onView(task)}
              >
                View
              </button>

              <button
                className="tf-edit-btn"
                onClick={() => openEdit(task)}
              >
                Edit
              </button>

              <button
                className="tf-delete-btn"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default App;
