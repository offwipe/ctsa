import type { ExamQuestion, PBQScenario } from './certificationPacks'

/** CCST IT Support items sourced from PDF practice sets (set 3/4 + Perplexity generations). */
export const ccstPdfImportMcqs: ExamQuestion[] = [
  {
    id: 'ccst-95',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'ITSM',
    difficulty: 'easy',
    prompt:
      'A dashboard shows average time to restore service after outages. Which metric family does that best illustrate?',
    options: [
      { key: 'A', text: 'A pure customer-satisfaction survey with no time component' },
      { key: 'B', text: 'A service performance / availability KPI such as MTTR or similar restore-time tracking' },
      { key: 'C', text: 'A marketing click-through rate' },
      { key: 'D', text: 'A hardware serial-number inventory count' },
    ],
    answer: 'B',
    explanation:
      'Restore-oriented metrics quantify how quickly service returns after failure—common in operations KPIs and SLAs.',
    tags: ['KPI', 'SLA'],
  },
  {
    id: 'ccst-96',
    certification: 'ccst-it-support',
    domain: 'Help Desk',
    topic: 'Metrics',
    difficulty: 'easy',
    prompt:
      'Which pair best distinguishes an SLA from a simple internal goal?',
    options: [
      { key: 'A', text: 'SLAs are informal chat agreements; goals are always legally binding' },
      {
        key: 'B',
        text: 'An SLA is a documented commitment between provider and customer (often with targets and remedies); a goal may be internal-only',
      },
      { key: 'C', text: 'SLAs apply only to hardware warranties, never to response times' },
      { key: 'D', text: 'Goals are always public; SLAs are always secret' },
    ],
    answer: 'B',
    explanation:
      'SLAs formalize measurable expectations; internal goals can exist without an external contractual SLA.',
    tags: ['SLA'],
  },
  {
    id: 'ccst-97',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'ITSM',
    difficulty: 'easy',
    prompt:
      'A user asks for a second monitor because their role changed—nothing is broken. How should this be classified first?',
    options: [
      { key: 'A', text: 'Major incident' },
      { key: 'B', text: 'Service request (standard change/access or fulfillment)' },
      { key: 'C', text: 'Security breach' },
      { key: 'D', text: 'Problem record' },
    ],
    answer: 'B',
    explanation:
      'Routine asks for standard items or access are service requests; incidents imply disruption or degradation.',
    tags: ['ITSM'],
  },
  {
    id: 'ccst-98',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Documentation',
    difficulty: 'intermediate',
    prompt:
      'Why do regulated organizations emphasize consistent ticket documentation and retention policies?',
    options: [
      { key: 'A', text: 'So technicians can skip root-cause analysis' },
      {
        key: 'B',
        text: 'To support audits, continuity when shifts change, and defensible timelines of what was done and when',
      },
      { key: 'C', text: 'Because tickets replace backups entirely' },
      { key: 'D', text: 'To delete user emails automatically' },
    ],
    answer: 'B',
    explanation:
      'Tickets are part of the evidence trail for compliance, handoffs, and post-incident review—not a substitute for backups.',
    tags: ['Compliance'],
  },
  {
    id: 'ccst-99',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Safety',
    difficulty: 'easy',
    prompt:
      'Before swapping RAM inside a desktop on a low-humidity winter day, what practice best reduces ESD risk?',
    options: [
      { key: 'A', text: 'Work on carpet in socks to stay comfortable' },
      { key: 'B', text: 'Use an ESD wrist strap bonded to chassis ground and avoid insulating static buildup' },
      { key: 'C', text: 'Spray glass cleaner on the motherboard first' },
      { key: 'D', text: 'Touch only the gold contacts with greasy fingers' },
    ],
    answer: 'B',
    explanation:
      'Controlled grounding paths dissipate static; carpet and solvents increase risk to components.',
    tags: ['ESD'],
  },
  {
    id: 'ccst-100',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Peripherals',
    difficulty: 'easy',
    prompt:
      'Debris is stuck under laptop keys. What is the safest first-line approach compared with blasting compressed air at full pressure?',
    options: [
      { key: 'A', text: 'Invert gently and use short controlled bursts at an angle, or manufacturer-approved key-cap cleaning' },
      { key: 'B', text: 'Hold the can upside-down and freeze spray directly under keycaps' },
      { key: 'C', text: 'Pour isopropyl across the keyboard while powered on' },
      { key: 'D', text: 'Use a household vacuum nozzle pressed hard against switches' },
    ],
    answer: 'A',
    explanation:
      'Liquid propellants and excessive force can damage scissor mechanisms; follow vendor guidance and power down when liquids are involved.',
    tags: ['Keyboard'],
  },
  {
    id: 'ccst-101',
    certification: 'ccst-it-support',
    domain: 'Customer Service',
    topic: 'Communication',
    difficulty: 'easy',
    prompt:
      'Which behavior best reflects inclusive, professional customer service on a tense call?',
    options: [
      { key: 'A', text: 'Matching sarcasm so the user “calms down”' },
      { key: 'B', text: 'Neutral language, respect for identity, and focus on the technical facts and agreed next steps' },
      { key: 'C', text: 'Ending the call as soon as the user raises their voice' },
      { key: 'D', text: 'Sharing the ticket on social media for feedback' },
    ],
    answer: 'B',
    explanation:
      'Professional tone and boundaries reduce escalation; public shaming or mirroring hostility worsens outcomes.',
    tags: ['Soft skills'],
  },
  {
    id: 'ccst-102',
    certification: 'ccst-it-support',
    domain: 'Customer Service',
    topic: 'Communication',
    difficulty: 'easy',
    prompt:
      'Active listening on a help desk call most directly helps you:',
    options: [
      { key: 'A', text: 'Skip verification because you already know the product' },
      { key: 'B', text: 'Paraphrase symptoms, confirm impact, and reduce rework from misunderstood details' },
      { key: 'C', text: 'Guarantee a one-call fix every time' },
      { key: 'D', text: 'Avoid documenting anything the user said' },
    ],
    answer: 'B',
    explanation:
      'Playback of facts catches misheard IPs, error codes, and timelines before you chase the wrong root cause.',
    tags: ['Communication'],
  },
  {
    id: 'ccst-103',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Ticketing',
    difficulty: 'intermediate',
    prompt:
      'At shift change, what ticket practice most reduces duplicate work and customer frustration?',
    options: [
      { key: 'A', text: 'Close all open tickets so the queue looks clean' },
      {
        key: 'B',
        text: 'Leave factual status, next actions, pending vendor IDs, and contact preferences for the incoming tech',
      },
      { key: 'C', text: 'Delete internal notes to protect privacy' },
      { key: 'D', text: 'Reassign silently with no comment' },
    ],
    answer: 'B',
    explanation:
      'Handoff notes are the continuity layer across humans and time zones; they should be objective and actionable.',
    tags: ['Ticketing'],
  },
  {
    id: 'ccst-104',
    certification: 'ccst-it-support',
    domain: 'Help Desk',
    topic: 'Hardware support',
    difficulty: 'easy',
    prompt:
      'Tier 1 receives a failed laptop under vendor warranty. What is the typical next escalation path?',
    options: [
      { key: 'A', text: 'Open the sealed battery with a knife at the desk' },
      { key: 'B', text: 'Follow the OEM RMA / depot process and capture serials and failure evidence per policy' },
      { key: 'C', text: 'Bill the user personally for a new motherboard' },
      { key: 'D', text: 'Discard the device without asset tracking' },
    ],
    answer: 'B',
    explanation:
      'Warranty flows protect coverage and chain-of-custody; unauthorized disassembly can void protection.',
    tags: ['RMA'],
  },
  {
    id: 'ccst-105',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'Cabling',
    difficulty: 'intermediate',
    prompt:
      'Ethernet drops in a new office use shielded twisted-pair (STP) where EMI is high. What limitation still applies versus fiber for very long spans?',
    options: [
      { key: 'A', text: 'STP eliminates all distance limits so runs can be unlimited' },
      { key: 'B', text: 'Copper Ethernet still has standards-based segment length limits; EMI shielding does not remove all distance constraints' },
      { key: 'C', text: 'STP cannot carry TCP/IP' },
      { key: 'D', text: 'STP requires Wi-Fi controllers on every port' },
    ],
    answer: 'B',
    explanation:
      'Shielding helps noise; horizontal copper runs still obey category standards and channel length guidance.',
    tags: ['Cabling'],
  },
  {
    id: 'ccst-106',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Threats',
    difficulty: 'intermediate',
    prompt:
      'Which statement best contrasts spoofing with passive sniffing on a shared broadcast domain?',
    options: [
      { key: 'A', text: 'They are identical terms' },
      {
        key: 'B',
        text: 'Spoofing misrepresents identity (e.g., forged sender); sniffing captures traffic without necessarily impersonating',
      },
      { key: 'C', text: 'Sniffing always requires physical theft of the laptop' },
      { key: 'D', text: 'Spoofing only applies to printers' },
    ],
    answer: 'B',
    explanation:
      'Identity deception vs observation are different classes of misuse though both can enable attacks.',
    tags: ['Security'],
  },
  {
    id: 'ccst-107',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Phishing',
    difficulty: 'easy',
    prompt:
      'Spear phishing differs from broad phishing campaigns mainly because:',
    options: [
      { key: 'A', text: 'It only targets printers' },
      { key: 'B', text: 'It is tailored to a person or role using researched context, making it harder to spot' },
      { key: 'C', text: 'It never uses email' },
      { key: 'D', text: 'It is always blocked by spam filters' },
    ],
    answer: 'B',
    explanation:
      'Targeted lures reference real projects, colleagues, or vendors—raising success rates versus generic blasts.',
    tags: ['Phishing'],
  },
  {
    id: 'ccst-108',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Evidence',
    difficulty: 'intermediate',
    prompt:
      'Security asks you to preserve a laptop that may contain malware evidence. What is the best first-line stance?',
    options: [
      { key: 'A', text: 'Run every cleaner you find online, then sell the laptop' },
      {
        key: 'B',
        text: 'Stop non-essential use, avoid altering disk state more than necessary, and follow IR / legal chain-of-custody guidance',
      },
      { key: 'C', text: 'Reimage immediately without photos or notes' },
      { key: 'D', text: 'Let the user keep working because malware is hypothetical' },
    ],
    answer: 'B',
    explanation:
      'Forensics and IR need controlled handling; well-meaning “fixes” can destroy artifacts.',
    tags: ['IR'],
  },
  {
    id: 'ccst-109',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'IPv6',
    difficulty: 'intermediate',
    prompt:
      'A Windows PC shows a fe80::/10 address on an adapter but no global unicast IPv6. What does that most often imply?',
    options: [
      { key: 'A', text: 'The PC is guaranteed offline' },
      { key: 'B', text: 'Link-local addressing exists on-LAN only; global IPv6 may be absent or not configured end-to-end' },
      { key: 'C', text: 'DNS is always broken' },
      { key: 'D', text: 'IPv4 has been permanently removed from the internet' },
    ],
    answer: 'B',
    explanation:
      'fe80:: addresses are normal link-local; routable IPv6 requires additional configuration or SLAAC/ DHCPv6.',
    tags: ['IPv6'],
  },
  {
    id: 'ccst-110',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'TCP/IP',
    difficulty: 'easy',
    prompt:
      'A workstation shows 169.254.x.x on an interface that should be DHCP. What is that state commonly called?',
    options: [
      { key: 'A', text: 'APIPA / automatic private IP addressing when DHCP failed' },
      { key: 'B', text: 'A reserved loopback network' },
      { key: 'C', text: 'A public routable carrier grade NAT block' },
      { key: 'D', text: 'Proof the cable is fiber-only' },
    ],
    answer: 'A',
    explanation:
      '169.254/16 indicates self-assigned link-local IPv4 when DHCP is unreachable—start with link and DHCP path.',
    tags: ['DHCP'],
  },
  {
    id: 'ccst-111',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'Windows',
    difficulty: 'intermediate',
    prompt:
      'After changing Group Policy on a domain-joined PC, what command refreshes policy without waiting for the background cycle?',
    options: [
      { key: 'A', text: 'gpupdate /force from an elevated command prompt' },
      { key: 'B', text: 'format c:' },
      { key: 'C', text: 'netsh int ip reset' },
      { key: 'D', text: 'sfc /scannow only' },
    ],
    answer: 'A',
    explanation:
      'gpupdate triggers policy retrieval; combine with awareness of logon vs startup processing when testing.',
    tags: ['GPO'],
  },
  {
    id: 'ccst-112',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'Privileges',
    difficulty: 'easy',
    prompt:
      'On macOS, sudo elevates a single command; on Windows, “Run as administrator” does what conceptually similar thing?',
    options: [
      { key: 'A', text: 'Disables all security forever' },
      { key: 'B', text: 'Launches a process with administrative rights for actions that require them' },
      { key: 'C', text: 'Converts the disk to APFS automatically' },
      { key: 'D', text: 'Removes the need for passwords on the network' },
    ],
    answer: 'B',
    explanation:
      'Elevation grants higher integrity for maintenance tasks—still scoped and auditable on managed devices.',
    tags: ['Admin'],
  },
  {
    id: 'ccst-113',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'File shares',
    difficulty: 'intermediate',
    prompt:
      'A user’s mapped SMB drive fails after an AD password reset but the share still exists. What is a common credential cause on Windows?',
    options: [
      { key: 'A', text: 'The monitor refresh rate changed' },
      { key: 'B', text: 'Cached or mismatched credentials in Credential Manager / stale mapped session still referencing the old password' },
      { key: 'C', text: 'IPv6 always blocks SMB' },
      { key: 'D', text: 'The printer spooler deleted the share' },
    ],
    answer: 'B',
    explanation:
      'Windows can persist old credentials for UNC paths; clearing or updating them often restores mapped drives.',
    tags: ['SMB'],
  },
  {
    id: 'ccst-114',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'macOS',
    difficulty: 'intermediate',
    prompt:
      'An external disk mounts read-only on macOS. Before assuming hardware failure, what should you verify about filesystem support?',
    options: [
      { key: 'A', text: 'NTFS is natively fully read-write on all macOS versions without third-party drivers' },
      { key: 'B', text: 'Vendor NTFS drivers or reformat/exfil to exFAT/APFS may be required depending on OS support and mount state' },
      { key: 'C', text: 'APFS volumes always mount read-only on Macs' },
      { key: 'D', text: 'USB-C ports cannot carry storage' },
    ],
    answer: 'B',
    explanation:
      'Cross-platform filesystem support drives mount behavior; Disk Utility shows errors vs intentional read-only.',
    tags: ['macOS'],
  },
  {
    id: 'ccst-115',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Device Manager',
    difficulty: 'intermediate',
    prompt:
      'Device Manager shows Code 43 on a GPU after a user upgrade. What does Code 43 most often signal at a high level?',
    options: [
      { key: 'A', text: 'The monitor cable is HDMI 1.0' },
      { key: 'B', text: 'Windows stopped the device because it reported problems—often driver/power/physical seating related' },
      { key: 'C', text: 'The BIOS has no UEFI option' },
      { key: 'D', text: 'Wi-Fi channel width is 40 MHz' },
    ],
    answer: 'B',
    explanation:
      'Code 43 is a generic device-stop; gather driver versions, power connectors, and Event Viewer details.',
    tags: ['Drivers'],
  },
  {
    id: 'ccst-116',
    certification: 'ccst-it-support',
    domain: 'Troubleshooting',
    topic: 'Audio',
    difficulty: 'intermediate',
    prompt:
      'After installing a new graphics card, onboard audio disappeared from Sound settings. What should you check first?',
    options: [
      { key: 'A', text: 'Whether HDMI/DisplayPort audio from the GPU became the default playback device' },
      { key: 'B', text: 'Whether the keyboard layout is QWERTY' },
      { key: 'C', text: 'Whether DHCP lease time is 8 days' },
      { key: 'D', text: 'Whether the monitor refresh is 59 Hz vs 60 Hz' },
    ],
    answer: 'A',
    explanation:
      'Discrete GPUs often expose digital audio endpoints; defaults can shift away from previous Realtek outputs.',
    tags: ['Audio'],
  },
  {
    id: 'ccst-117',
    certification: 'ccst-it-support',
    domain: 'Help Desk',
    topic: 'Collaboration',
    difficulty: 'intermediate',
    prompt:
      'A Cisco Webex Desk Pro shows mic muted in the room but the OS input meter is dead flat. Where should you look first?',
    options: [
      { key: 'A', text: 'Only the cloud admin portal—ignore the physical device' },
      { key: 'B', text: 'Device touch controls / privacy shutter vs OS-level input mute and default microphone selection' },
      { key: 'C', text: 'Replace the motherboard immediately' },
      { key: 'D', text: 'Reinstall macOS on a Windows PC' },
    ],
    answer: 'B',
    explanation:
      'All-in-one collaboration bars have hardware mute and OS routing; reconcile both layers before deep dives.',
    tags: ['Webex'],
  },
  {
    id: 'ccst-118',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'AI',
    difficulty: 'easy',
    prompt:
      'Help desk triage bots that predict category from ticket text are closest to which description?',
    options: [
      { key: 'A', text: 'Generative fiction authoring with no training data' },
      { key: 'B', text: 'Predictive / classification style ML compared with a user-facing drafting assistant that synthesizes new paragraphs' },
      { key: 'C', text: 'Blockchain consensus' },
      { key: 'D', text: 'RAID 6 parity calculation by hand' },
    ],
    answer: 'B',
    explanation:
      'Prediction maps inputs to labels; generative tools create novel text—governance and verification differ.',
    tags: ['AI'],
  },
  {
    id: 'ccst-119',
    certification: 'ccst-it-support',
    domain: 'Customer Service',
    topic: 'Ethics',
    difficulty: 'intermediate',
    prompt:
      'You used an AI assistant to draft a reply to a customer. What is the most ethical transparency practice?',
    options: [
      { key: 'A', text: 'Pretend every word was spontaneous human thought' },
      { key: 'B', text: 'Follow organizational policy on disclosure; ensure facts are verified and tone matches standards' },
      { key: 'C', text: 'Paste model output without reading it' },
      { key: 'D', text: 'Share the customer’s PII in the AI prompt for “context”' },
    ],
    answer: 'B',
    explanation:
      'AI assistance is fine when accuracy, privacy, and brand policies are preserved—blind paste risks harm.',
    tags: ['AI ethics'],
  },
  {
    id: 'ccst-120',
    certification: 'ccst-it-support',
    domain: 'Troubleshooting',
    topic: 'Research',
    difficulty: 'easy',
    prompt:
      'Why should first-line techs prefer vendor knowledge bases and internal runbooks over random forum posts?',
    options: [
      { key: 'A', text: 'Forums are always more current than vendors' },
      { key: 'B', text: 'Official KBs align to supported configurations; forums may mix outdated, unsafe, or unlicensed advice' },
      { key: 'C', text: 'KB articles never contain version numbers' },
      { key: 'D', text: 'Internal docs are illegal' },
    ],
    answer: 'B',
    explanation:
      'Triangulate sources: start authoritative, then community hints with skepticism and change control.',
    tags: ['Documentation'],
  },
  {
    id: 'ccst-121',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Printers',
    difficulty: 'easy',
    prompt:
      'Jobs are stuck in a local Windows print queue on a shared printer. What is a sensible early step?',
    options: [
      { key: 'A', text: 'Delete the printer object without telling anyone' },
      { key: 'B', text: 'Clear or restart the queue after confirming no one is mid-job, then retest with a simple test page' },
      { key: 'C', text: 'Flash the printer firmware from an unknown USB' },
      { key: 'D', text: 'Disable spooler service globally on all servers' },
    ],
    answer: 'B',
    explanation:
      'Queue resets recover wedged jobs; coordinate on shared devices and capture driver errors if repeats happen.',
    tags: ['Printing'],
  },
  {
    id: 'ccst-122',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Display',
    difficulty: 'intermediate',
    prompt:
      'A laptop drives one Thunderbolt dock monitor but not a second high-res panel through the same chain. What should you verify?',
    options: [
      { key: 'A', text: 'Whether the dock / cable / GPU chain supports the aggregate bandwidth and display topology' },
      { key: 'B', text: 'Whether the user caps lock is on' },
      { key: 'C', text: 'Whether SMTP port 25 is blocked' },
      { key: 'D', text: 'Whether BIOS year is 1999' },
    ],
    answer: 'A',
    explanation:
      'DisplayPort MST and Thunderbolt lanes share budgets; mismatched cables or dock limits cause silent downgrade.',
    tags: ['Display'],
  },
  {
    id: 'ccst-123',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'Remote access',
    difficulty: 'easy',
    prompt:
      'Historically, which tool family is associated with early commercial remote control of PCs (useful for recognizing legacy exam references)?',
    options: [
      { key: 'A', text: 'PCAnywhere-style host/agent remote control predating modern SaaS remote stacks' },
      { key: 'B', text: 'BGP route reflectors' },
      { key: 'C', text: '802.1X supplicants only' },
      { key: 'D', text: 'ZFS send/receive' },
    ],
    answer: 'A',
    explanation:
      'Older remote-control suites appear in legacy curricula; today prefer approved enterprise remote tools.',
    tags: ['History'],
  },
  {
    id: 'ccst-124',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Remote support',
    difficulty: 'intermediate',
    prompt:
      'Before unattended remote control on a user’s PC, what is the best policy-aligned practice?',
    options: [
      { key: 'A', text: 'Connect silently anytime without logging' },
      {
        key: 'B',
        text: 'Use approved enterprise remote tools with consent prompts, session logging, and least-privilege controls',
      },
      { key: 'C', text: 'Share one global password for all sessions' },
      { key: 'D', text: 'Disable screen blanking so others can shoulder-surf credentials' },
    ],
    answer: 'B',
    explanation:
      'Remote access is high risk; combine technical controls with procedural consent and auditability.',
    tags: ['Remote'],
  },
  {
    id: 'ccst-125',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Encryption',
    difficulty: 'intermediate',
    prompt:
      'Where should BitLocker recovery keys be stored for a domain-joined laptop?',
    options: [
      { key: 'A', text: 'On a sticky note under the keyboard only' },
      { key: 'B', text: 'In AD/Azure AD escrow or approved secure vault per policy—not solely with the end user' },
      { key: 'C', text: 'In a public wiki' },
      { key: 'D', text: 'Nowhere; losing the key is fine' },
    ],
    answer: 'B',
    explanation:
      'Escrow enables recovery when TPM conditions change; user-only storage drives avoidable data loss.',
    tags: ['BitLocker'],
  },
  {
    id: 'ccst-126',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Email',
    difficulty: 'easy',
    prompt:
      'Spam and phishing can overlap, but phishing is specifically concerned with:',
    options: [
      { key: 'A', text: 'Deceptive intent to steal secrets, install malware, or manipulate the user—beyond mere unsolicited ads' },
      { key: 'B', text: 'Calendar invites only' },
      { key: 'C', text: 'Printer alignment pages' },
      { key: 'D', text: 'DNS caching' },
    ],
    answer: 'A',
    explanation:
      'Phishing is a social-engineering attack class; spam is unsolicited bulk—filters catch both differently.',
    tags: ['Email'],
  },
  {
    id: 'ccst-127',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Social engineering',
    difficulty: 'intermediate',
    prompt:
      'A caller claims to be a vendor and pressures you to run a “support tool” immediately. What response fits security awareness training?',
    options: [
      { key: 'A', text: 'Run the binary because they sounded confident' },
      { key: 'B', text: 'Verify through official channels, refuse surprise remote installs, and escalate per vendor impersonation playbooks' },
      { key: 'C', text: 'Share your password to prove identity' },
      { key: 'D', text: 'Disable antivirus to speed the session' },
    ],
    answer: 'B',
    explanation:
      'Vishing and fake IT support rely on urgency; break the chain with verification and policy.',
    tags: ['Vishing'],
  },
  {
    id: 'ccst-128',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Privacy',
    difficulty: 'easy',
    prompt:
      'Which item is clearly PII that should be minimized on shared screens during screen shares?',
    options: [
      { key: 'A', text: 'A public company’s stock ticker' },
      { key: 'B', text: 'A user’s home address pulled from an HR profile' },
      { key: 'C', text: 'RFC1918 internal IP shown in a lab diagram' },
      { key: 'D', text: 'A generic error code with no user data' },
    ],
    answer: 'B',
    explanation:
      'Personal addresses and identifiers deserve least display necessary during collaboration.',
    tags: ['PII'],
  },
  {
    id: 'ccst-129',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Firmware',
    difficulty: 'intermediate',
    prompt:
      'Fans ramp aggressively in firmware before the OS loads. That suggests:',
    options: [
      { key: 'A', text: 'The issue is at least partly independent of OS drivers—check thermals, curves, and hardware sensors early' },
      { key: 'B', text: 'Only Outlook add-ins are relevant' },
      { key: 'C', text: 'DNS over HTTPS is misconfigured' },
      { key: 'D', text: 'The Wi-Fi SSID is hidden' },
    ],
    answer: 'A',
    explanation:
      'Pre-boot behavior implicates firmware/EC thermal policy or hardware fault paths.',
    tags: ['Thermal'],
  },
  {
    id: 'ccst-130',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Storage',
    difficulty: 'intermediate',
    prompt:
      'An M.2 NVMe module has both B and M key notches (B+M). What does that commonly indicate?',
    options: [
      { key: 'A', text: 'It is always SATA-only regardless of socket' },
      { key: 'B', text: 'It may be SATA or PCIe depending on the module and slot—verify motherboard compatibility before purchase' },
      { key: 'C', text: 'It is exclusively RAM' },
      { key: 'D', text: 'It requires SCSI termination' },
    ],
    answer: 'B',
    explanation:
      'Keying signals electrical interfaces; dual-notch modules historically bridged SATA vs PCIe NGFF worlds.',
    tags: ['M.2'],
  },
  {
    id: 'ccst-131',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'DHCP',
    difficulty: 'intermediate',
    prompt:
      'A server must keep the same IPv4 for licensing that binds to the address. What is preferable to random DHCP renewals?',
    options: [
      { key: 'A', text: 'DHCP reservation or a controlled static IP outside the dynamic pool with DNS updated deliberately' },
      { key: 'B', text: 'Let any device claim any address via gratuitous ARP' },
      { key: 'C', text: 'Use APIPA for servers' },
      { key: 'D', text: 'Disable DNS for that host' },
    ],
    answer: 'A',
    explanation:
      'Stable service addressing uses reservations or documented statics with conflict checks.',
    tags: ['DHCP'],
  },
  {
    id: 'ccst-132',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'Wireless',
    difficulty: 'intermediate',
    prompt:
      'Enterprise WLAN “band steering” tries to move capable clients to 5 GHz. What user-visible benefit is targeted?',
    options: [
      { key: 'A', text: 'Freeing 2.4 GHz airtime for legacy IoT while improving throughput for capable devices on 5 GHz' },
      { key: 'B', text: 'Disabling all security' },
      { key: 'C', text: 'Guaranteeing maximum legal Wi-Fi power on every client' },
      { key: 'D', text: 'Removing the need for DHCP' },
    ],
    answer: 'A',
    explanation:
      '2.4 GHz is crowded; steering reduces contention when clients and APs support it well.',
    tags: ['Wi-Fi'],
  },
  {
    id: 'ccst-133',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'VPN',
    difficulty: 'easy',
    prompt:
      'Conceptually, remote desktop to an internal workstation over VPN differs from “VPN” alone because:',
    options: [
      { key: 'A', text: 'RDP still requires appropriate network reachability and authorization to the target host, not just tunnel establishment' },
      { key: 'B', text: 'VPN replaces the need for any host firewall' },
      { key: 'C', text: 'RDP cannot cross subnets' },
      { key: 'D', text: 'VPN is only for printers' },
    ],
    answer: 'A',
    explanation:
      'Tunnel vs application session: being on-net does not imply every service is exposed or permitted.',
    tags: ['VPN'],
  },
  {
    id: 'ccst-134',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'macOS',
    difficulty: 'intermediate',
    prompt:
      'A macOS app cannot access Documents after an OS upgrade. What privacy control should you review?',
    options: [
      { key: 'A', text: 'Files and Folders / Full Disk Access permissions for that app' },
      { key: 'B', text: 'The HDMI EDID block only' },
      { key: 'C', text: 'The printer driver version only' },
      { key: 'D', text: 'The BIOS boot order' },
    ],
    answer: 'A',
    explanation:
      'TCC prompts gate sensitive locations; upgrades can reset or tighten consent prompts.',
    tags: ['macOS'],
  },
  {
    id: 'ccst-135',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'Windows',
    difficulty: 'intermediate',
    prompt:
      'A help desk needs to standardize desktop apps for many users. What pattern aligns with modern Windows deployment?',
    options: [
      { key: 'A', text: 'Email users zipped installers from personal drives' },
      { key: 'B', text: 'Use Microsoft Store / Intune / approved package pipelines rather than ad-hoc EXEs' },
      { key: 'C', text: 'Disable Windows Update forever' },
      { key: 'D', text: 'Run every installer as SYSTEM without testing' },
    ],
    answer: 'B',
    explanation:
      'Managed software catalogs reduce drift and supply-chain risk compared with random binaries.',
    tags: ['Deployment'],
  },
  {
    id: 'ccst-136',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'Cloud sync',
    difficulty: 'easy',
    prompt:
      'OneDrive “Files On-Demand” primarily helps users by:',
    options: [
      { key: 'A', text: 'Showing placeholders that hydrate on use—saving local disk while keeping cloud library visible' },
      { key: 'B', text: 'Deleting cloud copies automatically' },
      { key: 'C', text: 'Disabling authentication' },
      { key: 'D', text: 'Encrypting the monitor cable' },
    ],
    answer: 'A',
    explanation:
      'Hydration models balance offline needs vs storage; teach users pin critical folders when traveling.',
    tags: ['OneDrive'],
  },
  {
    id: 'ccst-137',
    certification: 'ccst-it-support',
    domain: 'Troubleshooting',
    topic: 'Performance',
    difficulty: 'easy',
    prompt:
      'Task Manager Startup tab is most useful for:',
    options: [
      { key: 'A', text: 'Reducing boot/login delay by controlling which apps auto-launch' },
      { key: 'B', text: 'Editing video bitrate' },
      { key: 'C', text: 'Configuring RAID 50' },
      { key: 'D', text: 'Setting SMTP relay permissions' },
    ],
    answer: 'A',
    explanation:
      'Autostart bloat is a common logon performance hit on Windows endpoints.',
    tags: ['Task Manager'],
  },
  {
    id: 'ccst-138',
    certification: 'ccst-it-support',
    domain: 'Troubleshooting',
    topic: 'Logs',
    difficulty: 'intermediate',
    prompt:
      'An app crashes intermittently. Where is a high-value Windows artifact to correlate faulting module and timestamp?',
    options: [
      { key: 'A', text: 'Event Viewer Application and System logs with error metadata' },
      { key: 'B', text: 'The monitor OSD language menu' },
      { key: 'C', text: 'The Wi-Fi SSID only' },
      { key: 'D', text: 'Printer test page count' },
    ],
    answer: 'A',
    explanation:
      'Structured logs anchor intermittent issues to builds, DLLs, and update timelines.',
    tags: ['Event Viewer'],
  },
  {
    id: 'ccst-139',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'Patching',
    difficulty: 'intermediate',
    prompt:
      'Deferring quality updates on Windows workstations should be done how?',
    options: [
      { key: 'A', text: 'Via policy with documented risk acceptance—not by indefinitely disabling patching on unmanaged clients' },
      { key: 'B', text: 'By unplugging Ethernet during update Tuesdays forever' },
      { key: 'C', text: 'By deleting catroot2 randomly' },
      { key: 'D', text: 'By setting BIOS passwords on monitors' },
    ],
    answer: 'A',
    explanation:
      'Balanced deferral uses WSUS/Intune/GPO windows; unmanaged skips create exploit exposure.',
    tags: ['Patching'],
  },
  {
    id: 'ccst-140',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'MFA',
    difficulty: 'intermediate',
    prompt:
      'Push-notification MFA fatigue attacks trick users into approving logins they did not start. What user guidance helps?',
    options: [
      { key: 'A', text: 'Approve every prompt quickly to clear the queue' },
      { key: 'B', text: 'Approve only prompts that match their own immediate sign-in context; report unexpected pushes' },
      { key: 'C', text: 'Disable MFA when traveling' },
      { key: 'D', text: 'Share OTP codes in chat' },
    ],
    answer: 'B',
    explanation:
      'Number matching and context displays reduce blind approvals; security culture matters.',
    tags: ['MFA'],
  },
  {
    id: 'ccst-141',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Access',
    difficulty: 'intermediate',
    prompt:
      'Conditional Access may block legacy auth from unexpected countries. End users experience that as:',
    options: [
      { key: 'A', text: 'A sign-in failure until compliant device / location / MFA requirements are satisfied' },
      { key: 'B', text: 'Automatic admin rights' },
      { key: 'C', text: 'Higher monitor refresh rates' },
      { key: 'D', text: 'Printer color calibration' },
    ],
    answer: 'A',
    explanation:
      'Zero-trust signals gate access; support explains requirements rather than bypassing policy casually.',
    tags: ['Identity'],
  },
  {
    id: 'ccst-142',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Zero Trust',
    difficulty: 'easy',
    prompt:
      'Which statement best matches a Zero Trust mindset for help desk staff?',
    options: [
      { key: 'A', text: 'Trust everything on the corporate LAN by default' },
      { key: 'B', text: 'Verify explicitly, use least privilege, and assume breach—every request is evaluated' },
      { key: 'C', text: 'Disable logging to improve speed' },
      { key: 'D', text: 'Share one VPN credential for the team' },
    ],
    answer: 'B',
    explanation:
      'Modern access models minimize implicit trust zones; support workflows should reinforce verification.',
    tags: ['Zero Trust'],
  },
  {
    id: 'ccst-143',
    certification: 'ccst-it-support',
    domain: 'Security Awareness',
    topic: 'Data handling',
    difficulty: 'easy',
    prompt:
      'A spreadsheet labeled “Confidential — salary bands” is emailed to a personal Gmail. What principle is violated?',
    options: [
      { key: 'A', text: 'Data classification and acceptable use—sensitive data left controlled storage without business justification' },
      { key: 'B', text: 'RGB color gamut rules' },
      { key: 'C', text: 'DHCP lease renewal timing' },
      { key: 'D', text: 'DisplayPort version numbering' },
    ],
    answer: 'A',
    explanation:
      'Classification drives handling, DLP, and egress controls; personal mail is rarely approved.',
    tags: ['DLP'],
  },
  {
    id: 'ccst-144',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'DNS',
    difficulty: 'intermediate',
    prompt:
      'A browser resolves public sites but not an internal portal hostname. What is a focused check?',
    options: [
      { key: 'A', text: 'Whether the client points at internal DNS that hosts split-horizon records—or VPN DNS when offsite' },
      { key: 'B', text: 'Whether the mouse DPI is 1600' },
      { key: 'C', text: 'Whether the monitor is 4K' },
      { key: 'D', text: 'Whether the keyboard is mechanical' },
    ],
    answer: 'A',
    explanation:
      'Split DNS and VPN captive portals commonly cause “internet works, intranet name fails” patterns.',
    tags: ['DNS'],
  },
  {
    id: 'ccst-145',
    certification: 'ccst-it-support',
    domain: 'Operating Systems',
    topic: 'macOS',
    difficulty: 'intermediate',
    prompt:
      'On macOS, which command-line tool family best maps to checking interface addresses and reachability after Wi-Fi changes?',
    options: [
      { key: 'A', text: 'ifconfig / ip info plus ping and traceroute for path checks' },
      { key: 'B', text: 'defrag.exe only' },
      { key: 'C', text: 'chkdsk only' },
      { key: 'D', text: 'diskpart clean all' },
    ],
    answer: 'A',
    explanation:
      'Unix-derived stacks use these utilities; correlate with GUI Wi-Fi details and DNS.',
    tags: ['CLI'],
  },
  {
    id: 'ccst-146',
    certification: 'ccst-it-support',
    domain: 'Hardware',
    topic: 'Disposal',
    difficulty: 'easy',
    prompt:
      'Failed laptop batteries and shredded drives should be disposed of how?',
    options: [
      { key: 'A', text: 'In household trash mixed with coffee grounds' },
      { key: 'B', text: 'Through approved e-waste / hazardous recycling partners with asset destruction certificates' },
      { key: 'C', text: 'Burn in an open field' },
      { key: 'D', text: 'Sell on auction sites without wiping' },
    ],
    answer: 'B',
    explanation:
      'Batteries and storage carry fire and data-residue risks; follow environmental and security policy.',
    tags: ['e-waste'],
  },
  {
    id: 'ccst-147',
    certification: 'ccst-it-support',
    domain: 'Troubleshooting',
    topic: 'Malware',
    difficulty: 'intermediate',
    prompt:
      'Microsoft Defender shows a threat quarantined but the user still sees odd pop-ups. What is a sensible next step?',
    options: [
      { key: 'A', text: 'Ignore because quarantine equals full remediation' },
      { key: 'B', text: 'Run additional scans, check browser extensions and startup persistence, and escalate if reinfection loops' },
      { key: 'C', text: 'Disable Defender to stop pop-ups' },
      { key: 'D', text: 'Give local admin to the user' },
    ],
    answer: 'B',
    explanation:
      'Modern malware has stages; verify clean state across profiles and persistence mechanisms.',
    tags: ['Defender'],
  },
  {
    id: 'ccst-148',
    certification: 'ccst-it-support',
    domain: 'Networking Basics',
    topic: 'Connectivity',
    difficulty: 'easy',
    prompt:
      'ipconfig /release then /renew is most appropriate when investigating:',
    options: [
      { key: 'A', text: 'Suspected bad DHCP lease or stale address after VLAN port changes' },
      { key: 'B', text: 'Dead pixel patterns on LCD' },
      { key: 'C', text: 'GPU coil whine' },
      { key: 'D', text: 'Thunderbolt dock fan curves' },
    ],
    answer: 'A',
    explanation:
      'DHCP refresh reprovisions IPv4 parameters; pair with switchport/VLAN validation.',
    tags: ['ipconfig'],
  },
  {
    id: 'ccst-149',
    certification: 'ccst-it-support',
    domain: 'Help Desk',
    topic: 'Active Directory',
    difficulty: 'intermediate',
    prompt:
      'A user entered their corporate password into a fake “IT portal.” What is the priority order for containment?',
    options: [
      { key: 'A', text: 'Ignore until weekly password rotation' },
      {
        key: 'B',
        text: 'Assume compromise: reset password from a trusted flow, revoke sessions, notify security, watch for MFA changes',
      },
      { key: 'C', text: 'Ask the user to try the same password on three other sites to confirm' },
      { key: 'D', text: 'Disable the account permanently without telling anyone' },
    ],
    answer: 'B',
    explanation:
      'Credential stuffing and session hijacking move fast; IR playbooks start with rapid containment.',
    tags: ['AD'],
  },
  {
    id: 'ccst-150',
    certification: 'ccst-it-support',
    domain: 'Service Management',
    topic: 'Documentation',
    difficulty: 'easy',
    prompt:
      'A knowledge article closes recurring tickets faster. What should it always include?',
    options: [
      { key: 'A', text: 'Gossip about who caused incidents' },
      { key: 'B', text: 'Prerequisites, verified steps, rollback notes, and ownership for updates' },
      { key: 'C', text: 'Blank pages for aesthetics' },
      { key: 'D', text: 'Personal phone numbers of engineers' },
    ],
    answer: 'B',
    explanation:
      'Operational KBs are living documents; stale steps harm trust—assign maintainers.',
    tags: ['KB'],
  },
]

