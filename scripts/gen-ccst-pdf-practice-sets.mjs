/**
 * One-shot generator: writes src/data/ccstPdfPracticeSets.ts from extracted PDF text.
 * Run: node scripts/gen-ccst-pdf-practice-sets.mjs
 */
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'src', 'data', 'ccstPdfPracticeSets.ts')

/** Fix common PDF NUL / ligature extraction glitches */
function clean(s) {
  return s
    .replace(/\u0000/g, '')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .replace(/ ;/g, ';')
    .trim()
}

function opts(a, b, c, d) {
  return [
    { key: 'A', text: clean(a) },
    { key: 'B', text: clean(b) },
    { key: 'C', text: clean(c) },
    { key: 'D', text: clean(d) },
  ]
}

function letterFromAnswer(line) {
  const m = /^Answer:\s*([A-D])\./i.exec(line.trim())
  return m ? m[1].toUpperCase() : 'A'
}

/**
 * Each entry: prompt, A,B,C,D, answerLine (starts with Answer:)
 */
const set4 = [
  [
    'A technician says, "We are doing fine because most tickets eventually get solved," but the team lead wants to know whether the team is meeting measured service performance over time. Which concept best supports that review without changing the agreed customer commitment itself?',
    'KPI',
    'SLA breach notice',
    'Safe mode log',
    'Device status indicator',
    'Answer: A. KPI',
  ],
  [
    'A senior technician asks a new hire to update a ticket so another technician can continue troubleshooting after a shift change. Which note is the best example of documentation the blueprint expects?',
    '"Still broken. Needs more work."',
    '"Issue likely random. User upset."',
    '"User reports scanner disconnects after waking laptop; verified USB cable, tested alternate port, observed device reconnect failure twice, escalated for driver review."',
    '"Resolved by unknown change."',
    'Answer: C. C',
  ],
  [
    'A technician begins troubleshooting a complaint that "the network is down," but after asking clarifying questions learns only one internal application fails while web browsing works. Which step of the problem-solving process most directly prevented a bad assumption?',
    'Defining the problem',
    'Performing e-waste disposal',
    'Updating firmware immediately',
    'Applying BitLocker codes',
    'Answer: A. Defining the problem',
  ],
  [
    'Two tickets arrive at the same time: one is a minor browser issue for a single user, and one blocks onboarding for five new employees before a deadline. Which help desk concept most strongly supports prioritizing the onboarding issue first?',
    'Queue management',
    'Monitor brightness',
    'Cloud hypervisor placement',
    'Serial cable conversion',
    'Answer: A. Queue management',
  ],
  [
    'A technician tested a likely fix, and the device now appears stable. Which action should occur next if the goal is to align with the formal process before closing the case?',
    'Observe the results',
    'Replace the motherboard',
    'Force MFA enrollment',
    'Reinstall all productivity apps',
    'Answer: A. Observe the results',
  ],
  [
    'A note includes the user complaint and final resolution, but it leaves out what tests were performed between those points. Why is this a problem?',
    'It is too long for a ticketing system',
    'It lacks troubleshooting steps needed to make the record useful for future interactions',
    'It includes too much factual information',
    'It should only contain the device hostname',
    'Answer: B. B',
  ],
  [
    'A technician changes a printer setting, but the issue remains exactly the same. According to the blueprint process, which response is best?',
    'Repeat the troubleshooting process',
    'Mark the ticket solved',
    'Skip documentation until the end of the week',
    'Replace the printer automatically',
    'Answer: A. Repeat the troubleshooting process',
  ],
  [
    'A help desk manager is tracking how long tickets remain untouched after submission because users are complaining about delayed first contact. Which key help desk concept is being monitored most directly?',
    'Time management',
    'AirDrop performance',
    'ESD handling',
    'Hypervisor support',
    'Answer: A. Time management',
  ],
  [
    'A technician wants to show that a backlog is increasing even though SLA targets are still barely being met. Which concept is most useful for showing that trend numerically?',
    'KPI',
    'Power cable type',
    'MDM profile',
    'DisplayPort adapter',
    'Answer: A. KPI',
  ],
  [
    'A service desk uses a platform to assign cases, track updates, and record technician actions. Which blueprint concept best describes that platform?',
    'Ticketing system',
    'DHCPv6 service',
    'Time Machine',
    'Thunderbolt converter',
    'Answer: A. Ticketing system',
  ],
  [
    'A technician reaches into a desktop immediately after carrying it across carpeted flooring. Which safety issue is the bigger concern even if the system is unplugged?',
    'ESD',
    'DNS caching',
    'MFA timeout',
    'AirDrop failure',
    'Answer: A. ESD',
  ],
  [
    'A user needs to report the exact IPv4 and MAC address of a Windows laptop, but they already know the memory size and OS version. Which tool from the blueprint is the best match?',
    'ipconfig',
    'System Information',
    'Task Manager',
    'Event Viewer only',
    'Answer: A. ipconfig',
  ],
  [
    "A macOS user needs to find the computer's hostname and network interface details rather than application performance data. Which command-line tool is most relevant?",
    'ifconfig',
    'Activity Monitor',
    'About This Mac',
    'Console alerts only',
    'Answer: A. ifconfig',
  ],
  [
    'A technician is identifying display connectors on older and newer monitors. Which option below is specifically a digital video connector listed in the blueprint but not a network connector?',
    'DisplayPort',
    'RJ-45',
    'STP',
    'Serial DB-9 substitute',
    'Answer: A. DisplayPort',
  ],
  [
    'A user plugs a phone charging cable into a desktop port and asks whether all USB connectors are physically identical. Which response aligns best with the blueprint?',
    'No, USB-A, USB-B, USB-C, and Micro USB are different connector types',
    'Yes, all USB connectors are interchangeable by shape',
    'USB only applies to video output',
    'USB-C is a type of printer toner',
    'Answer: A. No',
  ],
  [
    'A technician installs a Bluetooth card in a desktop and now must confirm the OS recognizes it correctly. Which tool is most appropriate for checking and managing its driver status?',
    'Device Manager',
    'Cisco Webex',
    'gpupdate',
    'Time Machine',
    'Answer: A. Device Manager',
  ],
  [
    'A desktop upgrade involves replacing a slow SATA drive with a faster motherboard-mounted storage module. Which option best matches that target?',
    'M.2 storage',
    'VGA cable',
    'RJ-45 adapter',
    'Desktop power cord',
    'Answer: A. M.2 storage',
  ],
  [
    'A user wants to install a demanding graphics application, but the machine has limited video capability. Which requirement category from the blueprint is most relevant beyond CPU and RAM?',
    'GPU requirements',
    'AirDrop permissions',
    'MFA methods',
    'Ticketing system access',
    'Answer: A. GPU requirements',
  ],
  [
    'A laptop will not power on after being moved. Before investigating internal failure, which basic hardware troubleshooting check should happen first?',
    'Confirm it is connected to power',
    'Reset all group policies',
    'Reinstall the browser',
    'Enable VNC',
    'Answer: A. Confirm it is connected to power',
  ],
  [
    'A defective graphics card has been replaced successfully. What should the technician do with the failed part according to the blueprint rather than tossing it in regular trash?',
    'Follow e-waste best practices',
    'Return it to the user without comment',
    'Store it in the print tray',
    'Upload it to OneDrive',
    'Answer: A. Follow e-waste best practices',
  ],
  [
    'A user was added to a department yesterday and still cannot access the team Dropbox folder after signing in successfully. Which check is most directly aligned with the blueprint before blaming the sync client?',
    'Verify permissions',
    'Inspect GPU requirements',
    'Review BitLocker prompts',
    'Replace the power cable',
    'Answer: A. Verify permissions',
  ],
  [
    'A technician is troubleshooting a sign-in issue tied to a cloud-managed identity platform rather than on-premises Active Directory. Which blueprint service is the best match?',
    'Entra ID',
    'SATA',
    'Activity Monitor',
    'Thunderbolt 3',
    'Answer: A. Entra ID',
  ],
  [
    'A user says a new authenticator prompt appears after password entry and asks why the extra step exists. Which concept explains this?',
    'Multifactor Authentication',
    'Traceroute',
    'Screen brightness control',
    'Firmware rollback',
    'Answer: A. Multifactor Authentication',
  ],
  [
    'A user can authenticate to the network but the mapped Z: drive never reconnects after login. Which resource type is most directly associated with classic file-share mapping in the blueprint?',
    'SMB',
    'HDMI',
    'VNC',
    'APIPA',
    'Answer: A. SMB',
  ],
  [
    'A fax-capable multifunction device can print but not send outbound fax jobs. Which domain objective category includes this issue?',
    'Peripheral connectivity troubleshooting',
    'Help desk KPI review',
    'Virtual machine provisioning',
    'Confidential data classification',
    'Answer: A. Peripheral connectivity troubleshooting',
  ],
  [
    'A user reports that a webcam works in one app but not another, and the cable is securely connected. Which blueprint category still applies before escalating?',
    'Peripheral troubleshooting for webcams',
    'E-waste handling for components',
    'Cloud model identification',
    'Firewall log rotation',
    'Answer: A. Peripheral troubleshooting for webcams',
  ],
  [
    'A technician wants to verify whether a device is using a private IPv4 address or something outside the expected subnet. Which blueprint topic best covers that check?',
    'IP address ranges and subnet validation',
    'Safe mode boot path',
    'Technical forum moderation',
    'Time Machine backup policy',
    'Answer: A. IP address ranges and subnet validation',
  ],
  [
    'A Linux workstation can reach some services but the technician wants to inspect listening sockets to see whether a local process is bound correctly. Which blueprint-listed command is best suited to that check?',
    'ss',
    'About This Mac',
    'BitLocker',
    'Remote Assistance',
    'Answer: A. ss',
  ],
  [
    'A user can ping an IP address but cannot reach the same system by hostname. Which command from the blueprint is most directly useful for checking name resolution?',
    'nslookup',
    'Task Manager',
    'AirDrop',
    'Activity Monitor',
    'Answer: A. nslookup',
  ],
  [
    'A wired desktop has the correct IP settings and can reach the local gateway, but internet access still fails and active sessions seem abnormal. Which command from the blueprint can help inspect active network connections?',
    'netstat',
    'Safe Mode',
    'OneDrive',
    'Device Manager',
    'Answer: A. netstat',
  ],
  [
    'A Windows user says the laptop screen is too dim after waking from sleep, but external monitor output is normal. Which support area most directly fits?',
    'Brightness settings',
    'Group membership review',
    'Thunderbolt cabling only',
    'Social engineering prevention',
    'Answer: A. Brightness settings',
  ],
  [
    'A technician delays OS patching indefinitely because "updates only create problems." Which blueprint topic makes that stance too narrow?',
    'Windows and application updates are a support area',
    'Updates are only relevant to printers',
    'Windows updates are outside IT support scope',
    'Browser cache always replaces updates',
    'Answer: A. Windows and application updates are a support area',
  ],
  [
    'A user cannot remember the recovery information required after BitLocker prompts at startup. Which Windows topic is directly involved?',
    'BitLocker codes',
    'DisplayPort standards',
    'AWS IAM',
    'STP cable shielding',
    'Answer: A. BitLocker codes',
  ],
  [
    'A Windows laptop needs to reduce battery drain during travel, and the user asks whether this is an operating system support matter. Which blueprint topic confirms that it is?',
    'Power management',
    'RJ-45 termination',
    'Hypervisor tuning',
    'Fax queue cleanup',
    'Answer: A. Power management',
  ],
  [
    'A user with limited vision needs operating system adjustments to make the device easier to use. Which Windows area from the blueprint is most relevant?',
    'Accessibility features',
    'SMB mapping',
    'ESD handling',
    'Network socket inspection',
    'Answer: A. Accessibility features',
  ],
  [
    'A macOS browser still shows an outdated login page after the service was changed on the backend. What is the most appropriate first action?',
    'Clear the browser cache',
    'Replace the webcam',
    'Reset AWS credentials',
    'Force printer discovery',
    'Answer: A. Clear the browser cache',
  ],
  [
    'A macOS application is frozen, and the user needs to stop it without restarting the entire system. Which blueprint-listed tool best fits?',
    'Activity Monitor',
    'Device Manager',
    'gpupdate',
    'netstat',
    'Answer: A. Activity Monitor',
  ],
  [
    'A user asks which Apple backup option is a local-and-cloud-oriented recovery topic explicitly named in the blueprint alongside iCloud. Which answer is best?',
    'Time Machine',
    'VNC',
    'DHCPv6',
    'KPI dashboard',
    'Answer: A. Time Machine',
  ],
  [
    'An Android user cannot send or receive work email on a recently enrolled phone. Which mobile support area in the blueprint most directly applies?',
    'Email setup',
    'VGA conversion',
    'Motherboard identification',
    'Traceroute6 routing',
    'Answer: A. Email setup',
  ],
  [
    'A support ticket references an Azure-hosted workload running in a virtual machine. Which pair of blueprint concepts is most directly represented?',
    'Cloud provider and virtual machine terminology',
    'Paper jam and toner replacement',
    'Ticket notes and queue aging',
    'PII and impersonation',
    'Answer: A. Cloud provider and virtual machine terminology',
  ],
  [
    'A user receives an unexpected message with a harmless-looking link, but the final destination is masked behind a shortened URL. Which security issue should the technician suspect first?',
    'Phishing',
    'Display scaling',
    'RAM incompatibility',
    'APIPA reassignment',
    'Answer: A. Phishing',
  ],
  [
    'A workstation begins launching unwanted programs after a suspicious download, but there is no proof yet of credential theft. Which general threat category still clearly applies?',
    'Malware',
    'DHCPv6',
    'Cable conversion',
    'Time management',
    'Answer: A. Malware',
  ],
  [
    'A mailbox is flooded with unsolicited junk offers that do not appear to imitate trusted senders. Which blueprint threat term is the best match?',
    'Spam',
    'Entra ID',
    'Firmware flashing',
    'Hypervisor nesting',
    'Answer: A. Spam',
  ],
  [
    'A user reports many failed login notifications even though they did not attempt to sign in. Which blueprint threat category best fits this symptom?',
    'Unauthorized access attempts',
    'Accessibility error',
    'Printer misfeed',
    'External drive mount failure',
    'Answer: A. Unauthorized access attempts',
  ],
  [
    'A user asks whether reusing the same password everywhere is acceptable because it is complex. Which guidance should the technician provide?',
    'Good password practices matter, not just complexity alone',
    'Password reuse is preferred for support convenience',
    'MFA removes the need for password discipline',
    'Only cloud apps require secure passwords',
    'Answer: A. Good password practices matter, not just complexity alone',
  ],
  [
    'A caller says they are from the security team and urgently need an employee\'s direct mobile number and manager name. Which attack style should the technician suspect?',
    'Social engineering through impersonation',
    'GPU overload',
    'DHCP scope exhaustion',
    'Printer queue duplication',
    'Answer: A. Social engineering through impersonation',
  ],
  [
    'A help desk agent receives a message asking them to bypass identity verification because "policy is slowing down incident response." Which blueprint lesson is most directly relevant?',
    'Help desk technicians are prime targets for social engineering',
    'Company policies should be skipped during urgent calls',
    'Verification only matters for hardware tickets',
    'Social engineering is limited to email attacks',
    'Answer: A. Help desk technicians are prime targets for social engineering',
  ],
  [
    "A ticket contains a user's personal tax ID, date of birth, and home contact information even though the issue only involved a printer jam. Which data category has clearly been mishandled?",
    'PII',
    'STP wiring',
    'Predictive AI output',
    'DHCP reservation data only',
    'Answer: A. PII',
  ],
  [
    'A team member wants to share internal user account information with an external forum to ask for troubleshooting help. Which blueprint principle should stop that action?',
    'Company policies and confidentiality guidelines protect user data',
    'Public forums are always safe for internal incidents',
    'Any data can be shared if names are shortened',
    'Documentation is more important than confidentiality',
    'Answer: A. Company policies and confidentiality guidelines protect user data',
  ],
  [
    'A technician confirms a phishing email captured a user\'s credentials and the user may have clicked an attachment as well. Which action remains within the blueprint\'s basic support scope before full security escalation?',
    'Help the user run a malware scan',
    'Rebuild the mail server',
    'Rewrite all domain firewall rules',
    'Replace every switch in the office',
    'Answer: A. Help the user run a malware scan',
  ],
  [
    "A technician needs to connect to a user's machine over the network to view the screen and help directly, but the company prefers a built-in Windows remote-control option rather than a third-party product. Which listed tool fits best?",
    'Remote Desktop',
    'Dropbox',
    'Ping6',
    'DVI',
    'Answer: A. Remote Desktop',
  ],
  [
    'A support lead asks for another named remote support option besides Remote Desktop and TeamViewer that is specifically included in the blueprint. Which answer is correct?',
    'PC Anywhere',
    'System Information',
    'OneDrive',
    'HDMI',
    'Answer: A. PC Anywhere',
  ],
  [
    'A technician is troubleshooting a niche driver issue and wants vendor-neutral discussion threads from practitioners before changing internal notes. Which research source is explicitly listed?',
    'Technical forums',
    'BIOS splash screens',
    'Browser favorites',
    'Battery health widgets',
    'Answer: A. Technical forums',
  ],
  [
    'A support specialist checks an internal article and then compares it with an industry article for the same issue. Which blueprint resource category explicitly includes both internal and industry sources?',
    'Knowledge base articles',
    'Mobile device chargers',
    'Teleconferencing screens',
    'Multiple display settings',
    'Answer: A. Knowledge base articles',
  ],
  [
    'An AI tool provides a confident answer, but parts of it appear inconsistent with observed device behavior. Which blueprint caution is most relevant?',
    'Limitations of AI',
    'Dangers of USB-C video',
    'Risks of brightness settings',
    'Dangers of queue management',
    'Answer: A. Limitations of AI',
  ],
  [
    'A technician uses AI to draft a response for a user but worries about whether the generated content is fair, appropriate, and responsible in context. Which blueprint concern is most directly involved?',
    'Ethical considerations for AI',
    'M.2 compatibility',
    'Fax line interference',
    'DHCPv6 scope size',
    'Answer: A. Ethical considerations for AI',
  ],
  [
    'A technician chooses not to paste confidential ticket details into a public chatbot while researching an error. Which blueprint topic best supports that choice?',
    'Privacy and security risks of AI use',
    'Display brightness behavior',
    'Printer toner replacement',
    'SSD interface speed',
    'Answer: A. Privacy and security risks of AI use',
  ],
  [
    'A collaboration-first support session requires screen sharing and assistance within a Cisco-branded tool rather than a standalone desktop protocol. Which listed option fits best?',
    'Cisco Webex',
    'tracert',
    'BitLocker',
    'SATA',
    'Answer: A. Cisco Webex',
  ],
  [
    'A technician is comparing remote-control products and wants a protocol explicitly named in the blueprint that is commonly shortened to three letters. Which answer is correct?',
    'VNC',
    'SLA',
    'AWS',
    'DNS',
    'Answer: A. VNC',
  ],
  [
    'A technician finishes researching a repeat issue using AI, a search engine, and internal documentation. Which final action keeps the work aligned with the blueprint rather than leaving the knowledge only in personal notes?',
    'Update internal documentation with findings',
    'Clear the browser cache',
    'Replace the network adapter',
    'Delete the ticket history',
    'Answer: A. Update internal documentation with findings',
  ],
]

