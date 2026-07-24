export interface ServiceCreateRequest {
 name: string;
 description: string;
 price: number;
 durationInMinutes: number;
 orderIndex: number;
 imageUrl?: string;
}

export interface ServiceAdminResponse {
 id: number;
 name: string;
 description: string;
 price: number;
 durationInMinutes: number;
 orderIndex: number;
 status: "ACTIVE" | "INACTIVE";
 imageUrl?: string;
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
