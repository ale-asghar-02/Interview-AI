import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../src/features/auth/hooks/useAuth";
import { useInterview } from "../features/interview/hooks/useInterview";
import Swal from 'sweetalert2';

const NAV = [
  { icon:"bi-speedometer2",      label:"Dashboard",  id:"dashboard" },
  { icon:"bi-person",            label:"Profile",    id:"profile" },
  { icon:"bi-file-earmark-text", label:"My Reports", id:"reports" },
  { icon:"bi-plus-circle",       label:"New Report", id:"new" },
  { icon:"bi-gear",              label:"Settings",   id:"settings" },
];

function scoreCls(s){
  if(s>=85) return "rcard__score-badge--green";
  if(s>=70) return "rcard__score-badge--yellow";
  return "rcard__score-badge--red";
}

// ── Sidebar ──
function Sidebar({ active, setActive, close, onDeleteAccount }) {

  return (
    <div className="col-12 h-100 d-flex flex-column border-end bg-white p-3 p-lg-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <Link className="nav-logo text-decoration-none" to="/">
          <span className="logo-text text-dark">
            Interview<span className="logo-accent">AI</span>
          </span>
        </Link>
        {close && (
          <button onClick={close} className="fs-5 text-body-secondary bg-transparent border-0">
            <i className="bi bi-x" />
          </button>
        )}
      </div>

      <nav className="nav-items">
        {NAV.map((item) => {
          const ia = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); close && close(); }}
              className={`col-12 nav-item-btn ${ia ? "nav-item-btn--active" : ""}`}>
              <i className={`bi ${item.icon} nav-item-icon`} style={{ fontSize: '17px' }}/>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button onClick={onDeleteAccount} className="sidebar-logout-btn">
          <i className="bi bi-box-arrow-left" style={{ fontSize: '17px' }}/>
          Delete Account
        </button>
      </div>
    </div>
  );

}

function ProfileCard() {
  const { user, handleProfileUpdate, loading } = useAuth();
  const ref = useRef();
  const [hov, setHov] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    username: user?.username || "",
    linkedlnURL: user?.linkedlnURL || "",
    GithubURL: user?.GithubURL || "",
  });

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const upload = e => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    const r = new FileReader();
    r.onload = ev => setPreview(ev.target.result);
    r.readAsDataURL(f);
  };

  const handleSubmit = async () => {
    await handleProfileUpdate({
      username: form.username,
      linkedlnURL: form.linkedlnURL,
      GithubURL: form.GithubURL,
      userImage: imageFile,
    });
  };

  const avatarSrc = preview || user?.userImage;

  return (
    <div className="col-12 col-md-8 col-lg-8 col-xl-6 card p-3 px-lg-4 pt-5">
      <div className="d-flex flex-column align-items-center mb-4">
        <div
          className="position-relative"
          style={{ cursor: "pointer" }}
          onClick={() => ref.current.click()}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
        >
          <div className="av-pulse profile-card__avatar-ring">
            {avatarSrc ? (
              <img src={avatarSrc} alt="av" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div className="profile-card__avatar-initial">
                {user?.username ? user.username[0].toUpperCase() : "U"}
              </div>
            )}
          </div>
          <div className="profile-card__avatar-hover" style={{ opacity: hov ? 1 : 0 }}>
            <i className="bi bi-camera fs-3 text-white" />
          </div>
          <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={upload} />
        </div>
        <span className="profile-card__change-hint">Click to change photo</span>
      </div>

      <div className="col-12 mb-3">
        <div className="d-flex align-items-center gap-2 px-3 py-2 border rounded-2 mb-2">
          <i className="bi bi-person fs-5" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="form-control border-0"
          />
        </div>

        <div className="d-flex align-items-center gap-2 px-3 py-2 border rounded-2 mb-2 text-body-tertiary bg-body-secondary">
          <i className="bi bi-envelope" />
          <input
            type="email"
            placeholder="Email Address"
            value={user?.email || ""}
            readOnly
            className="form-control border-0 text-body-tertiary bg-body-secondary"
          />
          <i className="bi bi-lock-fill" />
        </div>

        <div className="d-flex align-items-center gap-2 px-3 py-2 border rounded-2 mb-2">
          <i className="bi bi-linkedin fs-5" style={{ color: "#0077b5" }} />
          <input
            type="text"
            name="linkedlnURL"
            placeholder="LinkedIn URL"
            value={form.linkedlnURL}
            onChange={handleChange}
            className="form-control border-0"
          />
        </div>

        <div className="d-flex align-items-center gap-2 px-3 py-2 border rounded-2 mb-2">
          <i className="bi bi-github fs-5" />
          <input
            type="text"
            name="GithubURL"
            placeholder="GitHub URL"
            value={form.GithubURL}
            onChange={handleChange}
            className="form-control border-0"
          />
        </div>
      </div>

      <button
        className="profile-card__save-btn rounded-2 mb-4"
        onClick={handleSubmit}
        disabled={loading}
      >
        <i className="bi bi-check2-circle fs-5 me-3" />
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}

