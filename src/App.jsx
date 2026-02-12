import { useState, useRef, useEffect } from 'react'
import {
  MessageCircle, CheckSquare, Users, UserPlus, Clock, Umbrella, StickyNote,
  DollarSign, Settings, Droplets, Building2, MapPin, AlertTriangle, Info,
  CircleCheck, CircleX, Coffee, Timer, Shield, Map, Wand2, Flag, Plus,
  ChevronRight, Pin, Scan, Lightbulb, Construction, CalendarDays, Tablet,
  TriangleAlert, X, Check, ArrowRight, Sparkles, CircleAlert, ChevronDown,
  RotateCcw, Trash2, ChevronLeft, ToggleLeft, ToggleRight, Search
} from 'lucide-react'

// Mock locations
const LOCATIONS = [
  { id: 'all', name: 'All locations', subtitle: 'Company defaults', icon: Building2 },
  { id: 'loc1', name: 'Downtown SF Store', subtitle: 'San Francisco, CA', icon: MapPin },
  { id: 'loc2', name: 'Oakland Branch', subtitle: 'Oakland, CA', icon: MapPin },
  { id: 'loc3', name: 'San Jose Outlet', subtitle: 'San Jose, CA', icon: MapPin },
]

// Mock: which settings differ from company defaults per location
const LOCATION_OVERRIDES = {
  loc1: { earlyClockIn: true, timeRounding: true }, // these 2 settings differ from company
  loc2: {},
  loc3: { breaks: true },
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
  const [selectedNavIndex, setSelectedNavIndex] = useState(8)
  return (
    <div className="app-shell">
      <MainSidebar selected={selectedNavIndex} onSelect={setSelectedNavIndex} />
      <SettingsScreen />
    </div>
  )
}

// ============================================================
// MAIN SIDEBAR
// ============================================================

function MainSidebar({ selected, onSelect }) {
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
    { icon: Settings, label: 'Settings' },
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
          onClick={() => onSelect(i)}
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
            onClick={() => onSelect(idx)}
          >
            <item.icon className="icon" size={20} />
            <span>{item.label}</span>
            {item.trailing && <span className="sidebar-trailing">{item.trailing}</span>}
          </div>
        )
      })}

      <div className="sidebar-spacer" />

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

