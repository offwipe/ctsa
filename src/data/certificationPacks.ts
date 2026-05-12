import { intermediateQuestions } from './questions'
import { aPlusGlossaryFlashcards, aPlusGlossaryMatchScenarios } from './aPlusGlossaryGenerated'
import { ccstPdfImportMcqs, ccstPdfImportPbqs } from './ccstPdfImport'

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

const ccstItSupportQuestionsBase: ExamQuestion[] = [
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
  {
    id: 'ccst-13',
    certification: 'ccst-it-support',
    domain: 'Troubleshooting',
    topic: 'Methodology',
    difficulty: 'intermediate',
    prompt:
      'A user cannot connect to internal Wi-Fi. After defining the problem and gathering details, you suspect a misconfiguration on that device. What should you do next?',
    options: [
      { key: 'A', text: 'Replace the wireless adapter without further testing' },
      { key: 'B', text: 'Close the ticket as user error' },
      {
        key: 'C',
        text: 'Skip validation and reinstall the operating system',
      },
      {
        key: 'D',
        text: 'Validate the theory—for example, check whether other users are affected or the issue is isolated',
      },
    ],
    answer: 'D',
    explanation:
      'After a probable cause is identified, test or validate it: scope (one client vs many) distinguishes misconfiguration from a broader outage.',
    tags: ['Wi-Fi', 'Methodology'],
  },
  {
    id: 'ccst-14',
    certification: 'ccst-it-support',
    domain: 'Customer Service',
    topic: 'Verification',
    difficulty: 'intermediate',
    prompt:
      'A caller claims to be Jane Doe from Accounting, demands an urgent password reset for payroll, and shows urgency. What should you do?',
    options: [
      { key: 'A', text: 'Reset the password immediately over the phone' },
      { key: 'B', text: 'Email the new password to the address they provide' },
      {
        key: 'C',
        text: "Verify identity via the user's manager using an internal directory phone number",
      },
      { key: 'D', text: 'Disable MFA so they can log in faster' },
    ],
    answer: 'C',
    explanation:
      'Urgency around payroll is a common social-engineering cue; verify through trusted internal channels before credential changes.',
    tags: ['Social engineering'],
  },
  {
    id: 'ccst-15',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Documentation',
    difficulty: 'easy',
    prompt: 'You resolve a customer printing issue. How should you document the incident?',
    options: [
      {
        key: 'A',
        text: 'Printing issue resolved; reinstalled printer drivers and rebooted the computer',
      },
      { key: 'B', text: 'User was difficult but we fixed it' },
      { key: 'C', text: 'Closed — printer problems happen sometimes' },
      { key: 'D', text: 'Per company policy, printing now works' },
    ],
    answer: 'A',
    explanation:
      'Ticket notes should be factual, objective, and technically specific—what changed and what fixed the symptom.',
    tags: ['Ticketing'],
  },
  {
    id: 'ccst-16',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Knowledge management',
    difficulty: 'easy',
    prompt:
      'When researching a technical issue and updating internal documentation, what best ensures information is accurate?',
    options: [
      { key: 'A', text: 'Use the first blog post returned by a search engine' },
      { key: 'B', text: 'Trust a single anonymous forum answer' },
      { key: 'C', text: 'Copy steps without testing them' },
      { key: 'D', text: 'Cross-check multiple authoritative sources before publishing' },
    ],
    answer: 'D',
    explanation:
      'Vendor docs, knowledge bases, and corroborating references reduce errors versus relying on one unverified source.',
    tags: ['Research'],
  },
  {
    id: 'ccst-17',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'SLA',
    difficulty: 'easy',
    prompt:
      'Which document defines service commitments between a provider and customer—service scope, standards, and often remedies when targets are missed?',
    options: [
      { key: 'A', text: 'Incident report' },
      { key: 'B', text: 'Memorandum of understanding only' },
      { key: 'C', text: 'Network diagram' },
      { key: 'D', text: 'Service Level Agreement (SLA)' },
    ],
    answer: 'D',
    explanation:
      'An SLA captures measurable commitments (response, availability, etc.); KPIs measure performance against it.',
    tags: ['ITSM'],
  },
  {
    id: 'ccst-18',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'AI ethics',
    difficulty: 'easy',
    prompt:
      'Among ethical considerations for using AI, what does transparency usually mean for IT support?',
    options: [
      { key: 'A', text: 'Hiding that AI was used to avoid questions' },
      { key: 'B', text: 'Using AI only after hours' },
      {
        key: 'C',
        text: 'Guaranteeing AI outputs are always correct',
      },
      {
        key: 'D',
        text: 'Informing users when AI informs decisions that could affect them',
      },
    ],
    answer: 'D',
    explanation:
      'Transparency means clear disclosure of AI involvement, especially when outcomes affect users or access.',
    tags: ['AI'],
  },
  {
    id: 'ccst-19',
    certification: 'ccst-it-support',
    domain: 'Troubleshooting',
    topic: 'Methodology',
    difficulty: 'intermediate',
    prompt:
      'Which option lists three activities that belong in a structured problem-solving process?',
    options: [
      {
        key: 'A',
        text: 'Avoid defining the problem; expand causes endlessly; document before gathering facts',
      },
      {
        key: 'B',
        text: 'Define the problem; gather facts to isolate causes; narrow causes to build an efficient plan',
      },
      {
        key: 'C',
        text: 'Skip user interviews; reinstall software first; escalate without triage',
      },
      {
        key: 'D',
        text: 'Guess hardware failure; replace components randomly; skip observation',
      },
    ],
    answer: 'B',
    explanation:
      'Sound troubleshooting starts with a clear problem statement and facts, narrows hypotheses, then plans controlled changes.',
    tags: ['Methodology'],
  },
  {
    id: 'ccst-20',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'IPv6',
    difficulty: 'easy',
    prompt: 'Which IPv6 prefix identifies an automatically configured link-local address?',
    options: [
      { key: 'A', text: '2001:' },
      { key: 'B', text: 'fe80:' },
      { key: 'C', text: '::1' },
      { key: 'D', text: 'fd00:' },
    ],
    answer: 'B',
    explanation:
      'Link-local addresses use fe80::/10; ::1 is loopback; fd00::/8 is unique local; 2001::/32 is example global unicast.',
    tags: ['IPv6'],
  },
  {
    id: 'ccst-21',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Privacy',
    difficulty: 'easy',
    prompt:
      'Which pair are examples of Personally Identifiable Information (PII) that typically require protection?',
    options: [
      {
        key: 'A',
        text: "Corporate cafeteria menu and building printer model number",
      },
      {
        key: 'B',
        text: "Customer full name with home phone number and individual Social Security Number",
      },
      {
        key: 'C',
        text: 'Published office mailing address and public website IP',
      },
      { key: 'D', text: 'SSID broadcast name and default gateway only' },
    ],
    answer: 'B',
    explanation:
      'PII identifies a specific person; combined name and phone, or SSN, are classic examples.',
    tags: ['Compliance'],
  },
  {
    id: 'ccst-22',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Malware',
    difficulty: 'easy',
    prompt: 'What is the primary purpose of a malware scan run by antivirus software?',
    options: [
      { key: 'A', text: 'Increase baseline CPU clock speed' },
      {
        key: 'B',
        text: 'Detect known-malicious patterns and typically quarantine or remove threats',
      },
      { key: 'C', text: 'Back up user files automatically' },
      { key: 'D', text: 'Upgrade the operating system' },
    ],
    answer: 'B',
    explanation:
      'Scans compare files and memory to signatures/heuristics to find malware; they do not replace backups or OS upgrades.',
    tags: ['Endpoint'],
  },
  {
    id: 'ccst-23',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'Linux CLI',
    difficulty: 'intermediate',
    prompt:
      'Which two commands (iproute2) display IP addresses currently assigned to interfaces?',
    options: [
      { key: 'A', text: 'ifconfig -a and netstat -r' },
      { key: 'B', text: 'ip addr show and ip address show' },
      { key: 'C', text: 'ipconfig /all and route print' },
      { key: 'D', text: 'netstat -r and ssh -V' },
    ],
    answer: 'B',
    explanation:
      'Modern Linux uses iproute2 (ip …); ifconfig is legacy on many distros; ipconfig/route are Windows-centric.',
    tags: ['Linux'],
  },
  {
    id: 'ccst-24',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Laptops',
    difficulty: 'intermediate',
    prompt:
      'A laptop shows a black screen but power LED is on and the fan spins. What is the most logical next step?',
    options: [
      { key: 'A', text: 'Attach an external monitor to isolate display vs system/video failure' },
      { key: 'B', text: 'Replace the motherboard immediately' },
      { key: 'C', text: 'Factory reset Windows before hardware checks' },
      { key: 'D', text: 'Update GPU drivers in Safe Mode before basic isolation' },
    ],
    answer: 'A',
    explanation:
      'External video tests panel/cable vs GPU/motherboard before invasive parts swaps or OS wipes.',
    tags: ['Display'],
  },
  {
    id: 'ccst-25',
    certification: 'ccst-it-support',
    domain: 'Troubleshooting',
    topic: 'Methodology',
    difficulty: 'intermediate',
    prompt:
      'While fixing printing, a technician restarts the Print Spooler service. In the Cisco-style problem-solving flow, this action maps to which step?',
    options: [
      { key: 'A', text: 'Gather detailed information' },
      { key: 'B', text: 'Identify a probable cause' },
      { key: 'C', text: 'Devise a plan to resolve the problem' },
      { key: 'D', text: 'Make necessary changes to implement the plan' },
    ],
    answer: 'D',
    explanation:
      'Restarting a service changes system state to execute the plan—implementation and observation follow planning.',
    tags: ['Windows'],
  },
  {
    id: 'ccst-26',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Peripherals',
    difficulty: 'intermediate',
    prompt:
      'For a Cisco Webex Desk Pro, which two connections match (1) wired network access and (2) single-cable BYOD laptop attach for AV/data?',
    options: [
      { key: 'A', text: 'VGA and RJ-11' },
      { key: 'B', text: 'RJ-45 Ethernet and USB-C' },
      { key: 'C', text: 'Serial DB-9 and coaxial' },
      { key: 'D', text: 'Two HDMI ports only' },
    ],
    answer: 'B',
    explanation:
      'Desk Pro typically uses Ethernet for LAN and USB-C for converged laptop connectivity; VGA/serial are legacy for this scenario.',
    tags: ['Collaboration'],
  },
  {
    id: 'ccst-27',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Storage',
    difficulty: 'easy',
    prompt:
      'When installing an M.2 NVMe SSD, what step is critical so the module seats correctly and is recognized?',
    options: [
      {
        key: 'A',
        text: 'Secure the module with the standoff and small mounting screw per motherboard layout',
      },
      { key: 'B', text: 'Apply thermal paste across the whole PCB' },
      { key: 'C', text: 'Connect a SATA power lead to the M.2 socket' },
      { key: 'D', text: 'Insert the module into a legacy PCI expansion slot' },
    ],
    answer: 'A',
    explanation:
      'M.2 cards insert at an angle then fasten with the factory standoff/screw; they do not use SATA power or PCI slots.',
    tags: ['Storage'],
  },
  {
    id: 'ccst-28',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'DNS',
    difficulty: 'intermediate',
    prompt:
      'A user reaches websites by IP address but not by hostname. Which two checks are most appropriate first?',
    options: [
      { key: 'A', text: 'Printer spooler status and SMB share ACLs' },
      {
        key: 'B',
        text: 'Client DNS settings and DNS service reachability (typically UDP/TCP 53)',
      },
      { key: 'C', text: 'Default gateway MAC address only' },
      { key: 'D', text: 'Monitor refresh rate and Bluetooth pairing' },
    ],
    answer: 'B',
    explanation:
      'IP works but names fail when name resolution breaks—verify configured DNS and that DNS servers answer.',
    tags: ['DNS'],
  },
  {
    id: 'ccst-29',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Ticketing',
    difficulty: 'easy',
    prompt:
      'Which concept describes systematically logging, categorizing, and tracking user requests from open to close?',
    options: [
      { key: 'A', text: 'SLA' },
      { key: 'B', text: 'KPI' },
      { key: 'C', text: 'Ticketing system' },
      { key: 'D', text: 'Remote monitoring only' },
    ],
    answer: 'C',
    explanation:
      'The ticketing system is the workflow database; SLAs/KPIs measure outcomes built atop those records.',
    tags: ['ITSM'],
  },
  {
    id: 'ccst-30',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Memory',
    difficulty: 'intermediate',
    prompt:
      'After a RAM upgrade the PC powers on, beeps, and never shows video. Which two causes are most probable?',
    options: [
      { key: 'A', text: 'Monitor cable unplugged and corrupted boot sector' },
      {
        key: 'B',
        text: 'Incompatible RAM type/speed for the board and modules not fully seated',
      },
      { key: 'C', text: 'DHCP failure and missing 64-bit OS' },
      { key: 'D', text: 'Stale DNS cache and wrong gateway' },
    ],
    answer: 'B',
    explanation:
      'Memory errors surface during POST as beeps/no video before OS load—reseating and compatibility come first.',
    tags: ['RAM'],
  },
  {
    id: 'ccst-31',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Display',
    difficulty: 'easy',
    prompt:
      'Which two interfaces commonly carry digital video and audio on one cable to a monitor with speakers without a separate audio cord?',
    options: [
      { key: 'A', text: 'VGA and DVI-A' },
      { key: 'B', text: 'DisplayPort and HDMI' },
      { key: 'C', text: 'DVI-I and serial RS-232' },
      { key: 'D', text: 'RJ-11 and coaxial only' },
    ],
    answer: 'B',
    explanation:
      'DisplayPort and HDMI integrate digital video and audio; VGA/DVI variants covered here are video-centric.',
    tags: ['AV'],
  },
  {
    id: 'ccst-32',
    certification: 'ccst-it-support',
    domain: 'Troubleshooting',
    topic: 'Scope',
    difficulty: 'intermediate',
    prompt:
      'Several HR employees cannot reach the Internet. Which two actions best establish problem scope first?',
    options: [
      { key: 'A', text: 'Restart the core switch immediately and update all NIC drivers' },
      {
        key: 'B',
        text:
          'Ask whether other departments see the same symptom and whether HR can still reach internal printers or shares',
      },
      { key: 'C', text: 'Run only a continuous ping to the gateway forever' },
      { key: 'D', text: 'Escalate to hardware vendor without triage' },
    ],
    answer: 'B',
    explanation:
      'Scope compares departments (localized vs widespread) and separates Internet break from LAN connectivity.',
    tags: ['Network'],
  },
  {
    id: 'ccst-33',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Social engineering',
    difficulty: 'easy',
    prompt:
      'Why might attackers target help desk technicians more than typical employees?',
    options: [
      {
        key: 'A',
        text: 'Technicians often have privileged actions such as password resets and account changes',
      },
      { key: 'B', text: 'Technicians always have slower internet links' },
      { key: 'C', text: 'Technicians publish public marketing sites' },
      { key: 'D', text: 'Technicians primarily manage payroll databases exclusively' },
    ],
    answer: 'A',
    explanation:
      'Elevated service privileges let an attacker recover or pivot accounts—high value for social engineering.',
    tags: ['Identity'],
  },
  {
    id: 'ccst-34',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Phishing',
    difficulty: 'easy',
    prompt:
      'An urgent email posing as IT Security links to an unknown domain instead of the corporate SSO portal. What threat is this?',
    options: [
      { key: 'A', text: 'Malware payload already resident on disk' },
      { key: 'B', text: 'Spam newsletter' },
      { key: 'C', text: 'Phishing for credentials or next-stage compromise' },
      { key: 'D', text: 'Denial-of-service flood' },
    ],
    answer: 'C',
    explanation:
      'Deceptive urgent messages with forged links typify phishing—not necessarily malware execution yet.',
    tags: ['Email'],
  },
  {
    id: 'ccst-35',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Social engineering',
    difficulty: 'easy',
    prompt:
      'Compared with general staff, why are IT support roles high-value targets for social engineering?',
    options: [
      { key: 'A', text: 'They receive less security training than other departments' },
      { key: 'B', text: 'They always sit in unsecured lobby desks' },
      { key: 'C', text: 'They reconcile corporate bank ledgers daily' },
      {
        key: 'D',
        text: 'Their roles include resetting credentials and adjusting access controls',
      },
    ],
    answer: 'D',
    explanation:
      'Ability to alter identities and access paths makes compromise of support accounts especially dangerous.',
    tags: ['Identity'],
  },
  {
    id: 'ccst-36',
    certification: 'ccst-it-support',
    domain: 'Help Desk',
    topic: 'Remote support',
    difficulty: 'easy',
    prompt:
      'Which native Windows assistance tool lets an agent view the user’s desktop interactively while they stay logged in?',
    options: [
      { key: 'A', text: 'SSH' },
      { key: 'B', text: 'Windows Remote Assistance / Quick Assist' },
      { key: 'C', text: 'Telnet' },
      { key: 'D', text: 'Microsoft Remote Desktop (full session takeover)' },
    ],
    answer: 'B',
    explanation:
      'Remote Assistance/Quick Assist shares the console for collaborative troubleshooting; classic RDP opens a separate session.',
    tags: ['Windows'],
  },
  {
    id: 'ccst-37',
    certification: 'ccst-it-support',
    domain: 'Customer Service',
    topic: 'Policy',
    difficulty: 'intermediate',
    prompt:
      'A caller claiming to be an executive demands an immediate password reset and threatens discipline. What should you do?',
    options: [
      {
        key: 'A',
        text: 'Provide a temp password that expires in 15 minutes without verification',
      },
      { key: 'B', text: 'Reset immediately to avoid delaying meetings' },
      {
        key: 'C',
        text: 'Follow the organization’s verification policy before any credential change',
      },
      { key: 'D', text: 'Mute the line until they calm down' },
    ],
    answer: 'C',
    explanation:
      'Authority or intimidation attempts bypass controls—identity verification policy always wins.',
    tags: ['Social engineering'],
  },
  {
    id: 'ccst-38',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Documentation',
    difficulty: 'easy',
    prompt:
      'While troubleshooting Windows feature updates you hit hexadecimal error 0x800F081F. Where is the most authoritative guidance?',
    options: [
      { key: 'A', text: 'Generic consumer tech blogs' },
      { key: 'B', text: 'Hardware OEM social feeds only' },
      { key: 'C', text: 'Microsoft Learn / official Microsoft support articles' },
      { key: 'D', text: 'Third-party driver forums exclusively' },
    ],
    answer: 'C',
    explanation:
      'Vendor-authored references decode OS-specific error codes and prescribed fixes.',
    tags: ['Windows'],
  },
  {
    id: 'ccst-39',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'Windows networking',
    difficulty: 'easy',
    prompt:
      'A user needs mapped drive R: to \\\\fin-srv\\reports every login. Which Map Network Drive option enables persistence across reboots?',
    options: [
      { key: 'A', text: 'Enable offline files' },
      { key: 'B', text: 'Reconnect at sign-in' },
      { key: 'C', text: 'Connect using different credentials only' },
      { key: 'D', text: 'Turn on network discovery only' },
    ],
    answer: 'B',
    explanation:
      'Reconnect at sign-in stores the mapping in the profile so Windows restores it after restart.',
    tags: ['SMB'],
  },
  {
    id: 'ccst-40',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'DNS',
    difficulty: 'intermediate',
    prompt:
      'A site fails by URL with “server not found,” yet ping to the host’s public IP succeeds. What is most likely wrong?',
    options: [
      { key: 'A', text: 'DHCP never assigned an address' },
      {
        key: 'B',
        text: 'DNS resolution failure while routing to the IP still works',
      },
      { key: 'C', text: 'Firewall blocking ports 80/443 despite successful ICMP' },
      { key: 'D', text: 'Missing default gateway configuration' },
    ],
    answer: 'B',
    explanation:
      'IP connectivity working while names fail points to DNS—not layer-3 reachability.',
    tags: ['DNS'],
  },
  {
    id: 'ccst-41',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'Wireless',
    difficulty: 'easy',
    prompt:
      'An editor buffers uploading huge files over Wi-Fi. What is the best first recommendation?',
    options: [
      { key: 'A', text: 'Move closer to the AP only' },
      {
        key: 'B',
        text: 'Use wired Ethernet for sustained high throughput and stability',
      },
      { key: 'C', text: 'Change DNS servers randomly' },
      { key: 'D', text: 'Update Wi-Fi drivers before checking physical connectivity' },
    ],
    answer: 'B',
    explanation:
      'Large sustained transfers benefit from Ethernet’s reliability versus contended wireless spectrum.',
    tags: ['Wi-Fi'],
  },
  {
    id: 'ccst-42',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'macOS',
    difficulty: 'easy',
    prompt:
      'On macOS a user cannot share their screen in Webex. Which privacy permission must usually be granted?',
    options: [
      { key: 'A', text: 'Camera only' },
      { key: 'B', text: 'Accessibility only' },
      { key: 'C', text: 'Screen Recording' },
      { key: 'D', text: 'Full Disk Access only' },
    ],
    answer: 'C',
    explanation:
      'Modern macOS requires explicit Screen Recording consent for desktop capture APIs.',
    tags: ['Collaboration'],
  },
  {
    id: 'ccst-43',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Documentation',
    difficulty: 'intermediate',
    prompt:
      'To improve knowledge reuse and reduce MTTR, which two elements belong in resolution notes?',
    options: [
      {
        key: 'A',
        text: 'Small-talk transcript and subjective frustration rating',
      },
      {
        key: 'B',
        text: 'Documented root cause and exact remediation steps performed',
      },
      {
        key: 'C',
        text: 'Technician personal opinions about hardware vendors',
      },
      { key: 'D', text: 'Only the user’s job title' },
    ],
    answer: 'B',
    explanation:
      'Future engineers need factual cause + fix steps—not emotion or chatter.',
    tags: ['Knowledge'],
  },
  {
    id: 'ccst-44',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Data classification',
    difficulty: 'easy',
    prompt:
      'How should uncompiled source code for an unreleased flagship product be classified?',
    options: [
      { key: 'A', text: 'Proprietary / confidential business information' },
      { key: 'B', text: 'Public marketing collateral' },
      { key: 'C', text: 'Personally Identifiable Information (PII)' },
      { key: 'D', text: 'Encrypted hash value' },
    ],
    answer: 'A',
    explanation:
      'Source code is intellectual property—treated as proprietary rather than public or personal data.',
    tags: ['IP'],
  },
  {
    id: 'ccst-45',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Power',
    difficulty: 'easy',
    prompt:
      'A laptop will not power on but is plugged in. What is the best first remote troubleshooting step?',
    options: [
      { key: 'A', text: 'Reinstall battery drivers' },
      { key: 'B', text: 'Ship a replacement battery immediately' },
      {
        key: 'C',
        text: 'Verify the AC adapter LED indicates power from the outlet/adapter',
      },
      { key: 'D', text: 'Hold power 30 seconds before checking any LEDs' },
    ],
    answer: 'C',
    explanation:
      'Confirm the brick/outlet actually delivers power before deeper hardware triage.',
    tags: ['Laptops'],
  },
  {
    id: 'ccst-46',
    certification: 'ccst-it-support',
    domain: 'Help Desk',
    topic: 'Mobile',
    difficulty: 'easy',
    prompt:
      'Adding corporate email to a personal phone forces enrollment first. What category of solution is this?',
    options: [
      { key: 'A', text: 'VPN concentrator' },
      { key: 'B', text: 'Remote Desktop' },
      { key: 'C', text: 'Multi-factor authentication template' },
      { key: 'D', text: 'Mobile Device Management (MDM)' },
    ],
    answer: 'D',
    explanation:
      'MDM enrolls devices to apply policies, apps, and compliance controls before accessing mail.',
    tags: ['BYOD'],
  },
  {
    id: 'ccst-47',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'Windows UI',
    difficulty: 'easy',
    prompt:
      'On a 4K monitor in Windows, icons and text look tiny but the user wants crisp rendering. What should you adjust first?',
    options: [
      {
        key: 'A',
        text: 'Increase Scale (Scale and layout) while keeping native resolution',
      },
      { key: 'B', text: 'Lower refresh rate' },
      { key: 'C', text: 'Enable Night light' },
      {
        key: 'D',
        text: 'Force 1920×1080 resolution on the 4K panel',
      },
    ],
    answer: 'A',
    explanation:
      'Scaling enlarges UI elements without abandoning the panel’s native sharp resolution.',
    tags: ['Display'],
  },
  {
    id: 'ccst-48',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'Ports',
    difficulty: 'easy',
    prompt:
      'Which TCP port must be allowed through a firewall for default Remote Desktop Protocol sessions?',
    options: [
      { key: 'A', text: '3389' },
      { key: 'B', text: '5900' },
      { key: 'C', text: '23' },
      { key: 'D', text: '443' },
    ],
    answer: 'A',
    explanation:
      'Microsoft RDP listens on TCP 3389 by default; 5900≈VNC, 23=Telnet, 443=HTTPS.',
    tags: ['Firewalls'],
  },
  {
    id: 'ccst-49',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Cabling',
    difficulty: 'easy',
    prompt:
      'A fax machine cable plug is too wide for the wall jack. Which connector belongs on analog phone lines?',
    options: [
      { key: 'A', text: 'USB-C' },
      { key: 'B', text: 'RG-6 coaxial F-type' },
      { key: 'C', text: 'RJ-45 8P8C' },
      { key: 'D', text: 'RJ-11 6P2C/6P4C' },
    ],
    answer: 'D',
    explanation:
      'Analog voice/POTS fax lines use narrow RJ-11 jacks; RJ-45 is wider Ethernet.',
    tags: ['Telephony'],
  },
  {
    id: 'ccst-50',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Encryption',
    difficulty: 'intermediate',
    prompt:
      'BitLocker recovery prompts at boot after hardware changes. Which credential unlocks the volume in recovery?',
    options: [
      { key: 'A', text: 'The 48-digit numerical recovery key' },
      { key: 'B', text: 'TPM owner password used for daily login' },
      { key: 'C', text: 'Standard domain password without recovery package' },
      { key: 'D', text: 'Windows Hello PIN alone' },
    ],
    answer: 'A',
    explanation:
      'Recovery mode requires the escrowed recovery key when TPM measurements no longer match.',
    tags: ['BitLocker'],
  },
  {
    id: 'ccst-51',
    certification: 'ccst-it-support',
    domain: 'Help Desk',
    topic: 'Identity',
    difficulty: 'easy',
    prompt:
      'Reset an on-premises domain user password from IT support. Which MMC tool is standard?',
    options: [
      { key: 'A', text: 'Local Users and Groups on the endpoint only' },
      { key: 'B', text: 'Microsoft Entra admin center (cloud-only scenario)' },
      { key: 'C', text: 'AWS IAM console' },
      { key: 'D', text: 'Active Directory Users and Computers (ADUC)' },
    ],
    answer: 'D',
    explanation:
      'Traditional AD domains use ADUC for account maintenance; Entra serves cloud identities.',
    tags: ['Active Directory'],
  },
  {
    id: 'ccst-52',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Ticketing',
    difficulty: 'intermediate',
    prompt:
      'Tickets auto-assign by urgency and impact to stop cherry-picking easy work. Which mechanism describes that?',
    options: [
      { key: 'A', text: 'FIFO queue only' },
      { key: 'B', text: 'Self-service catalog browsing' },
      { key: 'C', text: 'Automated ticket routing / assignment rules' },
      { key: 'D', text: 'Manual round-robin without logic' },
    ],
    answer: 'C',
    explanation:
      'Automation applies policy-based routing so analysts cannot skip tough incidents voluntarily.',
    tags: ['Workflow'],
  },
  {
    id: 'ccst-53',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Metrics',
    difficulty: 'intermediate',
    prompt:
      'Which pair of KPIs best proves complex incidents are resolved inside contracted windows?',
    options: [
      { key: 'A', text: 'First-contact resolution and total ticket volume' },
      {
        key: 'B',
        text: 'Mean Time to Resolution (MTTR) and SLA breach rate',
      },
      { key: 'C', text: 'Net Promoter Score and ticket volume' },
      { key: 'D', text: 'Customer satisfaction survey only' },
    ],
    answer: 'B',
    explanation:
      'MTTR tracks elapsed repair time while SLA breach counts misses against promised timelines.',
    tags: ['KPI'],
  },
  {
    id: 'ccst-54',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Operations',
    difficulty: 'easy',
    prompt:
      'Which concept sorts incoming incidents into structured workflows so the right teams resolve them efficiently?',
    options: [
      { key: 'A', text: 'Change management board only' },
      { key: 'B', text: 'Queue management' },
      { key: 'C', text: 'Capacity planning spreadsheets only' },
      { key: 'D', text: 'Hardware asset tagging only' },
    ],
    answer: 'B',
    explanation:
      'Queue management covers prioritization, routing, and throughput—not just inventory.',
    tags: ['ITSM'],
  },
  {
    id: 'ccst-55',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Motherboards',
    difficulty: 'easy',
    prompt:
      'A media PC must fit a shelf under 8 inches deep. Which mainstream motherboard form factor fits tight spaces?',
    options: [
      { key: 'A', text: 'Micro-ATX (typically ~9.6" deep)' },
      { key: 'B', text: 'Full ATX' },
      { key: 'C', text: 'E-ATX extended' },
      { key: 'D', text: 'Mini-ITX (~6.7" square)' },
    ],
    answer: 'D',
    explanation:
      'Mini-ITX is the smallest common consumer form factor listed—ideal for compact builds.',
    tags: ['Form factor'],
  },
  {
    id: 'ccst-56',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Safety',
    difficulty: 'intermediate',
    prompt:
      'Without wrist straps, which two practices reduce electrostatic discharge risk when handling components?',
    options: [
      {
        key: 'A',
        text: 'Wiping gold fingers with a dry cloth and working on carpet',
      },
      {
        key: 'B',
        text: 'Humidify the room above 90% for static dissipation',
      },
      {
        key: 'C',
        text: 'Touch unpainted chassis metal periodically and keep modules in anti-static bags until installation',
      },
      { key: 'D', text: 'Shuffle feet on rugs for grounding' },
    ],
    answer: 'C',
    explanation:
      'Equalize potential with chassis ground and leave parts shielded until placement—avoid static-generating surfaces.',
    tags: ['ESD'],
  },
  {
    id: 'ccst-57',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Safety',
    difficulty: 'easy',
    prompt:
      'Which extinguisher class best matches energized electrical equipment fires in typical US labeling?',
    options: [
      { key: 'A', text: 'Class D metal fires' },
      { key: 'B', text: 'Class A wood/paper water extinguishers' },
      { key: 'C', text: 'Class C nonconductive agents such as CO₂/clean agents for energized gear' },
      { key: 'D', text: 'Class B foam only on live circuits' },
    ],
    answer: 'C',
    explanation:
      'Class C addresses energized electrical fires using agents that do not conduct shock hazard.',
    tags: ['Safety'],
  },
  {
    id: 'ccst-58',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Power supplies',
    difficulty: 'intermediate',
    prompt:
      'Why should technicians avoid opening a PSU housing even when unplugged?',
    options: [
      { key: 'A', text: 'It vents ozone that collapses RAID arrays' },
      { key: 'B', text: 'Breaking the sticker bricks motherboard firmware automatically' },
      { key: 'C', text: 'Magnets erase SSDs instantly' },
      {
        key: 'D',
        text: 'High-voltage capacitors can retain dangerous charge after AC removal',
      },
    ],
    answer: 'D',
    explanation:
      'Bulk capacitors store energy—qualified depot repair only; do not probe consumer PSUs.',
    tags: ['Safety'],
  },
  {
    id: 'ccst-59',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Privacy',
    difficulty: 'easy',
    prompt: 'Which item is best classified as sensitive personal biometric PII?',
    options: [
      { key: 'A', text: 'Employer federal tax ID' },
      { key: 'B', text: 'Public marketing web server IP' },
      { key: 'C', text: 'Facial geometry used for authentication' },
      { key: 'D', text: 'Vendor toll-free support line' },
    ],
    answer: 'C',
    explanation:
      'Biometric templates uniquely identify individuals and demand strict handling.',
    tags: ['Privacy'],
  },
  {
    id: 'ccst-60',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'Windows diagnostics',
    difficulty: 'easy',
    prompt:
      'Which two utilities summarize processor model and installed RAM on Windows?',
    options: [
      { key: 'A', text: 'System Information (msinfo32) and Task Manager' },
      { key: 'B', text: 'Disk Management and ipconfig' },
      { key: 'C', text: 'Event Viewer and Paint' },
      { key: 'D', text: 'Only Command Prompt title bar' },
    ],
    answer: 'A',
    explanation:
      'Msinfo32 inventories hardware; Task Manager Performance tab highlights CPU/RAM quickly.',
    tags: ['Inventory'],
  },
  {
    id: 'ccst-61',
    certification: 'ccst-it-support',
    domain: 'Help Desk',
    topic: 'Remote support',
    difficulty: 'easy',
    prompt:
      'Which tool is intended for collaborative screen sharing without locking the local user out of their session?',
    options: [
      { key: 'A', text: 'SSH' },
      { key: 'B', text: 'Microsoft Remote Desktop (new session)' },
      { key: 'C', text: 'Windows Remote Assistance' },
      { key: 'D', text: 'PowerShell remoting without WinRM GUI' },
    ],
    answer: 'C',
    explanation:
      'Remote Assistance keeps the user engaged on the same desktop experience.',
    tags: ['Windows'],
  },
  {
    id: 'ccst-62',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'Printing',
    difficulty: 'intermediate',
    prompt:
      'The print queue is stuck and the UI cannot clear jobs. What is the correct remediation path?',
    options: [
      { key: 'A', text: 'Swap USB cables randomly' },
      { key: 'B', text: 'Remove/re-add printer without touching spooler files' },
      {
        key: 'C',
        text: 'Stop the Print Spooler service, delete jobs from the spool directory, restart the service',
      },
      { key: 'D', text: 'Power-cycle only the printer hardware' },
    ],
    answer: 'C',
    explanation:
      'Clearing stale SPL/SHD files after stopping spooler resets corrupted queues client-side.',
    tags: ['Printing'],
  },
  {
    id: 'ccst-63',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'Firewalls',
    difficulty: 'intermediate',
    prompt:
      'RDP to a server times out but ICMP ping succeeds. What should you verify next?',
    options: [
      { key: 'A', text: 'UDP 67 DHCP relay' },
      { key: 'B', text: 'Firewall permits TCP 3389 end-to-end' },
      { key: 'C', text: 'DNS MX records for email' },
      { key: 'D', text: 'HTTP port 80 only' },
    ],
    answer: 'B',
    explanation:
      'Reachability without session establishment usually points to filter rules blocking RDP while ICMP passes.',
    tags: ['RDP'],
  },
  {
    id: 'ccst-64',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Wireless peripherals',
    difficulty: 'easy',
    prompt:
      'Bluetooth headphones work with a phone but never appear on a laptop while Bluetooth is enabled. What is most likely?',
    options: [
      {
        key: 'A',
        text: 'Headphones stay connected to the phone and are not discoverable/pairing mode',
      },
      { key: 'B', text: 'Laptop Bluetooth generation forbids audio profiles' },
      { key: 'C', text: 'Windows Audio service solely controls pairing visibility' },
      { key: 'D', text: 'Headphones require a proprietary VLAN' },
    ],
    answer: 'A',
    explanation:
      'Most headsets pair to one active host—disconnect or enter pairing mode for the second device.',
    tags: ['Bluetooth'],
  },
  {
    id: 'ccst-65',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'Email protocols',
    difficulty: 'intermediate',
    prompt:
      'Outlook cannot connect on port 993 for IMAP. What configuration aligns with IMAPS?',
    options: [
      { key: 'A', text: 'Force plaintext port 143 without TLS' },
      { key: 'B', text: 'Switch to POP3 on port 110 only' },
      {
        key: 'C',
        text: 'Enable SSL/TLS encryption so port 993 negotiates TLS-wrapped IMAP',
      },
      { key: 'D', text: 'Disable Wi-Fi and rely on cellular DNS only' },
    ],
    answer: 'C',
    explanation:
      'Port 993 expects TLS (IMAPS); mismatched encryption settings cause handshake failures.',
    tags: ['Email'],
  },
  {
    id: 'ccst-66',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'macOS',
    difficulty: 'easy',
    prompt:
      'On macOS with a 4K external display, how do you enlarge UI text without turning the panel fuzzy?',
    options: [
      { key: 'A', text: 'Enable Large Text accessibility presets only' },
      {
        key: 'B',
        text: 'Pick a scaled HiDPI mode that renders larger UI while keeping crisp output',
      },
      { key: 'C', text: 'Drop refresh rate to 30 Hz' },
      { key: 'D', text: 'Switch color profile randomly' },
    ],
    answer: 'B',
    explanation:
      'macOS scaled resolutions render sharper than naive non-native timing tricks.',
    tags: ['Display'],
  },
  {
    id: 'ccst-67',
    certification: 'ccst-it-support',
    domain: 'Troubleshooting',
    topic: 'Interviewing',
    difficulty: 'intermediate',
    prompt:
      'Which pair of questions best reveals triggers and scope for an intermittent network fault?',
    options: [
      {
        key: 'A',
        text: 'Ask to replace hardware immediately and shame the user for delay',
      },
      {
        key: 'B',
        text: 'Ask the user to demonstrate what happens right before failure and whether it ever occurred previously',
      },
      { key: 'C', text: 'Ask only if Caps Lock was on' },
      { key: 'D', text: 'Demand executive escalation mid-call' },
    ],
    answer: 'B',
    explanation:
      'Repro steps plus history isolate patterns versus one-off mistakes.',
    tags: ['Communication'],
  },
  {
    id: 'ccst-68',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Documentation',
    difficulty: 'intermediate',
    prompt:
      'Which ticket closure details most help the next technician facing the same symptom?',
    options: [
      {
        key: 'A',
        text: 'Call duration and subjective frustration score only',
      },
      {
        key: 'B',
        text: 'Ordered troubleshooting steps plus exact error codes/messages captured',
      },
      { key: 'C', text: 'User department without technical notes' },
      { key: 'D', text: 'Reviewer initials only' },
    ],
    answer: 'B',
    explanation:
      'Repeatability depends on concrete symptoms and the validated fix path.',
    tags: ['Ticketing'],
  },
  {
    id: 'ccst-69',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'Windows security',
    difficulty: 'easy',
    prompt:
      'Windows reports “This app isn’t Microsoft-verified.” What is the approved first step?',
    options: [
      {
        key: 'A',
        text: 'Check Microsoft Store / Company Portal / approved software catalog',
      },
      { key: 'B', text: 'Boot Safe Mode and sideload unsigned binaries' },
      { key: 'C', text: 'Grant standing local admin without approval' },
      { key: 'D', text: 'Disable SmartScreen permanently' },
    ],
    answer: 'A',
    explanation:
      'Use sanctioned distribution channels before bypassing OS protections.',
    tags: ['App control'],
  },
  {
    id: 'ccst-70',
    certification: 'ccst-it-support',
    domain: 'Customer Service',
    topic: 'Communication',
    difficulty: 'easy',
    prompt:
      'Before asking technical questions, what is the best way to reduce tension when a caller sounds stressed?',
    options: [
      { key: 'A', text: 'Tell them others have worse problems today' },
      {
        key: 'B',
        text: 'Briefly acknowledge impact, confirm you are taking ownership, then move to structured questions',
      },
      { key: 'C', text: 'Ask them to calm down explicitly' },
      { key: 'D', text: 'Put them on hold without warning to research silently' },
    ],
    answer: 'B',
    explanation:
      'Empathy plus a clear path forward preserves rapport while you gather facts.',
    tags: ['Soft skills'],
  },
  {
    id: 'ccst-71',
    certification: 'ccst-it-support',
    domain: 'Customer Service',
    topic: 'Communication',
    difficulty: 'intermediate',
    prompt:
      'A chat session mixes multiple unrelated symptoms in one paragraph. What should you do first?',
    options: [
      { key: 'A', text: 'Pick the easiest symptom and ignore the rest' },
      {
        key: 'B',
        text: 'Restate priorities with the user and separate issues into distinct tracks or tickets',
      },
      { key: 'C', text: 'Close the chat because scope is unclear' },
      { key: 'D', text: 'Escalate immediately without clarification' },
    ],
    answer: 'B',
    explanation:
      'Clarifying scope prevents fixing the wrong problem and keeps SLAs honest per issue.',
    tags: ['Chat'],
  },
  {
    id: 'ccst-72',
    certification: 'ccst-it-support',
    domain: 'Customer Service',
    topic: 'Professionalism',
    difficulty: 'easy',
    prompt:
      'Which behavior best upholds professionalism when a user uses inappropriate language?',
    options: [
      { key: 'A', text: 'Match their tone so they respect you' },
      {
        key: 'B',
        text: 'Stay neutral, cite mutual respect expectations, and continue toward resolution or supervisor path per policy',
      },
      { key: 'C', text: 'Mute yourself and joke with coworkers' },
      { key: 'D', text: 'Hang up immediately without warning' },
    ],
    answer: 'B',
    explanation:
      'Depersonalize conflict; follow organizational escalation procedures instead of escalating emotionally.',
    tags: ['Conduct'],
  },
  {
    id: 'ccst-73',
    certification: 'ccst-it-support',
    domain: 'Help Desk',
    topic: 'Remote support',
    difficulty: 'intermediate',
    prompt:
      'Before starting a remote-control session, what must typically happen first?',
    options: [
      { key: 'A', text: 'Disable antivirus real-time protection silently' },
      {
        key: 'B',
        text: 'Explain what you will do, obtain informed consent, and record channel/time per policy',
      },
      { key: 'C', text: 'Share admin passwords in chat for speed' },
      { key: 'D', text: 'Take control without telling the user to avoid panic' },
    ],
    answer: 'B',
    explanation:
      'Consent and transparency protect privacy and align with audit/compliance expectations.',
    tags: ['Governance'],
  },
  {
    id: 'ccst-74',
    certification: 'ccst-it-support',
    domain: 'Help Desk',
    topic: 'Operations',
    difficulty: 'easy',
    prompt:
      'What is the primary difference between an incident ticket and a formal change request?',
    options: [
      {
        key: 'A',
        text: 'Incidents restore or track unexpected service issues; changes plan controlled modifications with risk review',
      },
      { key: 'B', text: 'They are identical labels in modern ITSM tools' },
      { key: 'C', text: 'Incidents never require approvals' },
      { key: 'D', text: 'Change requests are only for printer toner' },
    ],
    answer: 'A',
    explanation:
      'Incidents focus on service restoration; changes follow governance when altering production components.',
    tags: ['ITSM'],
  },
  {
    id: 'ccst-75',
    certification: 'ccst-it-support',
    domain: 'Help Desk',
    topic: 'Escalation',
    difficulty: 'intermediate',
    prompt:
      'Tier 1 exhausted documented fixes for an application crash affecting one VIP laptop. What is the best next step?',
    options: [
      { key: 'A', text: 'Reinstall the OS without backing up user data' },
      {
        key: 'B',
        text: 'Escalate with logs, reproduction steps, and hardware baseline to the application or desktop team per routing',
      },
      { key: 'C', text: 'Close as “cannot reproduce” because only one user reports it' },
      { key: 'D', text: 'Grant local admin permanently for convenience' },
    ],
    answer: 'B',
    explanation:
      'Escalation should bundle evidence so the next tier starts engineering instead of re-triage.',
    tags: ['Workflow'],
  },
  {
    id: 'ccst-76',
    certification: 'ccst-it-support',
    domain: 'Help Desk',
    topic: 'Assets',
    difficulty: 'easy',
    prompt:
      'Where would you most reliably find the factory warranty end date for a corporate laptop deployed through procurement?',
    options: [
      { key: 'A', text: 'The user’s mobile carrier billing portal' },
      {
        key: 'B',
        text: 'Asset management / CMDB or vendor portal tied to the device serial or purchase order',
      },
      { key: 'C', text: 'Public WHOIS for the company domain' },
      { key: 'D', text: 'Windows desktop wallpaper filename' },
    ],
    answer: 'B',
    explanation:
      'Warranty entitlements track with serials and purchase records—not user anecdotes.',
    tags: ['CMDB'],
  },
  {
    id: 'ccst-77',
    certification: 'ccst-it-support',
    domain: 'Troubleshooting',
    topic: 'Methodology',
    difficulty: 'intermediate',
    prompt:
      'After a software patch, a workstation fails to boot to the OS but BIOS POST completes. What isolation strategy fits next?',
    options: [
      { key: 'A', text: 'Replace every peripheral simultaneously' },
      {
        key: 'B',
        text: 'Boot to recovery/safe modes or restore points before assuming hardware failure',
      },
      { key: 'C', text: 'Format all drives from BIOS without backup verification' },
      { key: 'D', text: 'Assume the monitor cable caused boot failure' },
    ],
    answer: 'B',
    explanation:
      'Separate boot-environment issues from hardware by using vendor recovery tooling and logs.',
    tags: ['Windows'],
  },
  {
    id: 'ccst-78',
    certification: 'ccst-it-support',
    domain: 'Troubleshooting',
    topic: 'Networking',
    difficulty: 'intermediate',
    prompt:
      'Only one application protocol fails while others work on the same PC. What does that usually suggest?',
    options: [
      { key: 'A', text: 'The monitor refresh rate is wrong' },
      {
        key: 'B',
        text: 'Focus on application settings, host firewall rules, proxies, or service status—not the entire NIC stack first',
      },
      { key: 'C', text: 'The motherboard must be replaced' },
      { key: 'D', text: 'DNS is globally broken for the site' },
    ],
    answer: 'B',
    explanation:
      'When sibling apps work, narrow to ports, credentials, or app-specific blocks instead of Layer-1.',
    tags: ['Isolation'],
  },
  {
    id: 'ccst-79',
    certification: 'ccst-it-support',
    domain: 'Troubleshooting',
    topic: 'Change management',
    difficulty: 'easy',
    prompt:
      'Users report slow file copies after a driver update on several laptops. What aligns with good practice?',
    options: [
      { key: 'A', text: 'Hide the update because drivers never regress' },
      {
        key: 'B',
        text: 'Treat it as a potential regression: gather versions, compare baselines, roll back or patch per vendor guidance',
      },
      { key: 'C', text: 'Reimage every machine overnight without communication' },
      { key: 'D', text: 'Disable Ethernet to force Wi-Fi only' },
    ],
    answer: 'B',
    explanation:
      'Correlate updates with symptoms; use rollback or replacement builds under change policy.',
    tags: ['Drivers'],
  },
  {
    id: 'ccst-80',
    certification: 'ccst-it-support',
    domain: 'Troubleshooting',
    topic: 'Documentation',
    difficulty: 'easy',
    prompt:
      'What should you record when an intermittent issue did **not** reproduce during your live session?',
    options: [
      { key: 'A', text: 'Nothing—if it works now, close immediately' },
      {
        key: 'B',
        text: 'Environmental clues (time, apps open, docked vs undocked), monitoring plan, and next trigger to capture logs',
      },
      { key: 'C', text: 'Blame the user for exaggerating' },
      { key: 'D', text: 'Delete earlier ticket notes to reduce clutter' },
    ],
    answer: 'B',
    explanation:
      'Non-reproducing tickets still need hypotheses and follow-up hooks or diagnostics schedules.',
    tags: ['ITSM'],
  },
  {
    id: 'ccst-81',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'Windows',
    difficulty: 'intermediate',
    prompt:
      'A laptop “shuts down” instantly when closing the lid despite choosing Sleep in Settings. What setting pair should you verify?',
    options: [
      { key: 'A', text: 'Wallpaper slideshow interval' },
      {
        key: 'B',
        text: 'Power plan lid action plus Fast Startup / hybrid behavior affecting wake reliability',
      },
      { key: 'C', text: 'Screen saver timeout only' },
      { key: 'D', text: 'Sound scheme defaults' },
    ],
    answer: 'B',
    explanation:
      'Power buttons/lid actions and fast-startup quirks commonly confuse sleep vs hibernate vs shutdown.',
    tags: ['Power'],
  },
  {
    id: 'ccst-82',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'Windows',
    difficulty: 'easy',
    prompt:
      'Which built-in tool is the best first stop for application crashes logged as Error or Critical soon after login?',
    options: [
      { key: 'A', text: 'Character Map' },
      { key: 'B', text: 'Event Viewer (Windows Logs → Application / System filtered by time)' },
      { key: 'C', text: 'Magnifier' },
      { key: 'D', text: 'Steps Recorder only, without reading logs' },
    ],
    answer: 'B',
    explanation:
      'Event Viewer correlates faulting modules and exception codes near the failure window.',
    tags: ['Logs'],
  },
  {
    id: 'ccst-83',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'Windows',
    difficulty: 'intermediate',
    prompt:
      'A domain laptop cannot reach internal shares after VPN connects; internet browsing works. What should you check before blaming Wi-Fi?',
    options: [
      { key: 'A', text: 'Printer default orientation' },
      {
        key: 'B',
        text: 'Whether split tunneling excludes RFC1918 routes or DNS suffix/search lists resolve internal hostnames',
      },
      { key: 'C', text: 'Bluetooth audio codec' },
      { key: 'D', text: 'USB selective suspend for keyboard' },
    ],
    answer: 'B',
    explanation:
      'VPN policies determine which subnets traverse the tunnel; name resolution must match corporate suffixes.',
    tags: ['VPN'],
  },
  {
    id: 'ccst-84',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'Linux',
    difficulty: 'easy',
    prompt:
      'On Linux support calls, which command shows listening TCP ports and owning processes (modern tooling)?',
    options: [
      { key: 'A', text: 'lsblk' },
      { key: 'B', text: 'ss -tlnp (or netstat legacy where installed)' },
      { key: 'C', text: 'chmod 777 /' },
      { key: 'D', text: 'fdisk -l alone for network issues' },
    ],
    answer: 'B',
    explanation:
      '`ss` reveals sockets and programs bound to ports—critical when a service “should be up.”',
    tags: ['Linux'],
  },
  {
    id: 'ccst-85',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Physical security',
    difficulty: 'easy',
    prompt:
      'An unknown person tries to follow an employee through a secured badge door without badging. What is this called?',
    options: [
      { key: 'A', text: 'Phishing' },
      { key: 'B', text: 'Tailgating / piggybacking' },
      { key: 'C', text: 'SQL injection' },
      { key: 'D', text: 'Ransomware staging' },
    ],
    answer: 'B',
    explanation:
      'Physical access attempts exploit courtesy; employees should refuse to hold doors for strangers.',
    tags: ['Facilities'],
  },
  {
    id: 'ccst-86',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Physical security',
    difficulty: 'easy',
    prompt:
      'What is the best guidance when handling printed documents that list customer account numbers in an open office?',
    options: [
      { key: 'A', text: 'Leave them on the desk overnight for faster morning work' },
      {
        key: 'B',
        text: 'Limit exposure, use clean-desk policy, shred or secure bins when no longer needed',
      },
      { key: 'C', text: 'Photograph lists with a personal phone for convenience' },
      { key: 'D', text: 'Share scans in a public chat channel' },
    ],
    answer: 'B',
    explanation:
      'Shoulder surfing and loose paper are data-loss vectors—treat prints like sensitive media.',
    tags: ['Privacy'],
  },
  {
    id: 'ccst-87',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Problem management',
    difficulty: 'intermediate',
    prompt:
      'Over three months, dozens of tickets share the same router bug after a firmware release. What ITSM construct addresses the underlying cause?',
    options: [
      { key: 'A', text: 'A single incident marked resolved each time' },
      {
        key: 'B',
        text: 'A problem record driving root-cause analysis and permanent corrective change',
      },
      { key: 'C', text: 'A purchase order only' },
      { key: 'D', text: 'Rotating shift schedules' },
    ],
    answer: 'B',
    explanation:
      'Problems track trends across incidents; incidents restore service for each occurrence.',
    tags: ['ITSM'],
  },
  {
    id: 'ccst-88',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Self-service',
    difficulty: 'easy',
    prompt:
      'What is the main benefit of a well-maintained self-service password-reset portal backed by MFA?',
    options: [
      { key: 'A', text: 'Eliminates all security risks permanently' },
      {
        key: 'B',
        text: 'Reduces call volume and empowers users while preserving verification controls',
      },
      { key: 'C', text: 'Removes the need for directory services' },
      { key: 'D', text: 'Allows sharing passwords between coworkers' },
    ],
    answer: 'B',
    explanation:
      'Self-service deflects routine tickets but still must enforce identity assurance.',
    tags: ['Identity'],
  },
  {
    id: 'ccst-89',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'Addressing',
    difficulty: 'easy',
    prompt:
      'A Windows adapter shows an IPv4 address starting with 169.254.x.x and cannot reach the LAN. What does that indicate?',
    options: [
      { key: 'A', text: 'Guaranteed malware infection' },
      {
        key: 'B',
        text: 'APIPA self-assigned address because DHCP was unreachable—check cable, VLAN, or DHCP scope',
      },
      { key: 'C', text: 'The subnet mask is always /8' },
      { key: 'D', text: 'DNS root servers are offline globally' },
    ],
    answer: 'B',
    explanation:
      '169.254/16 link-local automatic addressing signals DHCP failure or isolation—not a routable corporate address.',
    tags: ['DHCP'],
  },
  {
    id: 'ccst-90',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'Diagnostics',
    difficulty: 'intermediate',
    prompt:
      'Compared with tracert, what does pathping add that helps intermittent WAN loss?',
    options: [
      { key: 'A', text: 'Disk defragmentation statistics' },
      {
        key: 'B',
        text: 'Per-hop statistics over time (latency/packet loss sampling), not just a single trace snapshot',
      },
      { key: 'C', text: 'GPU frame pacing graphs' },
      { key: 'D', text: 'Printer toner levels' },
    ],
    answer: 'B',
    explanation:
      'Pathping combines route tracing with sustained probing to catch flaky hops.',
    tags: ['WAN'],
  },
  {
    id: 'ccst-91',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'Wireless',
    difficulty: 'intermediate',
    prompt:
      'Users report perfect signal bars but terrible throughput in a dense office. What is a likely RF issue?',
    options: [
      { key: 'A', text: 'Too few SSIDs broadcast on one AP' },
      {
        key: 'B',
        text: 'Co-channel interference or overcrowded airtime—needs channel planning, cell sizing, or band steering',
      },
      { key: 'C', text: 'IPv6 is disabled on clients' },
      { key: 'D', text: 'DNS TTL values are too high' },
    ],
    answer: 'B',
    explanation:
      'Bars measure RSSI, not spectrum contention; interference still crushes effective throughput.',
    tags: ['Wi-Fi'],
  },
  {
    id: 'ccst-92',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Power',
    difficulty: 'easy',
    prompt:
      'Why is a small desktop UPS preferred over a simple surge strip for a workstation during storms?',
    options: [
      { key: 'A', text: 'UPS increases CPU clock automatically' },
      {
        key: 'B',
        text: 'UPS provides ride-through on brief outages and cleaner shutdown windows; surge strips only clamp spikes',
      },
      { key: 'C', text: 'Surge strips backup files to the cloud' },
      { key: 'D', text: 'UPS replaces the need for backups' },
    ],
    answer: 'B',
    explanation:
      'Battery-backed UPS bridges brownouts; surge suppressors do not power equipment through outages.',
    tags: ['UPS'],
  },
  {
    id: 'ccst-93',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Cooling',
    difficulty: 'easy',
    prompt:
      'After replacing a desktop CPU cooler, what should you verify before closing the case?',
    options: [
      { key: 'A', text: 'Apply standard notebook thermal paste to DIMM contacts' },
      {
        key: 'B',
        text: 'Fan header connected correctly, heatsink mount torque even, and airflow direction aligned with case flow',
      },
      { key: 'C', text: 'Remove all chassis fans for silence' },
      { key: 'D', text: 'Seal every vent with tape to reduce dust' },
    ],
    answer: 'B',
    explanation:
      'Cooling depends on mechanical seating and airflow paths—not improvisation with unrelated surfaces.',
    tags: ['Thermal'],
  },
  {
    id: 'ccst-94',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Storage',
    difficulty: 'intermediate',
    prompt:
      'Why might NVMe SSDs on PCIe outperform SATA SSDs for heavy database workloads on comparable generations?',
    options: [
      { key: 'A', text: 'SATA cables carry more RF noise than PCIe' },
      {
        key: 'B',
        text: 'NVMe leverages PCIe lanes with higher bandwidth and lower protocol overhead than AHCI-over-SATA',
      },
      { key: 'C', text: 'SATA SSDs cannot hold databases by specification' },
      { key: 'D', text: 'NVMe automatically encrypts without BitLocker' },
    ],
    answer: 'B',
    explanation:
      'Throughput and queue depth advantages come from the PCIe/NVMe stack versus legacy SATA bottlenecks.',
    tags: ['Performance'],
  },
]

