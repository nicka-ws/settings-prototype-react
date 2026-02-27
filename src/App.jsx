import { useState, useRef, useEffect } from 'react'
import {
  MessageCircle, CheckSquare, Users, UserPlus, Clock, Umbrella, StickyNote,
  DollarSign, Settings, Droplets, Building2, MapPin, AlertTriangle, Info,
  CircleCheck, CircleX, Coffee, Timer, Shield, Map, Wand2, Flag, Plus,
  ChevronRight, Pin, Scan, Lightbulb, Construction, CalendarDays, Tablet,
  TriangleAlert, X, Check, ArrowRight, Sparkles, CircleAlert, ChevronDown,
  RotateCcw, Trash2, ChevronLeft, ToggleLeft, ToggleRight, Search,
  FileText, Eye, EyeOff, Lock, LockOpen
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
// SHARED PAGE CONSTANTS (hoisted — used by DEFAULT_PAGE_VALUES and pages below)
// ============================================================

const DEFAULT_BREAK_RULES_CONST = [
  { id: 1, name: 'Meal Break', roles: [], type: 'Unpaid', shiftDuration: '5', breakDuration: '30', earliest: '5', latest: '6', required: true, waivable: false, allowEarlyEnd: false, sendReminder: false, reminderMins: '10' },
  { id: 2, name: 'Rest Break', roles: [], type: 'Paid', shiftDuration: '4', breakDuration: '10', earliest: '3', latest: '4.5', required: true, waivable: false, allowEarlyEnd: true, sendReminder: true, reminderMins: '5' },
]

const DEFAULT_FLAGS_CONST = [
  { id: 'far_location', name: 'Clock in/out too far from work location', description: 'Flag when a worker clocks in or out beyond the allowed distance from the store.', enabled: true, conditionLabel: 'Flag when distance exceeds', conditionValue: '500', conditionUnit: 'feet' },
  { id: 'long_shift', name: 'Shift exceeds maximum duration', description: 'Flag shifts that run longer than the allowed threshold.', enabled: true, conditionLabel: 'Flag when shift exceeds', conditionValue: '9', conditionUnit: 'hrs' },
  { id: 'clock_in_location_missing', name: 'Clock-in location not captured', description: 'Flag when GPS or location data is unavailable at clock-in.', enabled: true, conditionLabel: null, conditionValue: null, conditionUnit: null },
  { id: 'clock_out_location_missing', name: 'Clock-out location not captured', description: 'Flag when GPS or location data is unavailable at clock-out.', enabled: true, conditionLabel: null, conditionValue: null, conditionUnit: null },
  { id: 'break_end_missing', name: 'Break not ended', description: 'Flag when a worker starts a break but never records ending it.', enabled: true, conditionLabel: null, conditionValue: null, conditionUnit: null },
  { id: 'clock_out_missing', name: 'Missing clock-out', description: 'Flag when a worker clocks in but never clocks out.', enabled: false, conditionLabel: null, conditionValue: null, conditionUnit: null },
]

// ============================================================
// SETTINGS SCREEN
// ============================================================

// Default state shapes for each page — used to initialize a fresh scope
const DEFAULT_PAGE_VALUES = {
  breaks:           { rules: [], hasBreakRules: false },
  overtime:         { configured: false, weeklyHrs: '40', dailyHrs: '0', doubleHrs: '0' },
  pay_schedule:     { frequency: 'Bi-weekly', periodStart: 'Feb 1, 2026', startTime: '12:00 AM' },
  scheduling_hours: { sameHours: true, sharedStart: '9:00 AM', sharedEnd: '5:00 PM', workweekStart: 'Monday',
                      hours: Object.fromEntries(['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => [d,
                        d === 'Sat' || d === 'Sun' ? { start: '9:00 AM', end: '5:00 PM', closed: true }
                                                  : { start: '9:00 AM', end: '5:00 PM', closed: false }
                      ])) },
  shift_enforcement:{ earlyClockIn: false, earlyMins: '', geofence: true },
  shifts_and_flags: { openShifts: false, visibility: 'roles', flags: DEFAULT_FLAGS_CONST },
  clock_settings:   { autoClockOut: true, clockOutTime: '02:00 AM', timeRounding: true, roundMins: '15' },
  shared_device:    { biometrics: true, pin: '482901' },
}

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

  // Scope ID helper — key for all scope-keyed maps
  const getScopeId = () => selectedScope.type === 'company' ? 'company' : selectedScope.id

  // ── Per-scope saved values ──────────────────────────────────────────
  // savedValues[scopeId][pageId] = last explicitly saved snapshot
  // workingValues[scopeId][pageId] = live form state (synced by each page)
  const [savedValues, setSavedValues] = useState({})
  const [workingValues, setWorkingValues] = useState({})

  // Called by each page on every state change to keep parent in sync
  const syncValues = (pageId, values) => {
    const scopeId = getScopeId()
    setWorkingValues(prev => ({
      ...prev,
      [scopeId]: { ...(prev[scopeId] || {}), [pageId]: values }
    }))
  }

  // Resolve inherited values for a page by walking up the scope chain:
  // location → its group → company → hardcoded defaults
  const resolveInheritedValues = (pageId) => {
    if (isLocationScope && selectedGroup) {
      // Location inherits from its group, which inherits from company
      return (
        savedValues[selectedGroup.id]?.[pageId] ??
        savedValues['company']?.[pageId] ??
        DEFAULT_PAGE_VALUES[pageId]
      )
    }
    if (isGroupScope) {
      return savedValues['company']?.[pageId] ?? DEFAULT_PAGE_VALUES[pageId]
    }
    return DEFAULT_PAGE_VALUES[pageId]
  }

  // Get initial values for a page in the current scope.
  // If the scope has its own saved values, use those.
  // Otherwise fall back through the parent chain (cascading inheritance).
  const getInitialValues = (pageId) => {
    const scopeId = getScopeId()
    return savedValues[scopeId]?.[pageId] ?? resolveInheritedValues(pageId)
  }

  // ── Lock state ──────────────────────────────────────────────────────
  const [lockedPages, setLockedPages] = useState({})

  const _getLockKey = (settingKey) => `${getScopeId()}:${settingKey}`

  const isPageLocked = (settingKey) => {
    if (isCompanyScope) return false
    const key = _getLockKey(settingKey)
    if (key in lockedPages) return lockedPages[key]
    if (isGroupScope) return !selectedGroup?.overrides?.[settingKey]
    if (isLocationScope) return !selectedLocation?.overrides?.[settingKey]
    return true
  }

  const setPageLocked = (settingKey, locked) => {
    const key = _getLockKey(settingKey)
    setLockedPages(prev => ({ ...prev, [key]: locked }))
    if (locked) setIsDirty(false)
  }

  // ── Compliance (derived from saved breaks/overtime per scope) ───────
  const scopeId = getScopeId()
  const savedBreaks = savedValues[scopeId]?.breaks
  const savedOvertime = savedValues[scopeId]?.overtime
  const hasBreakRules = (savedBreaks?.hasBreakRules) || (savedBreaks?.rules?.length > 0) || false
  const hasOvertimeConfig = savedOvertime?.configured || false
  const isCompliant = hasBreakRules && hasOvertimeConfig

  // ── Dirty / nav state ───────────────────────────────────────────────
  const [isDirty, setIsDirty] = useState(false)
  const [pendingNav, setPendingNav] = useState(null)
  const [showToast, setShowToast] = useState(false)
  // discardKey: incrementing this remounts ContentRouter, resetting pages to saved values
  const [discardKey, setDiscardKey] = useState(0)
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
    if (isDirty) { setPendingNav({ cat, itm }); return }
    setCategory(cat)
    setItem(itm)
  }

  const handleSave = () => {
    // Snapshot working → saved for the current scope
    const sid = getScopeId()
    setSavedValues(prev => ({
      ...prev,
      [sid]: { ...(prev[sid] || {}), ...(workingValues[sid] || {}) }
    }))
    markClean()
    triggerToast()
  }

  const handleDiscardInPlace = () => {
    // Increment discardKey to remount ContentRouter, pages re-init from saved values
    setDiscardKey(k => k + 1)
    markClean()
  }

  const handleSaveAndContinue = () => {
    handleSave()
    if (pendingNav) { setCategory(pendingNav.cat); setItem(pendingNav.itm); setPendingNav(null) }
  }

  const handleDiscard = () => {
    setDiscardKey(k => k + 1)
    markClean()
    if (pendingNav) { setCategory(pendingNav.cat); setItem(pendingNav.itm); setPendingNav(null) }
  }

  const handleGoBack = () => { setPendingNav(null) }

  // Compliance wizard apply — also writes into saved + working values
  const handleApplyBreaks = () => {
    const sid = getScopeId()
    const v = { rules: DEFAULT_BREAK_RULES_CONST, hasBreakRules: true }
    setSavedValues(prev => ({ ...prev, [sid]: { ...(prev[sid] || {}), breaks: v } }))
    setWorkingValues(prev => ({ ...prev, [sid]: { ...(prev[sid] || {}), breaks: v } }))
    setDiscardKey(k => k + 1) // remount breaks page with new saved values
  }
  const handleApplyOvertime = () => {
    const sid = getScopeId()
    const v = { configured: true, weeklyHrs: '40', dailyHrs: '8', doubleHrs: '12' }
    setSavedValues(prev => ({ ...prev, [sid]: { ...(prev[sid] || {}), overtime: v } }))
    setWorkingValues(prev => ({ ...prev, [sid]: { ...(prev[sid] || {}), overtime: v } }))
    setDiscardKey(k => k + 1)
  }
  const handleApplyAll = () => { handleApplyBreaks(); handleApplyOvertime() }

  const scopeContext = {
    selectedScope,
    isCompanyScope,
    isGroupScope,
    isLocationScope,
    selectedGroup,
    selectedLocation,
    markDirty,
    onChangeScope: setSelectedScope,
    isPageLocked,
    setPageLocked,
    syncValues,
    getInitialValues,
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
        {!isCompliant && (
          <div className="compliance-banner" onClick={() => setShowComplianceWizard(true)}>
            <div className="compliance-banner-left">
              <CircleAlert size={16} />
              <div className="compliance-banner-text">
                <strong>Compliance issues detected</strong>
                <span>Your settings may not comply with state labor law. Review {
                  !hasBreakRules && !hasOvertimeConfig ? 'break rules and overtime thresholds'
                  : !hasBreakRules ? 'break rules' : 'overtime thresholds'
                } to fix.</span>
              </div>
            </div>
            <span className="compliance-banner-action">Fix now <ArrowRight size={14} /></span>
          </div>
        )}

        <div className="content-scroll">
          <ContentRouter
            key={`${getScopeId()}-${discardKey}`}
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
      { id: 'design_reference', label: 'Design reference' },
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

// All pages are rendered simultaneously; inactive ones are hidden with display:none.
// This keeps their state alive while navigating between pages within the same scope.
// The parent's key prop (scopeId + discardKey) remounts everything on scope change or discard.
function ContentRouter({ category, item, scopeContext, hasBreakRules, hasOvertimeConfig, onApplyBreaks, onApplyOvertime }) {
  const sc = scopeContext
  const is = (c, i) => category === c && item === i

  // Pages that have a real implementation
  const PAGES = [
    { cat: 'scheduling',  id: 'breaks' },
    { cat: 'scheduling',  id: 'overtime' },
    { cat: 'scheduling',  id: 'scheduling_hours' },
    { cat: 'scheduling',  id: 'shifts_and_flags' },
    { cat: 'time_clock',  id: 'shift_enforcement' },
    { cat: 'time_clock',  id: 'clock_settings' },
    { cat: 'time_clock',  id: 'shared_device' },
    { cat: 'payroll',     id: 'pay_schedule' },
    { cat: 'reference',   id: 'design_reference' },
  ]

  const isKnown = PAGES.some(p => is(p.cat, p.id))

  return (
    <>
      <div style={{ display: is('scheduling','breaks') ? 'contents' : 'none' }}>
        <BreaksPage hasBreakRules={hasBreakRules} onApply={onApplyBreaks} scopeContext={sc} />
      </div>
      <div style={{ display: is('scheduling','overtime') ? 'contents' : 'none' }}>
        <OvertimePage hasOvertimeConfig={hasOvertimeConfig} onApply={onApplyOvertime} scopeContext={sc} />
      </div>
      <div style={{ display: is('scheduling','scheduling_hours') ? 'contents' : 'none' }}>
        <SchedulingHoursPage scopeContext={sc} />
      </div>
      <div style={{ display: is('scheduling','shifts_and_flags') ? 'contents' : 'none' }}>
        <ShiftsAndFlagsPage scopeContext={sc} />
      </div>
      <div style={{ display: is('time_clock','shift_enforcement') ? 'contents' : 'none' }}>
        <ShiftEnforcementPage scopeContext={sc} />
      </div>
      <div style={{ display: is('time_clock','clock_settings') ? 'contents' : 'none' }}>
        <ClockSettingsPage scopeContext={sc} />
      </div>
      <div style={{ display: is('time_clock','shared_device') ? 'contents' : 'none' }}>
        <SharedDevicePage scopeContext={sc} />
      </div>
      <div style={{ display: is('payroll','pay_schedule') ? 'contents' : 'none' }}>
        <PaySchedulePage scopeContext={sc} />
      </div>
      <div style={{ display: category === 'payroll' && item !== 'pay_schedule' ? 'contents' : 'none' }}>
        <PlaceholderPage title="Payroll integration" />
      </div>
      <div style={{ display: is('reference','design_reference') ? 'contents' : 'none' }}>
        <DesignReferencePage />
      </div>
      {!isKnown && category !== 'payroll' && category !== 'reference' && (
        <PlaceholderPage title={item.replace(/_/g, ' ')} />
      )}
    </>
  )
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

// ============================================================
// OVERRIDE LOCK — replaces ScopeStatus badge in every page header
// ============================================================

function OverrideLock({ settingKey, scopeContext }) {
  const { isCompanyScope, isGroupScope, isLocationScope, selectedGroup, selectedLocation, isPageLocked, setPageLocked } = scopeContext
  const [pendingAction, setPendingAction] = useState(null) // 'customize' | 'revert'

  if (isCompanyScope) return null

  const locked = isPageLocked(settingKey)

  const parentLabel = isLocationScope
    ? (selectedGroup ? `${selectedGroup.name} policy` : 'Company default')
    : 'Company default'

  const scopeLabel = isGroupScope
    ? selectedGroup?.name
    : selectedLocation?.name

  const handleConfirm = () => {
    if (pendingAction === 'customize') setPageLocked(settingKey, false)
    if (pendingAction === 'revert') setPageLocked(settingKey, true)
    setPendingAction(null)
  }

  return (
    <>
      {locked ? (
        <div className="override-lock locked">
          <Lock size={13} />
          <span>Locked to {parentLabel}</span>
          <button className="override-lock-action-btn" onClick={() => setPendingAction('customize')}>
            Customize
          </button>
        </div>
      ) : (
        <div className="override-lock unlocked">
          <LockOpen size={13} />
          <span>Custom for {scopeLabel}</span>
          <button className="override-lock-revert" onClick={() => setPendingAction('revert')}>
            <RotateCcw size={11} /> Revert
          </button>
        </div>
      )}

      {pendingAction === 'customize' && (
        <OverrideLockModal
          action="customize"
          parentLabel={parentLabel}
          scopeLabel={scopeLabel}
          onConfirm={handleConfirm}
          onCancel={() => setPendingAction(null)}
        />
      )}

      {pendingAction === 'revert' && (
        <OverrideLockModal
          action="revert"
          parentLabel={parentLabel}
          scopeLabel={scopeLabel}
          onConfirm={handleConfirm}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </>
  )
}

function OverrideLockModal({ action, parentLabel, scopeLabel, onConfirm, onCancel }) {
  const isCustomize = action === 'customize'

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="override-lock-modal" onClick={e => e.stopPropagation()}>
        <div className={`override-lock-modal-icon ${isCustomize ? 'customize' : 'revert'}`}>
          {isCustomize ? <LockOpen size={20} /> : <Lock size={20} />}
        </div>

        {isCustomize ? (
          <>
            <h3>Customize for {scopeLabel}?</h3>
            <p>
              This will create a <strong>custom override</strong> for <strong>{scopeLabel}</strong>, breaking its
              inheritance from <strong>{parentLabel}</strong>. Any changes you save here will only apply to this scope
              and won't affect other regions or locations.
            </p>
            <p className="override-lock-modal-note">
              You can always revert back to {parentLabel} later.
            </p>
          </>
        ) : (
          <>
            <h3>Revert to {parentLabel}?</h3>
            <p>
              This will remove the custom override for <strong>{scopeLabel}</strong> and restore inheritance
              from <strong>{parentLabel}</strong>. Any unsaved changes on this page will be discarded.
            </p>
            <p className="override-lock-modal-note">
              Other regions or locations that inherit from {parentLabel} are not affected.
            </p>
          </>
        )}

        <div className="override-lock-modal-actions">
          <button className="override-lock-modal-cancel" onClick={onCancel}>Cancel</button>
          <button
            className={`override-lock-modal-confirm ${isCustomize ? 'customize' : 'revert'}`}
            onClick={onConfirm}
          >
            {isCustomize ? 'Customize' : 'Revert to default'}
          </button>
        </div>
      </div>
    </div>
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

const DEFAULT_BREAK_RULES = DEFAULT_BREAK_RULES_CONST

function BreaksPage({ hasBreakRules, onApply, scopeContext }) {
  const { markDirty, isPageLocked, syncValues, getInitialValues } = scopeContext
  const locked = isPageLocked('breaks')
  const init = getInitialValues('breaks')
  const [rules, setRules] = useState(init.rules)
  const [editingRule, setEditingRule] = useState(null)
  const [wasEverCompliant, setWasEverCompliant] = useState(init.hasBreakRules || init.rules.length > 0)

  useEffect(() => { syncValues('breaks', { rules, hasBreakRules: rules.length > 0 }) }, [rules])

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
        <OverrideLock settingKey="breaks" scopeContext={scopeContext} />
      </div>

      <div className={locked ? 'form-locked' : ''}>
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
              <BreakRuleRow key={rule.id} rule={rule} onClick={() => !locked && setEditingRule(rule)} />
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
  const { markDirty, isPageLocked, syncValues, getInitialValues } = scopeContext
  const locked = isPageLocked('overtime')
  const init = getInitialValues('overtime')
  const [configured, setConfigured] = useState(init.configured)
  const [weeklyHrs, setWeeklyHrs] = useState(init.weeklyHrs)
  const [dailyHrs, setDailyHrs] = useState(init.dailyHrs)
  const [doubleHrs, setDoubleHrs] = useState(init.doubleHrs)

  useEffect(() => { syncValues('overtime', { configured, weeklyHrs, dailyHrs, doubleHrs }) }, [configured, weeklyHrs, dailyHrs, doubleHrs])

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
        <OverrideLock settingKey="overtime" scopeContext={scopeContext} />
      </div>

      <div className={locked ? 'form-locked' : ''}>
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
    </div>
  )
}

// ============================================================
// SHIFT ENFORCEMENT PAGE
// ============================================================

function ShiftEnforcementPage({ scopeContext }) {
  const { markDirty, isPageLocked, syncValues, getInitialValues } = scopeContext
  const locked = isPageLocked('earlyClockIn')
  const init = getInitialValues('shift_enforcement')
  const [earlyClockIn, setEarlyClockIn] = useState(init.earlyClockIn)
  const [earlyMins, setEarlyMins] = useState(init.earlyMins)
  const [geofence, setGeofence] = useState(init.geofence)

  useEffect(() => { syncValues('shift_enforcement', { earlyClockIn, earlyMins, geofence }) }, [earlyClockIn, earlyMins, geofence])

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Shift Enforcement</h1>
          <p className="page-subtitle">Control when and where workers can clock in</p>
        </div>
        <OverrideLock settingKey="earlyClockIn" scopeContext={scopeContext} />
      </div>

      <div className={locked ? 'form-locked' : ''}>
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
    </div>
  )
}

// ============================================================
// SHIFTS & FLAGS PAGE (was "Advanced Scheduling")
// ============================================================

const DEFAULT_FLAGS = DEFAULT_FLAGS_CONST

function ShiftsAndFlagsPage({ scopeContext }) {
  const { markDirty, isPageLocked, syncValues, getInitialValues } = scopeContext
  const locked = isPageLocked('shiftsFlags')
  const init = getInitialValues('shifts_and_flags')
  const [openShifts, setOpenShifts] = useState(init.openShifts)
  const [visibility, setVisibility] = useState(init.visibility)
  const [flags, setFlags] = useState(init.flags)

  useEffect(() => { syncValues('shifts_and_flags', { openShifts, visibility, flags }) }, [openShifts, visibility, flags])

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
        <OverrideLock settingKey="shiftsFlags" scopeContext={scopeContext} />
      </div>

      <div className={locked ? 'form-locked' : ''}>
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
    </div>
  )
}



// ============================================================
// PAY SCHEDULE PAGE (now under Payroll)
// ============================================================

function PaySchedulePage({ scopeContext }) {
  const { markDirty, isPageLocked, syncValues, getInitialValues } = scopeContext
  const locked = isPageLocked('paySchedule')
  const init = getInitialValues('pay_schedule')
  const [frequency, setFrequency] = useState(init.frequency)
  const [periodStart, setPeriodStart] = useState(init.periodStart)
  const [startTime, setStartTime] = useState(init.startTime)

  useEffect(() => { syncValues('pay_schedule', { frequency, periodStart, startTime }) }, [frequency, periodStart, startTime])

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Pay Schedule</h1>
          <p className="page-subtitle">Configure pay periods and frequency</p>
        </div>
        <OverrideLock settingKey="paySchedule" scopeContext={scopeContext} />
      </div>

      <div className={locked ? 'form-locked' : ''}>
        <SettingsSection title="Pay period">
          <SettingValueRow label="Pay frequency" value={frequency} onChange={v => { setFrequency(v); markDirty() }} options={['Weekly', 'Bi-weekly', 'Semi-monthly', 'Monthly']} />
          <SettingValueRow label="Current period starts" value={periodStart} onChange={v => { setPeriodStart(v); markDirty() }} />
          <SettingValueRow label="Start time" value={startTime} onChange={v => { setStartTime(v); markDirty() }} type="time" />
        </SettingsSection>
      </div>
    </div>
  )
}

// ============================================================
// HOURS & WORKWEEK PAGE
// ============================================================

function SchedulingHoursPage({ scopeContext }) {
  const { markDirty, isPageLocked, syncValues, getInitialValues } = scopeContext
  const locked = isPageLocked('operatingHours')
  const init = getInitialValues('scheduling_hours')
  const [workweekStart, setWorkweekStart] = useState(init.workweekStart)
  const [sameHours, setSameHours] = useState(init.sameHours)
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const [sharedStart, setSharedStart] = useState(init.sharedStart)
  const [sharedEnd, setSharedEnd] = useState(init.sharedEnd)

  const [hours, setHours] = useState(init.hours)

  useEffect(() => { syncValues('scheduling_hours', { sameHours, sharedStart, sharedEnd, workweekStart, hours }) }, [sameHours, sharedStart, sharedEnd, workweekStart, hours])

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
        <OverrideLock settingKey="operatingHours" scopeContext={scopeContext} />
      </div>

      <div className={locked ? 'form-locked' : ''}>
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
  const { markDirty, isPageLocked, syncValues, getInitialValues } = scopeContext
  const locked = isPageLocked('timeRounding')
  const init = getInitialValues('clock_settings')
  const [autoClockOut, setAutoClockOut] = useState(init.autoClockOut)
  const [clockOutTime, setClockOutTime] = useState(init.clockOutTime)
  const [timeRounding, setTimeRounding] = useState(init.timeRounding)
  const [roundMins, setRoundMins] = useState(init.roundMins)

  useEffect(() => { syncValues('clock_settings', { autoClockOut, clockOutTime, timeRounding, roundMins }) }, [autoClockOut, clockOutTime, timeRounding, roundMins])

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Time Tracking</h1>
          <p className="page-subtitle">Auto clock-out, time rounding, and related settings</p>
        </div>
        <OverrideLock settingKey="timeRounding" scopeContext={scopeContext} />
      </div>

      <div className={locked ? 'form-locked' : ''}>
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
    </div>
  )
}

