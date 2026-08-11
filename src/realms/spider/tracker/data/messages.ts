import { Message } from '../types';

export const messages: Message[] = [
  {
    id: 'm-001',
    from: 'FIELD OPERATIONS',
    content: 'Unusual activity reported in the downtown sector. Requesting immediate drone surveillance and reinforcement on standby.',
    timestamp: new Date().toISOString(),
    read: false,
    priority: 'critical'
  },
  {
    id: 'm-002',
    from: 'SIGNAL ANALYSIS',
    content: 'Intercepted encrypted broadcast on secure channel. Preliminary decryption suggests a coordinated movement within 48 hours.',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    read: false,
    priority: 'high'
  },
  {
    id: 'm-003',
    from: 'CENTRAL COMMAND',
    content: 'Routine status update: All regional nodes operating within acceptable parameters. No major deviations detected in the last cycle.',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read: true,
    priority: 'normal'
  },
  {
    id: 'm-004',
    from: 'RECONNAISSANCE',
    content: 'Visual confirmation achieved at the coastal facility. Suspects matched the provided profiles. Awaiting orders to proceed.',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    read: true,
    priority: 'high'
  }
];