function SettingsScreen() {
  const [category, setCategory] = useState('scheduling')
  const [item, setItem] = useState('breaks')
  const [selectedLocationId, setSelectedLocationId] = useState('all')
  const [showComplianceWizard, setShowComplianceWizard] = useState(false)

  const isCompanyScope = selectedLocationId === 'all'
  const selectedLocation = LOCATIONS.find(l => l.id === selectedLocationId)
  const overrides = LOCATION_OVERRIDES[selectedLocationId] || {}

  // Simulated compliance state — toggled when user applies defaults
  const [hasBreakRules, setHasBreakRules] = useState(false)
  const [hasOvertimeConfig, setHasOvertimeConfig] = useState(false)
  const isCompliant = hasBreakRules && hasOvertimeConfig

  const handleNav = (cat, itm) => { setCategory(cat); setItem(itm) }

  const handleApplyBreaks = () => { setHasBreakRules(true) }
  const handleApplyOvertime = () => { setHasOvertimeConfig(true) }
  const handleApplyAll = () => { setHasBreakRules(true); setHasOvertimeConfig(true) }

  return (
    <>
      <SettingsNav
        category={category}
        item={item}
        isCompliant={isCompliant}
        hasBreakRules={hasBreakRules}
        hasOvertimeConfig={hasOvertimeConfig}
        onNav={handleNav}
      />
      <div className="settings-content">
        {/* Toolbar: location picker */}
        <div className="settings-toolbar">
          <LocationPicker
            selectedId={selectedLocationId}
            onSelect={setSelectedLocationId}
          />
        </div>

        {/* Compliance banner — full width, below toolbar */}
        {!isCompliant && (
          <div className="compliance-banner" onClick={() => setShowComplianceWizard(true)}>
            <div className="compliance-banner-left">
              <CircleAlert size={16} />
              <div className="compliance-banner-text">
                <strong>Compliance issues detected</strong>
                <span>
                  {!hasBreakRules && !hasOvertimeConfig
                    ? 'Break rules and overtime thresholds need attention.'
                    : !hasBreakRules
                    ? 'Break rules need attention.'
                    : 'Overtime thresholds need attention.'}
                </span>
              </div>
            </div>
            <span className="compliance-banner-action">Fix now <ArrowRight size={14} /></span>
          </div>
        )}

        <div className="content-scroll">
          <ContentRouter
            category={category}
            item={item}
            isCompanyScope={isCompanyScope}
            selectedLocation={selectedLocation}
            overrides={overrides}
            hasBreakRules={hasBreakRules}
            hasOvertimeConfig={hasOvertimeConfig}
            onApplyBreaks={handleApplyBreaks}
            onApplyOvertime={handleApplyOvertime}
          />
        </div>
      </div>

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
// LOCATION PICKER
// ============================================================

function LocationPicker({ selectedId, onSelect }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = LOCATIONS.find(l => l.id === selectedId)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="location-picker" ref={ref}>
      <button className="location-picker-trigger" onClick={() => setOpen(!open)}>
        <div className={`location-picker-icon ${selectedId === 'all' ? 'company' : 'location'}`}>
          {selectedId === 'all' ? <Building2 size={14} /> : <MapPin size={14} />}
        </div>
        <div className="location-picker-label">
          <span className="location-picker-name">{selected?.name}</span>
          <span className="location-picker-sub">{selected?.subtitle}</span>
        </div>
        <ChevronDown size={16} className={`location-picker-chevron ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="location-picker-dropdown">
          <div className="location-picker-dropdown-header">Switch scope</div>
          {LOCATIONS.map(loc => {
            const isActive = loc.id === selectedId
            const overrideCount = Object.keys(LOCATION_OVERRIDES[loc.id] || {}).length
            return (
              <div
                key={loc.id}
                className={`location-picker-option ${isActive ? 'active' : ''}`}
                onClick={() => { onSelect(loc.id); setOpen(false) }}
              >
                <div className={`location-picker-option-icon ${loc.id === 'all' ? 'company' : 'location'}`}>
                  <loc.icon size={16} />
                </div>
                <div className="location-picker-option-text">
                  <span className="location-picker-option-name">{loc.name}</span>
                  <span className="location-picker-option-sub">{loc.subtitle}</span>
                </div>
                {loc.id !== 'all' && overrideCount > 0 && (
                  <span className="location-picker-override-count">{overrideCount} override{overrideCount !== 1 ? 's' : ''}</span>
                )}
                {isActive && <Check size={16} color="var(--primary)" />}
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
]

function SettingsNav({ category, item, isCompliant, hasBreakRules, hasOvertimeConfig, onNav }) {
  return (
    <nav className="settings-nav">
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

function ContentRouter({ category, item, isCompanyScope, selectedLocation, overrides, hasBreakRules, hasOvertimeConfig, onApplyBreaks, onApplyOvertime }) {
  const scope = { isCompanyScope, selectedLocation, overrides }
  if (category === 'scheduling') {
    if (item === 'breaks') return <BreaksPage hasBreakRules={hasBreakRules} onApply={onApplyBreaks} {...scope} />
    if (item === 'overtime') return <OvertimePage hasOvertimeConfig={hasOvertimeConfig} onApply={onApplyOvertime} {...scope} />
    if (item === 'scheduling_hours') return <SchedulingHoursPage {...scope} />
    if (item === 'shifts_and_flags') return <ShiftsAndFlagsPage {...scope} />
  }
  if (category === 'time_clock') {
    if (item === 'shift_enforcement') return <ShiftEnforcementPage {...scope} />
    if (item === 'clock_settings') return <ClockSettingsPage {...scope} />
    if (item === 'shared_device') return <SharedDevicePage />
  }
  if (category === 'payroll') {
    if (item === 'pay_schedule') return <PaySchedulePage {...scope} />
    return <PlaceholderPage title="Payroll integration" />
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
// SCOPE STATUS (shows alignment with company defaults)
// ============================================================

function ScopeStatus({ isCompanyScope, isOverridden, onResetToDefault, selectedLocation, settingLabel }) {
  const [showModal, setShowModal] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  if (isCompanyScope) return null

  const tooltipText = isOverridden
    ? `This location has custom ${settingLabel} settings that differ from the company defaults.`
    : `These ${settingLabel} settings match the company-wide defaults. Changes to company defaults will apply here automatically.`

  return (
    <>
      <div
        className={`scope-badge-inline ${isOverridden ? 'customized' : 'default'}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {isOverridden ? <MapPin size={12} /> : <Building2 size={12} />}
        <span>{isOverridden ? `Custom for ${selectedLocation?.name || 'this location'}` : 'Company default'}</span>
        {isOverridden && (
          <button className="scope-badge-change" onClick={(e) => { e.stopPropagation(); setShowModal(true) }}>
            Change
          </button>
        )}
        {showTooltip && (
          <div className="scope-badge-tooltip">{tooltipText}</div>
        )}
      </div>

      {showModal && (
        <AlignSettingsModal
          locationName={selectedLocation?.name}
          settingLabel={settingLabel}
          onApply={(sourceId) => {
            onResetToDefault(sourceId)
            setShowModal(false)
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

// ============================================================
// ALIGN SETTINGS MODAL
// ============================================================

function AlignSettingsModal({ locationName, settingLabel, onApply, onClose }) {
  const [selectedSource, setSelectedSource] = useState('company')

  const sources = [
    { id: 'company', name: 'Company default', subtitle: 'Reset to your company-wide settings', icon: Building2, iconClass: 'company' },
    ...LOCATIONS.filter(l => l.id !== 'all').map(l => ({
      id: l.id, name: l.name, subtitle: l.subtitle, icon: MapPin, iconClass: 'location'
    })),
  ]

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="align-modal" onClick={e => e.stopPropagation()}>
        <div className="align-modal-header">
          <div>
            <h3>Change {settingLabel || 'settings'} source</h3>
            <p className="align-modal-subtitle">
              Choose which settings <strong>{locationName}</strong> should use for this page.
            </p>
          </div>
          <button className="align-modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="align-modal-options">
          {sources.map(source => (
            <label
              key={source.id}
              className={`align-modal-option ${selectedSource === source.id ? 'selected' : ''}`}
              onClick={() => setSelectedSource(source.id)}
            >
              <div className={`align-modal-option-icon ${source.iconClass}`}>
                <source.icon size={16} />
              </div>
              <div className="align-modal-option-text">
                <span className="align-modal-option-name">{source.name}</span>
                <span className="align-modal-option-sub">{source.subtitle}</span>
              </div>
              <div className={`align-modal-radio ${selectedSource === source.id ? 'checked' : ''}`}>
                {selectedSource === source.id && <div className="align-modal-radio-dot" />}
              </div>
            </label>
          ))}
        </div>

        <div className="align-modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onApply(selectedSource)}>
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

function BreaksPage({ hasBreakRules, onApply, isCompanyScope, selectedLocation, overrides }) {
  const [isOverridden, setIsOverridden] = useState(overrides?.breaks || false)
  const [rules, setRules] = useState(hasBreakRules ? DEFAULT_BREAK_RULES : [])
  const [editingRule, setEditingRule] = useState(null)
  const [wasEverCompliant, setWasEverCompliant] = useState(hasBreakRules)

  const handleAutoApply = () => {
    onApply()
    setRules(DEFAULT_BREAK_RULES)
    setWasEverCompliant(true)
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
  }

  const handleDelete = (ruleId) => {
    setRules(prev => prev.filter(r => r.id !== ruleId))
    setEditingRule(null)
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
        <ScopeStatus
          isCompanyScope={isCompanyScope}
          isOverridden={isOverridden}
          selectedLocation={selectedLocation}
          settingLabel="break rules"
          onResetToDefault={() => setIsOverridden(false)}
        />
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

  const tags = [
    { label: required ? 'Required' : 'Optional', on: required },
    { label: waivable ? 'Waivable' : 'Not waivable', on: waivable },
    { label: allowEarlyEnd ? 'Can end early' : 'Must complete', on: !allowEarlyEnd },
    { label: sendReminder ? `Reminder at ${reminderMins} min` : 'No reminder', on: sendReminder },
  ]

  return (
    <div className="break-card" onClick={onClick}>
      <div className="break-card-top">
        <div className="break-card-title">
          <span className="break-card-name">{name}</span>
          <span className={`mini-badge ${type === 'Paid' ? 'paid' : 'unpaid'}`}>{type}</span>
        </div>
        <ChevronRight size={16} color="var(--text-secondary)" />
      </div>

      <div className="break-card-details">
        <div className="break-card-detail">
          <Clock size={13} />
          <span>{breakDuration} min break</span>
        </div>
        <div className="break-card-detail">
          <Timer size={13} />
          <span>After {shiftDuration} hr shift</span>
        </div>
        <div className="break-card-detail">
          <ArrowRight size={13} />
          <span>Window: {earliest}–{latest} hrs</span>
        </div>
        <div className="break-card-detail">
          <Users size={13} />
          <span>{!roles || roles.length === 0 ? 'All roles' : roles.length === 1 ? roles[0] : `${roles.length} roles`}</span>
        </div>
      </div>

      <div className="break-card-tags">
        {tags.map(tag => (
          <span key={tag.label} className={`break-card-tag ${tag.on ? 'on' : 'off'}`}>{tag.label}</span>
        ))}
      </div>
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

  return (
    <div className="content-inner">
      <button className="back-link" onClick={onBack}>
        <ChevronLeft size={16} /> Back to break rules
      </button>

      <div className="page-header" style={{ marginTop: 8 }}>
        <div>
          <h1 className="page-title">{isNew ? 'New Break Rule' : 'Edit Break Rule'}</h1>
          <p className="page-subtitle">{isNew ? 'Create a new break rule for this location' : `Editing "${rule.name}"`}</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary" onClick={onBack}>Cancel</button>
          <button className="btn-primary" disabled={!canSave} onClick={() => onSave({ ...rule, name, roles, type, shiftDuration, breakDuration, earliest, latest, required, waivable, allowEarlyEnd, sendReminder, reminderMins })}>
            {isNew ? 'Add rule' : 'Save changes'}
          </button>
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
            <div className={`setting-toggle ${required ? 'on' : ''}`}><div className="setting-toggle-thumb" /></div>
            <div className="bre-toggle-content">
              <span className="bre-toggle-label">Required</span>
              <span className="bre-toggle-hint">{required ? 'When on, skipping this break flags the shift.' : 'When off, this break is optional.'}</span>
            </div>
          </div>
          <div className="bre-toggle-item" onClick={() => setWaivable(!waivable)}>
            <div className={`setting-toggle ${waivable ? 'on' : ''}`}><div className="setting-toggle-thumb" /></div>
            <div className="bre-toggle-content">
              <span className="bre-toggle-label">Waivable</span>
              <span className="bre-toggle-hint">{waivable ? 'When on, employees can waive this break.' : 'When off, this break cannot be waived.'}</span>
            </div>
          </div>
          <div className="bre-toggle-item" onClick={() => setAllowEarlyEnd(!allowEarlyEnd)}>
            <div className={`setting-toggle ${allowEarlyEnd ? 'on' : ''}`}><div className="setting-toggle-thumb" /></div>
            <div className="bre-toggle-content">
              <span className="bre-toggle-label">Allowed to end early</span>
              <span className="bre-toggle-hint">{allowEarlyEnd ? 'When on, workers can end this break before the full duration.' : 'When off, workers must complete the full break duration.'}</span>
            </div>
          </div>
          <div className="bre-toggle-item" onClick={() => setSendReminder(!sendReminder)}>
            <div className={`setting-toggle ${sendReminder ? 'on' : ''}`}><div className="setting-toggle-thumb" /></div>
            <div className="bre-toggle-content">
              <span className="bre-toggle-label">Send reminder</span>
              <span className="bre-toggle-hint">{sendReminder ? 'When on, workers are notified before it\'s time for this break.' : 'When off, no reminders are sent.'}</span>
            </div>
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

function OvertimePage({ hasOvertimeConfig, onApply, isCompanyScope, selectedLocation, overrides }) {
  const [isOverridden, setIsOverridden] = useState(overrides?.overtime || false)
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
        <ScopeStatus
          isCompanyScope={isCompanyScope}
          isOverridden={isOverridden}
          selectedLocation={selectedLocation}
          settingLabel="overtime"
          onResetToDefault={() => setIsOverridden(false)}
        />
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
        <SettingValueRow label="Weekly overtime" description="Hours per week before 1.5x overtime" value={`${weeklyHrs} hrs`} onChange={v => { setWeeklyHrs(v.replace(/[^0-9]/g, '') || '0'); setConfigured(true) }} />
        <SettingValueRow label="Daily overtime" description="Hours per day before 1.5x overtime" value={`${dailyHrs} hrs`} onChange={v => { setDailyHrs(v.replace(/[^0-9]/g, '') || '0'); setConfigured(true) }} />
        <SettingValueRow label="Daily double overtime" description="Hours per day before 2x overtime" value={`${doubleHrs} hrs`} onChange={v => { setDoubleHrs(v.replace(/[^0-9]/g, '') || '0'); setConfigured(true) }} />
      </SettingsSection>
    </div>
  )
}

// ============================================================
// SHIFT ENFORCEMENT PAGE
// ============================================================

function ShiftEnforcementPage({ isCompanyScope, selectedLocation, overrides }) {
  const [isOverridden, setIsOverridden] = useState(overrides?.earlyClockIn || false)
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
        <ScopeStatus
          isCompanyScope={isCompanyScope}
          isOverridden={isOverridden}
          selectedLocation={selectedLocation}
          settingLabel="shift enforcement"
          onResetToDefault={() => setIsOverridden(false)}
        />
      </div>

      <SettingsSection title="Early clock-in" description="Control whether workers can clock in before their shift starts.">
        <SettingToggleRow
          label="Prevent early clock-in"
          onDescription="When on, workers cannot clock in before their scheduled shift."
          offDescription="When off, workers can clock in at any time."
          enabled={earlyClockIn}
          onToggle={() => setEarlyClockIn(!earlyClockIn)}
        />
        {earlyClockIn && (
          <SettingChildRow>
            <SettingValueRow
              label="Buffer time"
              description="How many minutes before their shift workers can clock in"
              value={earlyMins ? `${earlyMins} mins` : 'Not set'}
              onChange={v => setEarlyMins(v.replace(/[^0-9]/g, ''))}
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
          onToggle={() => setGeofence(!geofence)}
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
  { id: 'far_location', name: 'Clock in/out location too far from the store', enabled: true, conditionLabel: 'Distance >', conditionValue: '500', conditionUnit: 'feet' },
  { id: 'long_shift', name: 'Long shift', enabled: true, conditionLabel: 'Duration \u2265', conditionValue: '9', conditionUnit: 'hrs' },
  { id: 'clock_in_location_missing', name: 'Clock in location missing', enabled: true, conditionLabel: null, conditionValue: null, conditionUnit: null },
  { id: 'clock_out_location_missing', name: 'Clock out location missing', enabled: true, conditionLabel: null, conditionValue: null, conditionUnit: null },
  { id: 'break_end_missing', name: 'Break end missing', enabled: true, conditionLabel: null, conditionValue: null, conditionUnit: null },
  { id: 'clock_out_missing', name: 'Clock out missing', enabled: false, conditionLabel: null, conditionValue: null, conditionUnit: null },
]

function ShiftsAndFlagsPage({ isCompanyScope, selectedLocation, overrides }) {
  const [openShifts, setOpenShifts] = useState(false)
  const [visibility, setVisibility] = useState('roles')
  const [flags, setFlags] = useState(DEFAULT_FLAGS)

  const toggleFlag = (id) => {
    setFlags(flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
  }

  const updateFlagCondition = (id, value) => {
    setFlags(flags.map(f => f.id === id ? { ...f, conditionValue: value } : f))
  }

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Shifts & Flags</h1>
          <p className="page-subtitle">Configure open shifts and compliance alerts</p>
        </div>
        <ScopeStatus
          isCompanyScope={isCompanyScope}
          isOverridden={false}
          selectedLocation={selectedLocation}
          settingLabel="shifts & flags"
          onResetToDefault={() => {}}
        />
      </div>

      <SettingsSection title="Open shifts" description="Automatically post flagged shifts for other workers to pick up.">
        <SettingToggleRow
          label="Auto-send to Open Shifts"
          onDescription="When on, flagged shifts are automatically posted to Open Shifts."
          offDescription="When off, flagged shifts must be manually posted."
          enabled={openShifts}
          onToggle={() => setOpenShifts(!openShifts)}
        />
        {openShifts && (
          <SettingChildRow>
            <div className="ss-row">
              <div className="ss-row-text">
                <div className="ss-row-label">Visibility of Open Shifts</div>
                <div className="ss-row-desc">Which shifts a team member can see in their Open Shifts list</div>
              </div>
            </div>
            <RadioRow
              selected={visibility === 'roles'}
              onSelect={() => setVisibility('roles')}
              label="Only shifts for roles they've worked before"
            />
            <RadioRow
              selected={visibility === 'any'}
              onSelect={() => setVisibility('any')}
              label="Any shift at this location"
            />
          </SettingChildRow>
        )}
      </SettingsSection>

      <SettingsSection title="Shift flags" description="Flags highlight shifts that may need attention. Enable or disable each flag and configure their conditions.">
        {flags.map(flag => (
          <div key={flag.id} className="flag-row">
            <div className={`setting-toggle ${flag.enabled ? 'on' : ''}`} onClick={() => toggleFlag(flag.id)}>
              <div className="setting-toggle-thumb" />
            </div>
            <div className={`flag-row-content ${!flag.enabled ? 'disabled' : ''}`}>
              <div className="flag-row-name">{flag.name}</div>
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
              {!flag.conditionLabel && (
                <div className="flag-row-condition">
                  <span className="flag-row-condition-label flag-row-no-condition">No configurable condition</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </SettingsSection>
    </div>
  )
}

function RadioRow({ selected, onSelect, label }) {
  return (
    <div className="ss-row clickable" onClick={onSelect}>
      <div className={`radio-circle ${selected ? 'selected' : ''}`}>
        {selected && <div className="radio-dot" />}
      </div>
      <span className="ss-row-label">{label}</span>
    </div>
  )
}

// ============================================================
// PAY SCHEDULE PAGE (now under Payroll)
// ============================================================

function PaySchedulePage({ isCompanyScope, selectedLocation, overrides }) {
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
        <ScopeStatus
          isCompanyScope={isCompanyScope}
          isOverridden={false}
          selectedLocation={selectedLocation}
          settingLabel="pay schedule"
          onResetToDefault={() => {}}
        />
      </div>

      <SettingsSection title="Pay period">
        <SettingValueRow label="Pay frequency" value={frequency} onChange={setFrequency} options={['Weekly', 'Bi-weekly', 'Semi-monthly', 'Monthly']} />
        <SettingValueRow label="Current period starts" value={periodStart} onChange={setPeriodStart} />
        <SettingValueRow label="Start time" value={startTime} onChange={setStartTime} options={['12:00 AM', '6:00 AM', '8:00 AM', '12:00 PM']} />
      </SettingsSection>
    </div>
  )
}

// ============================================================
// HOURS & WORKWEEK PAGE
// ============================================================

function SchedulingHoursPage({ isCompanyScope, selectedLocation, overrides }) {
  const [workweekStart, setWorkweekStart] = useState('Monday')
  const [sameHours, setSameHours] = useState(true)
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const defaultHours = { start: '9:00 AM', end: '5:00 PM' }
  const [hours, setHours] = useState(
    Object.fromEntries(DAYS.map(d => [d, d === 'Sat' || d === 'Sun' ? { start: '', end: '' } : { ...defaultHours }]))
  )

  const formatHours = (h) => h.start && h.end ? `${h.start} – ${h.end}` : 'Closed'

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Hours & Workweek</h1>
          <p className="page-subtitle">Business hours and workweek configuration</p>
        </div>
        <ScopeStatus
          isCompanyScope={isCompanyScope}
          isOverridden={false}
          selectedLocation={selectedLocation}
          settingLabel="hours & workweek"
          onResetToDefault={() => {}}
        />
      </div>

      <SettingsSection title="Scheduling hours" description="We use these hours to guide when shifts can be scheduled. Leave a day blank if no one should be scheduled.">
        <SettingToggleRow
          label="Same hours every day"
          onDescription="When on, all days share the same operating hours."
          offDescription="When off, each day can have different operating hours."
          enabled={sameHours}
          onToggle={() => setSameHours(!sameHours)}
          value={sameHours ? `${defaultHours.start} – ${defaultHours.end}` : ''}
        />
        {!sameHours && DAYS.map(d => (
          <SettingValueRow key={d} label={d} value={formatHours(hours[d])} />
        ))}
      </SettingsSection>

      <SettingsSection title="Workweek" description="The workweek start day determines when weekly overtime resets.">
        <SettingValueRow label="Starts on" value={workweekStart} onChange={setWorkweekStart} options={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']} />
      </SettingsSection>
    </div>
  )
}

// ============================================================
// CLOCK SETTINGS PAGE (was "Advanced Time Clock" — minus shared device)
// ============================================================

function ClockSettingsPage({ isCompanyScope, selectedLocation, overrides }) {
  const [isOverridden, setIsOverridden] = useState(overrides?.timeRounding || false)
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
        <ScopeStatus
          isCompanyScope={isCompanyScope}
          isOverridden={isOverridden}
          selectedLocation={selectedLocation}
          settingLabel="time tracking"
          onResetToDefault={() => setIsOverridden(false)}
        />
      </div>

      <SettingsSection title="Auto clock-out" description="Automatically clock out workers who forget to clock out.">
        <SettingToggleRow
          label="Enable auto clock-out"
          onDescription="When on, automatically clock out workers at a set time."
          offDescription="When off, workers will not be automatically clocked out."
          enabled={autoClockOut}
          onToggle={() => setAutoClockOut(!autoClockOut)}
        />
        {autoClockOut && (
          <SettingChildRow>
            <SettingValueRow
              label="Clock-out time"
              description="Workers will be clocked out at this time"
              value={clockOutTime}
              onChange={setClockOutTime}
              options={['10:00 PM', '11:00 PM', '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM']}
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
          onToggle={() => setTimeRounding(!timeRounding)}
        />
        {timeRounding && (
          <SettingChildRow>
            <SettingValueRow
              label="Round to nearest"
              description="Clock in/out times will be rounded to this interval"
              value={`${roundMins} mins`}
              onChange={v => setRoundMins(v.replace(/[^0-9]/g, ''))}
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

function SharedDevicePage() {
  const [biometrics, setBiometrics] = useState(true)

  return (
    <div className="content-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Shared Device</h1>
          <p className="page-subtitle">PIN and biometric settings for shared time clocks</p>
        </div>
      </div>

      <SettingsSection title="Security">
        <SettingValueRow label="Manager PIN" description="Required to access manager functions" value="••••••" onClick={() => {}} />
        <SettingToggleRow
          label="Face ID / Biometrics"
          onDescription="When on, workers can clock in using Face ID or biometrics."
          offDescription="When off, workers must use other methods to clock in."
          enabled={biometrics}
          onToggle={() => setBiometrics(!biometrics)}
        />
      </SettingsSection>
    </div>
  )
}

// ============================================================
// PLACEHOLDER PAGE
// ============================================================

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
 * SettingToggleRow — a row with label + toggle.
 * Shows a current value summary when enabled.
 * Value is editable inline when clicked (not on the toggle).
 */
function SettingToggleRow({ label, description, onDescription, offDescription, enabled, onToggle, value, onValueChange, options }) {
  const displayDescription = enabled ? (onDescription || description) : (offDescription || description)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value || '')

  const handleSave = () => {
    if (onValueChange) onValueChange(draft)
    setEditing(false)
  }

  const handleCancel = () => {
    setDraft(value || '')
    setEditing(false)
  }

  if (editing && enabled) {
    return (
      <div className="ss-row editing">
        <div className="ss-row-text">
          <div className="ss-row-label">{label}</div>
        </div>
        <div className="ss-inline-edit">
          {options ? (
            <select className="ss-inline-select" value={draft} onChange={e => setDraft(e.target.value)} autoFocus>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input className="ss-inline-input" value={draft} onChange={e => setDraft(e.target.value)} autoFocus onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }} />
          )}
          <button className="ss-inline-save" onClick={handleSave}>Save</button>
          <button className="ss-inline-cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="ss-row">
      <div className="ss-row-text">
        <div className="ss-row-label">{label}</div>
        {displayDescription && <div className="ss-row-desc">{displayDescription}</div>}
      </div>
      {enabled && value && (
        <span className="ss-row-value clickable-value" onClick={(e) => { e.stopPropagation(); setEditing(true) }}>{value}</span>
      )}
      <div className={`setting-toggle ${enabled ? 'on' : ''}`} onClick={onToggle}>
        <div className="setting-toggle-thumb" />
      </div>
    </div>
  )
}

/*
 * SettingValueRow — a row that displays a value.
 * Click to expand inline editing.
 * Supports text input or select via `options` prop.
 */
function SettingValueRow({ label, description, value, onChange, options }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const handleSave = () => {
    if (onChange) onChange(draft)
    setEditing(false)
  }

  const handleCancel = () => {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="ss-row editing">
        <div className="ss-row-text">
          <div className="ss-row-label">{label}</div>
        </div>
        <div className="ss-inline-edit">
          {options ? (
            <select className="ss-inline-select" value={draft} onChange={e => setDraft(e.target.value)} autoFocus>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input className="ss-inline-input" value={draft} onChange={e => setDraft(e.target.value)} autoFocus onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }} />
          )}
          <button className="ss-inline-save" onClick={handleSave}>Save</button>
          <button className="ss-inline-cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="ss-row clickable" onClick={() => setEditing(true)}>
      <div className="ss-row-text">
        <div className="ss-row-label">{label}</div>
        {description && <div className="ss-row-desc">{description}</div>}
      </div>
      <span className="ss-row-value">{value}</span>
      <ChevronRight size={16} className="ss-row-chevron" />
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
