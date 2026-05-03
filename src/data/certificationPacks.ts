import { intermediateQuestions } from './questions'
import { aPlusGlossaryFlashcards, aPlusGlossaryMatchScenarios } from './aPlusGlossaryGenerated'

export type CertificationId = 'a-plus' | 'network-plus' | 'security-plus' | 'ccst-it-support'
export type DifficultyLevel = 'easy' | 'intermediate' | 'advanced'

export type ExamQuestion = {
  id: string
  certification: CertificationId
  domain: string
  topic: string
  difficulty: DifficultyLevel
  prompt: string
  options: { key: string; text: string }[]
  answer: string
  explanation: string
  tags?: string[]
}

export type FlashcardItem = {
  id: string
  certification: CertificationId
  deck: string
  topic: string
  type: 'term' | 'cloze'
  front: string
  back: string
  clue?: string
  explanation?: string
  tags?: string[]
}

export type PBQScenarioType = 'match' | 'order' | 'map'

export type PBQScenario = {
  id: string
  certification: CertificationId
  topic: string
  difficulty: DifficultyLevel
  type: PBQScenarioType
  prompt: string
  instructions: string
  items: { id: string; label: string }[]
  targets: { id: string; label: string; accepts?: string[] }[]
  solution: Record<string, string | number>
  explanation: string
}

export type SubnettingWeakZoneCategory =
  | 'third-octet-focus'
  | 'block-size'
  | 'network-broadcast'
  | 'subnet-mask'
  | 'host-count'
  | 'cidr-to-mask'
  | 'mask-to-cidr'
  | 'usable-range'

export type SubnettingPromptConfig = {
  mode: 'full-drill' | 'fields-only' | 'seven-second' | 'whiteboard' | 'scratching-surface'
  allowedCidrs: number[]
  answerFields: Array<'networkId' | 'broadcastAddress' | 'blockSize' | 'subnetMask' | 'usableHosts' | 'usableRange'>
  weakZoneCategory?: SubnettingWeakZoneCategory
  timePressure: boolean
}

export type CertificationPack = {
  id: CertificationId
  label: string
  examCode: string
  exam: {
    questions: ExamQuestion[]
    domains: string[]
    topics: string[]
  }
  flashcards: {
    decks: string[]
    cards: FlashcardItem[]
  }
  pbq: {
    topics: string[]
    scenarios: PBQScenario[]
  }
  subnetting: {
    supportedModes: SubnettingPromptConfig['mode'][]
    weakZones: SubnettingWeakZoneCategory[]
    defaultCidrs: number[]
  }
}

function toTopic(domain: string) {
  const normalized = domain.toLowerCase()
  if (normalized.includes('network')) return 'Infrastructure'
  if (normalized.includes('security')) return 'Security'
  if (normalized.includes('hardware')) return 'Hardware'
  if (normalized.includes('mobile')) return 'Mobile'
  if (normalized.includes('cloud')) return 'Cloud'
  if (normalized.includes('software')) return 'Software'
  if (normalized.includes('operating')) return 'Operating Systems'
  return 'Troubleshooting'
}

const aPlusQuestions: ExamQuestion[] = intermediateQuestions.map((question) => ({
  id: `aplus-${question.id}`,
  certification: 'a-plus',
  domain: question.domain,
  topic: toTopic(question.domain),
  difficulty: 'intermediate',
  prompt: question.text,
  options: question.options,
  answer: question.answer,
  explanation: question.explanation,
  tags: [toTopic(question.domain)],
}))

const networkPlusQuestions: ExamQuestion[] = [
  {
    id: 'net-1',
    certification: 'network-plus',
    domain: 'Network Troubleshooting',
    topic: 'Routing',
    difficulty: 'intermediate',
    prompt: 'A router is receiving packets destined for an unknown network. Which entry should the administrator verify first to ensure traffic can still leave the site?',
    options: [
      { key: 'A', text: 'Loopback address' },
      { key: 'B', text: 'Default route' },
      { key: 'C', text: 'DNS suffix' },
      { key: 'D', text: 'MAC table' },
    ],
    answer: 'B',
    explanation: 'The default route is used when no more specific route exists for a destination network.',
    tags: ['Routing', 'WAN'],
  },
  {
    id: 'net-2',
    certification: 'network-plus',
    domain: 'Network Operations',
    topic: 'Monitoring',
    difficulty: 'easy',
    prompt: 'Which metric best describes the variation in packet arrival time during a VoIP call?',
    options: [
      { key: 'A', text: 'Jitter' },
      { key: 'B', text: 'Bandwidth' },
      { key: 'C', text: 'Throughput' },
      { key: 'D', text: 'Frequency' },
    ],
    answer: 'A',
    explanation: 'Jitter measures inconsistency in packet arrival timing and is critical for real-time audio quality.',
    tags: ['VoIP', 'Monitoring'],
  },
  {
    id: 'net-3',
    certification: 'network-plus',
    domain: 'Network Security',
    topic: 'Segmentation',
    difficulty: 'advanced',
    prompt: 'An administrator wants to isolate finance devices from guest wireless users while still using the same switching infrastructure. Which feature is the best fit?',
    options: [
      { key: 'A', text: 'VPN concentrator' },
      { key: 'B', text: 'VLAN' },
      { key: 'C', text: 'NAT overload' },
      { key: 'D', text: 'Port mirroring' },
    ],
    answer: 'B',
    explanation: 'VLANs logically segment traffic on shared switching infrastructure.',
    tags: ['VLAN', 'Security'],
  },
]

const securityPlusQuestions: ExamQuestion[] = [
  {
    id: 'sec-1',
    certification: 'security-plus',
    domain: 'Threat Management',
    topic: 'Phishing',
    difficulty: 'easy',
    prompt: 'A user receives a message pretending to be from payroll and asking for MFA approval. What type of attack is this?',
    options: [
      { key: 'A', text: 'Tailgating' },
      { key: 'B', text: 'Phishing' },
      { key: 'C', text: 'Shoulder surfing' },
      { key: 'D', text: 'Wardriving' },
    ],
    answer: 'B',
    explanation: 'Phishing uses impersonation to trick users into revealing information or approving access.',
    tags: ['Social Engineering'],
  },
  {
    id: 'sec-2',
    certification: 'security-plus',
    domain: 'Architecture',
    topic: 'Zero Trust',
    difficulty: 'intermediate',
    prompt: 'Which principle best aligns with a zero-trust security model?',
    options: [
      { key: 'A', text: 'Trust internal networks by default' },
      { key: 'B', text: 'Verify explicitly and apply least privilege' },
      { key: 'C', text: 'Disable MFA to reduce user friction' },
      { key: 'D', text: 'Allow unmanaged devices if on VPN' },
    ],
    answer: 'B',
    explanation: 'Zero trust assumes no implicit trust and requires strong verification with least-privilege access.',
    tags: ['Zero Trust', 'Access Control'],
  },
]