const set3 = [
  [
    'A technician wants to improve first response speed, but a teammate argues that only the formal contract matters, not internal measurements. Which help desk concept is specifically used to measure operational performance rather than define promised service targets?',
    'SLA',
    'KPI',
    'Ticket backlog',
    'Escalation chain',
    'Answer: B. KPI',
  ],
  [
    'A technician updates a ticket with "fixed after reboot," even though the issue involved a recurring browser sign-in failure that required clearing cached data. Which documentation problem is most serious?',
    'The note is not concise enough',
    'The note omits the troubleshooting steps and useful detail for future interactions',
    'The note includes too much technical detail',
    'The note should be stored outside the ticketing system',
    'Answer: B. B',
  ],
  [
    'A user reports that a headset fails only during Webex meetings, not during local audio playback. Before changing settings, which step in the problem-solving process should the technician focus on if they still need more specifics?',
    'Identify a probable cause',
    'Gather detailed information',
    'Document the final fix',
    'Escalate immediately',
    'Answer: B. Gather detailed information',
  ],
  [
    'A help desk queue contains 15 open tickets. One ticket has been open longest, but another affects a finance user blocked from all work and nearing the response deadline. Which combination of concepts best explains why the finance ticket should likely be handled first?',
    'Queue management and time management',
    'Documentation and escalation',
    'Ticket closure and root cause analysis',
    'Browser cache and process termination',
    'Answer: A. Queue management and time management',
  ],
  [
    'A technician has made the planned change to resolve a recurring display issue on a Windows laptop. According to the blueprint process, what should happen before documenting the final fix?',
    'Repeat the process regardless of outcome',
    'Observe the results of the changes',
    'Reopen all related historical tickets',
    "Reset the user's password",
    'Answer: B. Observe the results of the changes',
  ],
  [
    'A ticket note says, "Likely user confused; issue gone now." Why is this poor documentation even if the issue appears resolved?',
    'It is too technical for internal staff',
    'It is not factual and is not written in a way that is useful for future interactions',
    'It contains too many troubleshooting steps',
    'It improperly references a KPI',
    'Answer: B. B',
  ],
  [
    'A technician identifies a probable cause, but the planned fix fails. According to the blueprint, what is the correct next action rather than assuming the device needs replacement?',
    'Repeat the problem-solving process',
    'Close the ticket as unresolved',
    'Update only the SLA timer',
    'Immediately perform e-waste disposal',
    'Answer: A. Repeat the problem-solving process',
  ],
  [
    'A manager asks whether a ticketing system is the same thing as an SLA. Which response is most accurate?',
    'They are the same because both track ticket age',
    'A ticketing system manages incidents, while an SLA defines service expectations',
    'An SLA replaces queue management entirely',
    'A ticketing system is only used for hardware issues',
    'Answer: B. A ticketing system manages incidents',
  ],
  [
    'A technician writes complete notes about a password reset but leaves out the final outcome. Which required documentation element is still missing?',
    'Whether the changes resolved the issue',
    "The user's office location only",
    'The brand of monitor connected',
    'The keyboard layout setting',
    'Answer: A. Whether the changes resolved the issue',
  ],
  [
    'A service desk lead wants to reduce tickets that breach response commitments without reducing note quality. Which help desk area is most directly targeted?',
    'Time management',
    'Display settings',
    'Application marketplace policy',
    'AirDrop configuration',
    'Answer: A. Time management',
  ],
  [
    'A technician begins work inside a desktop that is still connected to wall power because the user says the device is shut down already. Which safety concern is still valid?',
    'DHCP lease renewal',
    'Electrical shock',
    'Browser cache corruption',
    'MFA prompt failure',
    'Answer: B. Electrical shock',
  ],
  [
    'A Windows user needs to find processor, installed memory, and OS version, but not network interface details. Which tool is the best fit?',
    'ipconfig',
    'System Information',
    'Event Viewer',
    'tracert',
    'Answer: B. System Information',
  ],
  [
    'A macOS user needs to review system activity because an application appears frozen and memory usage is spiking. Which tool should the technician direct the user to open first, even though About This Mac also shows device details?',
    'Activity Monitor',
    'Console',
    'ifconfig',
    'Finder',
    'Answer: A. Activity Monitor',
  ],
  [
    'A user wants to connect an older projector that only supports VGA to a laptop with USB-C video output. Which additional item is most likely required?',
    'A converter',
    'An MFA token',
    'A SATA cable',
    'An RJ-45 coupler',
    'Answer: A. A converter',
  ],
  [
    'A technician is asked to identify a twisted-pair network cable type with shielding to reduce interference. Which option matches the blueprint list?',
    'STP',
    'DVI',
    'VGA',
    'Micro USB',
    'Answer: A. STP',
  ],
  [
    'A desktop upgrade requires adding a wireless capability card. Which component type from the blueprint is the closest match?',
    'Wireless card',
    'Default gateway module',
    'BitLocker slot',
    'Browser adapter',
    'Answer: A. Wireless card',
  ],
  [
    'A user installs new RAM, and the system powers on but behaves unpredictably. Which domain objective most directly supports checking whether the new memory is appropriate for the system board?',
    'Interfaces and expansion card compatibility',
    'Printer queue management',
    'Social engineering awareness',
    'iCloud restore workflow',
    'Answer: A. Interfaces and expansion card compatibility',
  ],
  [
    'A desktop storage upgrade request mentions replacing a spinning disk with a faster 2.5-inch solid-state option, not a motherboard-mounted module. Which storage type best fits?',
    'SSD',
    'NVMe M.2 only',
    'DisplayPort',
    'Thunderbolt 4',
    'Answer: A. SSD',
  ],
  [
    'A device works physically, but Windows shows a warning icon and the user reports the hardware is unavailable. Which Windows tool listed in the blueprint is best for managing this type of issue?',
    'Device Manager',
    'Task Scheduler',
    'Notepad',
    'gpupdate',
    'Answer: A. Device Manager',
  ],
  [
    'A technician suggests applying firmware immediately to every hardware issue because updates are always beneficial. Why is that statement inaccurate?',
    'Firmware applies only to printers',
    'The blueprint notes both benefits and dangers of firmware updates',
    'Firmware is part of cloud access management',
    'Firmware cannot affect device stability',
    'Answer: B. The blueprint notes both benefits and dangers',
  ],
  [
    'A user can log on locally but cannot open a departmental OneDrive resource after a role change. Which check is most appropriate before assuming a sync problem?',
    'Security group membership',
    'GPU compatibility',
    'BitLocker recovery key',
    'RAM speed',
    'Answer: A. Security group membership',
  ],
  [
    "A technician resets a user's password and needs policy-driven access changes to apply right away. Which command from the blueprint is most relevant?",
    'gpupdate',
    'ping6',
    'ss',
    'netstat -e only',
    'Answer: A. gpupdate',
  ],
  [
    'A user says the office multifunction printer is online, has paper, and has toner, but nothing is printing because jobs are stuck. Which next action best fits the blueprint?',
    'Clear the print queue',
    'Replace the motherboard',
    'Reset AWS IAM permissions',
    'Reformat the SSD',
    'Answer: A. Clear the print queue',
  ],
  [
    'A wired keyboard intermittently disconnects, but only when connected through a loose front-panel port. Which category does this problem fall under in the blueprint?',
    'Peripheral connectivity troubleshooting',
    'Cloud model recognition',
    'Confidentiality policy enforcement',
    'MDM administration',
    'Answer: A. Peripheral connectivity troubleshooting',
  ],
  [
    'A remote participant sees the room clearly on a Cisco Webex Desk Pro, but the local user cannot hear the remote side through the attached audio device. Which blueprint area most directly applies?',
    'Teleconferencing device and headphone troubleshooting',
    'Hypervisor configuration',
    'E-waste disposal',
    'Password reset workflow',
    'Answer: A. Teleconferencing device and headphone troubleshooting',
  ],
  [
    'A Windows laptop shows an IPv4 address in the 169.254.x.x range after joining a wireless network. What is the strongest interpretation?',
    'DHCP likely failed, so the device self-assigned an APIPA address',
    'DNS is working correctly',
    'The user has a valid public IP',
    'The default gateway has been authenticated',
    'Answer: A. DHCP likely failed',
  ],
  [
    'A Linux user has connectivity issues and needs to verify socket and address information. Which pair of tools listed in the blueprint is most targeted to that task?',
    'ip add and ss',
    'Device Manager and Event Viewer',
    'About This Mac and Console',
    'AirDrop and Time Machine',
    'Answer: A. ip add and ss',
  ],
  [
    'A device has only an IPv6 address beginning with fe80:: and cannot reach remote IPv6 resources. What does this most likely indicate?',
    'The device has only a link-local IPv6 address instead of a global one',
    'The device has a valid AWS public address',
    'The device has passed MFA successfully',
    'DNS is definitely functioning',
    'Answer: A. The device has only a link-local IPv6 address',
  ],
  [
    'A user can ping the default gateway but cannot resolve internal hostnames. Which network service purpose should the technician focus on next?',
    'DNS',
    'BitLocker',
    'Bluetooth',
    'M.2 storage',
    'Answer: A. DNS',
  ],
  [
    'A user on the correct SSID still cannot reach a subnet beyond the local gateway, and traceroute stops after the first hop. Which blueprint concept may explain the block?',
    'A firewall may be impacting connectivity',
    'AirDrop is disabled',
    'The browser cache is stale',
    'The SSD firmware is outdated',
    'Answer: A. A firewall may be impacting connectivity',
  ],
  [
    'A Windows user sees everything duplicated across two monitors after docking, but the user wants the laptop and external display to show different content. Which support area applies most directly?',
    'Display settings and multiple displays',
    'MDM enrollment',
    'STP cabling',
    'Ticket queue management',
    'Answer: A. Display settings and multiple displays',
  ],
  [
    'A Windows user says a browser-based app still loads an outdated page after a service change. Which action best matches the blueprint before assuming the website itself is down?',
    'Clear the browser cache',
    'Replace the graphics card',
    'Run Device Manager',
    'Mount an external drive',
    'Answer: A. Clear the browser cache',
  ],
  [
    'A Windows application is unresponsive and consuming excessive CPU, but the system itself still responds. Which tool should be used to stop the process?',
    'Task Manager',
    'About This Mac',
    'Cisco Webex',
    'tracert',
    'Answer: A. Task Manager',
  ],
  [
    'A user needs help recovering personal files that were previously synchronized to Microsoft\'s cloud storage after a laptop replacement. Which blueprint topic best fits?',
    'OneDrive backup and restore assistance',
    'AWS IAM role assignment',
    'Printer jam removal',
    'ESD mitigation',
    'Answer: A. OneDrive backup and restore assistance',
  ],
  [
    'A Windows system fails to boot normally after an update, and the technician needs a minimal startup mode for troubleshooting. Which option is most appropriate?',
    'Safe Mode',
    'AirDrop',
    'Google Drive mapping',
    'Device Manager rollback from BIOS',
    'Answer: A. Safe Mode',
  ],
  [
    'A macOS user complains that an external monitor is too dim and mirroring behavior is incorrect, but the cabling is fine. Which blueprint topic should the technician work through first?',
    'Display settings, multiple displays, and brightness',
    'SMTP record management',
    'Token ring troubleshooting',
    'Malware escalation',
    'Answer: A. Display settings, multiple displays, and brightness',
  ],
  [
    'A macOS application launches but cannot access protected folders or devices required to function. Which support step is most relevant?',
    'Allow the application the necessary permissions',
    'Install a new hypervisor',
    'Replace the RJ-45 cable',
    'Run gpupdate',
    'Answer: A. Allow the application the necessary permissions',
  ],
  [
    'A user wants to transfer a file quickly between nearby Apple devices without emailing it or using cloud storage. Which blueprint feature is most directly involved?',
    'AirDrop',
    'BitLocker',
    'TeamViewer',
    'STP shielding',
    'Answer: A. AirDrop',
  ],
  [
    'A smartphone is enrolled in a company program that can push app settings, enforce policies, and support remote management. Which term best fits this blueprint topic?',
    'MDM',
    'SLA',
    'KPI',
    'APIPA',
    'Answer: A. MDM',
  ],
  [
    'A ticket mentions an AWS-hosted service issue, but the service desk only needs to recognize the environment and route it properly. Which concept is being tested?',
    'Recognizing cloud models in order to direct the incident to the right team',
    'Clearing the print queue',
    'Terminating Chrome processes',
    'Replacing Bluetooth cards',
    'Answer: A. Recognizing cloud models',
  ],
  [
    'A user receives an email that appears to come from payroll and asks them to verify credentials using an embedded link. The page closely imitates the real sign-in portal. Which threat is most accurate?',
    'Phishing',
    'STP interference',
    'APIPA assignment',
    'Printer queue corruption',
    'Answer: A. Phishing',
  ],
  [
    'A machine begins showing unwanted pop-ups, suspicious redirects, and degraded performance after the user opened an attachment. Which first-line action is explicitly included in the blueprint?',
    'Help the user run a malware scan',
    'Replace the motherboard',
    'Disable all browser tabs permanently',
    'Reimage every device on the subnet without investigation',
    'Answer: A. Help the user run a malware scan',
  ],
  [
    'A user proposes setting their password to the company name followed by 123 because it is easy to remember. Which security guidance should the technician reinforce?',
    'Good password practices and strong passwords',
    'Only cloud passwords matter',
    'Password reuse improves support speed',
    'MFA makes password quality irrelevant',
    'Answer: A. Good password practices and strong passwords',
  ],
  [
    'A caller claims to be the chief executive and pressures the help desk to bypass verification because they are "too busy for policy." What should the technician recognize?',
    'Help desk staff are prime targets for social engineering',
    'Executives are exempt from validation',
    'This is a normal cloud escalation',
    'The issue is primarily about WLAN SSID mismatch',
    'Answer: A. Help desk staff are prime targets for social engineering',
  ],
  [
    'A message uses a trusted company logo and familiar sender name, but the actual email address is altered slightly. Which threat term best matches the deception technique?',
    'Spoofing',
    'DHCPv6',
    'Hypervisor drift',
    'Accessibility failure',
    'Answer: A. Spoofing',
  ],
  [
    'A technician is asked to paste a user\'s driver\'s license number and home address into a public chat tool for "faster troubleshooting." Which blueprint concern is most directly violated?',
    'Protection of PII under confidentiality guidelines',
    'GPU compatibility checks',
    'Printer toner replacement procedure',
    'Desktop power cable identification',
    'Answer: A. Protection of PII under confidentiality guidelines',
  ],
  [
    'A suspicious email asks a technician to reveal internal reset procedures and admin contact names. Why is this scenario especially important in the blueprint?',
    'Help desk technicians are prime social engineering targets',
    'It is a standard request from users',
    'It is a mobile OS issue',
    'It is part of e-waste policy',
    'Answer: A. Help desk technicians are prime social engineering targets',
  ],
  [
    'A user reports repeated login attempts from unknown locations after entering credentials into a fake portal. What should the technician do from a security-response perspective at the help desk level?',
    'Perform basic investigation and escalate to the appropriate team',
    'Ignore the issue if access still works',
    'Only clear browser cache',
    "Replace the user's monitor",
    'Answer: A. Perform basic investigation and escalate',
  ],
  [
    'Which example is most clearly proprietary or confidential internal data rather than public information?',
    'An internal incident report containing employee account details',
    'A published vendor brochure',
    'A monitor user guide from a public website',
    'A public Cisco certification page title',
    'Answer: A. An internal incident report containing employee account details',
  ],
  [
    'A user argues that because MFA is enabled, entering credentials into a suspicious site is harmless. Which response is most accurate?',
    'Credential theft is still dangerous and may be part of a phishing or unauthorized access attempt',
    'MFA removes all risk from phishing',
    'Spoofed pages cannot capture passwords',
    'Password resets are unnecessary after suspicious sign-ins',
    'Answer: A. Credential theft is still dangerous',
  ],
  [
    'A remote employee needs live assistance while using a Windows desktop from home, and the technician must both view and control the screen. Which tool below is explicitly listed in the blueprint?',
    'TeamViewer',
    'Nslookup',
    'OneDrive',
    'Device Manager',
    'Answer: A. TeamViewer',
  ],
  [
    'A technician needs a Microsoft-native remote support option for connecting to an end-user Windows system, not a third-party collaboration tool. Which listed tool best matches that scenario?',
    'Remote Assistance',
    'AirDrop',
    'ifconfig',
    'M.2',
    'Answer: A. Remote Assistance',
  ],
  [
    'A support specialist uses a search engine to investigate an unfamiliar error code before updating internal notes. Why does this still align with the blueprint?',
    'Search engine results are one of the approved troubleshooting research resources',
    'Search engines replace knowledge bases entirely',
    'Search results should be used instead of documentation',
    'Search engines are only for cloud incidents',
    'Answer: A. Search engine results are one of the approved',
  ],
  [
    'A technician finds a likely fix in a technical forum, but the post is several years old and references a different OS version. What is the best interpretation under the blueprint\'s research guidance?',
    'Technical forums are useful, but findings should be validated before updating documentation',
    'Forum content is always authoritative',
    'Only predictive AI may be used',
    'Old guidance overrides internal KBs',
    'Answer: A. Technical forums are useful, but findings should be validated',
  ],
  [
    'A technician enters a full ticket transcript including personal information into a public generative AI tool to ask for troubleshooting help. Which blueprint concern is most directly implicated?',
    'Privacy and security risks',
    'Video port compatibility',
    'DHCPv6 addressing',
    'Tactile input calibration',
    'Answer: A. Privacy and security risks',
  ],
  [
    'A supervisor asks a new technician to explain one way predictive AI differs from generative AI in troubleshooting research. Which statement is best aligned with the blueprint topic?',
    'Predictive AI forecasts likely outcomes, while generative AI produces new content such as responses or summaries',
    'Predictive AI is only used for printers, while generative AI is only used for phones',
    'Predictive AI cannot analyze patterns',
    'Generative AI has no ethical considerations',
    'Answer: A. Predictive AI forecasts likely outcomes',
  ],
  [
    'A technician uses an internal knowledge base article, then updates the article after confirming a repeatable fix for a Webex issue. Which blueprint objective does this support most directly?',
    'Researching an issue and updating internal documentation with findings',
    'Replacing NVMe storage',
    'Enforcing printer toner policy',
    'Identifying PII in HR forms only',
    'Answer: A. Researching an issue and updating internal documentation',
  ],
  [
    'A remote support session requires a direct desktop connection protocol rather than a meeting platform. Which listed tool best fits that need?',
    'Remote Desktop',
    'Google Drive',
    'Event Viewer',
    'Traceroute6',
    'Answer: A. Remote Desktop',
  ],
  [
    'A technician is deciding whether to rely on a single AI answer or compare it against official documentation and KB content. Which approach is more aligned with the blueprint?',
    'Cross-check AI output because AI has limitations',
    'Accept the first AI response as final',
    'Avoid all written documentation once AI responds',
    'Use only social media replies instead',
    'Answer: A. Cross-check AI output because AI has limitations',
  ],
  [
    'A legacy support environment requires a remote-control tool, and the technician is reviewing blueprint-listed options beyond Cisco Webex and TeamViewer. Which option below is also explicitly named?',
    'VNC',
    'HDMI',
    'ifconfig',
    'Dropbox',
    'Answer: A. VNC',
  ],
]