export const ccstPdfImportPbqs: PBQScenario[] = [
  {
    id: 'ccst-pbq-order-smb-mapped-drive',
    certification: 'ccst-it-support',
    topic: 'Windows',
    difficulty: 'intermediate',
    type: 'order',
    prompt:
      'A user cannot open their mapped `\\\\fileserver\\share` drive after an AD password reset. Order sensible **first-line** remediation steps.',
    instructions: 'Arrange from first action to last.',
    items: [
      { id: 'smb-1', label: 'Confirm the share path and that others can reach it (rule out server-side outage)' },
      { id: 'smb-2', label: 'Sign out of Windows or disconnect mapped drives so sessions drop stale tokens' },
      { id: 'smb-3', label: 'Open Credential Manager and remove/update stored Windows credentials for that file server' },
      { id: 'smb-4', label: 'Map again or browse UNC with the fresh password; verify access to expected folders' },
      { id: 'smb-5', label: 'Document the credential reset and close the ticket with user education on password-change behavior' },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' },
    ],
    solution: { 'smb-1': 1, 'smb-2': 2, 'smb-3': 3, 'smb-4': 4, 'smb-5': 5 },
    explanation:
      'Password resets invalidate cached SMB creds; verify service health, clear stale sessions, refresh stored passwords, then validate and document.',
  },
  {
    id: 'ccst-pbq-order-audio-code43',
    certification: 'ccst-it-support',
    topic: 'Hardware',
    difficulty: 'intermediate',
    type: 'order',
    prompt:
      'After a GPU swap, onboard audio vanished and Device Manager shows errors. Order practical troubleshooting.',
    instructions: 'Arrange from first to last.',
    items: [
      { id: 'au-1', label: 'Check default playback/recording devices—HDMI/DP audio from the new GPU may have taken priority' },
      { id: 'au-2', label: 'Open Device Manager, view audio controllers, note error codes and timestamps in Event Viewer' },
      { id: 'au-3', label: 'Install motherboard/chipset and vendor audio drivers for this OS build' },
      { id: 'au-4', label: 'If still failing, uninstall device + delete driver software, reboot, reinstall clean driver package' },
      { id: 'au-5', label: 'Verify physical front-panel HD_AUDIO header and BIOS onboard audio enablement if applicable' },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' },
    ],
    solution: { 'au-1': 1, 'au-2': 2, 'au-3': 3, 'au-4': 4, 'au-5': 5 },
    explanation:
      'Routing shifts after GPU changes are common; then driver health, clean reinstall, and finally cabling/BIOS toggles.',
  },
  {
    id: 'ccst-pbq-order-webex-desk-mic',
    certification: 'ccst-it-support',
    topic: 'Collaboration',
    difficulty: 'intermediate',
    type: 'order',
    prompt:
      'Remote participants cannot hear a Webex Desk Pro room. Order checks that separate **hardware mute** from **OS routing**.',
    instructions: 'Arrange from first to last.',
    items: [
      { id: 'wx-1', label: 'Confirm the device’s physical mute / privacy LED state and tap controls on the Desk Pro' },
      { id: 'wx-2', label: 'In the meeting app, verify the selected microphone input matches the collaboration bar' },
      { id: 'wx-3', label: 'In Windows/macOS sound settings, confirm input level moves when tapping the mic—pick correct default' },
      { id: 'wx-4', label: 'Update firmware / Webex app per vendor advisory; reboot the appliance if stuck state suspected' },
      { id: 'wx-5', label: 'Escalate to collaboration admin with serial, versions, and packet capture of test calls if still failing' },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' },
    ],
    solution: { 'wx-1': 1, 'wx-2': 2, 'wx-3': 3, 'wx-4': 4, 'wx-5': 5 },
    explanation:
      'Bars expose hardware mute separate from OS defaults; align app + OS input, then firmware, then vendor escalation.',
  },
  {
    id: 'ccst-pbq-order-macos-external-disk',
    certification: 'ccst-it-support',
    topic: 'macOS',
    difficulty: 'intermediate',
    type: 'order',
    prompt:
      'An external USB disk does not mount on macOS. Order safe triage before declaring hardware dead.',
    instructions: 'Arrange from first to last.',
    items: [
      { id: 'macd-1', label: 'Try another port/cable/adapter and listen for spin-up; check System Information → USB/Thunderbolt' },
      { id: 'macd-2', label: 'Open Disk Utility—see if the volume appears greyed out or unmounted' },
      { id: 'macd-3', label: 'Run First Aid on the container/disk; capture error codes' },
      { id: 'macd-4', label: 'If filesystem is unsupported or foreign, plan read-only access or backup-then-erase to supported format' },
      { id: 'macd-5', label: 'If repeated I/O errors across machines, start RMA/data-recovery conversation per policy' },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' },
    ],
    solution: { 'macd-1': 1, 'macd-2': 2, 'macd-3': 3, 'macd-4': 4, 'macd-5': 5 },
    explanation:
      'Cabling vs logical volume issues vs filesystem support vs true hardware faults are sequenced cheapest signal first.',
  },
  {
    id: 'ccst-pbq-order-phishing-containment',
    certification: 'ccst-it-support',
    topic: 'Security',
    difficulty: 'intermediate',
    type: 'order',
    prompt:
      'A user clicked a credential-harvesting link but malware scan is clean so far. Order **first-hour** containment.',
    instructions: 'Arrange from first to last.',
    items: [
      { id: 'ph-1', label: 'Disconnect from network or isolate host per playbook to slow exfiltration/command channels' },
      { id: 'ph-2', label: 'Force password reset from trusted device; revoke sessions and check MFA methods for tampering' },
      { id: 'ph-3', label: 'Run full AV/EDR scans from current definitions; review browser extensions and scheduled tasks' },
      { id: 'ph-4', label: 'Notify security/IR with timeline, URLs, and screenshots per policy' },
      { id: 'ph-5', label: 'Document user coaching, indicators, and preventive controls (safe links, reporting button)' },
    ],
    targets: [
      { id: '1', label: 'Step 1' },
      { id: '2', label: 'Step 2' },
      { id: '3', label: 'Step 3' },
      { id: '4', label: 'Step 4' },
      { id: '5', label: 'Step 5' },
    ],
    solution: { 'ph-1': 1, 'ph-2': 2, 'ph-3': 3, 'ph-4': 4, 'ph-5': 5 },
    explanation:
      'Speed beats completeness early: cut channels, reset creds, hunt persistence, escalate, then teach.',
  },
  {
    id: 'ccst-pbq-order-ticket-priority',
    certification: 'ccst-it-support',
    topic: 'Service Management',
    difficulty: 'easy',
    type: 'order',
    prompt:
      'Four tickets arrived at once. Order **initial** handling priority for a general corporate queue (all “medium” SLA until triaged).',
    instructions: 'Arrange highest urgency first.',
    items: [
      { id: 'tq-1', label: 'Entire floor lost network—DHCP failing with APIPA widespread' },
      { id: 'tq-2', label: 'Executive laptop encryption recovery key needed before a board flight in 20 minutes' },
      { id: 'tq-3', label: 'Single user VPN connects but internal DNS names fail after profile push' },
      { id: 'tq-4', label: 'Department printer jam—workaround is secure PDF to another printer' },
    ],
    targets: [
      { id: '1', label: 'Rank 1' },
      { id: '2', label: 'Rank 2' },
      { id: '3', label: 'Rank 3' },
      { id: '4', label: 'Rank 4' },
    ],
    solution: { 'tq-1': 1, 'tq-2': 2, 'tq-3': 3, 'tq-4': 4 },
    explanation:
      'Site-wide outages trump individual devices; time-bound exec travel risk beats localized DNS misconfig; localized printer issues with workaround go last.',
  },
  {
    id: 'ccst-pbq-match-remote-tooling',
    certification: 'ccst-it-support',
    topic: 'Remote support',
    difficulty: 'easy',
    type: 'match',
    prompt: 'Match each remote-support pattern to the tool or approach that best fits.',
    instructions: 'Drag each pattern onto the best match.',
    items: [
      { id: 'rt-legacy', label: 'Legacy exam reference: classic host/agent commercial remote control suite' },
      { id: 'rt-quick', label: 'One-time assist a relative or vendor—no permanent agent; built-in OS assist flows' },
      { id: 'rt-managed', label: 'IT controls domain PCs with audited sessions and policy' },
      { id: 'rt-collab', label: 'Room system with integrated mic/camera needing vendor collaboration app tuning' },
    ],
    targets: [
      { id: 'tgt-pcany', label: 'Historical tools such as pcAnywhere-style remote control' },
      { id: 'tgt-quickassist', label: 'Quick Assist / similar ephemeral screen-sharing workflows' },
      { id: 'tgt-rmm', label: 'Enterprise RMM or managed remote desktop platform with logging' },
      { id: 'tgt-webex', label: 'Cisco Webex / collaboration endpoint admin plus app pairing' },
    ],
    solution: {
      'rt-legacy': 'tgt-pcany',
      'rt-quick': 'tgt-quickassist',
      'rt-managed': 'tgt-rmm',
      'rt-collab': 'tgt-webex',
    },
    explanation:
      'Pick approved enterprise tools in production; recognize legacy names for exam-style wording.',
  },
]