const ccstItSupportQuestions: ExamQuestion[] = [
  {
    id: 'ccst-1',
    certification: 'ccst-it-support',
    domain: 'Customer Service',
    topic: 'Communication',
    difficulty: 'easy',
    prompt:
      'A user is frustrated on the phone. Before troubleshooting, what should a technician prioritize after confirming identity?',
    options: [
      { key: 'A', text: 'Immediate remote takeover without consent' },
      { key: 'B', text: 'Acknowledging the issue and setting expectations for next steps' },
      { key: 'C', text: 'Transferring the user to another queue without explanation' },
      { key: 'D', text: 'Suggesting the user search online first' },
    ],
    answer: 'B',
    explanation:
      'Clear communication and expectation-setting reduce friction and build trust before technical work begins.',
    tags: ['Soft skills'],
  },
  {
    id: 'ccst-2',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Ticketing',
    difficulty: 'easy',
    prompt: 'What is the primary purpose of a trouble ticket in a service desk workflow?',
    options: [
      { key: 'A', text: 'To bill the customer automatically' },
      { key: 'B', text: 'To track, prioritize, and document work from intake through resolution' },
      { key: 'C', text: 'To replace knowledge base articles' },
      { key: 'D', text: 'To enforce hardware upgrades' },
    ],
    answer: 'B',
    explanation:
      'Tickets provide traceability and coordination across teams while preserving context for future incidents.',
    tags: ['ITSM'],
  },
  {
    id: 'ccst-3',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Prioritization',
    difficulty: 'intermediate',
    prompt:
      'Which factor most directly raises the priority of an incident affecting many users versus a single workstation?',
    options: [
      { key: 'A', text: 'The brand of the workstation' },
      { key: 'B', text: 'Business impact and scope of users or services affected' },
      { key: 'C', text: 'Whether the ticket arrived by email or portal' },
      { key: 'D', text: 'The seniority of the person submitting the ticket' },
    ],
    answer: 'B',
    explanation:
      'Priority balances urgency and impact; broader outages typically warrant faster response than isolated issues.',
    tags: ['ITSM'],
  },
  {
    id: 'ccst-4',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'TCP/IP',
    difficulty: 'easy',
    prompt: 'Which command on Windows shows IPv4 address, subnet mask, and default gateway for active adapters?',
    options: [
      { key: 'A', text: 'netstat -an' },
      { key: 'B', text: 'ipconfig' },
      { key: 'C', text: 'tracert 127.0.0.1' },
      { key: 'D', text: 'defrag /C' },
    ],
    answer: 'B',
    explanation: '`ipconfig` summarizes basic IPv4 settings; `/all` adds DNS and DHCP details.',
    tags: ['Windows', 'Networking'],
  },
  {
    id: 'ccst-5',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'Diagnostics',
    difficulty: 'easy',
    prompt: 'What does the ping utility primarily test between two hosts?',
    options: [
      { key: 'A', text: 'Disk throughput' },
      { key: 'B', text: 'Reachability and round-trip time using ICMP echo requests' },
      { key: 'C', text: 'Printer queue depth' },
      { key: 'D', text: 'GPU temperature' },
    ],
    answer: 'B',
    explanation:
      'Ping sends ICMP echoes to verify basic connectivity; blocked ICMP can produce false negatives.',
    tags: ['Networking'],
  },
  {
    id: 'ccst-6',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'DNS',
    difficulty: 'easy',
    prompt: 'Which statement best describes DNS in everyday IT support?',
    options: [
      { key: 'A', text: 'It encrypts all web traffic by default' },
      { key: 'B', text: 'It resolves human-readable hostnames to IP addresses' },
      { key: 'C', text: 'It assigns IP addresses to clients without a server' },
      { key: 'D', text: 'It replaces the need for a default gateway' },
    ],
    answer: 'B',
    explanation: 'DNS maps names to addresses; DHCP handles dynamic addressing.',
    tags: ['Networking'],
  },
  {
    id: 'ccst-7',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Components',
    difficulty: 'easy',
    prompt: 'A laptop feels sluggish opening applications after boot. Which upgrade often yields the largest everyday gain?',
    options: [
      { key: 'A', text: 'Replacing the webcam' },
      { key: 'B', text: 'Adding or upgrading to an SSD for the system volume' },
      { key: 'C', text: 'Installing a second monitor without changing storage' },
      { key: 'D', text: 'Changing the laptop color finish' },
    ],
    answer: 'B',
    explanation:
      'SSDs dramatically reduce random I/O latency compared with spinning disks for OS and apps.',
    tags: ['Hardware'],
  },
  {
    id: 'ccst-8',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'Windows',
    difficulty: 'intermediate',
    prompt: 'A Windows PC stops responding with a spinning cursor. What is the safest first step before forced power-off?',
    options: [
      { key: 'A', text: 'Open the case while powered on' },
      { key: 'B', text: 'Wait briefly, then try Ctrl+Alt+Del or Task Manager if accessible' },
      { key: 'C', text: 'Immediately cycle power without saving user work' },
      { key: 'D', text: 'Run diskpart clean on the system drive' },
    ],
    answer: 'B',
    explanation:
      'Give the OS a chance to recover; forced shutdown risks data loss or filesystem corruption.',
    tags: ['Windows'],
  },
  {
    id: 'ccst-9',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Authentication',
    difficulty: 'easy',
    prompt: 'Which example best illustrates multi-factor authentication (MFA)?',
    options: [
      { key: 'A', text: 'Password plus a code from an authenticator app' },
      { key: 'B', text: 'Two different passwords typed back-to-back' },
      { key: 'C', text: 'Using the same password on two websites' },
      { key: 'D', text: 'Answering two security questions with facts found online' },
    ],
    answer: 'A',
    explanation:
      'MFA combines categories such as something you know with something you have or are.',
    tags: ['Security'],
  },
  {
    id: 'ccst-10',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Social Engineering',
    difficulty: 'easy',
    prompt: 'A message urges immediate login via a link to avoid account suspension. What should you advise?',
    options: [
      { key: 'A', text: 'Click the link quickly to avoid lockout' },
      { key: 'B', text: 'Verify through official channels or type the known portal URL manually' },
      { key: 'C', text: 'Share credentials with the sender to prove ownership' },
      { key: 'D', text: 'Disable antivirus to speed up the browser' },
    ],
    answer: 'B',
    explanation:
      'Phishing relies on urgency; validate requests using trusted bookmarks or IT-provided guidance.',
    tags: ['Security'],
  },
  {
    id: 'ccst-11',
    certification: 'ccst-it-support',
    domain: 'Troubleshooting',
    topic: 'Methodology',
    difficulty: 'intermediate',
    prompt: 'Which sequence aligns with a practical tier-1 troubleshooting approach?',
    options: [
      { key: 'A', text: 'Replace hardware, then ask questions' },
      { key: 'B', text: 'Establish symptoms, isolate variables, test theories, verify with the user' },
      { key: 'C', text: 'Reinstall the OS before documenting anything' },
      { key: 'D', text: 'Assume user error and close the ticket' },
    ],
    answer: 'B',
    explanation:
      'Structured isolation reduces guesswork and prevents unnecessary disruptive changes.',
    tags: ['Troubleshooting'],
  },
  {
    id: 'ccst-12',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'Cabling',
    difficulty: 'easy',
    prompt: 'Which twisted-pair category is commonly associated with 1 Gbps Ethernet over structured cabling?',
    options: [
      { key: 'A', text: 'Cat 3' },
      { key: 'B', text: 'Cat 5e or higher for typical Gigabit runs' },
      { key: 'C', text: 'RG-6 coax for all desktop drops' },
      { key: 'D', text: 'Fiber patch cables only' },
    ],
    answer: 'B',
    explanation:
      'Cat 5e is a baseline for Gigabit in many installs; Cat 6/6a adds headroom for longer runs and noise.',
    tags: ['Cabling'],
  },
]

