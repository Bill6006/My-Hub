(() => {
  'use strict';

  const APP_VERSION = '1.1.0';
  const SCHEMA_VERSION = 2;
  const STORAGE_KEY = 'tyreeHub.state.v1';
  const ROLLBACK_KEY = 'tyreeHub.rollback.v1';
  const CORRUPT_KEY_PREFIX = 'tyreeHub.corrupt.';
  const DEFAULT_CATEGORY_NAMES = ['Personal', 'Coaching', 'Fitness', 'Productivity', 'Work', 'Finance', 'Entertainment', 'Other'];
  const ACCENT_COLORS = ['#7c3aed', '#2563eb', '#16845e', '#d97706', '#dc4c64', '#0891b2', '#4f46e5', '#64748b', '#be185d', '#0f766e'];
  const EMOJI_SUGGESTIONS = ['✨', '🎤', '💬', '🏋️', '🧭', '📅', '🧠', '❤️', '📚', '💼', '💵', '🎵', '🎮', '🌐', '⭐', '🏠', '📝', '⚙️'];
  const ICON_NAMES = ['mic', 'message', 'dumbbell', 'compass', 'calendar', 'checklist', 'brain', 'heart', 'book', 'briefcase', 'wallet', 'music', 'video', 'camera', 'gamepad', 'globe', 'star', 'home', 'notes', 'settings', 'link', 'folder', 'chart', 'sparkles'];

  const DEFAULT_APPS = Object.freeze([
    {
      id: 'default-speech-coach',
      name: 'Speech Coach',
      url: 'https://chatgpt.com/share/6a5da21a-959c-83ea-94cc-076d41ea8854',
      githubUploadUrl: '',
      description: 'Practice communication, speaking, and social confidence.',
      category: 'Coaching',
      iconType: 'library',
      icon: 'mic',
      accent: '#7c3aed',
      openMode: 'new',
      favorite: true,
      hidden: false,
      createdAt: '2026-07-20T00:00:00.000Z',
      updatedAt: '2026-07-20T00:00:00.000Z',
      lastOpenedAt: null,
      isDefault: true
    },
    {
      id: 'default-life-command-center',
      name: 'Life Command Center',
      url: 'https://bill6006.github.io/Command-center/',
      githubUploadUrl: '',
      description: 'Manage goals, routines, priorities, planning, and daily life.',
      category: 'Personal',
      iconType: 'library',
      icon: 'compass',
      accent: '#2563eb',
      openMode: 'new',
      favorite: true,
      hidden: false,
      createdAt: '2026-07-20T00:00:00.000Z',
      updatedAt: '2026-07-20T00:00:00.000Z',
      lastOpenedAt: null,
      isDefault: true
    },
    {
      id: 'default-tailored-training',
      name: 'Tailored Training',
      url: 'https://bill6006.github.io/Tailored-Training/index.html',
      githubUploadUrl: '',
      description: 'Open personalized workouts and track training.',
      category: 'Fitness',
      iconType: 'library',
      icon: 'dumbbell',
      accent: '#16845e',
      openMode: 'new',
      favorite: true,
      hidden: false,
      createdAt: '2026-07-20T00:00:00.000Z',
      updatedAt: '2026-07-20T00:00:00.000Z',
      lastOpenedAt: null,
      isDefault: true
    }
  ]);

  const ICONS = {
    'mic': '<path d="M12 14.5a3.5 3.5 0 0 0 3.5-3.5V6a3.5 3.5 0 1 0-7 0v5a3.5 3.5 0 0 0 3.5 3.5Z"/><path d="M5.5 10.5v.5a6.5 6.5 0 0 0 13 0v-.5M12 17.5V21M9 21h6"/>',
    'message': '<path d="M20 14a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v7Z"/><path d="M8 9h8M8 13h5"/>',
    'dumbbell': '<path d="M6 7v10M3.5 9v6M18 7v10M20.5 9v6M6 12h12M2 11v2M22 11v2"/>',
    'compass': '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z"/>',
    'calendar': '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
    'checklist': '<path d="m4 6 1.5 1.5L8 5M11 6h9M4 12l1.5 1.5L8 11M11 12h9M4 18l1.5 1.5L8 17M11 18h9"/>',
    'brain': '<path d="M9.5 4.5A3 3 0 0 0 4 6.2a3 3 0 0 0 .7 5.3A3.5 3.5 0 0 0 8 17v.5a2.5 2.5 0 0 0 4 2 2.5 2.5 0 0 0 4-2V17a3.5 3.5 0 0 0 3.3-5.5A3 3 0 0 0 20 6.2a3 3 0 0 0-5.5-1.7A3 3 0 0 0 12 3a3 3 0 0 0-2.5 1.5Z"/><path d="M9 8a3 3 0 0 0 3 3V5M15 8a3 3 0 0 1-3 3v8M8 14a3 3 0 0 0 4-1M16 14a3 3 0 0 1-4-1"/>',
    'heart': '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
    'book': '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H12v18H6.5A2.5 2.5 0 0 0 4 22V4.5ZM20 4.5A2.5 2.5 0 0 0 17.5 2H12v18h5.5A2.5 2.5 0 0 1 20 22V4.5Z"/>',
    'briefcase': '<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/>',
    'wallet': '<path d="M4 5h14a2 2 0 0 1 2 2v12H5a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h12"/><path d="M16 11h5v5h-5a2.5 2.5 0 0 1 0-5Z"/>',
    'music': '<path d="M9 18V5l11-2v13M9 9l11-2"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    'video': '<rect x="3" y="5" width="14" height="14" rx="3"/><path d="m17 10 4-2v8l-4-2v-4Z"/>',
    'camera': '<path d="M8 5 9.5 3h5L16 5h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3Z"/><circle cx="12" cy="12.5" r="4"/>',
    'gamepad': '<path d="M8.5 7h7a6 6 0 0 1 5.7 7.8l-.8 2.5a2.5 2.5 0 0 1-4.2 1l-1.4-1.6H9.2l-1.4 1.6a2.5 2.5 0 0 1-4.2-1l-.8-2.5A6 6 0 0 1 8.5 7Z"/><path d="M7 11v4M5 13h4M16 12h.01M18.5 14h.01"/>',
    'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    'star': '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
    'star-filled': '<path d="m12 2.8 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9 2.9-5.9Z"/>',
    'home': '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
    'notes': '<path d="M6 3h9l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h5M8 12h7M8 16h7"/>',
    'settings': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1-2.8 2.8-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1 1.7v.2h-4v-.2a1.8 1.8 0 0 0-1-1.7 1.8 1.8 0 0 0-2 .4l-.1.1-2.8-2.8.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.7-1H2.7v-4h.2a1.8 1.8 0 0 0 1.7-1 1.8 1.8 0 0 0-.4-2l-.1-.1 2.8-2.8.1.1a1.8 1.8 0 0 0 2 .4 1.8 1.8 0 0 0 1-1.7v-.2h4v.2a1.8 1.8 0 0 0 1 1.7 1.8 1.8 0 0 0 2-.4l.1-.1 2.8 2.8-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.7 1h.2v4h-.2a1.8 1.8 0 0 0-1.7 1Z"/>',
    'link': '<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"/>',
    'folder': '<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H5a2 2 0 0 1-2-2V6Z"/>',
    'chart': '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    'sparkles': '<path d="m12 3 1 3a4 4 0 0 0 2.5 2.5l3 1-3 1a4 4 0 0 0-2.5 2.5l-1 3-1-3a4 4 0 0 0-2.5-2.5l-3-1 3-1A4 4 0 0 0 11 6l1-3ZM19 16l.5 1.5L21 18l-1.5.5L19 20l-.5-1.5L17 18l1.5-.5L19 16ZM5 3l.5 1.5L7 5l-1.5.5L5 7l-.5-1.5L3 5l1.5-.5L5 3Z"/>',
    'sun-moon': '<path d="M12 3V2M12 22v-1M4.2 4.2l-.7-.7M20.5 20.5l-.7-.7M3 12H2M22 12h-1M4.2 19.8l-.7.7"/><circle cx="12" cy="12" r="4"/><path d="M18 3.5a5 5 0 0 0 2.5 7.5A7 7 0 0 1 18 3.5Z"/>',
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'search': '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    'x': '<path d="m6 6 12 12M18 6 6 18"/>',
    'edit': '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"/>',
    'grid': '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    'check': '<path d="m5 12 4 4L19 6"/>',
    'palette': '<path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h3a6 6 0 0 0 0-12h-3Z"/><path d="M7 10h.01M9 6h.01M14 6h.01M17 9h.01"/>',
    'monitor': '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    'moon': '<path d="M20.5 15.5A8 8 0 0 1 8.5 3.5a8.5 8.5 0 1 0 12 12Z"/>',
    'download': '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
    'upload': '<path d="M12 21V9M7 14l5-5 5 5M4 3h16"/>',
    'database': '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    'lock': '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
    'refresh': '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
    'trash': '<path d="M4 7h16M9 3h6l1 4H8l1-4ZM7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
    'shield': '<path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-5"/>',
    'info': '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    'alert': '<path d="M10.3 4.2 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
    'arrow-up': '<path d="m6 15 6-6 6 6"/>',
    'arrow-down': '<path d="m6 9 6 6 6-6"/>',
    'more': '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    'copy': '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    'eye-off': '<path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.5 10.5 0 0 1 12 4c5.5 0 9 6 9 6a16 16 0 0 1-2.4 3.1M6.6 6.6C4.3 8.2 3 10 3 10s3.5 6 9 6a9.7 9.7 0 0 0 3.4-.6"/>',
    'eye': '<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="3"/>'
  };

  const dom = {};
  let state;
  let activeFilter = 'all';
  let searchQuery = '';
  let editMode = false;
  let selectedIconType = 'library';
  let selectedIcon = 'link';
  let selectedAccent = ACCENT_COLORS[6];
  let pendingConfirm = null;
  let pendingPinAction = null;
  let pinDialogMode = 'unlock';
  let sessionUnlocked = false;
  let importCandidate = null;
  let deferredInstallPrompt = null;
  let waitingServiceWorker = null;
  let draggedAppId = null;
  const dialogHistory = [];

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function createId() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return `app-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function createInitialState() {
    return {
      schemaVersion: SCHEMA_VERSION,
      appVersion: APP_VERSION,
      apps: deepClone(DEFAULT_APPS),
      customCategories: [],
      settings: {
        theme: 'system',
        onboardingSeen: false,
        managementLock: {
          enabled: false,
          salt: '',
          hash: ''
        }
      },
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
  }

  function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }

  function sanitizeApp(raw, index = 0) {
    const fallback = {
      id: createId(),
      name: `Imported App ${index + 1}`,
      url: 'https://example.com',
      githubUploadUrl: '',
      description: '',
      category: 'Other',
      iconType: 'library',
      icon: 'link',
      accent: ACCENT_COLORS[index % ACCENT_COLORS.length],
      openMode: 'new',
      favorite: false,
      hidden: false,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      lastOpenedAt: null,
      isDefault: false
    };

    const app = { ...fallback, ...(isPlainObject(raw) ? raw : {}) };
    app.id = typeof app.id === 'string' && app.id.trim() ? app.id.trim() : createId();
    app.name = typeof app.name === 'string' && app.name.trim() ? app.name.trim().slice(0, 48) : fallback.name;
    app.url = normalizeUrl(typeof app.url === 'string' ? app.url : fallback.url) || fallback.url;
    app.githubUploadUrl = sanitizeGithubUploadUrl(app.githubUploadUrl);
    app.description = typeof app.description === 'string' ? app.description.trim().slice(0, 140) : '';
    app.category = typeof app.category === 'string' && app.category.trim() ? app.category.trim().slice(0, 32) : 'Other';
    app.iconType = app.iconType === 'emoji' ? 'emoji' : 'library';
    app.icon = typeof app.icon === 'string' && app.icon.trim() ? app.icon.trim().slice(0, 16) : 'link';
    if (app.iconType === 'library' && !ICONS[app.icon]) app.icon = 'link';
    app.accent = isValidHexColor(app.accent) ? app.accent : fallback.accent;
    app.openMode = app.openMode === 'same' ? 'same' : 'new';
    app.favorite = Boolean(app.favorite);
    app.hidden = Boolean(app.hidden);
    app.createdAt = isValidDateString(app.createdAt) ? app.createdAt : nowIso();
    app.updatedAt = isValidDateString(app.updatedAt) ? app.updatedAt : nowIso();
    app.lastOpenedAt = isValidDateString(app.lastOpenedAt) ? app.lastOpenedAt : null;
    app.isDefault = Boolean(app.isDefault);
    return app;
  }

  function validateStoredState(candidate) {
    if (!isPlainObject(candidate) || !Array.isArray(candidate.apps)) return null;
    const schemaVersion = Number(candidate.schemaVersion || 1);
    if (schemaVersion > SCHEMA_VERSION || schemaVersion < 1) return null;

    const uniqueIds = new Set();
    const apps = candidate.apps.map(sanitizeApp).map(app => {
      if (uniqueIds.has(app.id)) app.id = createId();
      uniqueIds.add(app.id);
      return app;
    });

    const settingsRaw = isPlainObject(candidate.settings) ? candidate.settings : {};
    const lockRaw = isPlainObject(settingsRaw.managementLock) ? settingsRaw.managementLock : {};
    return {
      schemaVersion: SCHEMA_VERSION,
      appVersion: APP_VERSION,
      apps,
      customCategories: Array.isArray(candidate.customCategories)
        ? [...new Set(candidate.customCategories.filter(item => typeof item === 'string').map(item => item.trim().slice(0, 32)).filter(Boolean))]
        : [],
      settings: {
        theme: ['system', 'light', 'dark'].includes(settingsRaw.theme) ? settingsRaw.theme : 'system',
        onboardingSeen: Boolean(settingsRaw.onboardingSeen),
        managementLock: {
          enabled: Boolean(lockRaw.enabled && lockRaw.salt && lockRaw.hash),
          salt: typeof lockRaw.salt === 'string' ? lockRaw.salt : '',
          hash: typeof lockRaw.hash === 'string' ? lockRaw.hash : ''
        }
      },
      createdAt: isValidDateString(candidate.createdAt) ? candidate.createdAt : nowIso(),
      updatedAt: isValidDateString(candidate.updatedAt) ? candidate.updatedAt : nowIso()
    };
  }

  function loadState() {
    let raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      queueMicrotask(() => showToast('Browser storage is unavailable. Changes may not persist after this session.', 'error', 7000));
      return createInitialState();
    }
    if (!raw) return createInitialState();
    try {
      const parsed = JSON.parse(raw);
      const validated = validateStoredState(parsed);
      if (!validated) throw new Error('Stored data failed validation.');
      if (Number(parsed.schemaVersion || 1) !== SCHEMA_VERSION) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
        } catch (_) {
          // The migrated state still works for this session if persistence is unavailable.
        }
      }
      return validated;
    } catch (error) {
      try {
        localStorage.setItem(`${CORRUPT_KEY_PREFIX}${Date.now()}`, raw);
      } catch (_) {
        // Continue with defaults even when recovery storage is unavailable.
      }
      queueMicrotask(() => showToast('Stored data was damaged, so Tyree Hub restored its defaults. A recovery copy was preserved when possible.', 'error', 7000));
      return createInitialState();
    }
  }

  function saveState() {
    state.updatedAt = nowIso();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      showToast('Tyree Hub could not save changes. Browser storage may be full or unavailable.', 'error', 7000);
      return false;
    }
  }

  function cacheDom() {
    const ids = [
      'appShell', 'todayLabel', 'themeQuickButton', 'settingsButton', 'heroAddButton', 'searchInput', 'clearSearchButton',
      'filterStrip', 'editModeButton', 'editModeLabel', 'updateBanner', 'updateNowButton', 'viewKicker', 'appsHeading',
      'appCountBadge', 'editNotice', 'exitEditButton', 'appGrid', 'emptyState', 'emptyAddButton', 'homeNavButton',
      'addNavButton', 'manageNavButton', 'settingsNavButton', 'appEditorDialog', 'appEditorForm', 'appEditorKicker',
      'appEditorTitle', 'editingAppId', 'appNameInput', 'appUrlInput', 'developerShortcutsDetails', 'githubUploadUrlInput',
      'githubUploadUrlError', 'openGithubUploadButton', 'appDescriptionInput', 'descriptionCount',
      'appCategoryInput', 'categorySuggestions', 'appOpenModeInput', 'libraryIconModeButton', 'emojiIconModeButton',
      'iconPicker', 'emojiPickerPanel', 'emojiInput', 'emojiSuggestions', 'colorPicker', 'customColorInput',
      'appFavoriteInput', 'appNameError', 'appUrlError', 'settingsDialog', 'installCard', 'installStatusText',
      'installAppButton', 'exportBackupButton', 'importBackupButton', 'importFileInput', 'managementLockToggle',
      'resetPinButton', 'restoreDefaultsButton', 'resetAllButton', 'reopenIntroButton', 'appVersionLabel',
      'schemaVersionLabel', 'confirmDialog', 'confirmForm', 'confirmTitle', 'confirmMessage', 'confirmPhraseField',
      'confirmPhraseLabel', 'confirmPhraseInput', 'confirmPhraseError', 'confirmCancelButton', 'confirmActionButton',
      'pinDialog', 'pinForm', 'pinTitle', 'pinMessage', 'pinInput', 'pinConfirmField', 'pinConfirmInput', 'pinError',
      'pinCancelButton', 'pinSubmitButton', 'onboardingDialog', 'introAddButton', 'introDoneButton',
      'importPreviewDialog', 'importPreviewSummary', 'importStats', 'importWarnings', 'importCancelButton',
      'mergeImportButton', 'replaceImportButton', 'toastRegion', 'appCardTemplate'
    ];
    ids.forEach(id => { dom[id] = document.getElementById(id); });
  }

  function svgIcon(name, label = '') {
    const body = ICONS[name] || ICONS.link;
    const filled = name === 'star-filled';
    return `<svg viewBox="0 0 24 24" aria-hidden="${label ? 'false' : 'true'}"${label ? ` role="img"><title>${escapeHtml(label)}</title>` : '>'}${body}</svg>`;
  }

  function hydrateIcons(root = document) {
    root.querySelectorAll('[data-icon]').forEach(element => {
      element.innerHTML = svgIcon(element.dataset.icon);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function isValidDateString(value) {
    return typeof value === 'string' && !Number.isNaN(Date.parse(value));
  }

  function isValidHexColor(value) {
    return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
  }

  function normalizeUrl(value) {
    let input = String(value || '').trim();
    if (!input) return null;
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(input)) input = `https://${input}`;
    try {
      const url = new URL(input);
      if (!['http:', 'https:'].includes(url.protocol)) return null;
      return url.href;
    } catch (_) {
      return null;
    }
  }

  function isValidGithubUploadUrl(value) {
    const input = String(value || '').trim();
    if (!input) return false;
    try {
      const url = new URL(input);
      const segments = url.pathname.split('/').filter(Boolean);
      return url.protocol === 'https:'
        && url.hostname.toLowerCase() === 'github.com'
        && segments.length >= 4
        && segments[2].toLowerCase() === 'upload'
        && Boolean(segments[0] && segments[1] && segments[3]);
    } catch (_) {
      return false;
    }
  }

  function sanitizeGithubUploadUrl(value) {
    const input = typeof value === 'string' ? value.trim() : '';
    return isValidGithubUploadUrl(input) ? input : '';
  }

  function openExternalUrl(url) {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function openGithubUploadUrl(value) {
    const url = sanitizeGithubUploadUrl(value);
    if (!url) {
      showToast('This app does not have a valid GitHub upload shortcut.', 'error');
      return;
    }
    openExternalUrl(url);
  }

  function getCategories() {
    const appCategories = state.apps.map(app => app.category).filter(Boolean);
    return [...new Set([...DEFAULT_CATEGORY_NAMES, ...state.customCategories, ...appCategories])].sort((a, b) => a.localeCompare(b));
  }

  function applyTheme(theme = state.settings.theme) {
    let resolved = theme;
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.dataset.theme = resolved;
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      const isDarkMeta = meta.media && meta.media.includes('dark');
      meta.setAttribute('content', resolved === 'dark'
        ? (isDarkMeta ? '#111827' : '#111827')
        : '#f4f7fb');
    });
    document.querySelectorAll('input[name="theme"]').forEach(input => {
      input.checked = input.value === theme;
    });
  }

  function cycleTheme() {
    const order = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(state.settings.theme) + 1) % order.length];
    state.settings.theme = next;
    saveState();
    applyTheme(next);
    showToast(`Theme set to ${next}.`, 'info');
  }

  function setTodayLabel() {
    const formatter = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    dom.todayLabel.textContent = formatter.format(new Date());
  }

  function renderFilters() {
    const categories = getCategories().filter(category => state.apps.some(app => app.category === category));
    const filters = [
      { id: 'all', label: 'All Apps' },
      { id: 'favorites', label: 'Favorites' },
      { id: 'recent', label: 'Recently Opened' },
      ...categories.map(category => ({ id: `category:${category}`, label: category }))
    ];

    if (!filters.some(filter => filter.id === activeFilter)) activeFilter = 'all';
    dom.filterStrip.replaceChildren(...filters.map(filter => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `filter-chip${filter.id === activeFilter ? ' active' : ''}`;
      button.textContent = filter.label;
      button.dataset.filter = filter.id;
      button.setAttribute('aria-pressed', String(filter.id === activeFilter));
      return button;
    }));
  }

  function getVisibleApps() {
    const query = searchQuery.trim().toLocaleLowerCase();
    let apps = state.apps.filter(app => editMode || !app.hidden);

    if (activeFilter === 'favorites') {
      apps = apps.filter(app => app.favorite);
    } else if (activeFilter === 'recent') {
      apps = apps.filter(app => app.lastOpenedAt).sort((a, b) => Date.parse(b.lastOpenedAt) - Date.parse(a.lastOpenedAt));
    } else if (activeFilter.startsWith('category:')) {
      const category = activeFilter.slice('category:'.length);
      apps = apps.filter(app => app.category === category);
    } else if (!editMode) {
      apps = apps
        .map((app, index) => ({ app, index }))
        .sort((a, b) => Number(b.app.favorite) - Number(a.app.favorite) || a.index - b.index)
        .map(item => item.app);
    }

    if (query) {
      apps = apps.filter(app => `${app.name} ${app.description} ${app.category}`.toLocaleLowerCase().includes(query));
    }
    return apps;
  }

  function renderAppIcon(container, app) {
    if (app.iconType === 'emoji') {
      container.textContent = app.icon || '✨';
    } else {
      container.innerHTML = svgIcon(app.icon);
    }
  }

  function buildAppCard(app) {
    const fragment = dom.appCardTemplate.content.cloneNode(true);
    const card = fragment.querySelector('.app-card');
    const main = fragment.querySelector('.app-card-main');
    const icon = fragment.querySelector('.app-card-icon');
    const category = fragment.querySelector('.app-card-category');
    const favorite = fragment.querySelector('.favorite-indicator');
    const name = fragment.querySelector('.app-card-name');
    const description = fragment.querySelector('.app-card-description');
    const moreMenu = fragment.querySelector('.card-more-menu');
    const hideLabel = fragment.querySelector('.hide-action-label');
    const hideIcon = fragment.querySelector('[data-action="hide"] [data-icon]');
    const githubUploadAction = fragment.querySelector('[data-action="github-upload"]');

    card.dataset.appId = app.id;
    card.style.setProperty('--accent', app.accent);
    card.classList.toggle('hidden-app', app.hidden);
    card.draggable = editMode && matchMedia('(hover: hover) and (pointer: fine)').matches;
    main.setAttribute('aria-label', editMode ? `Edit ${app.name}` : `Open ${app.name}`);
    renderAppIcon(icon, app);
    category.textContent = app.category || 'Other';
    favorite.classList.toggle('visible', app.favorite);
    name.textContent = app.name;
    description.textContent = app.description || app.url;
    hideLabel.textContent = app.hidden ? 'Show' : 'Hide';
    hideIcon.dataset.icon = app.hidden ? 'eye' : 'eye-off';
    githubUploadAction.hidden = !isValidGithubUploadUrl(app.githubUploadUrl);
    hydrateIcons(card);

    main.addEventListener('click', () => {
      if (editMode) runProtected(() => openAppEditor(app));
      else openApp(app);
    });

    card.querySelectorAll('[data-action]').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation();
        handleCardAction(app.id, button.dataset.action, moreMenu);
      });
    });

    card.addEventListener('dragstart', event => {
      if (!editMode) return event.preventDefault();
      draggedAppId = app.id;
      card.classList.add('dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', app.id);
    });
    card.addEventListener('dragend', () => {
      draggedAppId = null;
      card.classList.remove('dragging');
      document.querySelectorAll('.drag-over').forEach(item => item.classList.remove('drag-over'));
    });
    card.addEventListener('dragover', event => {
      if (!editMode || !draggedAppId || draggedAppId === app.id) return;
      event.preventDefault();
      card.classList.add('drag-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', event => {
      event.preventDefault();
      card.classList.remove('drag-over');
      if (draggedAppId && draggedAppId !== app.id) reorderAppBefore(draggedAppId, app.id);
    });

    return fragment;
  }

  function renderApps() {
    renderFilters();
    const apps = getVisibleApps();
    dom.appGrid.replaceChildren();
    dom.appShell.classList.toggle('edit-mode', editMode);
    dom.editNotice.hidden = !editMode;
    dom.editModeButton.setAttribute('aria-pressed', String(editMode));
    dom.editModeLabel.textContent = editMode ? 'Finish editing' : 'Edit apps';
    dom.manageNavButton.classList.toggle('active', editMode);
    dom.homeNavButton.classList.toggle('active', !editMode);
    dom.homeNavButton.toggleAttribute('aria-current', !editMode);
    dom.manageNavButton.toggleAttribute('aria-current', editMode);

    const headings = {
      all: ['Dashboard', 'Your apps'],
      favorites: ['Pinned first', 'Favorites'],
      recent: ['Latest activity', 'Recently opened']
    };
    const [kicker, heading] = headings[activeFilter] || ['Category', activeFilter.replace('category:', '')];
    dom.viewKicker.textContent = kicker;
    dom.appsHeading.textContent = heading;
    dom.appCountBadge.textContent = `${apps.length} ${apps.length === 1 ? 'app' : 'apps'}`;

    apps.forEach(app => dom.appGrid.appendChild(buildAppCard(app)));

    if (!searchQuery && activeFilter === 'all' && !editMode) {
      const addButton = document.createElement('button');
      addButton.type = 'button';
      addButton.className = 'add-app-card';
      addButton.innerHTML = `<span class="add-app-card-inner"><span class="plus-orb">${svgIcon('plus')}</span><strong>Add another app</strong><small>Build out your personal launcher.</small></span>`;
      addButton.addEventListener('click', () => runProtected(() => openAppEditor()));
      dom.appGrid.appendChild(addButton);
    }

    dom.emptyState.hidden = apps.length > 0 || (!searchQuery && activeFilter === 'all' && !editMode);
    dom.appGrid.hidden = !dom.emptyState.hidden;
  }

  function openApp(app) {
    const index = state.apps.findIndex(item => item.id === app.id);
    if (index >= 0) {
      state.apps[index].lastOpenedAt = nowIso();
      saveState();
    }
    if (app.openMode === 'same') {
      window.location.assign(app.url);
      return;
    }
    openExternalUrl(app.url);
  }

  function handleCardAction(appId, action, menu) {
    const app = state.apps.find(item => item.id === appId);
    if (!app) return;

    if (action === 'more') {
      closeAllCardMenus(menu);
      menu.hidden = !menu.hidden;
      return;
    }

    runProtected(() => {
      if (action === 'favorite') {
        app.favorite = !app.favorite;
        app.updatedAt = nowIso();
        saveState();
        renderApps();
        showToast(app.favorite ? 'Added to favorites.' : 'Removed from favorites.', 'success');
      } else if (action === 'move-up') {
        moveApp(app.id, -1);
      } else if (action === 'move-down') {
        moveApp(app.id, 1);
      } else if (action === 'edit') {
        openAppEditor(app);
      } else if (action === 'github-upload') {
        openGithubUploadUrl(app.githubUploadUrl);
      } else if (action === 'duplicate') {
        duplicateApp(app);
      } else if (action === 'hide') {
        app.hidden = !app.hidden;
        app.updatedAt = nowIso();
        saveState();
        renderApps();
        showToast(app.hidden ? `${app.name} is hidden.` : `${app.name} is visible again.`, 'success');
      } else if (action === 'delete') {
        showConfirm({
          title: `Delete ${app.name}?`,
          message: 'This removes the launcher from Tyree Hub. The linked website is not affected.',
          confirmLabel: 'Delete app',
          onConfirm: () => deleteApp(app.id)
        });
      }
    });
  }

  function closeAllCardMenus(except = null) {
    document.querySelectorAll('.card-more-menu').forEach(menu => {
      if (menu !== except) menu.hidden = true;
    });
  }

  function moveApp(appId, delta) {
    const index = state.apps.findIndex(app => app.id === appId);
    const target = index + delta;
    if (index < 0 || target < 0 || target >= state.apps.length) {
      showToast(delta < 0 ? 'This app is already first.' : 'This app is already last.', 'info');
      return;
    }
    [state.apps[index], state.apps[target]] = [state.apps[target], state.apps[index]];
    saveState();
    renderApps();
  }

  function reorderAppBefore(sourceId, targetId) {
    const sourceIndex = state.apps.findIndex(app => app.id === sourceId);
    const targetIndex = state.apps.findIndex(app => app.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const [source] = state.apps.splice(sourceIndex, 1);
    const adjustedTarget = state.apps.findIndex(app => app.id === targetId);
    state.apps.splice(adjustedTarget, 0, source);
    saveState();
    renderApps();
    showToast('App order updated.', 'success');
  }

  function duplicateApp(app) {
    const copy = {
      ...deepClone(app),
      id: createId(),
      name: `${app.name} Copy`.slice(0, 48),
      favorite: false,
      hidden: false,
      isDefault: false,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      lastOpenedAt: null
    };
    const index = state.apps.findIndex(item => item.id === app.id);
    state.apps.splice(index + 1, 0, copy);
    saveState();
    renderApps();
    showToast('App duplicated.', 'success');
  }

  function deleteApp(appId) {
    const index = state.apps.findIndex(app => app.id === appId);
    if (index < 0) return;
    const [removed] = state.apps.splice(index, 1);
    saveState();
    renderApps();
    showToast(`${removed.name} was deleted.`, 'success');
  }

  function renderEditorPickers() {
    dom.iconPicker.replaceChildren(...ICON_NAMES.map(name => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `icon-choice${selectedIconType === 'library' && selectedIcon === name ? ' selected' : ''}`;
      button.dataset.iconName = name;
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', String(selectedIconType === 'library' && selectedIcon === name));
      button.setAttribute('aria-label', name.replaceAll('-', ' '));
      button.innerHTML = svgIcon(name);
      button.addEventListener('click', () => {
        selectedIconType = 'library';
        selectedIcon = name;
        setIconMode('library');
        renderEditorPickers();
      });
      return button;
    }));

    dom.emojiSuggestions.replaceChildren(...EMOJI_SUGGESTIONS.map(emoji => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `emoji-choice${selectedIconType === 'emoji' && selectedIcon === emoji ? ' selected' : ''}`;
      button.textContent = emoji;
      button.setAttribute('aria-label', `Use ${emoji}`);
      button.addEventListener('click', () => {
        selectedIconType = 'emoji';
        selectedIcon = emoji;
        dom.emojiInput.value = emoji;
        renderEditorPickers();
      });
      return button;
    }));

    dom.colorPicker.replaceChildren(...ACCENT_COLORS.map(color => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `color-choice${selectedAccent.toLowerCase() === color.toLowerCase() ? ' selected' : ''}`;
      button.style.setProperty('--choice-color', color);
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', String(selectedAccent.toLowerCase() === color.toLowerCase()));
      button.setAttribute('aria-label', `Use color ${color}`);
      button.addEventListener('click', () => {
        selectedAccent = color;
        dom.customColorInput.value = color;
        renderEditorPickers();
      });
      return button;
    }));
  }

  function renderCategorySuggestions() {
    dom.categorySuggestions.replaceChildren(...getCategories().map(category => {
      const option = document.createElement('option');
      option.value = category;
      return option;
    }));
  }

  function setIconMode(mode) {
    selectedIconType = mode;
    dom.libraryIconModeButton.classList.toggle('active', mode === 'library');
    dom.libraryIconModeButton.setAttribute('aria-selected', String(mode === 'library'));
    dom.emojiIconModeButton.classList.toggle('active', mode === 'emoji');
    dom.emojiIconModeButton.setAttribute('aria-selected', String(mode === 'emoji'));
    dom.iconPicker.hidden = mode !== 'library';
    dom.emojiPickerPanel.hidden = mode !== 'emoji';
  }

  function openAppEditor(app = null) {
    const editing = Boolean(app);
    dom.appEditorKicker.textContent = editing ? 'Edit launcher' : 'New launcher';
    dom.appEditorTitle.textContent = editing ? `Edit ${app.name}` : 'Add app';
    dom.editingAppId.value = app?.id || '';
    dom.appNameInput.value = app?.name || '';
    dom.appUrlInput.value = app?.url || '';
    dom.githubUploadUrlInput.value = app?.githubUploadUrl || '';
    dom.developerShortcutsDetails.open = Boolean(app?.githubUploadUrl);
    dom.appDescriptionInput.value = app?.description || '';
    dom.descriptionCount.textContent = String((app?.description || '').length);
    dom.appCategoryInput.value = app?.category || 'Personal';
    dom.appOpenModeInput.value = app?.openMode || 'new';
    dom.appFavoriteInput.checked = Boolean(app?.favorite);
    selectedIconType = app?.iconType || 'library';
    selectedIcon = app?.icon || (editing ? 'link' : 'sparkles');
    selectedAccent = app?.accent || ACCENT_COLORS[state.apps.length % ACCENT_COLORS.length];
    dom.customColorInput.value = selectedAccent;
    dom.emojiInput.value = selectedIconType === 'emoji' ? selectedIcon : '';
    dom.appNameError.textContent = '';
    dom.appUrlError.textContent = '';
    dom.githubUploadUrlError.textContent = '';
    syncGithubUploadTestButton();
    setIconMode(selectedIconType);
    renderCategorySuggestions();
    renderEditorPickers();
    openDialog(dom.appEditorDialog);
    setTimeout(() => dom.appNameInput.focus(), 150);
  }

  function syncGithubUploadTestButton() {
    dom.openGithubUploadButton.hidden = !isValidGithubUploadUrl(dom.githubUploadUrlInput.value);
  }

  function validateAppEditor() {
    const name = dom.appNameInput.value.trim();
    const normalizedUrl = normalizeUrl(dom.appUrlInput.value);
    const githubUploadUrl = String(dom.githubUploadUrlInput.value || '').trim();
    const githubUploadValid = !githubUploadUrl || isValidGithubUploadUrl(githubUploadUrl);
    dom.appNameError.textContent = name ? '' : 'Enter an app name.';
    dom.appUrlError.textContent = normalizedUrl ? '' : 'Enter a valid http or https website address.';
    dom.githubUploadUrlError.textContent = githubUploadValid
      ? ''
      : 'Enter a valid secure GitHub upload URL, or leave this field blank.';
    if (!name) dom.appNameInput.focus();
    else if (!normalizedUrl) dom.appUrlInput.focus();
    else if (!githubUploadValid) {
      dom.developerShortcutsDetails.open = true;
      dom.githubUploadUrlInput.focus();
    }
    return name && normalizedUrl && githubUploadValid
      ? { name, normalizedUrl, githubUploadUrl }
      : null;
  }

  function saveAppFromEditor() {
    const validation = validateAppEditor();
    if (!validation) return;

    let icon = selectedIcon;
    if (selectedIconType === 'emoji') icon = dom.emojiInput.value.trim() || selectedIcon || '✨';
    const category = dom.appCategoryInput.value.trim().slice(0, 32) || 'Other';
    if (!DEFAULT_CATEGORY_NAMES.includes(category) && !state.customCategories.includes(category)) {
      state.customCategories.push(category);
    }

    const editingId = dom.editingAppId.value;
    const existingIndex = state.apps.findIndex(app => app.id === editingId);
    const timestamp = nowIso();
    const appData = {
      name: validation.name.slice(0, 48),
      url: validation.normalizedUrl,
      githubUploadUrl: validation.githubUploadUrl,
      description: dom.appDescriptionInput.value.trim().slice(0, 140),
      category,
      iconType: selectedIconType,
      icon,
      accent: isValidHexColor(selectedAccent) ? selectedAccent : ACCENT_COLORS[6],
      openMode: dom.appOpenModeInput.value === 'same' ? 'same' : 'new',
      favorite: dom.appFavoriteInput.checked,
      hidden: existingIndex >= 0 ? state.apps[existingIndex].hidden : false,
      updatedAt: timestamp
    };

    if (existingIndex >= 0) {
      state.apps[existingIndex] = { ...state.apps[existingIndex], ...appData };
      showToast('App updated.', 'success');
    } else {
      state.apps.push({
        id: createId(),
        ...appData,
        createdAt: timestamp,
        lastOpenedAt: null,
        isDefault: false
      });
      showToast('App added to Tyree Hub.', 'success');
    }

    saveState();
    closeDialog(dom.appEditorDialog);
    renderApps();
  }

  function openSettings() {
    syncSettingsUi();
    openDialog(dom.settingsDialog);
  }

  function syncSettingsUi() {
    applyTheme();
    dom.managementLockToggle.checked = state.settings.managementLock.enabled;
    dom.resetPinButton.hidden = !state.settings.managementLock.enabled;
    dom.appVersionLabel.textContent = APP_VERSION;
    dom.schemaVersionLabel.textContent = String(SCHEMA_VERSION);
    updateInstallUi();
  }

  function runProtected(action) {
    if (!state.settings.managementLock.enabled || sessionUnlocked) {
      action();
      return;
    }
    pendingPinAction = action;
    pinDialogMode = 'unlock';
    configurePinDialog();
    openDialog(dom.pinDialog);
    setTimeout(() => dom.pinInput.focus(), 120);
  }

  function configurePinDialog() {
    const setup = pinDialogMode === 'setup';
    dom.pinTitle.textContent = setup ? 'Create Management PIN' : 'Unlock management';
    dom.pinMessage.textContent = setup
      ? 'Choose a four-digit PIN to protect editing and data changes on this device.'
      : 'Enter your four-digit PIN to continue.';
    dom.pinConfirmField.hidden = !setup;
    dom.pinSubmitButton.textContent = setup ? 'Enable lock' : 'Unlock';
    dom.pinInput.value = '';
    dom.pinConfirmInput.value = '';
    dom.pinError.textContent = '';
  }

  async function handlePinSubmit() {
    const pin = dom.pinInput.value.trim();
    if (!/^\d{4}$/.test(pin)) {
      dom.pinError.textContent = 'Enter exactly four digits.';
      dom.pinInput.focus();
      return;
    }

    if (pinDialogMode === 'setup') {
      if (dom.pinConfirmInput.value.trim() !== pin) {
        dom.pinError.textContent = 'The PIN entries do not match.';
        dom.pinConfirmInput.focus();
        return;
      }
      const salt = createSalt();
      const hash = await hashPin(pin, salt);
      state.settings.managementLock = { enabled: true, salt, hash };
      sessionUnlocked = true;
      saveState();
      closeDialog(dom.pinDialog);
      syncSettingsUi();
      showToast('Management Lock enabled.', 'success');
      return;
    }

    const { salt, hash } = state.settings.managementLock;
    const candidate = await hashPin(pin, salt);
    if (candidate !== hash) {
      dom.pinError.textContent = 'That PIN is incorrect.';
      dom.pinInput.select();
      return;
    }
    sessionUnlocked = true;
    closeDialog(dom.pinDialog);
    const action = pendingPinAction;
    pendingPinAction = null;
    showToast('Management unlocked for this session.', 'success');
    action?.();
  }

  function createSalt() {
    const bytes = new Uint8Array(16);
    if (globalThis.crypto?.getRandomValues) {
      globalThis.crypto.getRandomValues(bytes);
    } else {
      for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
    }
    return [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async function hashPin(pin, salt) {
    const input = `${salt}:${pin}`;
    if (globalThis.crypto?.subtle) {
      const data = new TextEncoder().encode(input);
      const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
      return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Compatibility fallback for non-secure or restricted browser contexts.
    // Management Lock is convenience protection, not cryptographic security.
    const seeds = [0x811c9dc5, 0x9e3779b1, 0x85ebca6b, 0xc2b2ae35, 0x27d4eb2f, 0x165667b1, 0xd3a2646c, 0xfd7046c5];
    return seeds.map(seed => {
      let hash = seed >>> 0;
      for (let index = 0; index < input.length; index += 1) {
        hash ^= input.charCodeAt(index);
        hash = Math.imul(hash, 0x01000193) >>> 0;
        hash = (hash ^ (hash >>> 13)) >>> 0;
      }
      return hash.toString(16).padStart(8, '0');
    }).join('');
  }

  function handleManagementLockToggle() {
    if (dom.managementLockToggle.checked && !state.settings.managementLock.enabled) {
      dom.managementLockToggle.checked = false;
      pinDialogMode = 'setup';
      configurePinDialog();
      openDialog(dom.pinDialog);
      setTimeout(() => dom.pinInput.focus(), 120);
      return;
    }

    if (!dom.managementLockToggle.checked && state.settings.managementLock.enabled) {
      dom.managementLockToggle.checked = true;
      runProtected(() => {
        state.settings.managementLock = { enabled: false, salt: '', hash: '' };
        sessionUnlocked = false;
        saveState();
        syncSettingsUi();
        showToast('Management Lock disabled.', 'success');
      });
    }
  }

  function resetManagementLock() {
    showConfirm({
      title: 'Reset Management Lock?',
      message: 'This disables the local PIN without deleting your apps. It is intentionally available as a lockout recovery method.',
      confirmLabel: 'Reset lock',
      phrase: 'RESET',
      onConfirm: () => {
        state.settings.managementLock = { enabled: false, salt: '', hash: '' };
        sessionUnlocked = false;
        saveState();
        syncSettingsUi();
        showToast('Management Lock was reset.', 'success');
      }
    });
  }

  function showConfirm({ title, message, confirmLabel = 'Confirm', phrase = '', onConfirm }) {
    pendingConfirm = onConfirm;
    dom.confirmTitle.textContent = title;
    dom.confirmMessage.textContent = message;
    dom.confirmActionButton.textContent = confirmLabel;
    dom.confirmPhraseField.hidden = !phrase;
    dom.confirmPhraseLabel.textContent = phrase ? `Type ${phrase} to continue` : '';
    dom.confirmPhraseInput.value = '';
    dom.confirmPhraseInput.dataset.requiredPhrase = phrase;
    dom.confirmPhraseError.textContent = '';
    openDialog(dom.confirmDialog);
    if (phrase) setTimeout(() => dom.confirmPhraseInput.focus(), 120);
  }

  function handleConfirmSubmit() {
    const phrase = dom.confirmPhraseInput.dataset.requiredPhrase || '';
    if (phrase && dom.confirmPhraseInput.value.trim() !== phrase) {
      dom.confirmPhraseError.textContent = `Enter ${phrase} exactly.`;
      dom.confirmPhraseInput.focus();
      return;
    }
    const action = pendingConfirm;
    pendingConfirm = null;
    closeDialog(dom.confirmDialog);
    action?.();
  }

  function exportBackup() {
    const exportState = deepClone(state);
    exportState.settings.managementLock = { enabled: false, salt: '', hash: '' };
    const backup = {
      kind: 'tyree-hub-backup',
      backupVersion: 1,
      schemaVersion: SCHEMA_VERSION,
      appVersion: APP_VERSION,
      createdAt: nowIso(),
      note: 'Management Lock PIN data is intentionally excluded from portable backups.',
      data: exportState
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `tyree-hub-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Backup exported.', 'success');
  }

  function validateBackupObject(candidate) {
    if (!isPlainObject(candidate) || candidate.kind !== 'tyree-hub-backup') {
      throw new Error('This is not a Tyree Hub backup file.');
    }
    if (Number(candidate.schemaVersion) > SCHEMA_VERSION) {
      throw new Error('This backup was created by a newer, unsupported data schema.');
    }
    const rawApps = Array.isArray(candidate.data?.apps) ? candidate.data.apps : [];
    const invalidGithubUploadUrls = rawApps.filter(app => {
      const value = isPlainObject(app) && typeof app.githubUploadUrl === 'string' ? app.githubUploadUrl.trim() : '';
      return Boolean(value) && !isValidGithubUploadUrl(value);
    }).length;
    const validated = validateStoredState(candidate.data);
    if (!validated) throw new Error('The backup data is incomplete or damaged.');
    validated.settings.managementLock = { enabled: false, salt: '', hash: '' };
    return { validated, warnings: { invalidGithubUploadUrls } };
  }

  async function readImportFile(file) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
      showToast('Choose a JSON backup file.', 'error');
      return;
    }
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const { validated, warnings } = validateBackupObject(parsed);
      importCandidate = validated;
      showImportPreview(validated, parsed.createdAt, warnings);
    } catch (error) {
      showToast(error.message || 'The backup could not be read.', 'error', 7000);
    } finally {
      dom.importFileInput.value = '';
    }
  }

  function showImportPreview(candidate, createdAt, validationWarnings = {}) {
    const duplicateUrls = candidate.apps.filter(imported => state.apps.some(existing => existing.url === imported.url)).length;
    const customCount = candidate.apps.filter(app => !app.isDefault).length;
    const categories = new Set(candidate.apps.map(app => app.category)).size;
    dom.importPreviewSummary.textContent = createdAt && isValidDateString(createdAt)
      ? `Backup created ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(createdAt))}.`
      : 'Review the backup before applying it.';
    dom.importStats.innerHTML = `
      <div class="import-stat"><strong>${candidate.apps.length}</strong><span>Total apps</span></div>
      <div class="import-stat"><strong>${customCount}</strong><span>Custom apps</span></div>
      <div class="import-stat"><strong>${categories}</strong><span>Categories</span></div>`;
    const warnings = [];
    if (duplicateUrls) {
      warnings.push(`${duplicateUrls} link${duplicateUrls === 1 ? '' : 's'} already exist in your current hub. Merge mode will skip duplicate URLs.`);
    }
    if (validationWarnings.invalidGithubUploadUrls) {
      const count = validationWarnings.invalidGithubUploadUrls;
      warnings.push(`${count} invalid GitHub upload shortcut${count === 1 ? '' : 's'} will be ignored while the related app data is preserved.`);
    }
    dom.importWarnings.hidden = warnings.length === 0;
    dom.importWarnings.textContent = warnings.join(' ');
    openDialog(dom.importPreviewDialog);
  }

  function applyImport(mode) {
    if (!importCandidate) return;
    const previous = JSON.stringify(state);
    try {
      localStorage.setItem(ROLLBACK_KEY, previous);
      if (mode === 'replace') {
        state = validateStoredState(importCandidate);
      } else {
        const existingUrls = new Set(state.apps.map(app => app.url));
        const existingIds = new Set(state.apps.map(app => app.id));
        let added = 0;
        importCandidate.apps.forEach(importedApp => {
          if (existingUrls.has(importedApp.url)) return;
          const app = deepClone(importedApp);
          if (existingIds.has(app.id)) app.id = createId();
          app.isDefault = DEFAULT_APPS.some(defaultApp => defaultApp.id === app.id);
          state.apps.push(app);
          existingUrls.add(app.url);
          existingIds.add(app.id);
          added += 1;
        });
        state.customCategories = [...new Set([...state.customCategories, ...importCandidate.customCategories])];
        state.updatedAt = nowIso();
        showToast(`${added} app${added === 1 ? '' : 's'} merged into Tyree Hub.`, 'success');
      }
      state.settings.managementLock = { enabled: false, salt: '', hash: '' };
      sessionUnlocked = false;
      if (!saveState()) throw new Error('The imported data could not be saved.');
      closeDialog(dom.importPreviewDialog);
      importCandidate = null;
      applyTheme();
      syncSettingsUi();
      renderApps();
      if (mode === 'replace') showToast('Backup restored successfully.', 'success');
    } catch (error) {
      try {
        const rollback = localStorage.getItem(ROLLBACK_KEY);
        if (rollback) state = validateStoredState(JSON.parse(rollback)) || createInitialState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (_) {
        state = createInitialState();
      }
      renderApps();
      showToast('Import failed. Your previous data was restored.', 'error', 7000);
    }
  }

  function restoreDefaultApps() {
    showConfirm({
      title: 'Restore default apps?',
      message: 'The three original launchers will be restored to their exact names, links, icons, and colors. Your custom apps will remain.',
      confirmLabel: 'Restore defaults',
      onConfirm: () => {
        const defaultIds = new Set(DEFAULT_APPS.map(app => app.id));
        const customApps = state.apps.filter(app => !defaultIds.has(app.id));
        state.apps = [...deepClone(DEFAULT_APPS), ...customApps];
        saveState();
        renderApps();
        showToast('Default apps restored.', 'success');
      }
    });
  }

  function resetAllData() {
    showConfirm({
      title: 'Reset all Tyree Hub data?',
      message: 'This deletes custom apps, ordering, favorites, recent activity, categories, and settings on this device. Export a backup first if you may need them later.',
      confirmLabel: 'Reset everything',
      phrase: 'RESET',
      onConfirm: () => {
        state = createInitialState();
        sessionUnlocked = false;
        saveState();
        activeFilter = 'all';
        searchQuery = '';
        dom.searchInput.value = '';
        applyTheme();
        syncSettingsUi();
        renderApps();
        showToast('Tyree Hub was reset.', 'success');
      }
    });
  }

  function showOnboarding(force = false) {
    if (force || !state.settings.onboardingSeen) openDialog(dom.onboardingDialog);
  }

  function dismissOnboarding(openEditorAfter = false) {
    state.settings.onboardingSeen = true;
    saveState();
    closeDialog(dom.onboardingDialog);
    if (openEditorAfter) setTimeout(() => runProtected(() => openAppEditor()), 220);
  }

  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    closeAllCardMenus();
    dialog.showModal();
    dialogHistory.push(dialog);
    try {
      history.pushState({ tyreeHubDialog: true }, '');
    } catch (_) {
      // Dialogs still work when history is unavailable.
    }
  }

  function closeDialog(dialog) {
    if (!dialog?.open) return;
    if (history.state?.tyreeHubDialog) {
      history.back();
    } else {
      dialog.close();
      removeDialogFromHistory(dialog);
    }
  }

  function removeDialogFromHistory(dialog) {
    const index = dialogHistory.lastIndexOf(dialog);
    if (index >= 0) dialogHistory.splice(index, 1);
  }

  function handlePopState() {
    const dialog = [...dialogHistory].reverse().find(item => item.open);
    if (dialog) {
      dialog.close();
      removeDialogFromHistory(dialog);
    }
  }

  function showToast(message, type = 'info', duration = 3500) {
    if (!dom.toastRegion) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    dom.toastRegion.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 220);
    }, duration);
  }

  function updateInstallUi() {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (standalone) {
      dom.installAppButton.hidden = true;
      dom.installStatusText.textContent = 'Tyree Hub is installed on this device.';
    } else if (deferredInstallPrompt) {
      dom.installAppButton.hidden = false;
      dom.installStatusText.textContent = 'Install it for an app-like Android experience.';
    } else {
      dom.installAppButton.hidden = true;
      dom.installStatusText.textContent = 'Use your browser menu and choose Install app or Add to Home screen.';
    }
  }

  async function promptInstall() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    updateInstallUi();
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
        if (registration.waiting) showUpdateAvailable(registration.waiting);
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdateAvailable(worker);
          });
        });
        setInterval(() => registration.update().catch(() => {}), 60 * 60 * 1000);
      } catch (error) {
        console.warn('Tyree Hub service worker registration failed:', error);
      }
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }

  function showUpdateAvailable(worker) {
    waitingServiceWorker = worker;
    dom.updateBanner.hidden = false;
  }

  function initializeEvents() {
    dom.themeQuickButton.addEventListener('click', cycleTheme);
    dom.settingsButton.addEventListener('click', openSettings);
    dom.settingsNavButton.addEventListener('click', openSettings);
    dom.heroAddButton.addEventListener('click', () => runProtected(() => openAppEditor()));
    dom.addNavButton.addEventListener('click', () => runProtected(() => openAppEditor()));
    dom.emptyAddButton.addEventListener('click', () => runProtected(() => openAppEditor()));

    dom.editModeButton.addEventListener('click', toggleEditMode);
    dom.manageNavButton.addEventListener('click', toggleEditMode);
    dom.exitEditButton.addEventListener('click', () => {
      editMode = false;
      renderApps();
    });
    dom.homeNavButton.addEventListener('click', () => {
      editMode = false;
      activeFilter = 'all';
      searchQuery = '';
      dom.searchInput.value = '';
      dom.clearSearchButton.hidden = true;
      renderApps();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    dom.searchInput.addEventListener('input', () => {
      searchQuery = dom.searchInput.value;
      dom.clearSearchButton.hidden = !searchQuery;
      renderApps();
    });
    dom.clearSearchButton.addEventListener('click', () => {
      dom.searchInput.value = '';
      searchQuery = '';
      dom.clearSearchButton.hidden = true;
      dom.searchInput.focus();
      renderApps();
    });
    dom.filterStrip.addEventListener('click', event => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      activeFilter = button.dataset.filter;
      renderApps();
    });

    dom.appEditorForm.addEventListener('submit', event => {
      event.preventDefault();
      saveAppFromEditor();
    });
    dom.appDescriptionInput.addEventListener('input', () => {
      dom.descriptionCount.textContent = String(dom.appDescriptionInput.value.length);
    });
    dom.githubUploadUrlInput.addEventListener('input', () => {
      const value = dom.githubUploadUrlInput.value.trim();
      if (!value || isValidGithubUploadUrl(value)) dom.githubUploadUrlError.textContent = '';
      syncGithubUploadTestButton();
    });
    dom.githubUploadUrlInput.addEventListener('blur', () => {
      const value = dom.githubUploadUrlInput.value.trim();
      dom.githubUploadUrlError.textContent = !value || isValidGithubUploadUrl(value)
        ? ''
        : 'Enter a valid secure GitHub upload URL, or leave this field blank.';
    });
    dom.openGithubUploadButton.addEventListener('click', () => openGithubUploadUrl(dom.githubUploadUrlInput.value));
    dom.libraryIconModeButton.addEventListener('click', () => setIconMode('library'));
    dom.emojiIconModeButton.addEventListener('click', () => setIconMode('emoji'));
    dom.emojiInput.addEventListener('input', () => {
      selectedIcon = dom.emojiInput.value.trim() || '✨';
      renderEditorPickers();
    });
    dom.customColorInput.addEventListener('input', () => {
      selectedAccent = dom.customColorInput.value;
      renderEditorPickers();
    });

    document.querySelectorAll('input[name="theme"]').forEach(input => {
      input.addEventListener('change', () => {
        state.settings.theme = input.value;
        saveState();
        applyTheme();
      });
    });

    dom.installAppButton.addEventListener('click', promptInstall);
    dom.exportBackupButton.addEventListener('click', exportBackup);
    dom.importBackupButton.addEventListener('click', () => runProtected(() => dom.importFileInput.click()));
    dom.importFileInput.addEventListener('change', () => readImportFile(dom.importFileInput.files?.[0]));
    dom.managementLockToggle.addEventListener('change', handleManagementLockToggle);
    dom.resetPinButton.addEventListener('click', resetManagementLock);
    dom.restoreDefaultsButton.addEventListener('click', () => runProtected(restoreDefaultApps));
    dom.resetAllButton.addEventListener('click', () => runProtected(resetAllData));
    dom.reopenIntroButton.addEventListener('click', () => showOnboarding(true));

    dom.confirmForm.addEventListener('submit', event => {
      event.preventDefault();
      handleConfirmSubmit();
    });
    dom.confirmCancelButton.addEventListener('click', () => {
      pendingConfirm = null;
      closeDialog(dom.confirmDialog);
    });

    dom.pinForm.addEventListener('submit', event => {
      event.preventDefault();
      handlePinSubmit();
    });
    dom.pinCancelButton.addEventListener('click', () => {
      pendingPinAction = null;
      if (pinDialogMode === 'setup') dom.managementLockToggle.checked = state.settings.managementLock.enabled;
      closeDialog(dom.pinDialog);
    });

    dom.introDoneButton.addEventListener('click', () => dismissOnboarding(false));
    dom.introAddButton.addEventListener('click', () => dismissOnboarding(true));
    dom.importCancelButton.addEventListener('click', () => {
      importCandidate = null;
      closeDialog(dom.importPreviewDialog);
    });
    dom.mergeImportButton.addEventListener('click', () => runProtected(() => applyImport('merge')));
    dom.replaceImportButton.addEventListener('click', () => runProtected(() => applyImport('replace')));

    dom.updateNowButton.addEventListener('click', () => waitingServiceWorker?.postMessage({ type: 'SKIP_WAITING' }));

    document.addEventListener('click', event => {
      if (!event.target.closest('.card-more-menu') && !event.target.closest('[data-action="more"]')) closeAllCardMenus();
    });

    document.querySelectorAll('[data-close-dialog]').forEach(button => {
      button.addEventListener('click', () => closeDialog(document.getElementById(button.dataset.closeDialog)));
    });

    document.querySelectorAll('dialog').forEach(dialog => {
      dialog.addEventListener('click', event => {
        if (event.target === dialog) closeDialog(dialog);
      });
      dialog.addEventListener('close', () => removeDialogFromHistory(dialog));
      dialog.addEventListener('cancel', event => {
        event.preventDefault();
        closeDialog(dialog);
      });
    });

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      deferredInstallPrompt = event;
      updateInstallUi();
    });
    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      updateInstallUi();
      showToast('Tyree Hub installed.', 'success');
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (state.settings.theme === 'system') applyTheme('system');
    });
  }

  function toggleEditMode() {
    if (editMode) {
      editMode = false;
      renderApps();
      return;
    }
    runProtected(() => {
      editMode = true;
      activeFilter = 'all';
      renderApps();
      setTimeout(() => dom.appGrid.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    });
  }

  function init() {
    cacheDom();
    hydrateIcons();
    state = loadState();
    applyTheme();
    setTodayLabel();
    initializeEvents();
    syncSettingsUi();
    renderApps();
    registerServiceWorker();
    setTimeout(() => showOnboarding(false), 350);
  }

  init();
})();
