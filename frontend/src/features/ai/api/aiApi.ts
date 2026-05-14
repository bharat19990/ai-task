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

export interface Suggestion {
  title: string;
  description: string;
}

export interface SuggestionsApiResponse {
  success: boolean;
  data: Suggestion[];
}

const aiApi = {
  generateContent: async (data: GenerateContentRequest): Promise<GenerateContentResponse> => {
    const response = await api.post<AiApiResponse>('/ai/generate', data);
    return response.data.data;
  },

  getSuggestions: async (): Promise<Suggestion[]> => {
    const response = await api.get<SuggestionsApiResponse>('/ai/suggestions');
    return response.data.data;
  },
};

export default aiApi;