// ============================================================
// SHARED DEVICE PAGE (own page now)
// ============================================================

function SharedDevicePage({ scopeContext }) {
  const { markDirty, syncValues, getInitialValues } = scopeContext
  const init = getInitialValues('shared_device')
  const [biometrics, setBiometrics] = useState(init.biometrics)
  const [pin, setPin] = useState(init.pin)
  const [pinVisible, setPinVisible] = useState(false)

  useEffect(() => { syncValues('shared_device', { biometrics, pin }) }, [biometrics, pin])

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

function DesignReferencePage() {
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
          <h1 className="page-title">Design Reference</h1>
          <p className="page-subtitle">Architecture, interaction patterns, data models, and component API for the settings redesign</p>
        </div>
      </div>

      {/* ================================================================
          SECTION 1: NAVIGATION MODEL
          ================================================================ */}
      <div className="lib-section">
        <h2 className="lib-heading">1. Navigation Model</h2>
        <p className="lib-note">
          The application uses a <strong>two-mode architecture</strong>: a main app shell and a focused settings mode. These are mutually exclusive views — you are either in the main app or in settings, never both.
        </p>

        <h3 className="lib-subheading">Entry &amp; Exit</h3>
        <ul className="lib-list">
          <li><strong>Enter settings</strong> — click the <em>Settings</em> button at the bottom of the main app sidebar. This replaces the main content area with the settings experience.</li>
          <li><strong>Exit settings</strong> — click the <em>Back</em> button in the settings nav header. This returns to the main app, restoring the previous view.</li>
        </ul>

        <h3 className="lib-subheading">Why Two Modes?</h3>
        <p className="lib-note">
          Settings is conceptually separate from day-to-day workflows (scheduling, messaging, etc.). A dedicated mode reduces cognitive load — the user knows they are in "configuration" context, not "operational" context. It also frees up the full sidebar for settings navigation without competing with the main nav.
        </p>

        <h3 className="lib-subheading">Scope Picker Placement</h3>
        <p className="lib-note">
          The scope picker (Company / Policy Group / Location) lives in the settings sidebar, not in the content area or a toolbar. This is intentional: scope selection is a <strong>navigation-level concern</strong> — changing scope affects every settings page, so it belongs alongside page navigation. It also keeps the content area focused purely on the settings being edited.
        </p>

        <h3 className="lib-subheading">Implementation Notes</h3>
        <ul className="lib-list">
          <li><code>App</code> manages <code>inSettings</code> boolean state. When <code>true</code>, renders <code>SettingsScreen</code>; when <code>false</code>, renders <code>MainAppPlaceholder</code>.</li>
          <li><code>MainSidebar</code> accepts <code>onOpenSettings</code> prop → sets <code>inSettings = true</code>.</li>
          <li><code>SettingsNav</code> accepts <code>onBack</code> prop → sets <code>inSettings = false</code>.</li>
          <li>The settings entry button should be rendered at the bottom of every main app sidebar variant (manager, admin, etc.).</li>
        </ul>
      </div>

      {/* ================================================================
          SECTION 2: INFORMATION ARCHITECTURE
          ================================================================ */}
      <div className="lib-section">
        <h2 className="lib-heading">2. Information Architecture</h2>
        <p className="lib-note">
          Settings pages are organized into 4 functional categories plus a reference section. This structure maps directly to the <code>NAV</code> constant in code.
        </p>

        <div className="lib-ia-table">
          <table className="lib-table">
            <thead>
              <tr><th>Category</th><th>Page</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr className="lib-table-category"><td rowSpan={2}>Profile</td><td>Avatar</td><td>Profile picture and display name (placeholder)</td></tr>
              <tr><td>Login and security</td><td>Password, 2FA, session management (placeholder)</td></tr>
              <tr className="lib-table-category"><td rowSpan={2}>Payroll</td><td>Pay schedule</td><td>Pay frequency, pay period start, overtime calculation start time</td></tr>
              <tr><td>Payroll integration</td><td>External payroll system connection (placeholder)</td></tr>
              <tr className="lib-table-category"><td rowSpan={4}>Scheduling</td><td>Breaks</td><td>Break rules (duration, paid/unpaid, required/optional), compliance</td></tr>
              <tr><td>Overtime</td><td>Weekly, daily, and double-time thresholds, compliance</td></tr>
              <tr><td>Hours &amp; workweek</td><td>Operating hours per day, workweek start day, same-hours toggle</td></tr>
              <tr><td>Shifts &amp; flags</td><td>Flag rules for clock anomalies (early, late, GPS distance, etc.)</td></tr>
              <tr className="lib-table-category"><td rowSpan={3}>Time Clock</td><td>Shift enforcement</td><td>Early clock-in buffer, automatic clock-out</td></tr>
              <tr><td>Time tracking</td><td>Clock rounding interval, rounding direction</td></tr>
              <tr><td>Shared device</td><td>Kiosk mode, photo capture, GPS enforcement, manager PIN</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="lib-subheading">Notes for Engineering</h3>
        <ul className="lib-list">
          <li><strong>Profile pages</strong> are stub placeholders — they exist to demonstrate that the settings sidebar handles non-admin settings too. Implementation is out of scope for this phase.</li>
          <li>Pages with a <code>complianceKey</code> property in the NAV data (<em>Breaks</em>, <em>Overtime</em>) display a compliance module and a warning banner when non-compliant.</li>
          <li>The nav renders a small colored dot next to pages that have compliance warnings, calculated from the <code>isCompliant</code> and <code>hasBreakRules</code> / <code>hasOvertimeConfig</code> state.</li>
        </ul>
      </div>

      {/* ================================================================
          SECTION 3: SCOPE & INHERITANCE MODEL
          ================================================================ */}
      <div className="lib-section">
        <h2 className="lib-heading">3. Scope &amp; Inheritance Model</h2>
        <p className="lib-note">
          Settings follow a <strong>3-level cascade</strong>, from broadest to most specific:
        </p>

        <div className="lib-cascade">
          <div className="lib-cascade-level">
            <div className="lib-cascade-icon"><Building2 size={18} /></div>
            <div>
              <strong>Company Defaults</strong>
              <span className="lib-cascade-desc">Base values that apply to all locations unless overridden.</span>
            </div>
          </div>
          <div className="lib-cascade-arrow">↓</div>
          <div className="lib-cascade-level">
            <div className="lib-cascade-icon"><FileText size={18} /></div>
            <div>
              <strong>Policy Groups</strong>
              <span className="lib-cascade-desc">Named collections of locations that share overrides (e.g., "California" for state-specific compliance). A location belongs to exactly one group.</span>
            </div>
          </div>
          <div className="lib-cascade-arrow">↓</div>
          <div className="lib-cascade-level">
            <div className="lib-cascade-icon"><MapPin size={18} /></div>
            <div>
              <strong>Locations</strong>
              <span className="lib-cascade-desc">Individual locations can override their group or the company default for any setting.</span>
            </div>
          </div>
        </div>

        <h3 className="lib-subheading">Resolution Logic</h3>
        <p className="lib-note">
          When displaying a setting for a given location, the system resolves the source using <code>resolveSettingSource(locationId, settingKey)</code>:
        </p>
        <ol className="lib-list lib-list-ordered">
          <li>Check if the <strong>location</strong> has an override for <code>settingKey</code> → return <code>'location'</code></li>
          <li>Check if the location's <strong>policy group</strong> has an override → return <code>'group'</code></li>
          <li>Fall through to <strong>company default</strong> → return <code>'company'</code></li>
        </ol>
        <p className="lib-note">
          This means a location <em>never</em> needs to explicitly store a value that matches its group or company default — it inherits automatically.
        </p>

        <h3 className="lib-subheading">ScopeStatus Badge Variants</h3>
        <p className="lib-note">
          Each settings page header displays a <code>ScopeStatus</code> badge showing where the current value comes from. The badge adapts based on the selected scope:
        </p>
        <ul className="lib-list">
          <li><strong>Company scope selected</strong> — no badge shown (you're editing the base defaults).</li>
          <li><strong>Group scope, has override</strong> — "<em>[Group name] policy override</em>" in blue. Indicates the group has its own value.</li>
          <li><strong>Group scope, inheriting</strong> — "Using company default" in neutral gray. Indicates the group uses the base value.</li>
          <li><strong>Location scope, custom override</strong> — "Custom for [Location]" in amber, with a <strong>Change</strong> button. Clicking Change opens the <code>AlignSettingsModal</code> to realign with a group or company default.</li>
          <li><strong>Location scope, from group</strong> — "From [Group] policy" with an "Edit policy" link that navigates to the group scope.</li>
          <li><strong>Location scope, from company</strong> — "Company default" with an "Edit default" link that navigates to company scope.</li>
        </ul>

        <h3 className="lib-subheading">AlignSettingsModal</h3>
        <p className="lib-note">
          When a location has a custom override, the user can open the <code>AlignSettingsModal</code> to choose a new inheritance source. The modal presents all available options (company default, the location's policy group, or keep custom) and previews what will change. Selecting an option removes the location override and lets it inherit from the chosen source.
        </p>

        <h3 className="lib-subheading">Data Model (Prototype)</h3>
        <ul className="lib-list">
          <li><code>POLICY_GROUPS[]</code> — each has <code>id</code>, <code>name</code>, <code>subtitle</code>, <code>locationIds[]</code>, and <code>overrides</code> (object mapping setting keys to booleans).</li>
          <li><code>LOCATIONS[]</code> — each has <code>id</code>, <code>name</code>, <code>subtitle</code>, <code>groupId</code>, and <code>overrides</code>.</li>
          <li>In production, <code>overrides</code> should store actual values (not just boolean flags) and the resolution logic should return the resolved <em>value</em>, not just the source.</li>
        </ul>
      </div>

      {/* ================================================================
          SECTION 4: SAVE FLOW
          ================================================================ */}
      <div className="lib-section">
        <h2 className="lib-heading">4. Save Flow</h2>
        <p className="lib-note">
          The save mechanism uses a <strong>page-level dirty state</strong> pattern, not per-field saves. All changes on a page accumulate until the user explicitly saves or discards. Three components work together:
        </p>

        <h3 className="lib-subheading">Components</h3>
        <ul className="lib-list">
          <li>
            <strong>UnsavedChangesBar</strong> — a sticky bar anchored to the bottom of the content area. Appears with a slide-up animation when <code>isDirty</code> becomes true. Provides two actions: <em>Discard</em> (reverts all changes) and <em>Save</em> (commits changes).
          </li>
          <li>
            <strong>SaveChangesModal</strong> — a modal dialog that intercepts navigation when the page is dirty. If the user clicks a different nav item while unsaved changes exist, the navigation is blocked and this modal appears with three choices:
            <ul className="lib-list">
              <li><em>Go back</em> — cancels the navigation, returns to the dirty page.</li>
              <li><em>Discard changes</em> — throws away changes and proceeds to the new page.</li>
              <li><em>Save and continue</em> — saves changes, then navigates to the new page.</li>
            </ul>
          </li>
          <li>
            <strong>SaveToast</strong> — a brief confirmation message that slides in from the bottom-right after a successful save. Auto-dismisses after 3 seconds. Shows a checkmark icon and "Settings saved" message.
          </li>
        </ul>

        <h3 className="lib-subheading">Dirty State Lifecycle</h3>
        <ol className="lib-list lib-list-ordered">
          <li>User modifies any setting → page calls <code>markDirty()</code> from the scope context</li>
          <li><code>isDirty</code> becomes <code>true</code> → <code>UnsavedChangesBar</code> appears</li>
          <li>User clicks <em>Save</em> → <code>markClean()</code> called, <code>triggerToast()</code> fires the toast</li>
          <li>Or user clicks <em>Discard</em> → <code>markClean()</code> called, no toast</li>
          <li>Or user navigates away → <code>pendingNav</code> is set, <code>SaveChangesModal</code> opens</li>
        </ol>

        <h3 className="lib-subheading">Implementation Notes</h3>
        <ul className="lib-list">
          <li>All orchestration lives in <code>SettingsScreen</code>. Individual page components only need to call <code>markDirty()</code> — they never manage their own save UI.</li>
          <li><code>pendingNav</code> stores the <code>{'{category, item}'}</code> the user tried to navigate to. When the modal resolves, the pending nav is either executed or cleared.</li>
          <li>The unsaved bar uses <code>position: absolute</code> within a <code>position: relative</code> parent to avoid scroll issues. It does <em>not</em> use <code>position: sticky</code> because the content area has overflow handling.</li>
          <li>In production, <code>markDirty()</code> should accept a changeset diff so that <em>Discard</em> can truly revert to the previous state rather than just reloading.</li>
        </ul>
      </div>

      {/* ================================================================
          SECTION 5: COMPLIANCE SYSTEM
          ================================================================ */}
      <div className="lib-section">
        <h2 className="lib-heading">5. Compliance System</h2>
        <p className="lib-note">
          Compliance is surfaced through two UI elements: a <strong>page-level compliance module</strong> (inside the Breaks and Overtime pages) and a <strong>banner</strong> in the content header area. Together, they guide the user from unconfigured → compliant or highlight when existing settings have drifted out of compliance.
        </p>

        <h3 className="lib-subheading">ComplianceModule States</h3>
        <p className="lib-note">The module operates as a 3-state machine:</p>
        <ul className="lib-list">
          <li>
            <strong>Empty (first-time setup)</strong> — shown when no rules exist yet. Displays a prompt with an auto-apply button ("Apply California defaults") and a "View applicable law" link. The auto-apply triggers the <code>ComplianceWizard</code>.
          </li>
          <li>
            <strong>Compliant</strong> — green checkmark with a confirmation message (e.g., "Your break rules meet California requirements"). Shown when existing rules satisfy the compliance check.
          </li>
          <li>
            <strong>Warning</strong> — red alert icon with a specific description of what's missing (e.g., "California requires a 30-minute unpaid meal break for shifts over 5 hours") and a "Fix compliance" button that opens the wizard.
          </li>
        </ul>

        <h3 className="lib-subheading">ComplianceWizard</h3>
        <p className="lib-note">
          A multi-step modal that auto-applies state-specific defaults. The current prototype is hardcoded to California and handles two compliance domains:
        </p>
        <ul className="lib-list">
          <li><strong>Breaks</strong> — applies a 10-min paid rest break (shifts 3.5+ hrs) and a 30-min unpaid meal break (shifts 5+ hrs).</li>
          <li><strong>Overtime</strong> — applies 40-hr weekly threshold, 8-hr daily threshold, and 12-hr double-time threshold.</li>
        </ul>
        <p className="lib-note">
          In production, the wizard should detect the applicable state from the location's address and load the correct rule set dynamically. The wizard flow should also support reviewing changes before applying.
        </p>

        <h3 className="lib-subheading">Compliance Banner</h3>
        <p className="lib-note">
          When <code>isCompliant</code> is <code>false</code>, a warning banner appears at the top of the content area (below the page header, above the first section). The banner reads: <em>"Compliance issues detected — Your settings are not compliant with state law."</em> and links to the compliance wizard.
        </p>

        <h3 className="lib-subheading">Nav Indicator</h3>
        <p className="lib-note">
          The sidebar navigation shows a small red/amber dot next to pages that have compliance issues. This is calculated from page-level state (<code>isCompliant</code>, <code>hasBreakRules</code>, <code>hasOvertimeConfig</code>) and rendered in <code>SettingsNav</code>.
        </p>
      </div>

      {/* ================================================================
          SECTION 6: COMPONENT PRIMITIVES
          ================================================================ */}
      <div className="lib-section">
        <h2 className="lib-heading">6. Component Primitives</h2>
        <p className="lib-note">
          All settings pages are built from a small set of standardized components. This section documents each primitive's API, rendering behavior, and intended usage with live interactive demos.
        </p>
      </div>

      {/* -- 6a: SettingsSection -- */}
      <div className="lib-section lib-subsection">
        <h3 className="lib-subheading">6a. SettingsSection</h3>
        <p className="lib-note">
          Card wrapper that groups related setting rows. Renders a white card with border-radius and subtle shadow.
        </p>
        <ul className="lib-list">
          <li><strong>Props:</strong> <code>title</code> (string, optional), <code>description</code> (string, optional), <code>children</code></li>
          <li><strong>Behavior:</strong> If <code>title</code> is provided, renders a header area with title and optional description. All child rows are rendered below the header with dividers between them.</li>
        </ul>
        <div className="lib-demo">
          <SettingsSection title="Example Section" description="This description explains what the section controls.">
            <div className="ss-row"><div className="ss-row-text"><div className="ss-row-label">Rows go here</div><div className="ss-row-desc">Each row is a child of the section</div></div></div>
          </SettingsSection>
        </div>
      </div>

      {/* -- 6b: SettingToggleRow -- */}
      <div className="lib-section lib-subsection">
        <h3 className="lib-subheading">6b. SettingToggleRow</h3>
        <p className="lib-note">
          A row with a label, contextual description, and a right-aligned toggle switch.
        </p>
        <ul className="lib-list">
          <li><strong>Props:</strong> <code>label</code>, <code>onDescription</code>, <code>offDescription</code>, <code>enabled</code> (bool), <code>onToggle</code> (fn), <code>value</code> (string, optional)</li>
          <li><strong>Behavior:</strong> Description text swaps between <code>onDescription</code> and <code>offDescription</code> based on the toggle state. If <code>value</code> is provided and the toggle is on, the value appears as read-only text below the description.</li>
          <li><strong>Design rule:</strong> The toggle is always on the right. This is consistent across all toggle-based components (flag rows, break rule toggles, day hours).</li>
        </ul>
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

      {/* -- 6c: SettingValueRow -- */}
      <div className="lib-section lib-subsection">
        <h3 className="lib-subheading">6c. SettingValueRow</h3>
        <p className="lib-note">
          The most versatile primitive. Renders a label + description on the left and an input control on the right (or stacked below for radio). The rendering mode is determined automatically from props:
        </p>
        <ul className="lib-list">
          <li><strong>Read-only</strong> — no <code>onChange</code> provided → plain text display</li>
          <li><strong>Radio buttons</strong> — <code>options</code> array with ≤5 items → inline radio group (stacked layout)</li>
          <li><strong>Dropdown</strong> — <code>options</code> array with &gt;5 items → native <code>&lt;select&gt;</code></li>
          <li><strong>Time picker</strong> — <code>type="time"</code> → segmented hour:minute AM/PM picker</li>
          <li><strong>Number + suffix</strong> — <code>type="number"</code> + <code>suffix</code> → number input with unit label and stepper buttons</li>
          <li><strong>Text input</strong> — default → standard text <code>&lt;input&gt;</code></li>
        </ul>
        <p className="lib-note">
          <strong>Key design decision:</strong> Inputs are always directly visible and editable — there is no "click to edit" pattern. This was an intentional change from the original design: because we have a page-level save button, there's no need for per-field edit modes. Exposing inputs directly reduces friction and makes the current values scannable.
        </p>

        <h3 className="lib-subheading" style={{ marginTop: 24 }}>Text Input</h3>
        <div className="lib-demo">
          <SettingsSection>
            <SettingValueRow label="Editable text" description="Standard text input" value={demoText} onChange={setDemoText} />
            <SettingValueRow label="Read-only" description="No onChange — display only" value="Static value" />
          </SettingsSection>
        </div>

        <h3 className="lib-subheading" style={{ marginTop: 24 }}>Number + Suffix</h3>
        <p className="lib-note">Uses native stepper buttons. The <code>suffix</code> prop renders a unit label to the right of the input.</p>
        <div className="lib-demo">
          <SettingsSection>
            <SettingValueRow label="Rounding interval" description="Clock times rounded to this value" value={demoNumber} suffix="mins" type="number" onChange={setDemoNumber} />
          </SettingsSection>
        </div>

        <h3 className="lib-subheading" style={{ marginTop: 24 }}>Radio Buttons (≤5 options)</h3>
        <p className="lib-note">Renders as a stacked row with the radio group below the label. Used for short, mutually exclusive option lists.</p>
        <div className="lib-demo">
          <SettingsSection>
            <SettingValueRow label="Pay frequency" value={demoRadio} onChange={setDemoRadio} options={['Weekly', 'Bi-weekly', 'Semi-monthly', 'Monthly']} />
          </SettingsSection>
        </div>

        <h3 className="lib-subheading" style={{ marginTop: 24 }}>Dropdown (&gt;5 options)</h3>
        <p className="lib-note">Automatically switches to a native <code>&lt;select&gt;</code> when the options list exceeds 5 items. Use this threshold consistently.</p>
        <div className="lib-demo">
          <SettingsSection>
            <SettingValueRow label="Starts on" value={demoDropdown} onChange={setDemoDropdown} options={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']} />
          </SettingsSection>
        </div>

        <h3 className="lib-subheading" style={{ marginTop: 24 }}>Time Picker</h3>
        <p className="lib-note">
          Segmented picker with separate hour, minute, and AM/PM fields. The AM/PM segment toggles on click and also responds to <code>a</code> / <code>p</code> keyboard input. Hour and minute fields accept numeric input with stepper buttons.
        </p>
        <div className="lib-demo">
          <SettingsSection>
            <SettingValueRow label="Start time" value={demoTime} onChange={setDemoTime} type="time" />
          </SettingsSection>
        </div>
      </div>

      {/* -- 6d: SettingChildRow -- */}
      <div className="lib-section lib-subsection">
        <h3 className="lib-subheading">6d. SettingChildRow</h3>
        <p className="lib-note">
          Indented wrapper for dependent child settings. Renders its children with a left indent to visually communicate hierarchy. Typically used inside a conditional block that checks whether the parent toggle is on.
        </p>
        <ul className="lib-list">
          <li><strong>Props:</strong> <code>children</code> only</li>
          <li><strong>Pattern:</strong> Parent <code>SettingToggleRow</code> → conditional <code>SettingChildRow</code> containing child <code>SettingValueRow</code> or similar</li>
        </ul>
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

      {/* -- 6e: TimePicker -- */}
      <div className="lib-section lib-subsection">
        <h3 className="lib-subheading">6e. TimePicker</h3>
        <p className="lib-note">
          Standalone segmented time input. Typically used inside <code>SettingValueRow</code> (via <code>type="time"</code>) or inside <code>DayHoursRow</code>.
        </p>
        <ul className="lib-list">
          <li><strong>Props:</strong> <code>value</code> (string, e.g. <code>"9:00 AM"</code>), <code>onChange</code> (fn)</li>
          <li><strong>Segments:</strong> Hour (1–12, numeric with steppers), Minute (00–59, numeric with steppers), Period (AM/PM, click to toggle or press <code>a</code>/<code>p</code>)</li>
          <li><strong>Output format:</strong> <code>"H:MM AM"</code> or <code>"H:MM PM"</code></li>
        </ul>
      </div>

      {/* -- 6f: DayHoursRow -- */}
      <div className="lib-section lib-subsection">
        <h3 className="lib-subheading">6f. DayHoursRow</h3>
        <p className="lib-note">
          Per-day scheduling row with open/close time pickers and an on/off toggle. Detects when the end time is earlier than the start time and displays a <strong>+1 day</strong> badge to indicate next-day hours.
        </p>
        <ul className="lib-list">
          <li><strong>Props:</strong> <code>day</code> (string), <code>start</code>, <code>end</code>, <code>closed</code> (bool), <code>onChangeStart</code>, <code>onChangeEnd</code>, <code>onToggle</code></li>
          <li><strong>Next-day detection:</strong> Uses <code>isNextDay(start, end)</code> helper which compares 24hr-converted times. If end ≤ start, the +1 badge appears. Maximum supported closing time is 2:00 AM next day.</li>
        </ul>
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

      {/* -- 6g: Flag Row -- */}
      <div className="lib-section lib-subsection">
        <h3 className="lib-subheading">6g. Flag Row</h3>
        <p className="lib-note">
          Used on the Shifts &amp; Flags page. Each flag has a name, description, an optional configurable threshold (with label, input, and unit), and a right-aligned toggle.
        </p>
        <ul className="lib-list">
          <li><strong>Data model:</strong> Each flag has <code>id</code>, <code>name</code>, <code>description</code>, <code>enabled</code>, optional <code>conditionLabel</code>, <code>conditionValue</code>, <code>conditionUnit</code></li>
          <li><strong>Disabled state:</strong> When toggled off, the content area gets <code>opacity: 0.5</code> and the threshold input becomes read-only (displays as plain text).</li>
          <li><strong>Toggle placement:</strong> Always on the right side, consistent with all other toggle components.</li>
        </ul>
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

      {/* -- 6h: PIN Field -- */}
      <div className="lib-section lib-subsection">
        <h3 className="lib-subheading">6h. PIN Field</h3>
        <p className="lib-note">
          A sensitive-value input pattern for the manager PIN on the Shared Device page.
        </p>
        <ul className="lib-list">
          <li><strong>Default state:</strong> Field shows password dots, is <code>readOnly</code>. An inline eye icon button (<code>Eye</code> from lucide) sits inside the field.</li>
          <li><strong>Reveal:</strong> Clicking the eye or the field itself sets <code>pinVisible = true</code>, showing the PIN and enabling editing.</li>
          <li><strong>Input constraints:</strong> <code>inputMode="numeric"</code>, <code>pattern="[0-9]*"</code>, <code>maxLength={'{8}'}</code>. Non-numeric characters are stripped on input.</li>
          <li><strong>Toggle back:</strong> Clicking the eye icon again (<code>EyeOff</code>) hides and locks the field.</li>
        </ul>
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

      {/* -- 6i: Break Rule Card -- */}
      <div className="lib-section lib-subsection">
        <h3 className="lib-subheading">6i. Break Rule Card</h3>
        <p className="lib-note">
          List-view card for break rules on the Breaks page. Designed for scanability — the most important information is visible at a glance without expanding.
        </p>
        <ul className="lib-list">
          <li><strong>Title row:</strong> Rule name (large weight) + inline badges for type (<em>Paid</em>/<em>Unpaid</em>) and requirement (<em>Required</em>/<em>Optional</em>).</li>
          <li><strong>Summary:</strong> A natural-language sentence describing the rule, e.g. "30-minute break after 5 hours for all roles." Generated from the rule's duration, trigger, and role assignment.</li>
          <li><strong>Modifiers:</strong> Only <em>active</em> modifiers are shown as small tags: "Waivable", "Can end early", "Reminder". Inactive modifiers are hidden (not shown as disabled) to reduce noise.</li>
          <li><strong>Chevron:</strong> Right-aligned chevron indicates the card is clickable (opens the break rule editor). Rendered at low opacity to keep focus on content.</li>
        </ul>
      </div>

      {/* ================================================================
          SECTION 7: PAGE-SPECIFIC PATTERNS
          ================================================================ */}
      <div className="lib-section">
        <h2 className="lib-heading">7. Page-Specific Patterns</h2>
        <p className="lib-note">
          Patterns that are unique to individual pages and not covered by the generic primitives above.
        </p>
      </div>

      <div className="lib-section lib-subsection">
        <h3 className="lib-subheading">7a. Breaks — Rule List &amp; Editor</h3>
        <ul className="lib-list">
          <li><strong>List view:</strong> Displays all break rules as <code>BreakRuleRow</code> cards. An "Add break rule" button at the bottom opens the editor for a new rule.</li>
          <li><strong>Editor:</strong> <code>BreakRuleEditor</code> is a full-page form (replaces the list view), not a modal. This is intentional — break rules have enough fields that a modal would feel cramped.</li>
          <li><strong>Editor fields:</strong> Name, duration (minutes), type (paid/unpaid radio), trigger (after X hours), required toggle, waivable toggle, allow early end toggle, send reminder toggle, and role assignment.</li>
          <li><strong>Role picker:</strong> A multi-select dropdown component (<code>RolePicker</code>) that groups roles by department. Each department has a checkbox that toggles all roles in that department. "All roles" is a special option that selects everything. Roles come from <code>ROLE_GROUPS</code> data.</li>
          <li><strong>Navigation:</strong> The editor has its own "Back" button that returns to the rule list. If the page is dirty, the standard save flow intercepts.</li>
          <li><strong>Delete:</strong> Each existing rule can be deleted via a "Delete rule" button in the editor, which requires confirmation.</li>
        </ul>
      </div>

      <div className="lib-section lib-subsection">
        <h3 className="lib-subheading">7b. Overtime — Threshold Inputs</h3>
        <ul className="lib-list">
          <li>Three numeric threshold inputs: weekly hours, daily hours, and double-time daily hours.</li>
          <li>Each uses <code>SettingValueRow</code> with <code>type="number"</code> and <code>suffix="hrs"</code>.</li>
          <li><strong>Zero behavior:</strong> Setting any threshold to <code>0</code> effectively disables that overtime rule. The UI should communicate this clearly in production (e.g., showing "Disabled" when value is 0).</li>
          <li>This page also displays a compliance module that checks whether the thresholds meet state law requirements.</li>
        </ul>
      </div>

      <div className="lib-section lib-subsection">
        <h3 className="lib-subheading">7c. Hours &amp; Workweek — Scheduling Mode</h3>
        <ul className="lib-list">
          <li><strong>"Same hours every day" toggle:</strong> When on, shows two shared time pickers (start/end). When off, renders a list of <code>DayHoursRow</code> components for each day of the week.</li>
          <li><strong>Individual day toggle:</strong> Each day can be toggled open/closed independently. When closed, the row shows "Closed" text and the time pickers are hidden.</li>
          <li><strong>Next-day hours:</strong> End times can be set up to 2:00 AM. When the end time wraps past midnight (i.e., end ≤ start), a "+1 day" badge appears. A note at the bottom of the section explains this.</li>
          <li><strong>Workweek start:</strong> A dropdown (<code>SettingValueRow</code> with 7 day options) sets which day the workweek begins. This affects overtime calculations.</li>
        </ul>
      </div>

      <div className="lib-section lib-subsection">
        <h3 className="lib-subheading">7d. Shifts &amp; Flags — Flag Data Model</h3>
        <ul className="lib-list">
          <li>Flags are stored as an array of objects in <code>DEFAULT_FLAGS</code>.</li>
          <li>Each flag object: <code>{'{id, name, description, enabled, conditionLabel?, conditionValue?, conditionUnit?}'}</code></li>
          <li>Flags without a <code>conditionLabel</code> are simple on/off toggles (no threshold input).</li>
          <li>Flags with a condition render an additional input row showing the label, a number input for the value, and a unit label.</li>
          <li>Flag descriptions should be written as actionable explanations of <em>when</em> the flag triggers, not just the flag name. Example: "Flag when a worker clocks in or out beyond the allowed distance" rather than "GPS distance flag."</li>
        </ul>
      </div>

      <div className="lib-section lib-subsection">
        <h3 className="lib-subheading">7e. Shared Device — PIN Interaction</h3>
        <ul className="lib-list">
          <li>The Shared Device page has multiple toggle settings (kiosk mode, photo capture, GPS) that use standard <code>SettingToggleRow</code> components.</li>
          <li>The Manager PIN field is the exception: it uses the custom PIN field pattern (see 6h above) because it requires show/hide functionality for a sensitive value.</li>
          <li>The PIN field lives inside a <code>SettingsSection</code> alongside other shared device settings, using a custom <code>.pin-row</code> layout that matches the row height and spacing of standard rows.</li>
          <li><strong>Validation note:</strong> In production, PIN changes should require re-authentication or confirmation. The prototype skips this for simplicity.</li>
        </ul>
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
