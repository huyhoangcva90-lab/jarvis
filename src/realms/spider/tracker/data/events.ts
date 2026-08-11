import { TrackerEvent } from '../types';

export const events: TrackerEvent[] = [
  {
    id: 'e-001',
    title: 'NIGHT MARKET',
    location: 'Tokyo',
    coordinates: [139.6917, 35.6895],
    date: 'Aug 18',
    description: 'An underground gathering of tech enthusiasts and information brokers.',
    status: 'upcoming'
  },
  {
    id: 'e-002',
    title: 'CITY FESTIVAL',
    location: 'London',
    coordinates: [-0.1276, 51.5074],
    date: 'Aug 24',
    description: 'Annual cultural festival expected to draw massive crowds, potential for covert ops.',
    status: 'upcoming'
  },
  {
    id: 'e-003',
    title: 'ROOFTOP CONCERT',
    location: 'New York',
    coordinates: [-74.0060, 40.7128],
    date: 'Sep 02',
    description: 'High-profile event serving as a suspected cover for a clandestine meeting.',
    status: 'upcoming'
  },
  {
    id: 'e-004',
    title: 'TECH SUMMIT',
    location: 'Berlin',
    coordinates: [13.4050, 52.5200],
    date: 'Aug 12',
    description: 'Global conference on advanced AI and neural networking. Active surveillance ongoing.',
    status: 'active'
  },
  {
    id: 'e-005',
    title: 'HARBOR GATHERING',
    location: 'Sydney',
    coordinates: [151.2093, -33.8688],
    date: 'Aug 08',
    description: 'Completed rendezvous of maritime operatives. Data currently being analyzed.',
    status: 'completed'
  },
  {
    id: 'e-006',
    title: 'SIGNAL CONVERGENCE',
    location: 'Mumbai',
    coordinates: [72.8777, 19.0760],
    date: 'Aug 28',
    description: 'Predicted node convergence event based on anomalous signal patterns.',
    status: 'upcoming'
  }
];
