export interface ChequeField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date';
  required: boolean;
  position: {
    x: number; // millimeters
    y: number; // millimeters
  };
  width: number; // millimeters
  height: number; // millimeters
  fontSize?: number;
  fontFamily?: string;
  maxLength?: number;
  validation?: string;
}

export interface ChequeData {
  [key: string]: string | number | Date;
}

export interface ChequeConfig {
  template: {
    width: number; // millimeters
    height: number; // millimeters
  };
  fields: ChequeField[];
}