const ccstFlashcards: FlashcardItem[] = [
  {
    id: 'ccst-flash-sla',
    certification: 'ccst-it-support',
    deck: 'Service fundamentals',
    topic: 'ITSM',
    type: 'term',
    front: 'What is an SLA?',
    back: 'A Service Level Agreement — documented targets for service quality, often including response and resolution times.',
    tags: ['ITSM'],
  },
  {
    id: 'ccst-flash-incident',
    certification: 'ccst-it-support',
    deck: 'Service fundamentals',
    topic: 'ITSM',
    type: 'term',
    front: 'Incident vs service request',
    back: 'An incident is an unplanned interruption or quality reduction. A service request is a standard ask such as access or equipment.',
    tags: ['ITSM'],
  },
  {
    id: 'ccst-flash-escalate',
    certification: 'ccst-it-support',
    deck: 'Service fundamentals',
    topic: 'Workflow',
    type: 'cloze',
    front: 'Escalate when impact grows, specialized skills are needed, or ____ limits are exceeded.',
    back: 'SLA',
    explanation: 'Escalation paths protect agreements and bring the right expertise.',
    tags: ['ITSM'],
  },
  {
    id: 'ccst-flash-ipconfig',
    certification: 'ccst-it-support',
    deck: 'Windows essentials',
    topic: 'CLI',
    type: 'term',
    front: 'What does ipconfig /release and /renew do?',
    back: 'Releases and renews DHCP leases on Windows adapters that use DHCP.',
    tags: ['Windows'],
  },
  {
    id: 'ccst-flash-dns',
    certification: 'ccst-it-support',
    deck: 'Networking literacy',
    topic: 'DNS',
    type: 'cloze',
    front: 'DNS resolves ____ names to IP addresses.',
    back: 'host',
    tags: ['Networking'],
  },
  {
    id: 'ccst-flash-dhcp',
    certification: 'ccst-it-support',
    deck: 'Networking literacy',
    topic: 'Addressing',
    type: 'term',
    front: 'Role of DHCP',
    back: 'Automatically assigns IP configuration such as address, mask, gateway, and DNS to clients.',
    tags: ['Networking'],
  },
  {
    id: 'ccst-flash-gateway',
    certification: 'ccst-it-support',
    deck: 'Networking literacy',
    topic: 'Routing',
    type: 'term',
    front: 'Default gateway',
    back: 'The router interface used to reach networks outside the local subnet.',
    tags: ['Networking'],
  },
  {
    id: 'ccst-flash-vpn',
    certification: 'ccst-it-support',
    deck: 'Networking literacy',
    topic: 'Remote access',
    type: 'term',
    front: 'What does a VPN typically provide?',
    back: 'An encrypted tunnel over another network, often used for secure remote access to corporate resources.',
    tags: ['Security'],
  },
  {
    id: 'ccst-flash-ssid',
    certification: 'ccst-it-support',
    deck: 'Networking literacy',
    topic: 'Wireless',
    type: 'term',
    front: 'SSID',
    back: 'Service Set Identifier — the broadcast name of a wireless network.',
    tags: ['Wi-Fi'],
  },
  {
    id: 'ccst-flash-driver',
    certification: 'ccst-it-support',
    deck: 'Hardware & OS',
    topic: 'Drivers',
    type: 'term',
    front: 'Device driver',
    back: 'Software that lets the operating system communicate with hardware.',
    tags: ['Windows'],
  },
  {
    id: 'ccst-flash-bsod',
    certification: 'ccst-it-support',
    deck: 'Hardware & OS',
    topic: 'Stability',
    type: 'cloze',
    front: 'On Windows, a stop error screen is often called a ____.',
    back: 'BSOD',
    clue: 'Blue Screen of Death',
    tags: ['Windows'],
  },
  {
    id: 'ccst-flash-sfc',
    certification: 'ccst-it-support',
    deck: 'Windows essentials',
    topic: 'Repair',
    type: 'term',
    front: 'sfc /scannow purpose',
    back: 'Scans protected Windows system files and repairs corrupted copies when possible.',
    tags: ['Windows'],
  },
  {
    id: 'ccst-flash-phish',
    certification: 'ccst-it-support',
    deck: 'Security awareness',
    topic: 'Threats',
    type: 'term',
    front: 'Phishing',
    back: 'Deceptive attempts to steal credentials or install malware, commonly via email or messaging.',
    tags: ['Security'],
  },
  {
    id: 'ccst-flash-malware',
    certification: 'ccst-it-support',
    deck: 'Security awareness',
    topic: 'Threats',
    type: 'term',
    front: 'Malware vs virus (colloquial)',
    back: 'Malware is the umbrella term for malicious software; viruses are one category that self-replicate.',
    tags: ['Security'],
  },
  {
    id: 'ccst-flash-backup',
    certification: 'ccst-it-support',
    deck: 'Operations',
    topic: 'Data',
    type: 'term',
    front: '3-2-1 backup concept (high level)',
    back: 'Keep three copies of data, on two media types, with one copy off-site.',
    tags: ['Backup'],
  },
  {
    id: 'ccst-flash-remote',
    certification: 'ccst-it-support',
    deck: 'Windows essentials',
    topic: 'Support tools',
    type: 'term',
    front: 'RDP',
    back: 'Remote Desktop Protocol — graphical remote session to another Windows host when permitted.',
    tags: ['Windows'],
  },
  {
    id: 'ccst-flash-ticket-fields',
    certification: 'ccst-it-support',
    deck: 'Service fundamentals',
    topic: 'Documentation',
    type: 'cloze',
    front: 'Good ticket notes include reproduction steps, error text, recent changes, and ____ attempted.',
    back: 'steps',
    explanation: 'Future technicians rely on concise factual notes.',
    tags: ['ITSM'],
  },
  {
    id: 'ccst-flash-peripherals',
    certification: 'ccst-it-support',
    deck: 'Hardware basics',
    topic: 'Peripherals',
    type: 'term',
    front: 'USB vs Thunderbolt (support lens)',
    back: 'Both carry data (and often power). Thunderbolt lanes integrate PCIe/DisplayPort features on compatible ports; always verify cable and port markings.',
    tags: ['Hardware'],
  },
]

