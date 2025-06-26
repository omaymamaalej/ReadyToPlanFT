export interface BusinessPlanFinal {
  id?: string;
  title?: string;
  description?: string;
  creationDate?: string;
  company?: any;
  products?: any[];
  teams?: any[];
  marketings?: any[];
}
export interface AIResponseDTO {
  entityType: string;
  aiResponse: string;
}

export interface BusinessPlanFinalDTO {
  title: string;
  creationDate: string;
  aiResponses: AIResponseDTO[];
}