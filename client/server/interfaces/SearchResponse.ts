import { Restaurant } from "./Restaurant";

export interface SearchResponse {
  restaurants: Restaurant[];
  nextPageToken: string | null;
}