const ccstPbqScenarios: PBQScenario[] = [
  {
    id: 'ccst-pbq-match-types',
    certification: 'ccst-it-support',
    topic: 'Ticketing',
    difficulty: 'easy',
    type: 'match',
    prompt: 'Match each record type to how service desks typically use it.',
    instructions: 'Drag each label onto the best description.',
    items: [
      { id: 'incident', label: 'Incident' },
      { id: 'request', label: 'Service request' },
      { id: 'problem', label: 'Problem' },
    ],
    targets: [
      { id: 'unplanned', label: 'Unplanned outage or degradation users notice right now' },
      { id: 'standard', label: 'Routine fulfilled change such as access or a headset' },
      { id: 'root', label: 'Underlying cause analysis spanning related incidents' },
    ],
    solution: {
      incident: 'unplanned',
      request: 'standard',
      problem: 'root',
    },
    explanation: 'Incidents restore service quickly; requests follow catalogs; problems chase root causes.',
  },
  {
    id: 'ccst-pbq-order-triage',
    certification: 'ccst-it-support',
    topic: 'Troubleshooting',
    difficulty: 'intermediate',
    type: 'order',
    prompt: 'Order these tier-1 steps for a vague “internet is down” report.',
    instructions: 'Arrange from first action to last among these choices.',
    items: [
      { id: 'confirm', label: 'Confirm scope (one device vs many, wired vs Wi-Fi)' },
      { id: 'link', label: 'Check link status / IP settings on the affected device' },
      { id: 'pinggw', label: 'Ping default gateway or known internal host' },
      { id: 'doc', label: 'Document findings and next owner if unresolved' },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
    ],
    solution: { confirm: 1, link: 2, pinggw: 3, doc: 4 },
    explanation: 'Start broad to narrow impact, validate local stack, then escalate with evidence.',
  },
  {
    id: 'ccst-pbq-match-tools',
    certification: 'ccst-it-support',
    topic: 'Diagnostics',
    difficulty: 'easy',
    type: 'match',
    prompt: 'Match each Windows networking command to its typical use.',
    instructions: 'Drag each command onto the task it fits best.',
    items: [
      { id: 'ping', label: 'ping' },
      { id: 'nslookup', label: 'nslookup' },
      { id: 'tracert', label: 'tracert' },
    ],
    targets: [
      { id: 'reach', label: 'Quick reachability test to an IP or hostname' },
      { id: 'dnsq', label: 'Query DNS records for a name' },
      { id: 'path', label: 'Show routers along the path to a destination' },
    ],
    solution: {
      ping: 'reach',
      nslookup: 'dnsq',
      tracert: 'path',
    },
    explanation: 'Ping checks basic connectivity, nslookup probes DNS, tracert maps route hops.',
  },
  {
    id: 'ccst-pbq-order-boot-recovery',
    certification: 'ccst-it-support',
    topic: 'Windows',
    difficulty: 'intermediate',
    type: 'order',
    prompt:
      'A laptop loops into Automatic Repair after an update. Put these tier-1 actions in the best order before escalating.',
    instructions: 'Arrange from first step to last.',
    items: [
      {
        id: 'capture',
        label: 'Capture exact screen text, codes, or photos (including BitLocker prompts if shown)',
      },
      {
        id: 'peripherals',
        label: 'Disconnect dock, USB hubs, and external storage; perform a clean cold boot',
      },
      {
        id: 'startup-repair',
        label: 'From recovery: run Startup Repair once',
      },
      {
        id: 'remove-update',
        label: 'If still failing: uninstall the latest quality update from Advanced Startup',
      },
      {
        id: 'escalate',
        label: 'Escalate to desktop/engineering with timeline, screenshots, and what was already tried',
      },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' },
    ],
    solution: {
      capture: 1,
      peripherals: 2,
      'startup-repair': 3,
      'remove-update': 4,
      escalate: 5,
    },
    explanation:
      'Evidence first, reduce variables, then built-in repair paths; uninstalling a bad patch is common after failed boots; escalate with facts—not guesses.',
  },
  {
    id: 'ccst-pbq-order-print-spooler',
    certification: 'ccst-it-support',
    topic: 'Peripherals',
    difficulty: 'easy',
    type: 'order',
    prompt: 'One Windows PC cannot print to a shared network printer; others can. Order sensible checks.',
    instructions: 'Arrange from first step to last.',
    items: [
      {
        id: 'scope',
        label: 'Confirm scope: same printer works for peers on the same network/VLAN',
      },
      {
        id: 'queue',
        label: 'Open the print queue on this PC—clear paused or stuck jobs',
      },
      {
        id: 'spooler',
        label: 'Restart the Print Spooler service on the affected workstation',
      },
      {
        id: 'driver',
        label: 'Repair driver/port: reinstall or pick correct printer/duplex settings',
      },
      {
        id: 'wire',
        label: 'If still failing, escalate with queue errors and Event Viewer Application log clues',
      },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' },
    ],
    solution: {
      scope: 1,
      queue: 2,
      spooler: 3,
      driver: 4,
      wire: 5,
    },
    explanation:
      'Isolate whether it is user-specific, clear common queue/spooler faults locally, then driver corruption; escalate when logs point past tier-1 fixes.',
  },
  {
    id: 'ccst-pbq-match-first-response',
    certification: 'ccst-it-support',
    topic: 'Triage',
    difficulty: 'intermediate',
    type: 'match',
    prompt: 'Match each desk scenario to the best first focus (before deep dives).',
    instructions: 'Drag each situation onto the opening move that fits best.',
    items: [
      { id: 'vpn-internal', label: 'VPN shows connected but intranet and file shares fail' },
      { id: 'solo-email', label: 'Only one user cannot send mail; teammates are fine' },
      { id: 'blank-dock', label: 'External monitors stay blank after docking—laptop lid works' },
    ],
    targets: [
      {
        id: 'routes-dns',
        label: 'Split tunneling, DNS suffix, and routes for corporate names (often VPN-specific)',
      },
      {
        id: 'mailbox-local',
        label: 'That user’s Outlook profile, credentials, and mailbox permissions on this device',
      },
      {
        id: 'video-path',
        label: 'Dock video cable, monitor input source, and display detection / firmware',
      },
    ],
    solution: {
      'vpn-internal': 'routes-dns',
      'solo-email': 'mailbox-local',
      'blank-dock': 'video-path',
    },
    explanation:
      'VPN-without-internal usually splits routing/DNS from “general internet”; single-user email failures rarely start at the mail gateway; blank dock displays usually trace to physical video path before OS bugs.',
  },
  {
    id: 'ccst-pbq-order-credential-incident',
    certification: 'ccst-it-support',
    topic: 'Security',
    difficulty: 'advanced',
    type: 'order',
    prompt:
      'A user admits they submitted credentials on a phishing page. Order an immediate containment sequence.',
    instructions: 'Arrange from first response to last listed action.',
    items: [
      {
        id: 'reset-pw',
        label: 'Have them change the password from a trusted device and known-good browser session',
      },
      {
        id: 'revoke',
        label: 'Revoke sessions / sign out everywhere your IdP supports',
      },
      {
        id: 'notify-sec',
        label: 'Notify the security team using the official incident channel',
      },
      {
        id: 'scan',
        label: 'Run an approved malware scan on the affected device',
      },
      {
        id: 'document',
        label: 'Document indicators (URL, time, MFA prompts) for the incident record',
      },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' },
    ],
    solution: {
      'reset-pw': 1,
      revoke: 2,
      'notify-sec': 3,
      scan: 4,
      document: 5,
    },
    explanation:
      'Stop the bleed first (credential reset + session kill), loop in security early, verify endpoint hygiene, and preserve facts—actual IR playbooks may parallelize notify/document.',
  },
  {
    id: 'ccst-pbq-map-handoff',
    certification: 'ccst-it-support',
    topic: 'Escalation',
    difficulty: 'easy',
    type: 'map',
    prompt: 'Route each ticket theme to the team most likely to own the fix long-term.',
    instructions: 'Assign each ticket to the best owning group.',
    items: [
      { id: 'ticket-ap-wifi', label: 'Dead spots only on floor 3 since AP swap—needs RF validation' },
      { id: 'ticket-firewall', label: 'New SaaS app blocked for entire site—same URL works off-network' },
      { id: 'ticket-ad', label: 'Repeated lockouts after password sync—identity directory mismatch suspected' },
    ],
    targets: [
      { id: 'wireless', label: 'Wireless / network engineering (RF, controllers, AP configs)' },
      { id: 'edge-filter', label: 'Security / firewall / proxy engineering (policy and egress paths)' },
      { id: 'identity', label: 'Identity / directory services (AD/Azure AD sync and auth flows)' },
    ],
    solution: {
      'ticket-ap-wifi': 'wireless',
      'ticket-firewall': 'edge-filter',
      'ticket-ad': 'identity',
    },
    explanation:
      'Coverage issues follow RF/AP ownership; policy blocks affecting whole sites cross security architecture; repeating identity symptoms belong with directory and SSO specialists.',
  },
  {
    id: 'ccst-pbq-order-problem-solving',
    certification: 'ccst-it-support',
    topic: 'Help Desk',
    difficulty: 'intermediate',
    type: 'order',
    prompt:
      'Order the core help-desk problem-solving flow (Cisco IT Support style). Start with understanding the issue; end with records.',
    instructions: 'Arrange from first step to last.',
    items: [
      { id: 'ps-define', label: 'Define the problem: expected vs actual behavior' },
      { id: 'ps-gather', label: 'Gather detailed information: scope, time, changes, error text' },
      { id: 'ps-cause', label: 'Identify a probable cause from the facts (not guesses)' },
      { id: 'ps-plan', label: 'Plan the smallest safe change to verify or fix' },
      { id: 'ps-implement', label: 'Implement the change and observe whether symptoms stop' },
      { id: 'ps-document', label: 'Document outcome, rollback notes, and escalate if still broken' },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' },
      { id: '6', label: 'Step 6' },
    ],
    solution: {
      'ps-define': 1,
      'ps-gather': 2,
      'ps-cause': 3,
      'ps-plan': 4,
      'ps-implement': 5,
      'ps-document': 6,
    },
    explanation:
      'Mirrors the documented CCST-style workflow: narrow scope with facts before changes, verify impact, then record—repeat deeper troubleshooting only when needed.',
  },
  {
    id: 'ccst-pbq-order-ticket-lifecycle',
    certification: 'ccst-it-support',
    topic: 'Documentation',
    difficulty: 'easy',
    type: 'order',
    prompt: 'Put a typical service desk ticket lifecycle in order from intake to closure.',
    instructions: 'Arrange from first step to last.',
    items: [
      { id: 'tl-intake', label: 'Log intake: requester, channel, and brief description' },
      { id: 'tl-triage', label: 'Triage: category, priority, SLA clock, and assignment' },
      { id: 'tl-work', label: 'Investigate and troubleshoot with timestamped notes' },
      { id: 'tl-resolve', label: 'Resolve or fulfill (fix applied or standard request completed)' },
      { id: 'tl-verify', label: 'Verify with the user that service meets expectation' },
      { id: 'tl-close', label: 'Close with resolution summary and knowledge-base hints if useful' },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' },
      { id: '6', label: 'Step 6' },
    ],
    solution: {
      'tl-intake': 1,
      'tl-triage': 2,
      'tl-work': 3,
      'tl-resolve': 4,
      'tl-verify': 5,
      'tl-close': 6,
    },
    explanation:
      'Reflects common ITSM practice: capture early, prioritize honestly, prove resolution with the customer, then codify learning.',
  },
  {
    id: 'ccst-pbq-match-ports',
    certification: 'ccst-it-support',
    topic: 'Hardware',
    difficulty: 'easy',
    type: 'match',
    prompt: 'Match each connector or interface to its best everyday description.',
    instructions: 'Drag each label onto the description it fits best.',
    items: [
      { id: 'port-rj45', label: 'RJ45 / 8P8C modular jack' },
      { id: 'port-hdmi', label: 'HDMI' },
      { id: 'port-dp', label: 'DisplayPort' },
      { id: 'port-usbc', label: 'USB-C (generic)' },
    ],
    targets: [
      {
        id: 'tp-lan',
        label: 'Twisted-pair Ethernet jack for LAN cabling on desktops, docks, and switches',
      },
      {
        id: 'tp-hdmi-use',
        label: 'Common consumer digital AV plug for monitors and TVs (audio/video)',
      },
      {
        id: 'tp-dp-use',
        label: 'Digital PC display link common on business monitors and docking setups',
      },
      {
        id: 'tp-usbc-use',
        label: 'Reversible connector that may carry USB data, charging power, and Alt Mode video—verify markings/cables',
      },
    ],
    solution: {
      'port-rj45': 'tp-lan',
      'port-hdmi': 'tp-hdmi-use',
      'port-dp': 'tp-dp-use',
      'port-usbc': 'tp-usbc-use',
    },
    explanation:
      'CCST hardware chapters emphasize recognizing ports: RJ45 for Ethernet; HDMI/DisplayPort for digital video paths; USB-C is versatile—never assume speed or Thunderbolt without specs.',
  },
  {
    id: 'ccst-pbq-match-osi-lite',
    certification: 'ccst-it-support',
    topic: 'Networking',
    difficulty: 'intermediate',
    type: 'match',
    prompt: 'Match each OSI layer focus (lite set) to what it primarily deals with.',
    instructions: 'Drag each layer label onto the plain-language role.',
    items: [
      { id: 'osi-l1', label: 'Layer 1 Physical' },
      { id: 'osi-l2', label: 'Layer 2 Data Link' },
      { id: 'osi-l3', label: 'Layer 3 Network' },
      { id: 'osi-l4', label: 'Layer 4 Transport' },
      { id: 'osi-l7', label: 'Layer 7 Application' },
    ],
    targets: [
      {
        id: 'osi-bits',
        label: 'Raw bits across cable/fiber/Wi-Fi—the physical medium',
      },
      {
        id: 'osi-mac',
        label: 'Frames between adjacent hops using MAC addressing (switching)',
      },
      {
        id: 'osi-ip',
        label: 'Packets and logical addressing/routing between subnets',
      },
      {
        id: 'osi-tcp',
        label: 'Segments and reliability / multiplexing with ports (TCP/UDP)',
      },
      {
        id: 'osi-app',
        label: 'Protocols end users touch—HTTP, SMTP, APIs—not cabling itself',
      },
    ],
    solution: {
      'osi-l1': 'osi-bits',
      'osi-l2': 'osi-mac',
      'osi-l3': 'osi-ip',
      'osi-l4': 'osi-tcp',
      'osi-l7': 'osi-app',
    },
    explanation:
      'Entry-level exams usually stay conceptual: separate cabling from switching from routing from transport reliability from user-visible apps.',
  },
  {
    id: 'ccst-pbq-match-windows-diagnostics',
    certification: 'ccst-it-support',
    topic: 'Windows',
    difficulty: 'intermediate',
    type: 'match',
    prompt:
      'Match each Windows utility or command family to the diagnostic goal it serves best (beyond basic ping).',
    instructions: 'Drag each tool onto the goal.',
    items: [
      { id: 'wd-ipconfig', label: 'ipconfig' },
      { id: 'wd-netstat', label: 'netstat' },
      { id: 'wd-event', label: 'Event Viewer' },
      { id: 'wd-taskmgr', label: 'Task Manager' },
      { id: 'wd-msinfo', label: 'System Information (msinfo32)' },
    ],
    targets: [
      {
        id: 'wd-ipcfg',
        label: 'See IPv4/IPv6 addresses, mask, gateway, and DNS per adapter',
      },
      {
        id: 'wd-sessions',
        label: 'Inspect listening ports and established TCP/UDP sessions locally',
      },
      {
        id: 'wd-logs',
        label: 'Review Application/System logs for crashes, services, and drivers',
      },
      {
        id: 'wd-process',
        label: 'End hung apps or spot CPU/RAM pressure causing sluggishness',
      },
      {
        id: 'wd-inventory',
        label: 'Summarize OS build, hardware resources, and loaded components',
      },
    ],
    solution: {
      'wd-ipconfig': 'wd-ipcfg',
      'wd-netstat': 'wd-sessions',
      'wd-event': 'wd-logs',
      'wd-taskmgr': 'wd-process',
      'wd-msinfo': 'wd-inventory',
    },
    explanation:
      'CCST Windows chapters highlight ipconfig, Task Manager, Event Viewer, and system summaries—pair tools to symptoms instead of guessing.',
  },
  {
    id: 'ccst-pbq-map-threat-response',
    certification: 'ccst-it-support',
    topic: 'Security',
    difficulty: 'intermediate',
    type: 'map',
    prompt: 'Map each user-reported situation to the **first-line support response** that fits best.',
    instructions: 'Assign each situation to the immediate playbook bucket.',
    items: [
      {
        id: 'tr-phish-mail',
        label: 'Phishing email arrived—user has NOT clicked links or entered credentials',
      },
      {
        id: 'tr-creds-entered',
        label: 'User typed credentials into a fake login page moments ago',
      },
      {
        id: 'tr-locker-popup',
        label: 'Browser fullscreen warning demanding payment or phone call (“support scam”)',
      },
    ],
    targets: [
      {
        id: 'tr-aware',
        label: 'Educate, report or forward to security, delete/quarantine—no credential reuse',
      },
      {
        id: 'tr-contain',
        label: 'Contain credentials now: reset password on trusted device, revoke sessions, notify security/IR',
      },
      {
        id: 'tr-malwarevec',
        label: 'Treat as malware vector: kill browser/processes per policy, scan endpoint, escalate if persistent',
      },
    ],
    solution: {
      'tr-phish-mail': 'tr-aware',
      'tr-creds-entered': 'tr-contain',
      'tr-locker-popup': 'tr-malwarevec',
    },
    explanation:
      'Aligns with Cisco’s emphasis on spotting threats: prevent accidental clicks first; active credential loss triggers containment; scareware often pairs with malware tactics.',
  },
  {
    id: 'ccst-pbq-order-connectivity-stack',
    certification: 'ccst-it-support',
    topic: 'Networking',
    difficulty: 'intermediate',
    type: 'order',
    prompt:
      'Order **bottom-up connectivity checks** when a workstation cannot reach internal apps (story differs from “whole site internet down”).',
    instructions: 'Arrange from first check to last.',
    items: [
      {
        id: 'cs-link',
        label: 'Confirm physical/virtual link: cable seated, Wi-Fi associated, correct VLAN SSID',
      },
      {
        id: 'cs-ip',
        label: 'Verify sensible IP configuration—not APIPA/169.254 unless designed',
      },
      {
        id: 'cs-gw',
        label: 'Ping or reach the default gateway / first-hop router',
      },
      {
        id: 'cs-dns',
        label: 'Resolve an internal hostname via DNS or ping known DNS targets',
      },
      {
        id: 'cs-path',
        label: 'Traceroute/tracert toward the application host to locate where loss begins',
      },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' },
    ],
    solution: {
      'cs-link': 1,
      'cs-ip': 2,
      'cs-gw': 3,
      'cs-dns': 4,
      'cs-path': 5,
    },
    explanation:
      'Classic layered isolation: link → addressing → local routing → name resolution → path analysis—mirrors CCST networking troubleshooting chapters.',
  },
]

