import { IntelReport } from '../types';

export const intelligence: IntelReport[] = [
  {
    id: 'i-001',
    reportNumber: 'REPORT #001',
    title: 'UNUSUAL ENERGY SIGNATURE DETECTED',
    location: 'New York',
    coordinates: [-74.0060, 40.7128],
    confidence: 87,
    source: 'Automated Monitoring',
    timestamp: new Date().toISOString(),
    status: 'confirmed',
    description: 'Consistent anomalous energy spikes detected in the lower Manhattan grid. Signature does not match known power sources.'
  },
  {
    id: 'i-002',
    reportNumber: 'REPORT #002',
    title: 'UNIDENTIFIED FREQUENCY BURST',
    location: 'London',
    coordinates: [-0.1276, 51.5074],
    confidence: 64,
    source: 'Signal Intercept',
    timestamp: new Date().toISOString(),
    status: 'likely',
    description: 'Short-wave frequency bursts recorded. Cryptanalysis suggests structured data payload, origin undetermined.'
  },
  {
    id: 'i-003',
    reportNumber: 'REPORT #003',
    title: 'ANOMALOUS SEISMIC PATTERN',
    location: 'Tokyo',
    coordinates: [139.6917, 35.6895],
    confidence: 42,
    source: 'Seismic Network',
    timestamp: new Date().toISOString(),
    status: 'unverified',
    description: 'Low-amplitude, high-frequency tremors registered on local seismographs. Pattern appears artificial rather than tectonic.'
  },
  {
    id: 'i-004',
    reportNumber: 'REPORT #004',
    title: 'ENCRYPTED TRANSMISSION INTERCEPTED',
    location: 'Berlin',
    coordinates: [13.4050, 52.5200],
    confidence: 91,
    source: 'Comms Surveillance',
    timestamp: new Date().toISOString(),
    status: 'confirmed',
    description: 'High-level encrypted data stream intercepted. Encryption protocol matches known adversary signatures.'
  },
  {
    id: 'i-005',
    reportNumber: 'REPORT #005',
    title: 'ATMOSPHERIC DISTURBANCE LOGGED',
    location: 'São Paulo',
    coordinates: [-46.6333, -23.5505],
    confidence: 55,
    source: 'Meteorological Data',
    timestamp: new Date().toISOString(),
    status: 'likely',
    description: 'Localized atmospheric pressure anomalies correlated with unconfirmed visual sightings of aerial phenomena.'
  }
];