if (set4.length !== 60) throw new Error(`set4 expected 60 got ${set4.length}`)
if (set3.length !== 60) throw new Error(`set3 expected 60 got ${set3.length}`)

function domainForSetIndex(set, i) {
  const n = i + 1
  if (set === 4) {
    if (n <= 3) return { domain: 'Service Management', topic: 'Practice intro' }
    if (n <= 10) return { domain: 'Help Desk', topic: 'Domain 1' }
    if (n <= 20) return { domain: 'Hardware', topic: 'Domain 2' }
    if (n <= 30) return { domain: 'Networking Basics', topic: 'Domain 3' }
    if (n <= 40) return { domain: 'Operating Systems', topic: 'Domain 4' }
    if (n <= 50) return { domain: 'Security Awareness', topic: 'Domain 5' }
    return { domain: 'Help Desk', topic: 'Domain 6 tools' }
  }
  if (n <= 3) return { domain: 'Service Management', topic: 'Practice intro' }
  if (n <= 10) return { domain: 'Help Desk', topic: 'Domain 1' }
  if (n <= 20) return { domain: 'Hardware', topic: 'Domain 2' }
  if (n <= 30) return { domain: 'Networking Basics', topic: 'Domain 3' }
  if (n <= 40) return { domain: 'Operating Systems', topic: 'Domain 4' }
  if (n <= 50) return { domain: 'Security Awareness', topic: 'Domain 5' }
  return { domain: 'Help Desk', topic: 'Domain 6 tools' }
}

