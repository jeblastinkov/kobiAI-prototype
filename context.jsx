// KobiAI Context — global state for role, language, device, demo state

const { createContext, useContext, useState, useCallback } = React;

const KobiCtx = createContext(null);

function KobiProvider({ children }) {
  const [role, setRole] = useState('manager');
  const [language, setLanguage] = useState('en');
  const [deviceMode, setDeviceMode] = useState('desktop');
  const [activeChannel, setActiveChannel] = useState('dashboard');
  const [rightPanel, setRightPanel] = useState(null);
  const [notesAdded, setNotesAdded] = useState(false);
  const [openIncidentCount, setOpenIncidentCount] = useState(3);
  const [showOnPremModal, setShowOnPremModal] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  /** { kind: 'pdf'|'image', src: string, title: string } | null */
  const [mediaViewer, setMediaViewer] = useState(null);
  /** Mattermost-style apps bar: which integration is open in the iframe panel (null = closed) */
  const [activeIntegrationId, setActiveIntegrationId] = useState(null);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('bratislava');
  /** Set when opening #docs-drop from a machine’s right panel so we can return + show correct breadcrumbs. */
  const [channelReturnContext, setChannelReturnContext] = useState(null);

  // messages: channelSlug -> Message[]
  const [messages, setMessages] = useState(() => {
    const d = window.KobiData;
    return {
      general: d.conversations.general,
      'machine-siemens': d.conversations['machine-siemens'],
      'machine-kuka': d.conversations['machine-kuka'],
      'machine-zund': d.conversations['machine-zund'],
      'docs-drop': d.conversations['docs-drop'],
      incidents: d.incidents.map(inc => ({ id: inc.id, isIncidentCard: true, incident: inc })),
      dashboard: [],
    };
  });

  const t = useCallback((key) => {
    const map = window.KobiData.i18n[language] || window.KobiData.i18n.en;
    return map[key] || window.KobiData.i18n.en[key] || key;
  }, [language]);

  const addMessage = useCallback((channelSlug, msg) => {
    setMessages(prev => ({
      ...prev,
      [channelSlug]: [...(prev[channelSlug] || []), msg],
    }));
  }, []);

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const switchRole = useCallback((newRole) => {
    setRole(newRole);
    const firstMachine = window.KobiData.getFirstMachineSlugForWorkspace(activeWorkspaceId);
    setActiveChannel(newRole === 'manager' ? 'dashboard' : firstMachine);
    setRightPanel(null);
    setMediaViewer(null);
    setActiveIntegrationId(null);
    setChannelReturnContext(null);
  }, [activeWorkspaceId]);

  const setActiveWorkspace = useCallback((id) => {
    if (!id) return;
    setActiveWorkspaceId(id);
    setActiveChannel('dashboard');
    setRightPanel(null);
    setMediaViewer(null);
    setActiveIntegrationId(null);
    setChannelReturnContext(null);
  }, []);

  const value = {
    role, setRole: switchRole,
    activeWorkspaceId, setActiveWorkspace,
    language, setLanguage,
    deviceMode, setDeviceMode,
    activeChannel, setActiveChannel,
    channelReturnContext, setChannelReturnContext,
    rightPanel, setRightPanel,
    notesAdded, setNotesAdded,
    openIncidentCount, setOpenIncidentCount,
    showOnPremModal, setShowOnPremModal,
    showSearchOverlay, setShowSearchOverlay,
    sidebarOpen, setSidebarOpen,
    mediaViewer, setMediaViewer,
    activeIntegrationId, setActiveIntegrationId,
    messages, addMessage,
    toasts, addToast,
    t,
  };

  return React.createElement(KobiCtx.Provider, { value }, children);
}

function useKobi() {
  return useContext(KobiCtx);
}

Object.assign(window, { KobiProvider, useKobi });
