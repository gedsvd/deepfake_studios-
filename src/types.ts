/**
 * DeepFake Face Classification & Auth Types
 */

export interface User {
  id: number;
  name: string;
  city: string;
  email: string;
  mobile: string;
  password?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AnalysisResult {
  predictedClass: 'real' | 'fake';
  confidence: number;
  realProbability: number;
  fakeProbability: number;
  title: string;
  detail: string;
  severity: 'HIGH SEVERITY' | 'VERIFIED AUTHENTIC';
  fftScore: string;
  blinkScore: string;
  warpScore: string;
  metadataScore: string;
  latencyMs: number;
  fovAngle: number;
  blendingArtifacts: 'DETECTED' | 'CLEAN / ZERO';
}

export interface DatasetPreset {
  id: string;
  title: string;
  type: 'FAKE' | 'REAL';
  confidence: number;
  realProb: number;
  fakeProb: number;
  detail: string;
  imageUrl: string;
  fftScore: string;
  blinkScore: string;
  warpScore: string;
  metadataScore: string;
  blendingArtifacts: 'DETECTED' | 'CLEAN / ZERO';
  severity: 'HIGH SEVERITY' | 'VERIFIED AUTHENTIC';
}

export type NavigationMenu = 'Home' | 'Register' | 'Login';

export interface AnalysisHistoryItem {
  id: string;
  timestamp: string;
  imageName: string;
  imageUrl: string;
  predictedClass: 'real' | 'fake';
  confidence: number;
}
