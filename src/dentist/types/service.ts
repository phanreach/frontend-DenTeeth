export interface ServiceCreateRequest {
  name: string;
  description: string;
  price: number;
  durationInMinutes: number;
  orderIndex: number;
}

export interface ServiceAdminResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  durationInMinutes: number;
  orderIndex: number;
  status: "ACTIVE" | "INACTIVE";
  totalCount: number;
  pendingCount: number;
  acceptCount: number;
  rejectCount: number;
  cancelCount: number;
}

export interface ServiceSuccessResponse {
  success: boolean;
  message: string;
  data: ServiceAdminResponse[];
}