function toQuestions(rows, setNum, idStart) {
  return rows.map((row, i) => {
    const [prompt, a, b, c, d, ansLine] = row
    const answer = letterFromAnswer(ansLine)
    const { domain, topic } = domainForSetIndex(setNum, i)
    const id = `ccst-${idStart + i}`
    return {
      id,
      certification: 'ccst-it-support',
      domain,
      topic,
      difficulty: 'easy',
      prompt: clean(prompt),
      options: opts(a, b, c, d),
      answer,
      explanation: `Practice Set ${setNum} (PDF): correct answer **${answer}**.`,
      tags: [`PDF Practice Set ${setNum}`],
    }
  })
}

const part4 = toQuestions(set4, 4, 151)
const part3 = toQuestions(set3, 3, 211)

function escJs(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r|\n/g, ' ')
}

function emitQuestion(q) {
  const [o0, o1, o2, o3] = q.options
  const opt = (o) => `{ key: '${o.key}', text: '${escJs(o.text)}' }`
  return `  {
    id: '${q.id}',
    certification: 'ccst-it-support',
    domain: '${escJs(q.domain)}',
    topic: '${escJs(q.topic)}',
    difficulty: 'easy',
    prompt: '${escJs(q.prompt)}',
    options: [
      ${opt(o0)},
      ${opt(o1)},
      ${opt(o2)},
      ${opt(o3)},
    ],
    answer: '${q.answer}',
    explanation: '${escJs(q.explanation)}',
    tags: ['${escJs(q.tags[0])}'],
  }`
}

const all = [...part4, ...part3]
const body = all.map(emitQuestion).join(',\n')

const file = `import type { ExamQuestion } from './certificationPacks'

/**
 * Full 60+60 items from CCST IT Support Practice Set 4 and Practice Set 3 PDFs
 * (ccst_it_support_60_questions_set4.pdf + ccst_it_support_60_questions_unique.pdf).
 * IDs ccst-151–ccst-210 = Set 4; ccst-211–ccst-270 = Set 3.
 */
export const ccstPdfPracticeSet3And4Mcqs: ExamQuestion[] = [
${body},
]
`

writeFileSync(out, file)

console.log('Wrote', out, 'count', all.length)