const seedFlashcards: FlashcardItem[] = [
  {
    id: 'flash-osi',
    certification: 'a-plus',
    deck: 'Networking Foundations',
    topic: 'OSI',
    type: 'term',
    front: 'Which OSI layer handles MAC addressing and switching?',
    back: 'Layer 2, the Data Link layer.',
    explanation: 'Switches make forwarding decisions using MAC addresses at Layer 2.',
    tags: ['OSI', 'Networking'],
  },
  {
    id: 'flash-cidr',
    certification: 'network-plus',
    deck: 'Subnetting',
    topic: 'CIDR',
    type: 'cloze',
    front: 'A /27 network has a block size of ____ addresses.',
    back: '32',
    clue: '256 minus the interesting octet value.',
    explanation: 'A /27 mask corresponds to 255.255.255.224, so the block size is 32.',
    tags: ['Subnetting'],
  },
  {
    id: 'flash-mfa',
    certification: 'security-plus',
    deck: 'Identity Security',
    topic: 'Authentication',
    type: 'term',
    front: 'What does MFA stand for?',
    back: 'Multi-factor authentication.',
    explanation: 'MFA combines two or more factor categories such as something you know and something you have.',
    tags: ['IAM'],
  },
  {
    id: 'flash-gateway',
    certification: 'a-plus',
    deck: 'Networking Foundations',
    topic: 'Routing',
    type: 'term',
    front: 'What device is typically used as the default gateway on a LAN?',
    back: 'A router or Layer 3 gateway interface.',
    tags: ['Networking'],
  },
  {
    id: 'flash-zero-trust',
    certification: 'security-plus',
    deck: 'Architecture',
    topic: 'Zero Trust',
    type: 'cloze',
    front: 'Zero trust requires you to verify ____ and apply least privilege.',
    back: 'explicitly',
    tags: ['Zero Trust'],
  },
]