// ── Top bar ──
function Topbar({ onHamburger }) {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  const submitLogout = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom px-3 px-lg-4 mb-2 mb-lg-3 topbar" style={{ paddingBlock: '10px' }}>
      <div className="d-flex align-items-center gap-3">
        <button onClick={onHamburger} className="d-lg-none border-0 rounded-2 bg-body-secondary" style={{ width: '38px', height: '38px' }}>
          <i className="bi bi-list text-secondary fs-5" />
        </button>
        <div>
          <div className="fw-medium">
            Good morning, <span className="grad-text">{user.username}</span> 👋
          </div>
          <div className="text-body-tertiary" style={{ fontSize: '12px' }}>Ready to ace your next interview?</div>
        </div>
      </div>

      <div className="d-flex flex-wrap align-items-center gap-3">
        <button className="border-0 text-secondary bg-transparent"><i className="bi bi-bell" /></button>
        <div className="d-flex align-items-center gap-2">
          <div className="topbar__avatar">
            <img className='w-100 h-100 object-fit-cover' src={user?.userImage || "../../src/assets/images/default.jpg"} alt="profile_img" />
          </div>
          <div>
            <div className="fw-medium" style={{ fontSize: '13px', lineHeight: '1.1' }}>{user.username}</div>
            <div className="text-body-secondary" style={{ fontSize: '11px' }}>{user.email}</div>
          </div>
        </div>
        <button className="topbar__logout-btn" onClick={submitLogout}>
          <i className="bi bi-box-arrow-right" />
          Logout
        </button>
      </div>
    </div>
  );
}

