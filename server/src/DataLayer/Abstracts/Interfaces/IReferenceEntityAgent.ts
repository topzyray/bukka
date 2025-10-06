export interface IReferenceEntityAgent {
  getById(id: number): Promise<any>;
}
