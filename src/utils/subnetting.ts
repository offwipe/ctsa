import type { SubnettingWeakZoneCategory } from '../data/certificationPacks'

export type SubnettingPrompt = {
  ipAddress: string
  cidr: number
  mask: string
  blockSize: number
  networkId: string
  broadcastAddress: string
  usableHosts: number
  usableRange: string
  interestingOctetIndex: number
}

const weakZoneLabelToCidr: Record<SubnettingWeakZoneCategory, number[]> = {
  'third-octet-focus': [17, 18, 19, 20, 21, 22, 23],
  'block-size': [24, 25, 26, 27, 28, 29, 30],
  'network-broadcast': [24, 25, 26, 27, 28, 29, 30],
  'subnet-mask': [8, 16, 24, 25, 26, 27, 28, 29, 30],
  'host-count': [24, 25, 26, 27, 28, 29, 30],
  'cidr-to-mask': [8, 16, 24, 25, 26, 27, 28, 29, 30],
  'mask-to-cidr': [8, 16, 24, 25, 26, 27, 28, 29, 30],
  'usable-range': [24, 25, 26, 27, 28, 29, 30],
}

export function cidrToMask(cidr: number) {
  const maskValue = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0
  return [
    (maskValue >>> 24) & 255,
    (maskValue >>> 16) & 255,
    (maskValue >>> 8) & 255,
    maskValue & 255,
  ].join('.')
}

export function ipToInt(ip: string) {
  return ip.split('.').reduce((total, octet) => ((total << 8) + Number(octet)) >>> 0, 0)
}

export function intToIp(value: number) {
  return [
    (value >>> 24) & 255,
    (value >>> 16) & 255,
    (value >>> 8) & 255,
    value & 255,
  ].join('.')
}

export function generateSubnettingPrompt(cidrs: number[], weakZone?: SubnettingWeakZoneCategory): SubnettingPrompt {
  const sourceCidrs = weakZone ? weakZoneLabelToCidr[weakZone] : cidrs
  const cidr = sourceCidrs[Math.floor(Math.random() * sourceCidrs.length)]
  const mask = cidrToMask(cidr)
  const maskOctets = mask.split('.').map(Number)
  const interestingOctetIndex = maskOctets.findIndex((octet) => octet !== 255 && octet !== 0)
  const blockSize = interestingOctetIndex === -1 ? 256 : 256 - maskOctets[interestingOctetIndex]

  const octets = [
    10 + Math.floor(Math.random() * 200),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    1 + Math.floor(Math.random() * 254),
  ]

  if (weakZone === 'third-octet-focus') {
    octets[2] = 16 + Math.floor(Math.random() * 200)
  }

  const ipAddress = octets.join('.')
  const maskInt = ipToInt(mask)
  const ipInt = ipToInt(ipAddress)
  const networkInt = ipInt & maskInt
  const broadcastInt = networkInt | (~maskInt >>> 0)
  const usableHosts = Math.max(0, broadcastInt - networkInt - 1)
  const usableRange = usableHosts > 0
    ? `${intToIp(networkInt + 1)} - ${intToIp(broadcastInt - 1)}`
    : 'N/A'

  return {
    ipAddress,
    cidr,
    mask,
    blockSize,
    networkId: intToIp(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    usableHosts,
    usableRange,
    interestingOctetIndex,
  }
}

export const sevenSecondRows = [
  { mask: '/1', networkMask: '/9', addressMask: '/17', hostMask: '/25', octet: '128', networks: '2', addresses: '128' },
  { mask: '/2', networkMask: '/10', addressMask: '/18', hostMask: '/26', octet: '192', networks: '4', addresses: '64' },
  { mask: '/3', networkMask: '/11', addressMask: '/19', hostMask: '/27', octet: '224', networks: '8', addresses: '32' },
  { mask: '/4', networkMask: '/12', addressMask: '/20', hostMask: '/28', octet: '240', networks: '16', addresses: '16' },
  { mask: '/5', networkMask: '/13', addressMask: '/21', hostMask: '/29', octet: '248', networks: '32', addresses: '8' },
  { mask: '/6', networkMask: '/14', addressMask: '/22', hostMask: '/30', octet: '252', networks: '64', addresses: '4' },
  { mask: '/7', networkMask: '/15', addressMask: '/23', hostMask: '/31', octet: '254', networks: '128', addresses: '2' },
  { mask: '/8', networkMask: '/16', addressMask: '/24', hostMask: '/32', octet: '255', networks: '256', addresses: '1' },
]