const sharedFlashcards: FlashcardItem[] = [
  ...(aPlusGlossaryFlashcards as unknown as FlashcardItem[]),
  ...seedFlashcards,
  ...ccstFlashcards,
]

const seedPBQ: PBQScenario[] = [
  {
    id: 'pbq-match-cables',
    certification: 'a-plus',
    topic: 'Cabling',
    difficulty: 'easy',
    type: 'match',
    prompt: 'Match each connector to the best description.',
    instructions: 'Drag each connector label into the correct target description.',
    items: [
      { id: 'usb-c', label: 'USB-C' },
      { id: 'rj45', label: 'RJ45' },
      { id: 'hdmi', label: 'HDMI' },
    ],
    targets: [
      { id: 'data-power', label: 'Carries reversible data and power connection' },
      { id: 'ethernet', label: 'Common twisted-pair network connector' },
      { id: 'video-audio', label: 'Carries digital video and audio' },
    ],
    solution: {
      'usb-c': 'data-power',
      rj45: 'ethernet',
      hdmi: 'video-audio',
    },
    explanation: 'USB-C is reversible and carries power/data, RJ45 is used for Ethernet, and HDMI carries digital AV.',
  },
  {
    id: 'pbq-order-troubleshooting',
    certification: 'network-plus',
    topic: 'Troubleshooting',
    difficulty: 'intermediate',
    type: 'order',
    prompt: 'Place the troubleshooting steps in the best order.',
    instructions: 'Arrange the items from first step to last step.',
    items: [
      { id: 'identify', label: 'Identify the problem' },
      { id: 'theory', label: 'Establish a theory of probable cause' },
      { id: 'test', label: 'Test the theory' },
      { id: 'document', label: 'Document findings and actions' },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
    ],
    solution: { identify: 1, theory: 2, test: 3, document: 4 },
    explanation: 'The CompTIA workflow begins by identifying the problem before building and testing a theory.',
  },
  {
    id: 'pbq-map-segmentation',
    certification: 'security-plus',
    topic: 'Segmentation',
    difficulty: 'advanced',
    type: 'map',
    prompt: 'Place each device into the most appropriate network zone.',
    instructions: 'Assign each device to the zone that best matches its access needs.',
    items: [
      { id: 'web-server', label: 'Public Web Server' },
      { id: 'accounting-pc', label: 'Accounting Workstation' },
      { id: 'guest-tablet', label: 'Guest Tablet' },
    ],
    targets: [
      { id: 'dmz', label: 'DMZ' },
      { id: 'internal', label: 'Internal LAN' },
      { id: 'guest', label: 'Guest Network' },
    ],
    solution: {
      'web-server': 'dmz',
      'accounting-pc': 'internal',
      'guest-tablet': 'guest',
    },
    explanation: 'Public-facing services belong in the DMZ, internal workstations stay on the LAN, and guests belong on isolated access.',
  },
  {
    id: 'pbq-match-ports',
    certification: 'a-plus',
    topic: 'Networking',
    difficulty: 'easy',
    type: 'match',
    prompt: 'Match each common protocol to its default port.',
    instructions: 'Drag each protocol onto the correct default port number.',
    items: [
      { id: 'http', label: 'HTTP' },
      { id: 'https', label: 'HTTPS' },
      { id: 'ssh', label: 'SSH' },
      { id: 'rdp', label: 'RDP' },
      { id: 'dns', label: 'DNS' },
    ],
    targets: [
      { id: '80', label: 'TCP 80' },
      { id: '443', label: 'TCP 443' },
      { id: '22', label: 'TCP 22' },
      { id: '3389', label: 'TCP 3389' },
      { id: '53', label: 'UDP/TCP 53' },
    ],
    solution: { http: '80', https: '443', ssh: '22', rdp: '3389', dns: '53' },
    explanation: 'HTTP=80, HTTPS=443, SSH=22, RDP=3389, DNS uses 53 for both UDP queries and TCP zone transfers.',
  },
  {
    id: 'pbq-match-ram',
    certification: 'a-plus',
    topic: 'Hardware',
    difficulty: 'intermediate',
    type: 'match',
    prompt: 'Match each memory module form factor to where it is most commonly used.',
    instructions: 'Drag each form factor onto the device class it usually fits.',
    items: [
      { id: 'dimm', label: 'DIMM (DDR4)' },
      { id: 'sodimm', label: 'SO-DIMM' },
      { id: 'ecc', label: 'ECC RDIMM' },
    ],
    targets: [
      { id: 'desktop', label: 'Desktop tower' },
      { id: 'laptop', label: 'Laptop / mini PC' },
      { id: 'server', label: 'Production server' },
    ],
    solution: { dimm: 'desktop', sodimm: 'laptop', ecc: 'server' },
    explanation: 'Standard DIMMs fit desktops, smaller SO-DIMMs fit laptops, and ECC RDIMMs are used in servers for error correction.',
  },
  {
    id: 'pbq-match-printer',
    certification: 'a-plus',
    topic: 'Printers',
    difficulty: 'intermediate',
    type: 'match',
    prompt: 'Match each laser-printer step to the correct phase.',
    instructions: 'Pair each description with the phase of the laser printing imaging process.',
    items: [
      { id: 'charge', label: 'Apply uniform negative charge to drum' },
      { id: 'expose', label: 'Laser writes image as positive charge' },
      { id: 'develop', label: 'Toner sticks to exposed areas' },
      { id: 'transfer', label: 'Toner is moved onto the paper' },
      { id: 'fuse', label: 'Heat and pressure bond toner' },
    ],
    targets: [
      { id: 'charging', label: 'Charging' },
      { id: 'exposing', label: 'Exposing' },
      { id: 'developing', label: 'Developing' },
      { id: 'transferring', label: 'Transferring' },
      { id: 'fusing', label: 'Fusing' },
    ],
    solution: {
      charge: 'charging',
      expose: 'exposing',
      develop: 'developing',
      transfer: 'transferring',
      fuse: 'fusing',
    },
    explanation: 'Laser print imaging order: processing → charging → exposing → developing → transferring → fusing → cleaning.',
  },
  {
    id: 'pbq-order-malware-response',
    certification: 'a-plus',
    topic: 'Security',
    difficulty: 'intermediate',
    type: 'order',
    prompt: 'Place the malware-removal best practices in the correct order.',
    instructions: 'Arrange the seven CompTIA malware-removal steps from first to last.',
    items: [
      { id: 'investigate', label: 'Investigate and verify malware symptoms' },
      { id: 'quarantine', label: 'Quarantine the infected system' },
      { id: 'disable', label: 'Disable System Restore (Windows)' },
      { id: 'remediate', label: 'Remediate the infected system' },
      { id: 'schedule', label: 'Schedule scans and run updates' },
      { id: 'enable', label: 'Re-enable System Restore and create restore point' },
      { id: 'educate', label: 'Educate the end user' },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' },
      { id: '6', label: 'Step 6' },
      { id: '7', label: 'Step 7' },
    ],
    solution: {
      investigate: 1,
      quarantine: 2,
      disable: 3,
      remediate: 4,
      schedule: 5,
      enable: 6,
      educate: 7,
    },
    explanation: 'CompTIA malware-removal order: investigate → quarantine → disable System Restore → remediate → schedule scans/updates → re-enable System Restore → educate the end user.',
  },
  {
    id: 'pbq-map-osi',
    certification: 'network-plus',
    topic: 'OSI Model',
    difficulty: 'intermediate',
    type: 'map',
    prompt: 'Place each device or protocol at its primary OSI layer.',
    instructions: 'Drag each item onto the OSI layer it is most associated with.',
    items: [
      { id: 'switch', label: 'Layer 2 Switch' },
      { id: 'router', label: 'Router' },
      { id: 'http', label: 'HTTP traffic' },
      { id: 'tcp', label: 'TCP segments' },
      { id: 'cable', label: 'Cat 6 cable' },
    ],
    targets: [
      { id: 'l1', label: 'Layer 1 (Physical)' },
      { id: 'l2', label: 'Layer 2 (Data Link)' },
      { id: 'l3', label: 'Layer 3 (Network)' },
      { id: 'l4', label: 'Layer 4 (Transport)' },
      { id: 'l7', label: 'Layer 7 (Application)' },
    ],
    solution: { switch: 'l2', router: 'l3', http: 'l7', tcp: 'l4', cable: 'l1' },
    explanation: 'Cables = Physical, switches = Data Link, routers = Network, TCP = Transport, HTTP = Application.',
  },
  {
    id: 'pbq-match-cidr',
    certification: 'network-plus',
    topic: 'Subnetting',
    difficulty: 'intermediate',
    type: 'match',
    prompt: 'Match each CIDR prefix to its subnet mask.',
    instructions: 'Drag the CIDR prefix onto the matching dotted-decimal mask.',
    items: [
      { id: 'cidr-24', label: '/24' },
      { id: 'cidr-26', label: '/26' },
      { id: 'cidr-27', label: '/27' },
      { id: 'cidr-30', label: '/30' },
    ],
    targets: [
      { id: '255.255.255.0', label: '255.255.255.0' },
      { id: '255.255.255.192', label: '255.255.255.192' },
      { id: '255.255.255.224', label: '255.255.255.224' },
      { id: '255.255.255.252', label: '255.255.255.252' },
    ],
    solution: {
      'cidr-24': '255.255.255.0',
      'cidr-26': '255.255.255.192',
      'cidr-27': '255.255.255.224',
      'cidr-30': '255.255.255.252',
    },
    explanation: '/24 = .0, /26 = .192, /27 = .224, /30 = .252. Each step adds 2 host bits to the mask.',
  },
  {
    id: 'pbq-match-wireless',
    certification: 'network-plus',
    topic: 'Wireless',
    difficulty: 'intermediate',
    type: 'match',
    prompt: 'Match each Wi-Fi standard to its primary frequency band.',
    instructions: 'Drag each 802.11 standard onto its main operating band.',
    items: [
      { id: 'a', label: '802.11a' },
      { id: 'b', label: '802.11b' },
      { id: 'g', label: '802.11g' },
      { id: 'n', label: '802.11n' },
      { id: 'ac', label: '802.11ac' },
      { id: 'ax', label: '802.11ax (Wi-Fi 6/6E)' },
    ],
    targets: [
      { id: '2.4', label: '2.4 GHz only' },
      { id: '5', label: '5 GHz only' },
      { id: 'dual', label: 'Dual band 2.4 + 5 GHz' },
      { id: 'tri', label: '2.4 / 5 / 6 GHz' },
    ],
    solution: { a: '5', b: '2.4', g: '2.4', n: 'dual', ac: '5', ax: 'tri' },
    explanation: '802.11a/ac use 5 GHz; b/g use 2.4 GHz; n is dual-band; ax adds 6 GHz with Wi-Fi 6E.',
  },
  {
    id: 'pbq-order-cable-termination',
    certification: 'network-plus',
    topic: 'Cabling',
    difficulty: 'easy',
    type: 'order',
    prompt: 'Place the steps for terminating a Cat 6 patch cable in order.',
    instructions: 'Arrange the steps from first to last.',
    items: [
      { id: 'strip', label: 'Strip the outer jacket' },
      { id: 'untwist', label: 'Untwist and arrange pairs by T568B order' },
      { id: 'trim', label: 'Trim the wires evenly' },
      { id: 'insert', label: 'Insert wires into the RJ45 connector' },
      { id: 'crimp', label: 'Crimp the connector' },
      { id: 'test', label: 'Test continuity with a cable tester' },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' },
      { id: '6', label: 'Step 6' },
    ],
    solution: { strip: 1, untwist: 2, trim: 3, insert: 4, crimp: 5, test: 6 },
    explanation: 'You always strip → arrange → trim → insert → crimp → test. Skipping the test step is the most common shop floor mistake.',
  },
  {
    id: 'pbq-map-ipv4-ranges',
    certification: 'network-plus',
    topic: 'Addressing',
    difficulty: 'intermediate',
    type: 'map',
    prompt: 'Place each IP address into its correct address category.',
    instructions: 'Drag each IPv4 address onto the matching range type.',
    items: [
      { id: '10-1-1-1', label: '10.1.1.1' },
      { id: '172-16-5-9', label: '172.16.5.9' },
      { id: '192-168-1-50', label: '192.168.1.50' },
      { id: '169-254-7-3', label: '169.254.7.3' },
      { id: '127-0-0-1', label: '127.0.0.1' },
      { id: '8-8-8-8', label: '8.8.8.8' },
    ],
    targets: [
      { id: 'private', label: 'RFC1918 Private' },
      { id: 'apipa', label: 'APIPA / Link-local' },
      { id: 'loopback', label: 'Loopback' },
      { id: 'public', label: 'Public Internet' },
    ],
    solution: {
      '10-1-1-1': 'private',
      '172-16-5-9': 'private',
      '192-168-1-50': 'private',
      '169-254-7-3': 'apipa',
      '127-0-0-1': 'loopback',
      '8-8-8-8': 'public',
    },
    explanation: '10/8, 172.16/12, and 192.168/16 are private; 169.254/16 is APIPA; 127/8 is loopback; everything else is public.',
  },
  {
    id: 'pbq-order-incident-response',
    certification: 'security-plus',
    topic: 'Incident Response',
    difficulty: 'intermediate',
    type: 'order',
    prompt: 'Order the NIST incident-response phases.',
    instructions: 'Place the phases in the correct sequence.',
    items: [
      { id: 'prep', label: 'Preparation' },
      { id: 'detect', label: 'Detection & Analysis' },
      { id: 'contain', label: 'Containment' },
      { id: 'eradicate', label: 'Eradication' },
      { id: 'recover', label: 'Recovery' },
      { id: 'lessons', label: 'Lessons Learned' },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' },
      { id: '6', label: 'Step 6' },
    ],
    solution: { prep: 1, detect: 2, contain: 3, eradicate: 4, recover: 5, lessons: 6 },
    explanation: 'NIST IR lifecycle: Preparation → Detection & Analysis → Containment → Eradication → Recovery → Lessons Learned.',
  },
  {
    id: 'pbq-match-attacks',
    certification: 'security-plus',
    topic: 'Threats',
    difficulty: 'intermediate',
    type: 'match',
    prompt: 'Match each attack technique to its description.',
    instructions: 'Drag each attack name onto the description that fits it best.',
    items: [
      { id: 'phishing', label: 'Phishing' },
      { id: 'smishing', label: 'Smishing' },
      { id: 'vishing', label: 'Vishing' },
      { id: 'whaling', label: 'Whaling' },
      { id: 'tailgating', label: 'Tailgating' },
    ],
    targets: [
      { id: 'email', label: 'Fraudulent email pretending to be a trusted sender' },
      { id: 'sms', label: 'Fraudulent text message luring a click' },
      { id: 'voice', label: 'Fraudulent phone call to extract info' },
      { id: 'exec', label: 'Targeted attack against a high-profile executive' },
      { id: 'door', label: 'Following an authorized person through a secure door' },
    ],
    solution: {
      phishing: 'email',
      smishing: 'sms',
      vishing: 'voice',
      whaling: 'exec',
      tailgating: 'door',
    },
    explanation: 'Phishing = email, smishing = SMS, vishing = voice, whaling = high-value targets, tailgating = piggybacking through a door.',
  },
  {
    id: 'pbq-map-controls',
    certification: 'security-plus',
    topic: 'Controls',
    difficulty: 'advanced',
    type: 'map',
    prompt: 'Categorize each control as Preventive, Detective, or Corrective.',
    instructions: 'Drag each control onto the matching category.',
    items: [
      { id: 'firewall', label: 'Firewall rule blocking traffic' },
      { id: 'ids', label: 'Network IDS alert' },
      { id: 'av', label: 'Antivirus quarantining a file' },
      { id: 'mfa', label: 'Multi-factor authentication' },
      { id: 'siem', label: 'SIEM log review' },
      { id: 'backup', label: 'Restoring from backup' },
    ],
    targets: [
      { id: 'preventive', label: 'Preventive' },
      { id: 'detective', label: 'Detective' },
      { id: 'corrective', label: 'Corrective' },
    ],
    solution: {
      firewall: 'preventive',
      ids: 'detective',
      av: 'corrective',
      mfa: 'preventive',
      siem: 'detective',
      backup: 'corrective',
    },
    explanation: 'Preventive controls stop incidents (firewall, MFA). Detective controls find them (IDS, SIEM). Corrective controls fix the impact (AV cleanup, backup restore).',
  },
]

