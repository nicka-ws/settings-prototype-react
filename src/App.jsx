import { useState, useRef, useEffect } from 'react'
import {
  MessageCircle, CheckSquare, Users, UserPlus, Clock, Umbrella, StickyNote,
  DollarSign, Settings, Droplets, Building2, MapPin, AlertTriangle, Info,
  CircleCheck, CircleX, Coffee, Timer, Shield, Map, Wand2, Flag, Plus,
  ChevronRight, Pin, Scan, Lightbulb, Construction, CalendarDays, Tablet,
  TriangleAlert, X, Check, ArrowRight, Sparkles, CircleAlert, ChevronDown,
  RotateCcw, Trash2, ChevronLeft, ToggleLeft, ToggleRight, Search,
  FileText, Eye, EyeOff
} from 'lucide-react'

// ============================================================
// MOCK DATA — Cascading scope hierarchy
// ============================================================

// Policy groups: named collections of locations that share settings
const POLICY_GROUPS = [
  {
    id: 'california',
    name: 'California',
    subtitle: '3 locations · State compliance',
    icon: FileText,
    locationIds: ['loc1', 'loc2', 'loc3'],
    overrides: { breaks: true, overtime: true },
  },
  {
    id: 'texas',
    name: 'Texas',
    subtitle: '2 locations · State compliance',
    icon: FileText,
    locationIds: ['loc4', 'loc5'],
    overrides: { overtime: true },
  },
  {
    id: 'newyork',
    name: 'New York',
    subtitle: '2 locations · State compliance',
    icon: FileText,
    locationIds: ['loc6', 'loc7'],
    overrides: { breaks: true, overtime: true, shiftsFlags: true },
  },
]

// Individual locations, each belonging to a policy group
const LOCATIONS = [
  // California
  { id: 'loc1', name: 'Downtown SF Store', subtitle: 'San Francisco, CA', icon: MapPin, groupId: 'california',
    overrides: { earlyClockIn: true, operatingHours: true } },
  { id: 'loc2', name: 'Oakland Branch', subtitle: 'Oakland, CA', icon: MapPin, groupId: 'california',
    overrides: {} },
  { id: 'loc3', name: 'San Jose Outlet', subtitle: 'San Jose, CA', icon: MapPin, groupId: 'california',
    overrides: { operatingHours: true } },
  // Texas
  { id: 'loc4', name: 'Austin Downtown', subtitle: 'Austin, TX', icon: MapPin, groupId: 'texas',
    overrides: { operatingHours: true } },
  { id: 'loc5', name: 'Houston Galleria', subtitle: 'Houston, TX', icon: MapPin, groupId: 'texas',
    overrides: {} },
  // New York
  { id: 'loc6', name: 'Manhattan Midtown', subtitle: 'New York, NY', icon: MapPin, groupId: 'newyork',
    overrides: { earlyClockIn: true } },
  { id: 'loc7', name: 'Brooklyn Heights', subtitle: 'Brooklyn, NY', icon: MapPin, groupId: 'newyork',
    overrides: {} },
]

// Helper: find group for a location
const getGroupForLocation = (locationId) => POLICY_GROUPS.find(g => g.locationIds.includes(locationId))

// Helper: convert 12hr time string to minutes since midnight
const timeTo24 = (t) => {
  const m = t?.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!m) return -1
  let h = parseInt(m[1])
  const min = parseInt(m[2])
  const p = m[3].toUpperCase()
  if (p === 'AM' && h === 12) h = 0
  if (p === 'PM' && h !== 12) h += 12
  return h * 60 + min
}

// Helper: does end time wrap past midnight relative to start?
const isNextDay = (start, end) => {
  const s = timeTo24(start)
  const e = timeTo24(end)
  if (s < 0 || e < 0) return false
  return e <= s
}

// Helper: resolve where a setting comes from for a given location
// Returns 'location', 'group', or 'company'
const resolveSettingSource = (locationId, settingKey) => {
  const loc = LOCATIONS.find(l => l.id === locationId)
  if (loc?.overrides?.[settingKey]) return 'location'
  const group = getGroupForLocation(locationId)
  if (group?.overrides?.[settingKey]) return 'group'
  return 'company'
}

// Mock roles grouped by department
const ROLE_GROUPS = [
  {
    department: 'Front of House',
    roles: ['Cashier', 'Waitress', 'Host', 'Bartender'],
  },
  {
    department: 'Back of House',
    roles: ['Line Cook', 'Prep Cook', 'Dishwasher'],
  },
  {
    department: 'Management',
    roles: ['General Manager', 'Shift Lead', 'Assistant Manager'],
  },
]

// ============================================================
// APP
// ============================================================