// ── Report Card Component ──
function ReportCard({ report , onView , onDownload , onDelete }) {

  return (
    <div className="col-12 col-md-6 col-lg-4 col-xl-3">
      <div className="card p-3 p-xl-4 h-100" style={{ borderRadius: '10px' }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="rcard__icon-wrap">
            <i className="bi bi-file-earmark-bar-graph fs-5" style={{ color: '#6366f1' }} />
          </div>
          <span className={`px-2 py-1 rounded-1 ${scoreCls(report.matchScore)}`} style={{ fontSize: '13px' }}>
            <i className="bi bi-patch-check-fill me-2" style={{ fontSize: '11px' }} />
            {report.matchScore}%
          </span>
        </div>

        <div className="fs-6 fw-semibold mb-1 lh-sm">{report.jobTitle}</div>

        <div className="text-body-tertiary mb-3" style={{ fontSize: '12px' }}>
          <i className="bi bi-calendar3 me-2" />
          Created {new Date(report.createdAt).toLocaleDateString('en-US', { day:'numeric', month:'short',
          year:'numeric' })}
        </div>

        <div className="d-flex gap-2 mt-auto">
          <button
            className="col border-0 px-2 py-2 rounded-1"
            style={{ fontSize: '12px', color: '#6366f1', backgroundColor: '#F1F0FE' }}
            onClick={() => onView(report._id)}
          >
            <i className="bi bi-eye me-2" />View
          </button>
          <button
            onClick={() => onDownload(report._id)}
            className="border-0 rounded-1"
            style={{ fontSize: '12px', padding: '7px 12px', color: '#64748b', backgroundColor: '#eeeef3' }}>
            <i className="bi bi-download" />
          </button>
          <button
            className="border-0 rounded-1"
            style={{ fontSize: '12px', padding: '7px 12px', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.08)' }}
            onClick={() => onDelete(report._id)}
          >
            <i className="bi bi-trash3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──
const UserDashboard = () => {
  const navigate  = useNavigate();
  const { user, handleUserDeleteAccount }  = useAuth();
  const { loading , reports , reportStats , handleDeleteReport , handleGenerateResumePdf , fetchReportStats } = useInterview();

  const [active, setActive] = useState("dashboard");
  const [mob,    setMob   ] = useState(false);

  useEffect(() => {
      fetchReportStats();
  }, []);

  const formatLatestResume = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Latest today";
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const STATS = [
    {
        icon: "bi-file-earmark-text",
        label: "Total Reports",
        value: reportStats?.stats?.totalReports ?? "—",
        change: reportStats?.stats?.timePeriodLabel
            ? `+${reportStats.stats.totalReports} in ${reportStats.stats.timePeriodLabel}`
            : "—",
        up: true,
        c: "#6366f1"
    },
    {
        icon: "bi-patch-check",
        label: "Avg Score",
        value: reportStats?.stats?.avgScore != null ? `${reportStats.stats.avgScore}%` : "—",
        change: `${reportStats?.stats?.avgScore ?? 0}% overall`,
        up: true,
        c: "#10b981"
    },
    {
        icon: "bi-lightbulb",
        label: "Skills Found",
        value: reportStats?.stats?.totalSkillGaps ?? "—",   // ← total gaps value
        change: `${reportStats?.stats?.totalReports ?? 0} gaps found`,
        up: false,
        c: "#f59e0b"
    },
    {
        icon: "bi-file-person",
        label: "Resumes Gen",
        value: reportStats?.stats?.totalReports ?? "—",
        change: reportStats?.stats?.latestResumeLabel ?? "N/A",  // ← "May 2026"
        up: !!reportStats?.stats?.latestResumeLabel,
        c: "#a855f7"
    },
  ];

  // ── View Report ──
  const handleView = (id) => {
    navigate(`/interview/report/${id}`);
  };

  // ── Delete Report with SweetAlert2 ──
  const handleDelete = async (id) => {
    await handleDeleteReport(id);
    fetchReportStats();
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Delete Account?',
      text: 'Your account and all interview reports will be permanently deleted. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete Account',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      await handleUserDeleteAccount();
      navigate('/');
    }
  };

  return (
    <div className="d-flex user-dashboard" style={{ height: '100vh' }}>

      {/* Desktop Sidebar */}
      <div className="d-none d-lg-flex left-side-bar" style={{ width: '280px', flexShrink: 0 }}>
        <Sidebar active={active} setActive={setActive} onDeleteAccount={handleDeleteAccount} />
      </div>

      {/* Mobile Sidebar overlay */}
      {mob && <>
        <div onClick={() => setMob(false)} className="d-flex d-lg-none mobile-overlay" />
        <div className="mobile-sidebar-wrap left-side-bar">
          <Sidebar active={active} setActive={setActive} onDeleteAccount={handleDeleteAccount} close={() => setMob(false)} />
        </div>
      </>}

      {/* Main */}
      <div className="d-flex flex-column main-section overflow-y-auto" style={{ minWidth: '0', height: '100vh', flexGrow: 1 }}>

        <Topbar onHamburger={() => setMob(true)} />

        {/* Content */}
        <div className="col-12 px-3 px-lg-4 content-section" style={{ paddingBlock: '10px', flexGrow: 1 }}>

          {/* ── Dashboard ── */}
          {active === "dashboard" && <>

            <div className="dashboard-banner p-3 p-lg-4 mb-3">
              <div className="dashboard-banner__circle1" />
              <div className="dashboard-banner__circle2" />
              <div className="fw-semibold mb-1" style={{ fontSize: '20px' }}>Your Interview AI Dashboard</div>
              <div className="col-12 col-lg-6 small fw-light opacity-75">
                Upload your resume, add a job description and let AI generate a personalized interview report for you.
              </div>
              <button onClick={() => setActive("new")} className="btn-dashboard">
                <i className="bi bi-plus-lg" />Generate New Report
              </button>
            </div>

            <div className="row g-2 mb-3 stat-cards">
              {STATS.map((s) => (
                <div key={s.label} className="col-12 col-md-6 col-lg-3">
                  <div className="card p-3 p-xl-4" style={{ borderRadius: '10px' }}>
                    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center justify-content-center rounded-2" style={{ width: '38px', height: '38px', background: `${s.c}18` }}>
                        <i className={`bi ${s.icon}`} style={{ color: s.c, fontSize: '17px' }} />
                      </div>
                      <span className={`px-2 py-1 rounded-1 ${s.up ? "stat-card__badge--up" : "stat-card__badge--warn"}`} style={{ fontSize: '12px' }}>
                        <i className={`bi bi-arrow-${s.up ? "up" : "right"} me-2`} />
                        {s.change}
                      </span>
                    </div>
                    <div className="fs-4 fw-semibold">{s.value}</div>
                    <div className="fw-medium text-body-tertiary" style={{ fontSize: '13px' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Dashboard Reports ── */}
            <div className="report-cards">
              <div className="mb-3">
                <div className="fs-5 fw-semibold">My Interview Reports</div>
                <div className="small text-body-tertiary">{reports.length} reports generated</div>
              </div>

              {loading ? (
                <div className="d-flex align-items-center gap-2 py-4 text-body-secondary">
                  <div className="spinner-border spinner-border-sm" style={{ color: '#6366f1' }} />
                  <span style={{ fontSize: '0.875rem' }}>Loading reports...</span>
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-4 text-body-secondary" style={{ fontSize: '0.875rem' }}>
                   No reports found. Generate your first report!
                </div>
              ) : (
                <div className="row g-2">
                  {reports.map((r) => (
                    <ReportCard
                      key={r._id}
                      report={r}
                      onView={handleView}
                      onDownload={handleGenerateResumePdf} 
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </>}

          {/* ── Profile page ── */}
          {active === "profile" && (
            <div className="profile-section">
              <div className="fs-5 fw-semibold mb-3">Edit Profile</div>
              <ProfileCard />
            </div>
          )}

          {/* ── My Reports page ── */}
          {active === "reports" && (
            <div className="report-cards">
              <div className="fs-5 fw-semibold mb-3">
                My Interview Reports <span className="fs-6">( {reports.length} )</span>
              </div>

              {loading ? (
                <div className="d-flex align-items-center gap-2 py-4 text-body-secondary">
                  <div className="spinner-border spinner-border-sm" style={{ color: '#6366f1' }} />
                  <span style={{ fontSize: '0.875rem' }}>Loading reports...</span>
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-4 text-body-secondary" style={{ fontSize: '0.875rem' }}>
                  No reports found. Generate your first report!
                </div>
              ) : (
                <div className="row g-2">
                  {reports.map((r) => (
                    <ReportCard
                      key={r._id}
                      report={r}
                      onView={handleView}
                      onDownload={handleGenerateResumePdf} 
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── New Report page ── */}
          {active === "new" && (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center new-report-section">
              <div className="mb-3">
                <img src="../../src/assets/document-analysis.gif" alt="document-analysis" width={150} />
              </div>
              <div className="fs-4 fw-semibold mb-2">New Interview Report</div>
              <div className="col-12 col-lg-4 text-center small text-body-tertiary mb-3">
                Add your resume, job description and self description — AI will automatically generate a comprehensive interview report.
              </div>
              <button className="btn-new-report" onClick={() => { navigate('/generate/interview/report') }}>
                <i className="bi bi-upload me-3" />Open Report Generator
              </button>
            </div>
          )}

          {/* ── Settings page ── */}
          {active === "settings" && (
            <div className="col-12">
              <div className="fs-5 fw-semibold mb-3">Settings</div>
              <div className="card p-3 p-lg-4">
                {[
                  { label: 'Email Notifications', defaultChecked: true },
                  { label: 'Report Auto-Save',    defaultChecked: false },
                  { label: 'Dark Mode (Coming Soon)', defaultChecked: false },
                ].map((setting, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between border-bottom py-3">
                    <span className="fw-medium">{setting.label}</span>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input fs-5"
                        style={{ cursor: 'pointer' }}
                        type="checkbox"
                        role="switch"
                        defaultChecked={setting.defaultChecked}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;