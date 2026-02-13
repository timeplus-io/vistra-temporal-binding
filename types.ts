export enum BindingMode {
  HOME = 'Home',
  AXIS = 'Axis Binding',
  FRAME = 'Frame Binding',
  KEY = 'Key-based Updates'
}

export interface DataPoint {
  id: string;
  timestamp: number;
  key: string;
  value: number;
  // For visualizations
  x?: number;
  y?: number;
}

export interface EntityState {
  [key: string]: {
    value: number;
    lastUpdated: number;
    isHighlighting?: boolean;
  };
}