const ccstItSupportQuestions: ExamQuestion[] = [...ccstItSupportQuestionsBase, ...ccstPdfImportMcqs]

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

const ccstPbqScenariosBase: PBQScenario[] = [
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
  {
    id: 'ccst-pbq-order-methodology-8',
    certification: 'ccst-it-support',
    topic: 'Troubleshooting',
    difficulty: 'intermediate',
    type: 'order',
    prompt:
      'Order the full Cisco-style problem-solving sequence (eight steps). Start with defining the problem; end with documentation.',
    instructions: 'Arrange from Step 1 through Step 8.',
    items: [
      { id: 'm8-def', label: 'Define the problem' },
      { id: 'm8-gather', label: 'Gather detailed information' },
      { id: 'm8-cause', label: 'Identify a probable cause of failure' },
      { id: 'm8-plan', label: 'Devise a plan to resolve the problem' },
      { id: 'm8-change', label: 'Make necessary changes to implement the plan' },
      { id: 'm8-observe', label: 'Observe the results of the changes' },
      { id: 'm8-repeat', label: 'If unresolved, repeat the process' },
      { id: 'm8-doc', label: 'Document the changes made to resolve the problem' },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' },
      { id: '6', label: 'Step 6' },
      { id: '7', label: 'Step 7' },
      { id: '8', label: 'Step 8' },
    ],
    solution: {
      'm8-def': 1,
      'm8-gather': 2,
      'm8-cause': 3,
      'm8-plan': 4,
      'm8-change': 5,
      'm8-observe': 6,
      'm8-repeat': 7,
      'm8-doc': 8,
    },
    explanation:
      'Matches CCST IT Support sequencing: validate outcomes before looping, and finish with documentation after resolution.',
  },
  {
    id: 'ccst-pbq-match-ticket-notes',
    certification: 'ccst-it-support',
    topic: 'Documentation',
    difficulty: 'easy',
    type: 'match',
    prompt:
      'Classify each trouble-ticket note snippet as meeting documentation best practices or not.',
    instructions: 'Drag each note into the correct bucket.',
    items: [
      {
        id: 'note-factual',
        label:
          'WAN outage; ping to gateway 192.168.1.1 OK; traceroute fails hop 3 — ISP ticket #45892 opened.',
      },
      {
        id: 'note-subjective',
        label: 'Customer was rude and clearly does not understand networking gear.',
      },
      {
        id: 'note-errorcode',
        label: 'Outlook error 0x800CCC0F reproduced after reboot; cleared cache per vendor KB ####.',
      },
      {
        id: 'note-blame',
        label: 'User keeps jamming printers — third complaint this month.',
      },
    ],
    targets: [
      {
        id: 'bucket-good',
        label: 'Meets best practices — objective, factual, technically specific',
      },
      {
        id: 'bucket-bad',
        label: 'Does not meet best practices — subjective, emotional, or blame-oriented',
      },
    ],
    solution: {
      'note-factual': 'bucket-good',
      'note-subjective': 'bucket-bad',
      'note-errorcode': 'bucket-good',
      'note-blame': 'bucket-bad',
    },
    explanation:
      'Professional tickets capture reproducible facts, measurements, and vendor references—not opinions about users.',
  },
  {
    id: 'ccst-pbq-match-helpdesk-terms',
    certification: 'ccst-it-support',
    topic: 'Help Desk',
    difficulty: 'easy',
    type: 'match',
    prompt: 'Match each help desk term to the scenario it best describes.',
    instructions: 'Drag each term onto the matching description.',
    items: [
      { id: 'term-queue', label: 'Queue management' },
      { id: 'term-ticket', label: 'Ticketing system' },
      { id: 'term-time', label: 'Time management' },
      { id: 'term-kpi', label: 'KPI' },
    ],
    targets: [
      {
        id: 'sc-queue',
        label: 'Prioritize incoming incidents so urgent business impact is handled first',
      },
      {
        id: 'sc-ticket',
        label: 'Store documentation for every contact so teams can track status across shifts',
      },
      {
        id: 'sc-time',
        label: 'Switch to another productive task while waiting on downloads or vendor callbacks',
      },
      {
        id: 'sc-kpi',
        label: 'Measure metrics such as backlog or resolution time against SLA targets',
      },
    ],
    solution: {
      'term-queue': 'sc-queue',
      'term-ticket': 'sc-ticket',
      'term-time': 'sc-time',
      'term-kpi': 'sc-kpi',
    },
    explanation:
      'Queues govern priority; ticketing systems record truth over time; time management avoids idle waiting; KPIs quantify performance versus commitments.',
  },
]

const ccstPbqScenarios: PBQScenario[] = [...ccstPbqScenariosBase, ...ccstPdfImportPbqs]

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
