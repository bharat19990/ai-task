import api from '../../../services/axios';

export interface GenerateContentRequest {
  prompt: string;
}

export interface GenerateContentResponse {
  title: string;
  content: string;
}

export interface AiApiResponse {
  success: boolean;
  data: GenerateContentResponse;
}

const aiApi = {
  generateContent: async (data: GenerateContentRequest): Promise<GenerateContentResponse> => {
    const response = await api.post<AiApiResponse>('/ai/generate', data);
    return response.data.data;
  },
};

export default aiApi;
