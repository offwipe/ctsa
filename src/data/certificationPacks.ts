import { intermediateQuestions } from './questions'
import { aPlusGlossaryFlashcards, aPlusGlossaryMatchScenarios } from './aPlusGlossaryGenerated'

export type CertificationId = 'a-plus' | 'network-plus' | 'security-plus'
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
]

export function getCertificationPack(id: CertificationId) {
  return certificationPacks.find((pack) => pack.id === id) ?? certificationPacks[0]
}