export default function App() {
  const [inSettings, setInSettings] = useState(true)

  if (inSettings) {
    return (
      <div className="app-shell">
        <SettingsScreen onBack={() => setInSettings(false)} />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <MainSidebar onOpenSettings={() => setInSettings(true)} />
      <MainAppPlaceholder />
    </div>
  )
}

// ============================================================
// MAIN APP PLACEHOLDER (what you see when not in settings)
// ============================================================

function MainAppPlaceholder() {
  return (
    <div className="main-app-content">
      <div className="main-app-toolbar">
        <div className="main-app-user-menu">
          <div className="main-app-avatar">ML</div>
          <span className="main-app-user-name">Michael Lee</span>
          <ChevronDown size={14} />
        </div>
      </div>
      <div className="main-app-body">
        <Construction size={48} color="var(--text-secondary)" />
        <h2>Team</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Main app content goes here</p>
      </div>
    </div>
  )
}

// ============================================================
// MAIN SIDEBAR
// ============================================================

function MainSidebar({ onOpenSettings }) {
  const [selected, setSelected] = useState(2)
  const mainItems = [
    { icon: MessageCircle, label: 'Chat', badge: '3' },
    { icon: CheckSquare, label: 'Task' },
  ]
  const appItems = [
    { icon: Users, label: 'Team' },
    { icon: UserPlus, label: 'Hiring' },
    { icon: Clock, label: 'Time Clock' },
    { icon: Umbrella, label: 'Time Off' },
    { icon: StickyNote, label: 'Note' },
    { icon: DollarSign, label: 'Payroll', trailing: '👑' },
  ]

  return (
    <nav className="main-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><Droplets size={20} /></div>
        <span className="sidebar-logo-text">workstream</span>
      </div>

      {mainItems.map((item, i) => (
        <div
          key={i}
          className={`sidebar-nav-item ${selected === i ? 'active' : ''}`}
          onClick={() => setSelected(i)}
        >
          <item.icon className="icon" size={20} />
          <span>{item.label}</span>
          {item.badge && <span className="sidebar-badge">{item.badge}</span>}
        </div>
      ))}

      <div className="sidebar-section-title">App Center</div>

      {appItems.map((item, i) => {
        const idx = i + 2
        return (
          <div
            key={idx}
            className={`sidebar-nav-item ${selected === idx ? 'active' : ''}`}
            onClick={() => setSelected(idx)}
          >
            <item.icon className="icon" size={20} />
            <span>{item.label}</span>
            {item.trailing && <span className="sidebar-trailing">{item.trailing}</span>}
          </div>
        )
      })}

      <div className="sidebar-spacer" />

      <div className="sidebar-settings-btn" onClick={onOpenSettings}>
        <Settings size={18} />
        <span>Settings</span>
        <ChevronRight size={14} />
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">ML</div>
        <div>
          <div className="sidebar-user-name">Michael Lee</div>
          <div className="sidebar-user-org">KFC - BasicTier Co.ltd</div>
        </div>
      </div>
    </nav>
  )
}

// ============================================================
// SETTINGS SCREEN
// ============================================================

function SettingsScreen({ onBack }) {
  const [category, setCategory] = useState('scheduling')
  const [item, setItem] = useState('breaks')
  const [showComplianceWizard, setShowComplianceWizard] = useState(false)

  // Scope: { type: 'company' } | { type: 'group', id } | { type: 'location', id }
  const [selectedScope, setSelectedScope] = useState({ type: 'company' })

  // Derived scope info
  const isCompanyScope = selectedScope.type === 'company'
  const isGroupScope = selectedScope.type === 'group'
  const isLocationScope = selectedScope.type === 'location'

  const selectedGroup = isGroupScope
    ? POLICY_GROUPS.find(g => g.id === selectedScope.id)
    : isLocationScope
    ? getGroupForLocation(selectedScope.id)
    : null

  const selectedLocation = isLocationScope
    ? LOCATIONS.find(l => l.id === selectedScope.id)
    : null

  // Simulated compliance state — toggled when user applies defaults
  const [hasBreakRules, setHasBreakRules] = useState(false)
  const [hasOvertimeConfig, setHasOvertimeConfig] = useState(false)
  const isCompliant = hasBreakRules && hasOvertimeConfig

  // Dirty state tracking for unsaved changes
  const [isDirty, setIsDirty] = useState(false)
  const [pendingNav, setPendingNav] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const toastTimer = useRef(null)

  const markDirty = () => setIsDirty(true)
  const markClean = () => setIsDirty(false)

  const triggerToast = () => {
    setShowToast(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setShowToast(false), 3000)
  }

  const handleNav = (cat, itm) => {
    if (cat === category && itm === item) return
    if (isDirty) {
      setPendingNav({ cat, itm })
      return
    }
    setCategory(cat)
    setItem(itm)
  }

  const handleSave = () => { markClean(); triggerToast() }
  const handleDiscardInPlace = () => { markClean() }
  const handleSaveAndContinue = () => {
    markClean(); triggerToast()
    if (pendingNav) { setCategory(pendingNav.cat); setItem(pendingNav.itm); setPendingNav(null) }
  }
  const handleDiscard = () => {
    markClean()
    if (pendingNav) { setCategory(pendingNav.cat); setItem(pendingNav.itm); setPendingNav(null) }
  }
  const handleGoBack = () => { setPendingNav(null) }

  const handleApplyBreaks = () => { setHasBreakRules(true) }
  const handleApplyOvertime = () => { setHasOvertimeConfig(true) }
  const handleApplyAll = () => { setHasBreakRules(true); setHasOvertimeConfig(true) }

  // Build scope context object passed to all pages
  const scopeContext = {
    selectedScope,
    isCompanyScope,
    isGroupScope,
    isLocationScope,
    selectedGroup,
    selectedLocation,
    markDirty,
    onChangeScope: setSelectedScope,
  }

  return (
    <>
      <SettingsNav
        category={category}
        item={item}
        isCompliant={isCompliant}
        hasBreakRules={hasBreakRules}
        hasOvertimeConfig={hasOvertimeConfig}
        onNav={handleNav}
        onBack={onBack}
        selectedScope={selectedScope}
        onSelectScope={setSelectedScope}
      />
      <div className="settings-content">
        {/* Compliance banner */}
        {!isCompliant && (
          <div className="compliance-banner" onClick={() => setShowComplianceWizard(true)}>
            <div className="compliance-banner-left">
              <CircleAlert size={16} />
              <div className="compliance-banner-text">
                <strong>Compliance issues detected</strong>
                <span>Your settings may not comply with state labor law. Review {
                  !hasBreakRules && !hasOvertimeConfig
                    ? 'break rules and overtime thresholds'
                    : !hasBreakRules
                    ? 'break rules'
                    : 'overtime thresholds'
                } to fix.</span>
              </div>
            </div>
            <span className="compliance-banner-action">Fix now <ArrowRight size={14} /></span>
          </div>
        )}

        <div className="content-scroll">
          <ContentRouter
            category={category}
            item={item}
            scopeContext={scopeContext}
            hasBreakRules={hasBreakRules}
            hasOvertimeConfig={hasOvertimeConfig}
            onApplyBreaks={handleApplyBreaks}
            onApplyOvertime={handleApplyOvertime}
          />
        </div>

        {isDirty && !pendingNav && (
          <UnsavedChangesBar onDiscard={handleDiscardInPlace} onSave={handleSave} />
        )}
      </div>

      {showToast && <SaveToast onClose={() => setShowToast(false)} />}

      {pendingNav && (
        <SaveChangesModal onGoBack={handleGoBack} onDiscard={handleDiscard} onSave={handleSaveAndContinue} />
      )}

      {showComplianceWizard && (
        <ComplianceWizard
          hasBreakRules={hasBreakRules}
          hasOvertimeConfig={hasOvertimeConfig}
          onApplyAll={handleApplyAll}
          onApplyBreaks={handleApplyBreaks}
          onApplyOvertime={handleApplyOvertime}
          onClose={() => setShowComplianceWizard(false)}
        />
      )}
    </>
  )
}

// ============================================================
// SAVE CHANGES MODAL
// ============================================================

function SaveChangesModal({ onGoBack, onDiscard, onSave }) {
  return (
    <div className="dialog-overlay" onClick={onGoBack}>
      <div className="save-changes-modal" onClick={e => e.stopPropagation()}>
        <div className="save-changes-modal-header">
          <h3>Save changes?</h3>
          <button className="save-changes-modal-close" onClick={onGoBack}><X size={18} /></button>
        </div>
        <p className="save-changes-modal-body">
          You have unsaved changes on this page. Would you like to save them before leaving?
        </p>
        <div className="save-changes-modal-actions">
          <button className="btn-secondary" onClick={onGoBack}>Go back</button>
          <button className="btn-discard" onClick={onDiscard}>Discard</button>
          <button className="btn-primary" onClick={onSave}>Save and continue</button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// UNSAVED CHANGES BOTTOM BAR
// ============================================================

function UnsavedChangesBar({ onDiscard, onSave }) {
  return (
    <div className="unsaved-bar">
      <div className="unsaved-bar-left">
        <CircleAlert size={16} />
        <span>You have unsaved changes.</span>
      </div>
      <div className="unsaved-bar-actions">
        <button className="btn-secondary btn-sm" onClick={onDiscard}>Discard</button>
        <button className="btn-primary btn-sm" onClick={onSave}>Save</button>
      </div>
    </div>
  )
}

// ============================================================
// SAVE TOAST
// ============================================================

function SaveToast({ onClose }) {
  return (
    <div className="save-toast">
      <div className="save-toast-icon"><CircleCheck size={18} /></div>
      <span>Settings saved successfully.</span>
      <button className="save-toast-close" onClick={onClose}><X size={14} /></button>
    </div>
  )
}

// ============================================================
// SCOPE PICKER (hierarchical: Company → Policy Groups → Locations)
// ============================================================

function ScopePicker({ selectedScope, onSelect }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Derive trigger display
  const getTriggerInfo = () => {
    if (selectedScope.type === 'company') return { icon: Building2, name: 'Company defaults', sub: 'All locations', iconClass: 'company' }
    if (selectedScope.type === 'group') {
      const g = POLICY_GROUPS.find(pg => pg.id === selectedScope.id)
      return { icon: FileText, name: g?.name + ' policy', sub: g?.locationIds.length + ' locations', iconClass: 'group' }
    }
    const loc = LOCATIONS.find(l => l.id === selectedScope.id)
    return { icon: MapPin, name: loc?.name, sub: loc?.subtitle, iconClass: 'location' }
  }

  const trigger = getTriggerInfo()
  const isActive = (type, id) => selectedScope.type === type && (id ? selectedScope.id === id : true)

  return (
    <div className="scope-picker" ref={ref}>
      <button className="scope-picker-trigger" onClick={() => setOpen(!open)}>
        <div className={`scope-picker-icon ${trigger.iconClass}`}>
          <trigger.icon size={14} />
        </div>
        <div className="scope-picker-label">
          <span className="scope-picker-name">{trigger.name}</span>
          <span className="scope-picker-sub">{trigger.sub}</span>
        </div>
        <ChevronDown size={16} className={`scope-picker-chevron ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="scope-picker-dropdown">
          <div className="scope-picker-dropdown-header">Switch scope</div>

          {/* Company defaults */}
          <div
            className={`scope-picker-option ${isActive('company') ? 'active' : ''}`}
            onClick={() => { onSelect({ type: 'company' }); setOpen(false) }}
          >
            <div className="scope-picker-option-icon company"><Building2 size={16} /></div>
            <div className="scope-picker-option-text">
              <span className="scope-picker-option-name">Company defaults</span>
              <span className="scope-picker-option-sub">All {LOCATIONS.length} locations</span>
            </div>
            {isActive('company') && <Check size={16} color="var(--primary)" />}
          </div>

          {/* Policy groups with nested locations */}
          {POLICY_GROUPS.map(group => {
            const groupLocs = group.locationIds.map(id => LOCATIONS.find(l => l.id === id)).filter(Boolean)
            const isGroupActive = isActive('group', group.id)
            // Is any child location active?
            const hasActiveChild = groupLocs.some(l => isActive('location', l.id))

            return (
              <div key={group.id} className={`scope-picker-group ${isGroupActive || hasActiveChild ? 'has-active' : ''}`}>
                {/* Group header */}
                <div
                  className={`scope-picker-option scope-picker-group-header ${isGroupActive ? 'active' : ''}`}
                  onClick={() => { onSelect({ type: 'group', id: group.id }); setOpen(false) }}
                >
                  <div className="scope-picker-option-icon group"><FileText size={16} /></div>
                  <div className="scope-picker-option-text">
                    <span className="scope-picker-option-name">{group.name}</span>
                    <span className="scope-picker-option-sub">{group.subtitle}</span>
                  </div>
                  {isGroupActive && <Check size={16} color="var(--primary)" />}
                </div>

                {/* Nested child locations */}
                <div className="scope-picker-children">
                  {groupLocs.map(loc => {
                    const overrideCount = Object.keys(loc.overrides || {}).length
                    return (
                      <div
                        key={loc.id}
                        className={`scope-picker-option scope-picker-child ${isActive('location', loc.id) ? 'active' : ''}`}
                        onClick={() => { onSelect({ type: 'location', id: loc.id }); setOpen(false) }}
                      >
                        <div className="scope-picker-child-dot" />
                        <div className="scope-picker-option-text">
                          <span className="scope-picker-option-name">{loc.name}</span>
                          <span className="scope-picker-option-sub">{loc.subtitle}</span>
                        </div>
                        {overrideCount > 0 && (
                          <span className="scope-picker-override-badge">{overrideCount}</span>
                        )}
                        {isActive('location', loc.id) && <Check size={16} color="var(--primary)" />}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


// ============================================================
// SETTINGS NAV (restructured IA + section dividers)
// ============================================================

const NAV = [
  {
    title: 'Profile', category: 'profile', items: [
      { id: 'avatar', label: 'Avatar' },
      { id: 'login_security', label: 'Login and security' },
    ]
  },
  {
    title: 'Payroll', category: 'payroll', items: [
      { id: 'pay_schedule', label: 'Pay schedule' },
      { id: 'payroll_other', label: 'Payroll integration' },
    ]
  },
  {
    title: 'Scheduling', category: 'scheduling', items: [
      { id: 'breaks', label: 'Breaks', complianceKey: 'breaks' },
      { id: 'overtime', label: 'Overtime', complianceKey: 'overtime' },
      { id: 'scheduling_hours', label: 'Hours & workweek' },
      { id: 'shifts_and_flags', label: 'Shifts & flags' },
    ]
  },
  {
    title: 'Time clock', category: 'time_clock', items: [
      { id: 'shift_enforcement', label: 'Shift enforcement' },
      { id: 'clock_settings', label: 'Time tracking' },
      { id: 'shared_device', label: 'Shared device' },
    ]
  },
  {
    title: 'Reference', category: 'reference', items: [
      { id: 'component_library', label: 'Component library' },
    ]
  },
]

function SettingsNav({ category, item, isCompliant, hasBreakRules, hasOvertimeConfig, onNav, onBack, selectedScope, onSelectScope }) {
  return (
    <nav className="settings-nav">
      {/* Back header */}
      <div className="settings-nav-header">
        <button className="settings-nav-back" onClick={onBack}>
          <ChevronLeft size={18} />
          <span>Back</span>
        </button>
        <div className="settings-nav-title">
          <Settings size={16} />
          <span>Settings</span>
        </div>
      </div>

      {/* Scope picker in sidebar */}
      <div className="settings-nav-scope">
        <ScopePicker selectedScope={selectedScope} onSelect={onSelectScope} />
      </div>

      {/* Nav sections */}
      <div className="settings-nav-sections">
        {NAV.map((section, si) => {
          const cat = section.category
          return (
            <div key={si} className="settings-nav-group">
              <div className="settings-nav-section-title">{section.title}</div>
              {section.items.map((navItem) => {
                const showDot = navItem.complianceKey && (
                  (navItem.complianceKey === 'breaks' && !hasBreakRules) ||
                  (navItem.complianceKey === 'overtime' && !hasOvertimeConfig)
                )
                return (
                  <div
                    key={navItem.id}
                    className={`settings-nav-item ${category === cat && item === navItem.id ? 'active' : ''}`}
                    onClick={() => onNav(cat, navItem.id)}
                  >
                    {showDot && <span className="settings-nav-dot error" />}
                    <span>{navItem.label}</span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </nav>
  )
}

// ============================================================
// COMPLIANCE WIZARD (guided flow for Breaks + Overtime)
// ============================================================

function ComplianceWizard({ hasBreakRules, hasOvertimeConfig, onApplyAll, onApplyBreaks, onApplyOvertime, onClose }) {
  const [step, setStep] = useState(hasBreakRules ? 'overtime' : 'intro')

  const allDone = hasBreakRules && hasOvertimeConfig

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="wizard" onClick={e => e.stopPropagation()}>
        {step === 'intro' && (
          <>
            <div className="wizard-header">
              <Sparkles size={24} color="var(--primary)" />
              <div>
                <h3>Fix Compliance Issues</h3>
                <p className="wizard-subtitle">We detected your location is in <strong>California</strong>. Let's set up compliant rules.</p>
              </div>
            </div>

            <div className="wizard-checklist">
              <WizardCheckItem label="Break Rules" done={hasBreakRules} desc="Meal & rest break requirements" />
              <WizardCheckItem label="Overtime Thresholds" done={hasOvertimeConfig} desc="Weekly, daily & double OT rates" />
            </div>

            <div className="wizard-actions">
              <button className="wizard-btn-secondary" onClick={onClose}>I'll do this later</button>
              <button className="wizard-btn-primary" onClick={() => {
                if (!hasBreakRules) { setStep('breaks') }
                else if (!hasOvertimeConfig) { setStep('overtime') }
              }}>
                Get started <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}

        {step === 'breaks' && (
          <>
            <div className="wizard-step-indicator">Step 1 of 2</div>
            <h3>California Break Rules</h3>
            <p className="wizard-subtitle">These break rules comply with California labor law:</p>

            <div className="wizard-preview-list">
              <WizardPreviewCard title="Meal Break" details="30 min · Unpaid · Required after 5 hrs" />
              <WizardPreviewCard title="Rest Break" details="10 min · Paid · Every 4 hrs worked" />
            </div>

            <div className="wizard-note">
              <Info size={16} />
              <p>You can customize these rules after applying.</p>
            </div>

            <div className="wizard-actions">
              <button className="wizard-btn-secondary" onClick={() => setStep('intro')}>Back</button>
              <button className="wizard-btn-primary" onClick={() => { onApplyBreaks(); setStep('overtime') }}>
                Apply break rules <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}

        {step === 'overtime' && !allDone && (
          <>
            <div className="wizard-step-indicator">Step {hasBreakRules ? '2 of 2' : '1 of 1'}</div>
            <h3>California Overtime Thresholds</h3>
            <p className="wizard-subtitle">These thresholds comply with California labor law:</p>

            <div className="wizard-preview-list">
              <WizardPreviewCard title="Weekly Overtime" details="40 hrs → 1.5x rate" />
              <WizardPreviewCard title="Daily Overtime" details="8 hrs → 1.5x rate" />
              <WizardPreviewCard title="Daily Double OT" details="12 hrs → 2x rate" />
            </div>

            <div className="wizard-note">
              <Info size={16} />
              <p>7th consecutive work day overtime will also apply.</p>
            </div>

            <div className="wizard-actions">
              {!hasBreakRules && <button className="wizard-btn-secondary" onClick={() => setStep('breaks')}>Back</button>}
              <button className="wizard-btn-primary" onClick={() => { onApplyOvertime(); setStep('done') }}>
                Apply overtime rules <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}

        {(step === 'done' || allDone) && (
          <div className="wizard-done">
            <div className="wizard-done-icon"><Check size={32} /></div>
            <h3>You're all set!</h3>
            <p className="wizard-subtitle">California compliance rules have been applied. You can fine-tune individual settings at any time.</p>
            <div className="wizard-done-checks">
              <WizardCheckItem label="Break Rules" done desc="California meal & rest breaks" />
              <WizardCheckItem label="Overtime Thresholds" done desc="40hr weekly, 8hr daily, 12hr double OT" />
            </div>
            <button className="wizard-btn-primary" onClick={onClose} style={{ width: '100%' }}>
              Done
            </button>
            <div className="wizard-legal">
              This information is for guidance only. Please verify with your legal counsel that settings comply with applicable laws.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function WizardCheckItem({ label, done, desc }) {
  return (
    <div className={`wizard-check ${done ? 'done' : ''}`}>
      <div className={`wizard-check-icon ${done ? 'ok' : 'pending'}`}>
        {done ? <Check size={16} /> : <X size={16} />}
      </div>
      <div>
        <div className="wizard-check-label">{label}</div>
        {desc && <div className="wizard-check-desc">{desc}</div>}
      </div>
    </div>
  )
}

function WizardPreviewCard({ title, details }) {
  return (
    <div className="wizard-preview-card">
      <div className="wizard-preview-title">{title}</div>
      <div className="wizard-preview-details">{details}</div>
    </div>
  )
}

// ============================================================
// CONTENT ROUTER
// ============================================================

function ContentRouter({ category, item, scopeContext, hasBreakRules, hasOvertimeConfig, onApplyBreaks, onApplyOvertime }) {
  const sc = scopeContext
  if (category === 'scheduling') {
    if (item === 'breaks') return <BreaksPage hasBreakRules={hasBreakRules} onApply={onApplyBreaks} scopeContext={sc} />
    if (item === 'overtime') return <OvertimePage hasOvertimeConfig={hasOvertimeConfig} onApply={onApplyOvertime} scopeContext={sc} />
    if (item === 'scheduling_hours') return <SchedulingHoursPage scopeContext={sc} />
    if (item === 'shifts_and_flags') return <ShiftsAndFlagsPage scopeContext={sc} />
  }
  if (category === 'time_clock') {
    if (item === 'shift_enforcement') return <ShiftEnforcementPage scopeContext={sc} />
    if (item === 'clock_settings') return <ClockSettingsPage scopeContext={sc} />
    if (item === 'shared_device') return <SharedDevicePage scopeContext={sc} />
  }
  if (category === 'payroll') {
    if (item === 'pay_schedule') return <PaySchedulePage scopeContext={sc} />
    return <PlaceholderPage title="Payroll integration" />
  }
  if (category === 'reference') {
    if (item === 'component_library') return <ComponentLibraryPage />
  }
  return <PlaceholderPage title={item.replace(/_/g, ' ')} />
}

// ============================================================
// SECTION CARD (simplified — no icon box when title is redundant)
// ============================================================

function SectionCard({ icon: Icon, title, description, onEdit, badge, children, compact }) {
  return (
    <div className="section-card">
      {!compact && (
        <div className="section-card-header">
          {Icon && <div className="section-card-icon"><Icon size={20} /></div>}
          <div className="section-card-title">
            <h3>{title}</h3>
            {description && <p>{description}</p>}
          </div>
          <div className="section-card-actions">
            {badge}
            {onEdit && <button className="edit-btn" onClick={onEdit}>Edit</button>}
          </div>
        </div>
      )}
      <div className="section-card-body">{children}</div>
    </div>
  )
}

// ============================================================
// SCOPE STATUS (3-level inheritance: company → group → location)
// ============================================================

function ScopeStatus({ scopeContext, settingKey, settingLabel }) {
  const { isCompanyScope, isGroupScope, isLocationScope, selectedGroup, selectedLocation, onChangeScope } = scopeContext

  // At company level — you're editing the base, no badge needed
  if (isCompanyScope) return null

  // At group level — show that this is a policy group override
  if (isGroupScope && selectedGroup) {
    const isGroupOverride = selectedGroup.overrides?.[settingKey]
    return (
      <div className={`scope-badge-inline ${isGroupOverride ? 'group-override' : 'default'}`}>
        {isGroupOverride ? <FileText size={12} /> : <Building2 size={12} />}
        <span>{isGroupOverride ? `${selectedGroup.name} policy override` : 'Using company default'}</span>
      </div>
    )
  }

  // At location level — show the full inheritance chain
  if (isLocationScope && selectedLocation) {
    const source = resolveSettingSource(selectedLocation.id, settingKey)
    const group = getGroupForLocation(selectedLocation.id)

    if (source === 'location') {
      return (
        <ScopeBadgeWithAlign
          selectedLocation={selectedLocation}
          settingLabel={settingLabel}
          onChangeScope={onChangeScope}
        />
      )
    }

    if (source === 'group' && group) {
      return (
        <div className="scope-badge-inline group-inherited">
          <FileText size={12} />
          <span>From {group.name} policy</span>
          <button className="scope-badge-change" onClick={(e) => { e.stopPropagation(); onChangeScope({ type: 'group', id: group.id }) }}>
            Edit policy
          </button>
        </div>
      )
    }

    return (
      <div className="scope-badge-inline default">
        <Building2 size={12} />
        <span>Company default</span>
        <button className="scope-badge-change" onClick={(e) => { e.stopPropagation(); onChangeScope({ type: 'company' }) }}>
          Edit default
        </button>
      </div>
    )
  }

  return null
}

// The "Custom" badge with a Change button that opens the align modal
function ScopeBadgeWithAlign({ selectedLocation, settingLabel, onChangeScope }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="scope-badge-inline customized">
        <MapPin size={12} />
        <span>Custom for {selectedLocation.name}</span>
        <button className="scope-badge-change" onClick={(e) => { e.stopPropagation(); setShowModal(true) }}>
          Change
        </button>
      </div>

      {showModal && (
        <AlignSettingsModal
          locationName={selectedLocation.name}
          locationId={selectedLocation.id}
          settingLabel={settingLabel}
          onApply={(scope) => {
            onChangeScope(scope)
            setShowModal(false)
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

// ============================================================
// ALIGN SETTINGS MODAL (3-level: company, groups, locations)
// ============================================================

function AlignSettingsModal({ locationName, locationId, settingLabel, onApply, onClose }) {
  const [selectedSource, setSelectedSource] = useState(null)

  // Build source options: company default, each policy group, each location (except self)
  const sources = [
    { type: 'company', name: 'Company default', subtitle: 'Use the global company-wide settings', icon: Building2, iconClass: 'company' },
    ...POLICY_GROUPS.map(g => ({
      type: 'group', id: g.id, name: g.name + ' policy', subtitle: g.subtitle, icon: FileText, iconClass: 'group'
    })),
    ...LOCATIONS.filter(l => l.id !== locationId).map(l => ({
      type: 'location', id: l.id, name: l.name, subtitle: l.subtitle, icon: MapPin, iconClass: 'location'
    })),
  ]

  const isSelected = (source) => {
    if (!selectedSource) return false
    return selectedSource.type === source.type && selectedSource.id === source.id
  }

  const handleApply = () => {
    if (!selectedSource) return
    if (selectedSource.type === 'company') onApply({ type: 'company' })
    else if (selectedSource.type === 'group') onApply({ type: 'group', id: selectedSource.id })
    else onApply({ type: 'location', id: selectedSource.id })
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="align-modal" onClick={e => e.stopPropagation()}>
        <div className="align-modal-header">
          <div>
            <h3>Change {settingLabel || 'settings'} source</h3>
            <p className="align-modal-subtitle">
              Choose which settings <strong>{locationName}</strong> should inherit for this page.
            </p>
          </div>
          <button className="align-modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="align-modal-options">
          {sources.map((source, i) => {
            const key = source.type + (source.id || '')
            const active = isSelected(source)
            // Add section dividers
            const showGroupDivider = i === 1
            const showLocationDivider = source.type === 'location' && sources[i - 1]?.type !== 'location'
            return (
              <div key={key}>
                {showGroupDivider && <div className="align-modal-divider">Policy groups</div>}
                {showLocationDivider && <div className="align-modal-divider">Copy from location</div>}
                <div
                  className={`align-modal-option ${active ? 'selected' : ''}`}
                  onClick={() => setSelectedSource(source)}
                >
                  <div className={`align-modal-option-icon ${source.iconClass}`}>
                    <source.icon size={16} />
                  </div>
                  <div className="align-modal-option-text">
                    <span className="align-modal-option-name">{source.name}</span>
                    <span className="align-modal-option-sub">{source.subtitle}</span>
                  </div>
                  <div className={`align-modal-radio ${active ? 'checked' : ''}`}>
                    {active && <div className="align-modal-radio-dot" />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="align-modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={!selectedSource} onClick={handleApply}>
            Apply settings
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// COMPLIANCE MODULE (shared by Breaks + Overtime)
// ============================================================
// States: 'empty' (FTUX), 'compliant', 'warning' (fell out)

function ComplianceModule({ status, onAutoApply, emptyIcon: EmptyIcon, emptyTitle, emptyDescription, compliantLabel, warningLabel, warningDescription, autoApplyLabel, legalCode, legalSummary }) {
  const [expanded, setExpanded] = useState(false)

  const legalFooter = (
    <div className="compliance-legal">
      <button className="compliance-legal-toggle" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}>
        <Info size={13} />
        <span>View applicable law</span>
        <ChevronDown size={14} className={`compliance-legal-chevron ${expanded ? 'open' : ''}`} />
      </button>
      {expanded && (
        <div className="compliance-legal-body">
          <div className="compliance-legal-code">{legalCode}</div>
          <p>{legalSummary}</p>
          <p className="compliance-legal-disclaimer">This information is for guidance only. Please verify with your legal counsel.</p>
        </div>
      )}
    </div>
  )

  if (status === 'empty') {
    return (
      <div className="compliance-module empty">
        <div className="compliance-module-icon-lg"><EmptyIcon size={28} /></div>
        <div className="compliance-module-body">
          <h3>{emptyTitle}</h3>
          <p>{emptyDescription}</p>
        </div>
        <div className="compliance-module-actions">
          <button className="btn-primary" onClick={onAutoApply}>
            <Wand2 size={16} /> {autoApplyLabel}
          </button>
        </div>
        {legalFooter}
      </div>
    )
  }

  if (status === 'warning') {
    return (
      <div className="compliance-module error">
        <div className="compliance-module-row">
          <CircleAlert size={18} className="compliance-module-icon-error" />
          <div className="compliance-module-body">
            <h4>Non-compliance detected</h4>
            <p>{warningDescription}</p>
          </div>
          <button className="btn-primary btn-sm" onClick={onAutoApply}>
            <Wand2 size={14} /> {autoApplyLabel}
          </button>
        </div>
        {legalFooter}
      </div>
    )
  }

  // compliant
  return (
    <div className="compliance-module compliant">
      <div className="compliance-compliant-top">
        <CircleCheck size={20} />
        <div className="compliance-compliant-text">
          <strong>Fully compliant</strong>
          <span>{compliantLabel}</span>
        </div>
      </div>
      <div className="compliance-compliant-footer">
        <span className="compliance-disclaimer">This is a recommendation and does not constitute legal advice.</span>
        <button className="compliance-learn-more" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}>
          Learn more <ChevronDown size={14} className={`compliance-legal-chevron ${expanded ? 'open' : ''}`} />
        </button>
      </div>
      {expanded && (
        <div className="compliance-legal-body">
          <div className="compliance-legal-code">{legalCode}</div>
          <p>{legalSummary}</p>
        </div>
      )}
    </div>
  )
}

// ============================================================
// BREAKS PAGE
// ============================================================

const DEFAULT_BREAK_RULES = [
  { id: 1, name: 'Meal Break', roles: [], type: 'Unpaid', shiftDuration: '5', breakDuration: '30', earliest: '5', latest: '6', required: true, waivable: false, allowEarlyEnd: false, sendReminder: false, reminderMins: '10' },
  { id: 2, name: 'Rest Break', roles: [], type: 'Paid', shiftDuration: '4', breakDuration: '10', earliest: '3', latest: '4.5', required: true, waivable: false, allowEarlyEnd: true, sendReminder: true, reminderMins: '5' },
]

function BreaksPage({ hasBreakRules, onApply, scopeContext }) {
  const { markDirty } = scopeContext
  const [rules, setRules] = useState(hasBreakRules ? DEFAULT_BREAK_RULES : [])
  const [editingRule, setEditingRule] = useState(null)
  const [wasEverCompliant, setWasEverCompliant] = useState(hasBreakRules)

  const handleAutoApply = () => {
    onApply()
    setRules(DEFAULT_BREAK_RULES)
    setWasEverCompliant(true)
    markDirty()
  }

  const handleAddNew = () => {
    setEditingRule({
      id: null, name: '', roles: [], type: 'Unpaid', shiftDuration: '5', breakDuration: '30', earliest: '5', latest: '6', required: false, waivable: false, allowEarlyEnd: true, sendReminder: false, reminderMins: '10',
    })
  }

  const handleSave = (rule) => {
    if (rule.id) {
      setRules(prev => prev.map(r => r.id === rule.id ? rule : r))
    } else {
      setRules(prev => [...prev, { ...rule, id: Date.now() }])
    }
    setEditingRule(null)
    markDirty()
  }

  const handleDelete = (ruleId) => {
    setRules(prev => prev.filter(r => r.id !== ruleId))
    setEditingRule(null)
    markDirty()
  }

  if (editingRule !== null) {
    return (
      <BreakRuleEditor
        rule={editingRule}
        onSave={handleSave}
        onDelete={editingRule.id ? () => handleDelete(editingRule.id) : null}
        onBack={() => setEditingRule(null)}
      />
    )
  }

  const hasRules = rules.length > 0
  // Derive compliance status
  const hasRequiredMeal = rules.some(r => r.required && parseInt(r.breakDuration) >= 30)
  const hasRequiredRest = rules.some(r => r.required && parseInt(r.breakDuration) >= 10 && parseInt(r.breakDuration) < 30)
  const isCompliant = hasRequiredMeal && hasRequiredRest

  let complianceStatus = 'empty'
  if (hasRules && isCompliant) complianceStatus = 'compliant'
  else if (hasRules || wasEverCompliant) complianceStatus = 'warning'

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Breaks</h1>
          <p className="page-subtitle">Configure required meal and rest breaks</p>
        </div>
        <ScopeStatus scopeContext={scopeContext} settingKey="breaks" settingLabel="break rules" />
      </div>

      <ComplianceModule
        status={complianceStatus}
        onAutoApply={handleAutoApply}
        emptyIcon={Coffee}
        emptyTitle="No break rules configured"
        emptyDescription="Break rules help ensure your location complies with labor laws. We detected this location is in California and can auto-apply compliant rules."
        compliantLabel="Compliant with California break requirements"
        warningLabel="Missing required break rules"
        warningDescription="California requires a 30-min meal break and a 10-min rest break. Add them manually or apply the defaults."
        autoApplyLabel="Apply California defaults"
        legalCode="Cal. Lab. Code §§ 226.7, 512"
        legalSummary="Employers must provide a 30-minute unpaid meal break for shifts over 5 hours, and a paid 10-minute rest break for every 4 hours worked or major fraction thereof. Employees may waive a meal break if the shift is no more than 6 hours."
      />

      <SectionCard compact>
        {hasRules ? (
          <>
          {rules.map(rule => (
            <BreakRuleRow key={rule.id} rule={rule} onClick={() => setEditingRule(rule)} />
          ))}
            <div style={{ height: 12 }} />
          </>
        ) : (
          <div className="empty-list">
            <Coffee size={20} />
            <span>No break rules yet</span>
          </div>
        )}
        <button className="link-btn" onClick={handleAddNew}><Plus size={16} /> Add break rule</button>
      </SectionCard>
    </div>
  )
}

function BreakRuleRow({ rule, onClick }) {
  const { name, roles, type, shiftDuration, breakDuration, earliest, latest, required, waivable, allowEarlyEnd, sendReminder, reminderMins } = rule

  // Only surface active/notable modifiers — silence is the default
  const modifiers = []
  if (waivable) modifiers.push('Waivable')
  if (allowEarlyEnd) modifiers.push('Can end early')
  if (sendReminder) modifiers.push(`Reminder ${reminderMins} min before`)

  const roleLabel = !roles || roles.length === 0
    ? 'All roles'
    : roles.length === 1 ? roles[0] : `${roles.length} roles`

  return (
    <div className="break-card" onClick={onClick}>
      <div className="break-card-header">
        <div className="break-card-left">
          <div className="break-card-title-row">
            <span className="break-card-name">{name}</span>
            <span className={`break-badge ${type === 'Paid' ? 'paid' : 'unpaid'}`}>{type}</span>
            <span className={`break-badge ${required ? 'required' : 'optional'}`}>{required ? 'Required' : 'Optional'}</span>
          </div>
          <p className="break-card-summary">
            {breakDuration} min break after {shiftDuration}+ hr shifts · Take between {earliest}–{latest} hrs in · {roleLabel}
          </p>
        </div>
        <ChevronRight size={16} className="break-card-chevron" />
      </div>

      {modifiers.length > 0 && (
        <div className="break-card-modifiers">
          {modifiers.map(m => (
            <span key={m} className="break-modifier">{m}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================
// BREAK RULE EDITOR (full-page inline form)
// ============================================================

// ============================================================
// ROLE PICKER — multi-select with search + nested departments
// ============================================================

function RolePicker({ selected, onChange }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const allRoles = ROLE_GROUPS.flatMap(g => g.roles)
  const isAllSelected = selected.length === 0 || (selected.length === allRoles.length)

  const toggleAll = () => {
    onChange(isAllSelected ? [] : [])
  }

  const toggleDepartment = (dept) => {
    const group = ROLE_GROUPS.find(g => g.department === dept)
    if (!group) return
    const allInDept = group.roles.every(r => selected.includes(r))
    if (allInDept) {
      onChange(selected.filter(r => !group.roles.includes(r)))
    } else {
      const merged = [...new Set([...selected, ...group.roles])]
      onChange(merged)
    }
  }

  const toggleRole = (role) => {
    if (selected.includes(role)) {
      onChange(selected.filter(r => r !== role))
    } else {
      onChange([...selected, role])
    }
  }

  const isDeptChecked = (dept) => {
    const group = ROLE_GROUPS.find(g => g.department === dept)
    return group?.roles.every(r => selected.includes(r))
  }

  const isDeptIndeterminate = (dept) => {
    const group = ROLE_GROUPS.find(g => g.department === dept)
    const some = group?.roles.some(r => selected.includes(r))
    const all = group?.roles.every(r => selected.includes(r))
    return some && !all
  }

  const lowerSearch = search.toLowerCase()
  const filtered = ROLE_GROUPS.map(g => ({
    ...g,
    roles: g.roles.filter(r => r.toLowerCase().includes(lowerSearch)),
    deptMatch: g.department.toLowerCase().includes(lowerSearch),
  })).filter(g => g.deptMatch || g.roles.length > 0)

  const label = isAllSelected ? 'All roles' : selected.length === 1 ? selected[0] : `${selected.length} roles`

  return (
    <div className="role-picker" ref={ref}>
      <button className="role-picker-trigger" onClick={() => setOpen(!open)}>
        <span>{label}</span>
        <ChevronDown size={14} className={`role-picker-chevron ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="role-picker-dropdown">
          <div className="role-picker-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search roles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          <div className="role-picker-list">
            {/* All roles option */}
            {!search && (
              <label className="role-picker-option role-picker-all" onClick={(e) => { e.preventDefault(); toggleAll() }}>
                <span className={`role-checkbox ${isAllSelected ? 'checked' : ''}`}>
                  {isAllSelected && <Check size={12} />}
                </span>
                <span className="role-picker-option-label">All roles</span>
              </label>
            )}

            {filtered.map(group => (
              <div key={group.department} className="role-picker-group">
                <label className="role-picker-option role-picker-dept" onClick={(e) => { e.preventDefault(); toggleDepartment(group.department) }}>
                  <span className={`role-checkbox ${isDeptChecked(group.department) ? 'checked' : ''} ${isDeptIndeterminate(group.department) ? 'indeterminate' : ''}`}>
                    {isDeptChecked(group.department) && <Check size={12} />}
                    {isDeptIndeterminate(group.department) && <span className="role-checkbox-dash" />}
                  </span>
                  <span className="role-picker-option-label">{group.department}</span>
                </label>
                {(search ? group.roles : group.roles).map(role => (
                  <label key={role} className="role-picker-option role-picker-role" onClick={(e) => { e.preventDefault(); toggleRole(role) }}>
                    <span className={`role-checkbox ${selected.includes(role) ? 'checked' : ''}`}>
                      {selected.includes(role) && <Check size={12} />}
                    </span>
                    <span className="role-picker-option-label">{role}</span>
                  </label>
                ))}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="role-picker-empty">No roles match "{search}"</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// BREAK RULE EDITOR
// ============================================================

function BreakRuleEditor({ rule, onSave, onDelete, onBack }) {
  const [name, setName] = useState(rule.name)
  const [roles, setRoles] = useState(Array.isArray(rule.roles) ? rule.roles : [])
  const [type, setType] = useState(rule.type)
  const [shiftDuration, setShiftDuration] = useState(rule.shiftDuration)
  const [breakDuration, setBreakDuration] = useState(rule.breakDuration)
  const [earliest, setEarliest] = useState(rule.earliest)
  const [latest, setLatest] = useState(rule.latest)
  const [required, setRequired] = useState(rule.required)
  const [waivable, setWaivable] = useState(rule.waivable)
  const [allowEarlyEnd, setAllowEarlyEnd] = useState(rule.allowEarlyEnd)
  const [sendReminder, setSendReminder] = useState(rule.sendReminder)
  const [reminderMins, setReminderMins] = useState(rule.reminderMins || '10')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isNew = !rule.id
  const canSave = name.trim().length > 0

  // Auto-apply changes when navigating back
  const handleBack = () => {
    if (canSave) {
      onSave({ ...rule, name, roles, type, shiftDuration, breakDuration, earliest, latest, required, waivable, allowEarlyEnd, sendReminder, reminderMins })
    } else {
      onBack()
    }
  }

  return (
    <div className="content-inner">
      <button className="back-link" onClick={handleBack}>
        <ChevronLeft size={16} /> Back to break rules
      </button>

      <div className="page-header" style={{ marginTop: 8 }}>
        <div>
          <h1 className="page-title">{isNew ? 'New Break Rule' : 'Edit Break Rule'}</h1>
          <p className="page-subtitle">{isNew ? 'Create a new break rule for this location' : `Editing "${rule.name}"`}</p>
        </div>
      </div>

      {/* --- Single card with all settings --- */}
      <div className="bre-card">
        {/* Name & Type — top row */}
        <div className="bre-header-row">
          <div className="bre-name-field">
            <input
              className="bre-name-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Break name, e.g. Meal Break"
            />
          </div>
          <div className="bre-type-toggle">
            <button className={`bre-type-btn ${type === 'Paid' ? 'active' : ''}`} onClick={() => setType('Paid')}>Paid</button>
            <button className={`bre-type-btn ${type === 'Unpaid' ? 'active' : ''}`} onClick={() => setType('Unpaid')}>Unpaid</button>
          </div>
        </div>

        {/* Quick settings grid */}
        <div className="bre-grid">
          <div className="bre-grid-item">
            <label className="bre-grid-label">Applies to</label>
            <RolePicker selected={roles} onChange={setRoles} />
          </div>
          <div className="bre-grid-item">
            <label className="bre-grid-label">Shift min length</label>
            <div className="bre-grid-input-group">
              <input className="bre-grid-input" type="number" value={shiftDuration} onChange={e => setShiftDuration(e.target.value)} min="0" step="0.5" />
              <span className="bre-grid-unit">hrs</span>
            </div>
          </div>
          <div className="bre-grid-item">
            <label className="bre-grid-label">Break length</label>
            <div className="bre-grid-input-group">
              <input className="bre-grid-input" type="number" value={breakDuration} onChange={e => setBreakDuration(e.target.value)} min="1" />
              <span className="bre-grid-unit">mins</span>
            </div>
          </div>
          <div className="bre-grid-item">
            <label className="bre-grid-label">Break window</label>
            <div className="bre-grid-window">
              <input className="bre-grid-input" type="number" value={earliest} onChange={e => setEarliest(e.target.value)} min="0" step="0.5" />
              <span className="bre-grid-unit">–</span>
              <input className="bre-grid-input" type="number" value={latest} onChange={e => setLatest(e.target.value)} min="0" step="0.5" />
              <span className="bre-grid-unit">hrs into shift</span>
            </div>
          </div>
        </div>

        {/* Toggles — compact list */}
        <div className="bre-toggles">
          <div className="bre-toggle-item" onClick={() => setRequired(!required)}>
            <div className="bre-toggle-content">
              <span className="bre-toggle-label">Required</span>
              <span className="bre-toggle-hint">{required ? 'When on, skipping this break flags the shift.' : 'When off, this break is optional.'}</span>
            </div>
            <div className={`setting-toggle ${required ? 'on' : ''}`}><div className="setting-toggle-thumb" /></div>
          </div>
          <div className="bre-toggle-item" onClick={() => setWaivable(!waivable)}>
            <div className="bre-toggle-content">
              <span className="bre-toggle-label">Waivable</span>
              <span className="bre-toggle-hint">{waivable ? 'When on, employees can waive this break.' : 'When off, this break cannot be waived.'}</span>
            </div>
            <div className={`setting-toggle ${waivable ? 'on' : ''}`}><div className="setting-toggle-thumb" /></div>
          </div>
          <div className="bre-toggle-item" onClick={() => setAllowEarlyEnd(!allowEarlyEnd)}>
            <div className="bre-toggle-content">
              <span className="bre-toggle-label">Allowed to end early</span>
              <span className="bre-toggle-hint">{allowEarlyEnd ? 'When on, workers can end this break before the full duration.' : 'When off, workers must complete the full break duration.'}</span>
            </div>
            <div className={`setting-toggle ${allowEarlyEnd ? 'on' : ''}`}><div className="setting-toggle-thumb" /></div>
          </div>
          <div className="bre-toggle-item" onClick={() => setSendReminder(!sendReminder)}>
            <div className="bre-toggle-content">
              <span className="bre-toggle-label">Send reminder</span>
              <span className="bre-toggle-hint">{sendReminder ? 'When on, workers are notified before it\'s time for this break.' : 'When off, no reminders are sent.'}</span>
            </div>
            <div className={`setting-toggle ${sendReminder ? 'on' : ''}`}><div className="setting-toggle-thumb" /></div>
          </div>
          {sendReminder && (
            <div className="bre-child-setting">
              <label className="bre-child-label">Remind</label>
              <div className="bre-child-input-group">
                <input className="bre-child-input" type="number" value={reminderMins} onChange={e => setReminderMins(e.target.value)} min="1" max="60" />
                <span className="bre-child-unit">minutes before break</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete — only for existing rules, pushed to bottom */}
      {onDelete && (
        <div className="bre-danger-zone">
          {showDeleteConfirm ? (
            <div className="bre-delete-confirm">
              <p>Are you sure you want to delete <strong>"{rule.name}"</strong>? Workers will no longer be required to take this break.</p>
              <div className="bre-delete-confirm-actions">
                <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button className="btn-danger-fill" onClick={onDelete}>Delete rule</button>
              </div>
            </div>
          ) : (
            <button className="bre-delete-btn" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 size={14} /> Delete this rule
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================
// OVERTIME PAGE (consolidated, same pattern)
// ============================================================

function OvertimePage({ hasOvertimeConfig, onApply, scopeContext }) {
  const { markDirty } = scopeContext
  const [configured, setConfigured] = useState(hasOvertimeConfig)
  const [weeklyHrs, setWeeklyHrs] = useState('40')
  const [dailyHrs, setDailyHrs] = useState('0')
  const [doubleHrs, setDoubleHrs] = useState('0')

  const handleAutoApply = () => {
    onApply()
    setConfigured(true)
    setWeeklyHrs('40')
    setDailyHrs('8')
    setDoubleHrs('12')
    markDirty()
  }

  const hasWeekly = parseInt(weeklyHrs) > 0
  const hasDaily = parseInt(dailyHrs) > 0
  const hasDouble = parseInt(doubleHrs) > 0
  const isCompliant = configured && hasWeekly && hasDaily && hasDouble
  const complianceStatus = !configured ? 'empty' : isCompliant ? 'compliant' : 'warning'

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Overtime</h1>
          <p className="page-subtitle">Set overtime thresholds for calculating pay</p>
        </div>
        <ScopeStatus scopeContext={scopeContext} settingKey="overtime" settingLabel="overtime" />
      </div>

      <ComplianceModule
        status={complianceStatus}
        onAutoApply={handleAutoApply}
        emptyIcon={Timer}
        emptyTitle="No overtime thresholds configured"
        emptyDescription="Overtime thresholds determine when workers earn overtime pay. We detected this location is in California and can auto-apply compliant thresholds."
        compliantLabel="Compliant with California overtime requirements"
        warningLabel="Missing overtime thresholds"
        warningDescription="California requires weekly (40 hr), daily (8 hr), and double OT (12 hr) thresholds."
        autoApplyLabel="Apply California defaults"
        legalCode="Cal. Lab. Code §§ 510, 511"
        legalSummary="California requires overtime pay at 1.5x the regular rate for hours worked beyond 8 in a day or 40 in a week, and double-time pay for hours beyond 12 in a day. The 7th consecutive day worked in a workweek also triggers overtime."
      />

      <SettingsSection title="Thresholds" description="Set to 0 hours to disable a threshold.">
        <SettingValueRow label="Weekly overtime" description="Hours per week before 1.5x overtime" value={weeklyHrs} suffix="hrs" type="number" onChange={v => { setWeeklyHrs(v || '0'); setConfigured(true); markDirty() }} />
        <SettingValueRow label="Daily overtime" description="Hours per day before 1.5x overtime" value={dailyHrs} suffix="hrs" type="number" onChange={v => { setDailyHrs(v || '0'); setConfigured(true); markDirty() }} />
        <SettingValueRow label="Daily double overtime" description="Hours per day before 2x overtime" value={doubleHrs} suffix="hrs" type="number" onChange={v => { setDoubleHrs(v || '0'); setConfigured(true); markDirty() }} />
      </SettingsSection>
    </div>
  )
}

// ============================================================
// SHIFT ENFORCEMENT PAGE
// ============================================================

function ShiftEnforcementPage({ scopeContext }) {
  const { markDirty } = scopeContext
  const [earlyClockIn, setEarlyClockIn] = useState(false)
  const [earlyMins, setEarlyMins] = useState('')
  const [geofence, setGeofence] = useState(true)

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Shift Enforcement</h1>
          <p className="page-subtitle">Control when and where workers can clock in</p>
        </div>
        <ScopeStatus scopeContext={scopeContext} settingKey="earlyClockIn" settingLabel="shift enforcement" />
      </div>

      <SettingsSection title="Early clock-in" description="Control whether workers can clock in before their shift starts.">
        <SettingToggleRow
          label="Prevent early clock-in"
          onDescription="When on, workers cannot clock in before their scheduled shift."
          offDescription="When off, workers can clock in at any time."
          enabled={earlyClockIn}
          onToggle={() => { setEarlyClockIn(!earlyClockIn); markDirty() }}
        />
        {earlyClockIn && (
          <SettingChildRow>
            <SettingValueRow
              label="Buffer time"
              description="How many minutes before their shift workers can clock in"
              value={earlyMins}
              suffix="mins"
              type="number"
              placeholder="Not set"
              onChange={v => { setEarlyMins(v); markDirty() }}
            />
          </SettingChildRow>
        )}
      </SettingsSection>

      <SettingsSection title="Geofence" description="Restrict clock-in to a set area around your workplace.">
        <SettingToggleRow
          label="Require location"
          onDescription="When on, workers must be within range of a location to clock in."
          offDescription="When off, workers can clock in from anywhere."
          enabled={geofence}
          onToggle={() => { setGeofence(!geofence); markDirty() }}
        />
        {geofence && (
          <SettingChildRow>
            <SettingValueRow label="Location" description="The address used as the geofence center" value="123 Main St, San Francisco, CA" />
          </SettingChildRow>
        )}
      </SettingsSection>
    </div>
  )
}

// ============================================================
// SHIFTS & FLAGS PAGE (was "Advanced Scheduling")
// ============================================================

const DEFAULT_FLAGS = [
  { id: 'far_location', name: 'Clock in/out too far from work location', description: 'Flag when a worker clocks in or out beyond the allowed distance from the store.', enabled: true, conditionLabel: 'Flag when distance exceeds', conditionValue: '500', conditionUnit: 'feet' },
  { id: 'long_shift', name: 'Shift exceeds maximum duration', description: 'Flag shifts that run longer than the allowed threshold.', enabled: true, conditionLabel: 'Flag when shift exceeds', conditionValue: '9', conditionUnit: 'hrs' },
  { id: 'clock_in_location_missing', name: 'Clock-in location not captured', description: 'Flag when GPS or location data is unavailable at clock-in.', enabled: true, conditionLabel: null, conditionValue: null, conditionUnit: null },
  { id: 'clock_out_location_missing', name: 'Clock-out location not captured', description: 'Flag when GPS or location data is unavailable at clock-out.', enabled: true, conditionLabel: null, conditionValue: null, conditionUnit: null },
  { id: 'break_end_missing', name: 'Break not ended', description: 'Flag when a worker starts a break but never records ending it.', enabled: true, conditionLabel: null, conditionValue: null, conditionUnit: null },
  { id: 'clock_out_missing', name: 'Missing clock-out', description: 'Flag when a worker clocks in but never clocks out.', enabled: false, conditionLabel: null, conditionValue: null, conditionUnit: null },
]

function ShiftsAndFlagsPage({ scopeContext }) {
  const { markDirty } = scopeContext
  const [openShifts, setOpenShifts] = useState(false)
  const [visibility, setVisibility] = useState('roles')
  const [flags, setFlags] = useState(DEFAULT_FLAGS)

  const toggleFlag = (id) => {
    setFlags(flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
    markDirty()
  }

  const updateFlagCondition = (id, value) => {
    setFlags(flags.map(f => f.id === id ? { ...f, conditionValue: value } : f))
    markDirty()
  }

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Shifts & Flags</h1>
          <p className="page-subtitle">Configure open shifts and compliance alerts</p>
        </div>
        <ScopeStatus scopeContext={scopeContext} settingKey="shiftsFlags" settingLabel="shifts & flags" />
      </div>

      <SettingsSection title="Open shifts" description="Automatically post flagged shifts for other workers to pick up.">
        <SettingToggleRow
          label="Auto-send to Open Shifts"
          onDescription="When on, flagged shifts are automatically posted to Open Shifts."
          offDescription="When off, flagged shifts must be manually posted."
          enabled={openShifts}
          onToggle={() => { setOpenShifts(!openShifts); markDirty() }}
        />
        {openShifts && (
          <SettingChildRow>
            <SettingValueRow
              label="Visibility of Open Shifts"
              description="Which shifts a team member can see in their Open Shifts list"
              value={visibility === 'roles' ? 'Matching roles only' : 'Any shift at this location'}
              onChange={v => { setVisibility(v === 'Matching roles only' ? 'roles' : 'any'); markDirty() }}
              options={['Matching roles only', 'Any shift at this location']}
            />
          </SettingChildRow>
        )}
      </SettingsSection>

      <SettingsSection title="Shift flags" description="Flags highlight shifts that may need manager attention. Toggle each flag on or off and adjust thresholds where applicable.">
        {flags.map(flag => (
          <div key={flag.id} className="flag-row">
            <div className={`flag-row-content ${!flag.enabled ? 'disabled' : ''}`}>
              <div className="flag-row-name">{flag.name}</div>
              <div className="flag-row-desc">{flag.description}</div>
              {flag.conditionLabel && (
                <div className="flag-row-condition">
                  <span className="flag-row-condition-label">{flag.conditionLabel}</span>
                  {flag.enabled ? (
                    <input
                      className="flag-row-condition-input"
                      type="number"
                      value={flag.conditionValue}
                      onChange={e => updateFlagCondition(flag.id, e.target.value)}
                      min="0"
                    />
                  ) : (
                    <span className="flag-row-condition-value">{flag.conditionValue}</span>
                  )}
                  <span className="flag-row-condition-unit">{flag.conditionUnit}</span>
                </div>
              )}
            </div>
            <div className={`setting-toggle ${flag.enabled ? 'on' : ''}`} onClick={() => toggleFlag(flag.id)}>
              <div className="setting-toggle-thumb" />
            </div>
          </div>
        ))}
      </SettingsSection>
    </div>
  )
}



// ============================================================
// PAY SCHEDULE PAGE (now under Payroll)
// ============================================================

function PaySchedulePage({ scopeContext }) {
  const { markDirty } = scopeContext
  const [frequency, setFrequency] = useState('Bi-weekly')
  const [periodStart, setPeriodStart] = useState('Feb 1, 2026')
  const [startTime, setStartTime] = useState('12:00 AM')

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pay Schedule</h1>
          <p className="page-subtitle">Configure pay periods and frequency</p>
        </div>
        <ScopeStatus scopeContext={scopeContext} settingKey="paySchedule" settingLabel="pay schedule" />
      </div>

      <SettingsSection title="Pay period">
        <SettingValueRow label="Pay frequency" value={frequency} onChange={v => { setFrequency(v); markDirty() }} options={['Weekly', 'Bi-weekly', 'Semi-monthly', 'Monthly']} />
        <SettingValueRow label="Current period starts" value={periodStart} onChange={v => { setPeriodStart(v); markDirty() }} />
        <SettingValueRow label="Start time" value={startTime} onChange={v => { setStartTime(v); markDirty() }} type="time" />
      </SettingsSection>
    </div>
  )
}

// ============================================================
// HOURS & WORKWEEK PAGE
// ============================================================

function SchedulingHoursPage({ scopeContext }) {
  const { markDirty } = scopeContext
  const [workweekStart, setWorkweekStart] = useState('Monday')
  const [sameHours, setSameHours] = useState(true)
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const [sharedStart, setSharedStart] = useState('9:00 AM')
  const [sharedEnd, setSharedEnd] = useState('5:00 PM')

  const [hours, setHours] = useState(
    Object.fromEntries(DAYS.map(d => [d,
      d === 'Sat' || d === 'Sun'
        ? { start: '9:00 AM', end: '5:00 PM', closed: true }
        : { start: '9:00 AM', end: '5:00 PM', closed: false }
    ]))
  )

  const updateDay = (day, field, value) => {
    setHours(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }))
    markDirty()
  }
  const toggleDay = (day) => {
    setHours(prev => ({ ...prev, [day]: { ...prev[day], closed: !prev[day].closed } }))
    markDirty()
  }

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Hours & Workweek</h1>
          <p className="page-subtitle">Business hours and workweek configuration</p>
        </div>
        <ScopeStatus scopeContext={scopeContext} settingKey="operatingHours" settingLabel="hours & workweek" />
      </div>

      <SettingsSection title="Scheduling hours" description="Hours when shifts can be scheduled. End times past midnight (up to 2:00 AM) are treated as the next day.">
        <SettingToggleRow
          label="Same hours every day"
          onDescription="All days share the same operating hours."
          offDescription="Each day can have different hours."
          enabled={sameHours}
          onToggle={() => { setSameHours(!sameHours); markDirty() }}
        />

        {sameHours && (
          <SettingChildRow>
            <SettingValueRow label="Opens at" value={sharedStart} onChange={v => { setSharedStart(v); markDirty() }} type="time" />
            <SettingValueRow label="Closes at" value={sharedEnd} onChange={v => { setSharedEnd(v); markDirty() }} type="time" />
            {isNextDay(sharedStart, sharedEnd) && (
              <div className="hours-next-day-note">Closes after midnight (next day)</div>
            )}
          </SettingChildRow>
        )}

        {!sameHours && (
          <div className="hours-day-list">
            {DAYS.map(d => (
              <DayHoursRow
                key={d}
                day={d}
                start={hours[d].start}
                end={hours[d].end}
                closed={hours[d].closed}
                onChangeStart={v => updateDay(d, 'start', v)}
                onChangeEnd={v => updateDay(d, 'end', v)}
                onToggle={() => toggleDay(d)}
              />
            ))}
          </div>
        )}
      </SettingsSection>

      <SettingsSection title="Workweek" description="The workweek start day determines when weekly overtime resets.">
        <SettingValueRow label="Starts on" value={workweekStart} onChange={v => { setWorkweekStart(v); markDirty() }} options={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']} />
      </SettingsSection>
    </div>
  )
}

function DayHoursRow({ day, start, end, closed, onChangeStart, onChangeEnd, onToggle }) {
  return (
    <div className={`hours-day-row ${closed ? 'closed' : ''}`}>
      <span className="hours-day-label">{day}</span>
      {!closed ? (
        <div className="hours-day-times">
          <TimePicker value={start} onChange={onChangeStart} />
          <span className="hours-day-sep">–</span>
          <TimePicker value={end} onChange={onChangeEnd} />
          {isNextDay(start, end) && <span className="hours-next-day-badge">+1 day</span>}
        </div>
      ) : (
        <span className="hours-day-closed">Closed</span>
      )}
      <div className={`setting-toggle ${!closed ? 'on' : ''}`} onClick={onToggle}>
        <div className="setting-toggle-thumb" />
      </div>
    </div>
  )
}

// ============================================================
// CLOCK SETTINGS PAGE (was "Advanced Time Clock" — minus shared device)
// ============================================================

function ClockSettingsPage({ scopeContext }) {
  const { markDirty } = scopeContext
  const [autoClockOut, setAutoClockOut] = useState(true)
  const [clockOutTime, setClockOutTime] = useState('02:00 AM')
  const [timeRounding, setTimeRounding] = useState(true)
  const [roundMins, setRoundMins] = useState('15')

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Time Tracking</h1>
          <p className="page-subtitle">Auto clock-out, time rounding, and related settings</p>
        </div>
        <ScopeStatus scopeContext={scopeContext} settingKey="timeRounding" settingLabel="time tracking" />
      </div>

      <SettingsSection title="Auto clock-out" description="Automatically clock out workers who forget to clock out.">
        <SettingToggleRow
          label="Enable auto clock-out"
          onDescription="When on, automatically clock out workers at a set time."
          offDescription="When off, workers will not be automatically clocked out."
          enabled={autoClockOut}
          onToggle={() => { setAutoClockOut(!autoClockOut); markDirty() }}
        />
        {autoClockOut && (
          <SettingChildRow>
            <SettingValueRow
              label="Clock-out time"
              description="Workers will be clocked out at this time"
              value={clockOutTime}
              onChange={v => { setClockOutTime(v); markDirty() }}
              type="time"
            />
          </SettingChildRow>
        )}
      </SettingsSection>

      <SettingsSection title="Time rounding" description="Round clock in/out times to reduce payroll discrepancies.">
        <SettingToggleRow
          label="Enable time rounding"
          onDescription="When on, clock in/out times are rounded to the nearest interval."
          offDescription="When off, exact clock in/out times are recorded."
          enabled={timeRounding}
          onToggle={() => { setTimeRounding(!timeRounding); markDirty() }}
        />
        {timeRounding && (
          <SettingChildRow>
            <SettingValueRow
              label="Round to nearest"
              description="Clock in/out times will be rounded to this interval"
              value={roundMins}
              suffix="mins"
              type="number"
              onChange={v => { setRoundMins(v); markDirty() }}
            />
          </SettingChildRow>
        )}
      </SettingsSection>
    </div>
  )
}

// ============================================================
// SHARED DEVICE PAGE (own page now)
// ============================================================

function SharedDevicePage({ scopeContext }) {
  const { markDirty } = scopeContext
  const [biometrics, setBiometrics] = useState(true)
  const [pin, setPin] = useState('482901')
  const [pinVisible, setPinVisible] = useState(false)

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Shared Device</h1>
          <p className="page-subtitle">PIN and biometric settings for shared time clocks</p>
        </div>
      </div>

      <SettingsSection title="Security">
        <div className="pin-row">
          <div className="pin-row-text">
            <div className="ss-row-label">Manager PIN</div>
            <div className="ss-row-desc">Required to access manager functions on shared devices</div>
          </div>
          <div className="pin-field-wrapper">
            <input
              className="pin-field"
              type={pinVisible ? 'text' : 'password'}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              value={pin}
              readOnly={!pinVisible}
              onChange={e => { setPin(e.target.value.replace(/[^0-9]/g, '')); markDirty() }}
              onClick={() => { if (!pinVisible) setPinVisible(true) }}
            />
            <button
              className="pin-eye"
              type="button"
              onClick={() => setPinVisible(!pinVisible)}
              tabIndex={-1}
            >
              {pinVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <SettingToggleRow
          label="Face ID / Biometrics"
          onDescription="When on, workers can clock in using Face ID or biometrics."
          offDescription="When off, workers must use other methods to clock in."
          enabled={biometrics}
          onToggle={() => { setBiometrics(!biometrics); markDirty() }}
        />
      </SettingsSection>
    </div>
  )
}

// ============================================================
// PLACEHOLDER PAGE
// ============================================================

// ============================================================
// COMPONENT LIBRARY — interactive reference for all primitives
// ============================================================

function ComponentLibraryPage() {
  // Demo state for interactive examples
  const [demoToggle1, setDemoToggle1] = useState(true)
  const [demoToggle2, setDemoToggle2] = useState(false)
  const [demoText, setDemoText] = useState('Hello world')
  const [demoNumber, setDemoNumber] = useState('15')
  const [demoRadio, setDemoRadio] = useState('Bi-weekly')
  const [demoDropdown, setDemoDropdown] = useState('Monday')
  const [demoTime, setDemoTime] = useState('9:00 AM')
  const [demoDayOpen, setDemoDayOpen] = useState(true)
  const [demoDayStart, setDemoDayStart] = useState('9:00 AM')
  const [demoDayEnd, setDemoDayEnd] = useState('5:00 PM')
  const [demoFlag, setDemoFlag] = useState(true)
  const [demoFlagValue, setDemoFlagValue] = useState('500')
  const [demoPin, setDemoPin] = useState('482901')
  const [demoPinVisible, setDemoPinVisible] = useState(false)

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Component Library</h1>
          <p className="page-subtitle">Interactive reference of all standardized settings primitives</p>
        </div>
      </div>

      {/* ---- SETTINGS SECTION ---- */}
      <div className="lib-section">
        <h2 className="lib-heading">SettingsSection</h2>
        <p className="lib-note">
          Card wrapper that groups related setting rows. Accepts an optional <code>title</code> and <code>description</code> header.
          All setting rows go inside as children.
        </p>
        <div className="lib-demo">
          <SettingsSection title="Example Section" description="This description explains what the section controls.">
            <div className="ss-row"><div className="ss-row-text"><div className="ss-row-label">Rows go here</div><div className="ss-row-desc">Each row is a child of the section</div></div></div>
          </SettingsSection>
        </div>
      </div>

      {/* ---- TOGGLE ROW ---- */}
      <div className="lib-section">
        <h2 className="lib-heading">SettingToggleRow</h2>
        <p className="lib-note">
          A row with a label, contextual description, and a right-aligned toggle. The description changes based on the on/off state
          via <code>onDescription</code> and <code>offDescription</code>. Optional <code>value</code> prop shows a read-only summary when enabled.
        </p>
        <div className="lib-demo">
          <SettingsSection>
            <SettingToggleRow
              label="With value summary"
              onDescription="This toggle is currently enabled."
              offDescription="This toggle is currently disabled."
              enabled={demoToggle1}
              onToggle={() => setDemoToggle1(!demoToggle1)}
              value={demoToggle1 ? '9:00 AM – 5:00 PM' : ''}
            />
            <SettingToggleRow
              label="Basic toggle"
              onDescription="Feature is active — workers will be notified."
              offDescription="Feature is off — no notifications are sent."
              enabled={demoToggle2}
              onToggle={() => setDemoToggle2(!demoToggle2)}
            />
          </SettingsSection>
        </div>
      </div>

      {/* ---- VALUE ROW: TEXT ---- */}
      <div className="lib-section">
        <h2 className="lib-heading">SettingValueRow — Text Input</h2>
        <p className="lib-note">
          Editable text input. Pass <code>value</code> and <code>onChange</code>. Without <code>onChange</code>, the row is read-only.
        </p>
        <div className="lib-demo">
          <SettingsSection>
            <SettingValueRow label="Editable text" description="Click the input to change" value={demoText} onChange={setDemoText} />
            <SettingValueRow label="Read-only" description="No onChange — display only" value="Static value" />
          </SettingsSection>
        </div>
      </div>

      {/* ---- VALUE ROW: NUMBER + SUFFIX ---- */}
      <div className="lib-section">
        <h2 className="lib-heading">SettingValueRow — Number with Suffix</h2>
        <p className="lib-note">
          Pass <code>type="number"</code> and <code>suffix</code> to render a numeric input with a unit label and native stepper buttons.
        </p>
        <div className="lib-demo">
          <SettingsSection>
            <SettingValueRow label="Rounding interval" description="Clock times rounded to this value" value={demoNumber} suffix="mins" type="number" onChange={setDemoNumber} />
          </SettingsSection>
        </div>
      </div>

      {/* ---- VALUE ROW: RADIO (SHORT OPTIONS) ---- */}
      <div className="lib-section">
        <h2 className="lib-heading">SettingValueRow — Radio Buttons</h2>
        <p className="lib-note">
          When <code>options</code> has 5 or fewer items, they render as inline radio buttons.
        </p>
        <div className="lib-demo">
          <SettingsSection>
            <SettingValueRow label="Pay frequency" value={demoRadio} onChange={setDemoRadio} options={['Weekly', 'Bi-weekly', 'Semi-monthly', 'Monthly']} />
          </SettingsSection>
        </div>
      </div>

      {/* ---- VALUE ROW: DROPDOWN (LONG OPTIONS) ---- */}
      <div className="lib-section">
        <h2 className="lib-heading">SettingValueRow — Dropdown</h2>
        <p className="lib-note">
          When <code>options</code> has more than 5 items, a native <code>&lt;select&gt;</code> dropdown is used instead.
        </p>
        <div className="lib-demo">
          <SettingsSection>
            <SettingValueRow label="Starts on" value={demoDropdown} onChange={setDemoDropdown} options={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']} />
          </SettingsSection>
        </div>
      </div>

      {/* ---- VALUE ROW: TIME ---- */}
      <div className="lib-section">
        <h2 className="lib-heading">SettingValueRow — Time Picker</h2>
        <p className="lib-note">
          Pass <code>type="time"</code> to render a segmented time picker with separate hour, minute, and AM/PM fields.
          The AM/PM button toggles on click and responds to <code>a</code> / <code>p</code> keys.
        </p>
        <div className="lib-demo">
          <SettingsSection>
            <SettingValueRow label="Start time" value={demoTime} onChange={setDemoTime} type="time" />
          </SettingsSection>
        </div>
      </div>

      {/* ---- CHILD ROW ---- */}
      <div className="lib-section">
        <h2 className="lib-heading">SettingChildRow</h2>
        <p className="lib-note">
          Wraps child settings that depend on a parent toggle. Visually indented to show the dependency relationship.
          Typically rendered conditionally when the parent toggle is on.
        </p>
        <div className="lib-demo">
          <SettingsSection>
            <SettingToggleRow
              label="Parent toggle"
              onDescription="Child settings are visible below."
              offDescription="Turn on to see child settings."
              enabled={demoToggle1}
              onToggle={() => setDemoToggle1(!demoToggle1)}
            />
            {demoToggle1 && (
              <SettingChildRow>
                <SettingValueRow label="Child setting" description="Indented under the parent" value={demoNumber} suffix="mins" type="number" onChange={setDemoNumber} />
              </SettingChildRow>
            )}
          </SettingsSection>
        </div>
      </div>

      {/* ---- DAY HOURS ROW ---- */}
      <div className="lib-section">
        <h2 className="lib-heading">DayHoursRow</h2>
        <p className="lib-note">
          Per-day scheduling row with two time pickers and an open/closed toggle. Shows a <strong>+1 day</strong> badge
          when the end time wraps past midnight.
        </p>
        <div className="lib-demo">
          <SettingsSection>
            <div className="hours-day-list" style={{ borderTop: 'none' }}>
              <DayHoursRow
                day="Mon"
                start={demoDayStart}
                end={demoDayEnd}
                closed={!demoDayOpen}
                onChangeStart={setDemoDayStart}
                onChangeEnd={setDemoDayEnd}
                onToggle={() => setDemoDayOpen(!demoDayOpen)}
              />
            </div>
          </SettingsSection>
          <p className="lib-hint">Try setting the end time earlier than the start to see the +1 day badge.</p>
        </div>
      </div>

      {/* ---- FLAG ROW ---- */}
      <div className="lib-section">
        <h2 className="lib-heading">Flag Row</h2>
        <p className="lib-note">
          Used for shift flags. Each row has a name, description, an optional configurable threshold, and a right-aligned toggle.
          When disabled, the condition input becomes read-only and the row dims.
        </p>
        <div className="lib-demo">
          <SettingsSection>
            <div className="flag-row">
              <div className={`flag-row-content ${!demoFlag ? 'disabled' : ''}`}>
                <div className="flag-row-name">Clock in/out too far from work location</div>
                <div className="flag-row-desc">Flag when a worker clocks in or out beyond the allowed distance.</div>
                <div className="flag-row-condition">
                  <span className="flag-row-condition-label">Flag when distance exceeds</span>
                  {demoFlag ? (
                    <input className="flag-row-condition-input" type="number" value={demoFlagValue} onChange={e => setDemoFlagValue(e.target.value)} min="0" />
                  ) : (
                    <span className="flag-row-condition-value">{demoFlagValue}</span>
                  )}
                  <span className="flag-row-condition-unit">feet</span>
                </div>
              </div>
              <div className={`setting-toggle ${demoFlag ? 'on' : ''}`} onClick={() => setDemoFlag(!demoFlag)}>
                <div className="setting-toggle-thumb" />
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>

      {/* ---- PIN ROW ---- */}
      <div className="lib-section">
        <h2 className="lib-heading">PIN Field</h2>
        <p className="lib-note">
          Sensitive value with an inline eye icon to toggle visibility. While hidden, the field is read-only and
          shows dots. Click the eye (or click the field) to reveal and enable editing. Accepts 4–8 numeric digits.
        </p>
        <div className="lib-demo">
          <SettingsSection>
            <div className="pin-row">
              <div className="pin-row-text">
                <div className="ss-row-label">Manager PIN</div>
                <div className="ss-row-desc">Required to access manager functions</div>
              </div>
              <div className="pin-field-wrapper">
                <input
                  className="pin-field"
                  type={demoPinVisible ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  value={demoPin}
                  readOnly={!demoPinVisible}
                  onChange={e => setDemoPin(e.target.value.replace(/[^0-9]/g, ''))}
                  onClick={() => { if (!demoPinVisible) setDemoPinVisible(true) }}
                />
                <button className="pin-eye" type="button" onClick={() => setDemoPinVisible(!demoPinVisible)} tabIndex={-1}>
                  {demoPinVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>

      {/* ---- SAVE FLOW ---- */}
      <div className="lib-section">
        <h2 className="lib-heading">Save Flow</h2>
        <p className="lib-note">
          Three components work together for the page-level save mechanism:
        </p>
        <ul className="lib-list">
          <li><strong>UnsavedChangesBar</strong> — sticky bottom bar that appears when the page is dirty. "Discard" reverts, "Save" commits.</li>
          <li><strong>SaveChangesModal</strong> — intercepts navigation away from a dirty page. Offers "Go back", "Discard", or "Save and continue".</li>
          <li><strong>SaveToast</strong> — temporary confirmation shown after a successful save.</li>
        </ul>
        <p className="lib-note">
          Any setting change calls <code>markDirty()</code> from <code>scopeContext</code>. The <code>SettingsScreen</code> orchestrates all three.
          To trigger the bar, edit any value on a real settings page.
        </p>
      </div>

      {/* ---- SCOPE STATUS ---- */}
      <div className="lib-section">
        <h2 className="lib-heading">ScopeStatus</h2>
        <p className="lib-note">
          Inheritance badge shown in each page header. Displays where the current setting comes from in the
          Company → Policy Group → Location cascade. Variants:
        </p>
        <ul className="lib-list">
          <li><strong>Company scope</strong> — no badge (you're editing the base).</li>
          <li><strong>Group scope, overriding</strong> — shows "<em>[Group] policy override</em>".</li>
          <li><strong>Group scope, inheriting</strong> — shows "Using company default".</li>
          <li><strong>Location scope, custom</strong> — shows "Custom for [Location]" with a <strong>Change</strong> button that opens the <code>AlignSettingsModal</code>.</li>
          <li><strong>Location scope, from group</strong> — shows "From [Group] policy" with an "Edit policy" link.</li>
          <li><strong>Location scope, from company</strong> — shows "Company default" with an "Edit default" link.</li>
        </ul>
        <p className="lib-note">Switch the scope picker in the sidebar to see different variants in action on any settings page.</p>
      </div>

      {/* ---- COMPLIANCE MODULE ---- */}
      <div className="lib-section">
        <h2 className="lib-heading">ComplianceModule</h2>
        <p className="lib-note">
          Three-state compliance indicator used on Breaks and Overtime pages:
        </p>
        <ul className="lib-list">
          <li><strong>Empty</strong> — first-time setup prompt with auto-apply button and legal reference.</li>
          <li><strong>Compliant</strong> — green checkmark with confirmation message.</li>
          <li><strong>Warning</strong> — red alert with description of what's missing and a fix button.</li>
        </ul>
        <p className="lib-note">Navigate to Breaks or Overtime to see these in context.</p>
      </div>

    </div>
  )
}

function PlaceholderPage({ title }) {
  return (
    <div className="placeholder-page">
      <Construction size={48} />
      <h2>{title}</h2>
      <p>Coming soon...</p>
    </div>
  )
}

// ============================================================
// STANDARDIZED SETTING COMPONENTS
// ============================================================

/*
 * SettingsSection — a card that groups related setting rows.
 * Optional title/description header.
 */
function SettingsSection({ title, description, children }) {
  return (
    <div className="ss-card">
      {title && (
        <div className="ss-card-header">
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
      )}
      <div className="ss-card-rows">{children}</div>
    </div>
  )
}

/* SettingChildRow — visually indented child setting, dependent on parent toggle */
function SettingChildRow({ children }) {
  return <div className="ss-child-row">{children}</div>
}

/*
 * SettingToggleRow — a row with label + description + toggle (right-aligned).
 * Optionally shows a read-only value summary when enabled.
 */
function SettingToggleRow({ label, description, onDescription, offDescription, enabled, onToggle, value }) {
  const displayDescription = enabled ? (onDescription || description) : (offDescription || description)

  return (
    <div className="ss-row">
      <div className="ss-row-text">
        <div className="ss-row-label">{label}</div>
        {displayDescription && <div className="ss-row-desc">{displayDescription}</div>}
      </div>
      {enabled && value && (
        <span className="ss-row-value">{value}</span>
      )}
      <div className={`setting-toggle ${enabled ? 'on' : ''}`} onClick={onToggle}>
        <div className="setting-toggle-thumb" />
      </div>
    </div>
  )
}

/*
 * SettingValueRow — a row with a directly-visible input.
 * Short option lists (≤5) render as radio buttons; longer lists as dropdowns.
 * Numeric values with a suffix render as input + unit label.
 */
function SettingValueRow({ label, description, value, onChange, options, suffix, type, placeholder }) {
  // Read-only (no onChange)
  if (!onChange) {
    return (
      <div className="ss-row">
        <div className="ss-row-text">
          <div className="ss-row-label">{label}</div>
          {description && <div className="ss-row-desc">{description}</div>}
        </div>
        <span className="ss-row-value">{suffix ? `${value} ${suffix}` : (value || placeholder || '')}</span>
      </div>
    )
  }

  // Short options → inline radio group
  if (options && options.length <= 5) {
    return (
      <div className="ss-row ss-row-stacked">
        <div className="ss-row-text">
          <div className="ss-row-label">{label}</div>
          {description && <div className="ss-row-desc">{description}</div>}
        </div>
        <div className="ss-radio-group">
          {options.map(o => (
            <label key={o} className="ss-radio-option" onClick={() => onChange(o)}>
              <div className={`radio-circle ${value === o ? 'selected' : ''}`}>
                {value === o && <div className="radio-dot" />}
              </div>
              <span>{o}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  // Long options → dropdown
  if (options) {
    return (
      <div className="ss-row">
        <div className="ss-row-text">
          <div className="ss-row-label">{label}</div>
          {description && <div className="ss-row-desc">{description}</div>}
        </div>
        <select className="ss-select" value={value} onChange={e => onChange(e.target.value)}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    )
  }

  // Time picker (segmented hour:minute AM/PM)
  if (type === 'time') {
    return (
      <div className="ss-row">
        <div className="ss-row-text">
          <div className="ss-row-label">{label}</div>
          {description && <div className="ss-row-desc">{description}</div>}
        </div>
        <TimePicker value={value} onChange={onChange} />
      </div>
    )
  }

  // Text/number input with optional suffix
  return (
    <div className="ss-row">
      <div className="ss-row-text">
        <div className="ss-row-label">{label}</div>
        {description && <div className="ss-row-desc">{description}</div>}
      </div>
      <div className="ss-input-group">
        <input
          className="ss-input"
          type={type || 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {suffix && <span className="ss-input-suffix">{suffix}</span>}
      </div>
    </div>
  )
}

// ============================================================
// TIME PICKER — segmented hour : minute  AM/PM
// ============================================================

function TimePicker({ value, onChange }) {
  // Parse "9:00 AM" or "02:00 AM" into parts
  const match = value?.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  const hour = match ? parseInt(match[1]) : 12
  const minute = match ? parseInt(match[2]) : 0
  const period = match ? match[3].toUpperCase() : 'AM'

  const emit = (h, m, p) => {
    onChange(`${h}:${String(m).padStart(2, '0')} ${p}`)
  }

  return (
    <div className="time-picker">
      <input
        className="time-picker-field"
        type="number"
        min={1}
        max={12}
        value={hour}
        onChange={e => {
          let h = parseInt(e.target.value)
          if (isNaN(h)) return
          emit(Math.max(1, Math.min(12, h)), minute, period)
        }}
      />
      <span className="time-picker-sep">:</span>
      <input
        className="time-picker-field time-picker-minute"
        type="number"
        min={0}
        max={59}
        value={String(minute).padStart(2, '0')}
        onChange={e => {
          let m = parseInt(e.target.value)
          if (isNaN(m)) return
          emit(hour, Math.max(0, Math.min(59, m)), period)
        }}
      />
      <button
        className={`time-picker-period ${period === 'AM' ? 'am' : 'pm'}`}
        onClick={() => emit(hour, minute, period === 'AM' ? 'PM' : 'AM')}
        onKeyDown={e => {
          if (e.key.toLowerCase() === 'a') { e.preventDefault(); emit(hour, minute, 'AM') }
          if (e.key.toLowerCase() === 'p') { e.preventDefault(); emit(hour, minute, 'PM') }
        }}
        type="button"
      >
        {period}
      </button>
    </div>
  )
}

// ============================================================
// OTHER SHARED COMPONENTS
// ============================================================

function OvertimeRow({ label, desc, value, rate }) {
  return (
    <div className="overtime-row default">
      <div className="overtime-row-text">
        <h4>{label}</h4>
        <p>{desc}</p>
      </div>
      <div className={`overtime-value ${!value ? 'unset' : ''}`}>
        {value || 'Not set'}
        {value && <span className="multiplier-badge">{rate}</span>}
      </div>
    </div>
  )
}

function InfoBanner({ text }) {
  return (
    <div className="info-banner">
      <Info size={20} className="icon" />
      <p>{text}</p>
    </div>
  )
}