const sharedPBQ: PBQScenario[] = [
  ...(aPlusGlossaryMatchScenarios as unknown as PBQScenario[]),
  ...seedPBQ,
  ...ccstPbqScenarios,
]

const subnetWeakZones: SubnettingWeakZoneCategory[] = [
  'third-octet-focus',
  'block-size',
  'network-broadcast',
  'subnet-mask',
  'host-count',
  'cidr-to-mask',
  'mask-to-cidr',
  'usable-range',
]

function collectDomains(questions: ExamQuestion[]) {
  return [...new Set(questions.map((question) => question.domain))]
}

function collectTopics(questions: ExamQuestion[]) {
  return [...new Set(questions.map((question) => question.topic))]
}

function cardsFor(certification: CertificationId) {
  return sharedFlashcards.filter((card) => card.certification === certification)
}

function pbqFor(certification: CertificationId) {
  return sharedPBQ.filter((scenario) => scenario.certification === certification)
}

export const certificationPacks: CertificationPack[] = [
  {
    id: 'a-plus',
    label: 'CompTIA A+',
    examCode: '220-1101 / 220-1102',
    exam: {
      questions: aPlusQuestions,
      domains: collectDomains(aPlusQuestions),
      topics: collectTopics(aPlusQuestions),
    },
    flashcards: {
      decks: [...new Set(cardsFor('a-plus').map((card) => card.deck))],
      cards: cardsFor('a-plus'),
    },
    pbq: {
      topics: [...new Set(pbqFor('a-plus').map((scenario) => scenario.topic))],
      scenarios: pbqFor('a-plus'),
    },
    subnetting: {
      supportedModes: ['full-drill', 'fields-only', 'seven-second', 'whiteboard', 'scratching-surface'],
      weakZones: subnetWeakZones,
      defaultCidrs: [24, 25, 26, 27, 28, 29, 30],
    },
  },
  {
    id: 'network-plus',
    label: 'Network+',
    examCode: 'N10-009',
    exam: {
      questions: networkPlusQuestions,
      domains: collectDomains(networkPlusQuestions),
      topics: collectTopics(networkPlusQuestions),
    },
    flashcards: {
      decks: [...new Set(cardsFor('network-plus').map((card) => card.deck))],
      cards: cardsFor('network-plus'),
    },
    pbq: {
      topics: [...new Set(pbqFor('network-plus').map((scenario) => scenario.topic))],
      scenarios: pbqFor('network-plus'),
    },
    subnetting: {
      supportedModes: ['full-drill', 'fields-only', 'seven-second', 'whiteboard', 'scratching-surface'],
      weakZones: subnetWeakZones,
      defaultCidrs: [16, 20, 22, 24, 26, 27, 28, 29, 30],
    },
  },
  {
    id: 'security-plus',
    label: 'Security+',
    examCode: 'SY0-701',
    exam: {
      questions: securityPlusQuestions,
      domains: collectDomains(securityPlusQuestions),
      topics: collectTopics(securityPlusQuestions),
    },
    flashcards: {
      decks: [...new Set(cardsFor('security-plus').map((card) => card.deck))],
      cards: cardsFor('security-plus'),
    },
    pbq: {
      topics: [...new Set(pbqFor('security-plus').map((scenario) => scenario.topic))],
      scenarios: pbqFor('security-plus'),
    },
    subnetting: {
      supportedModes: ['full-drill', 'fields-only', 'seven-second', 'whiteboard', 'scratching-surface'],
      weakZones: subnetWeakZones,
      defaultCidrs: [24, 25, 26, 27, 28],
    },
  },
  {
    id: 'ccst-it-support',
    label: 'CCST — IT Support',
    examCode: 'Cisco CCST',
    exam: {
      questions: ccstItSupportQuestions,
      domains: collectDomains(ccstItSupportQuestions),
      topics: collectTopics(ccstItSupportQuestions),
    },
    flashcards: {
      decks: [...new Set(cardsFor('ccst-it-support').map((card) => card.deck))],
      cards: cardsFor('ccst-it-support'),
    },
    pbq: {
      topics: [...new Set(pbqFor('ccst-it-support').map((scenario) => scenario.topic))],
      scenarios: pbqFor('ccst-it-support'),
    },
    subnetting: {
      supportedModes: ['full-drill', 'fields-only', 'seven-second', 'whiteboard', 'scratching-surface'],
      weakZones: subnetWeakZones,
      defaultCidrs: [24, 25, 26, 27, 28, 29, 30],
    },
  },
]

export function getCertificationPack(id: CertificationId) {
  return certificationPacks.find((pack) => pack.id === id) ?? certificationPacks[0]
}
