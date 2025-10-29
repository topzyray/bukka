import { envConfig, HttpClient } from "@/configs";
import { locationRoutes } from "@/constants/routes/locationRoutes";
import axios from "axios";
import { UpdateLocationDto } from "../dtos";

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 60 minutes

export class LocationApiService {
  static async getLocations(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${locationRoutes.getLocations}`,
      { params }
    );
    return response.data;
  }

  static async updateLocation(payload: UpdateLocationDto) {
    const response = await HttpClient.getClient().put(
      `${locationRoutes.updateLocation}`,
      payload
    );
    return response.data;
  }

  static async searchPlaces(params: Record<string, any> = {}) {
    const response = await HttpClient.getClient().get(
      `${locationRoutes.searchLocation}`,
      { params }
    );
    return response.data?.responseData;
  }

  static async reverseGeocode(payload: { lng: number; lat: number }) {
    const response = await HttpClient.getClient().get(
      `${locationRoutes.reverseGeocode}`,
      { params: payload }
    );
    return response.data;
  }

  static async fetchLocationSuggestions(
    query: string,
    limit: number = 5
  ): Promise<any[]> {
    const cleanQuery = query.trim();
    if (!query || cleanQuery.length < 2) {
      return [];
    }
    const cached = cache.get(cleanQuery.toLowerCase());
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_TTL) {
      console.debug("Serving from cache:", cleanQuery);
      return cached.data;
    }
    const API_KEY = envConfig.NEXT_PUBLIC_LOCATIONIQ_ACCESS_TOKEN;
    const url = `https://api.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${encodeURIComponent(
      cleanQuery
    )}&limit=${limit}&dedupe=1&normalizeaddress=1`;
    try {
      const response = await axios.get(url, {
        timeout: 7000,
      });
      if (!Array.isArray(response.data)) {
        console.warn("Unexpected LocationIQ response:", response.data);
        return [];
      }
      const data = response?.data;
      cache.set(cleanQuery.toLowerCase(), { data, timestamp: now });
      return data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        throw new Error("LocationIQ request canceled");
      } else if (error.response?.status === 404) {
        throw new Error(`No results for query ${query}`);
      } else {
        throw new Error(error.message || error);
      }
    }
  }

  static clearCache() {
    cache.clear();
  }
}
