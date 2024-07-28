export interface Certificate {
  id?: number;
  supplier: Supplier;
  certificateType: string;
  validFrom: Date;
  validTo: Date;
  preview?: string;
}
export interface Supplier {
  name: string;
  s_index?: number;
  city?: string;
}
export const sampleCertificates: Certificate[] = [];

export enum Certificate_Type {
  PERMISSION_OF_PRINTING = 'Permission of Printing',
  CCC_CERTIFICATE = 'CCC Certificate',
}
