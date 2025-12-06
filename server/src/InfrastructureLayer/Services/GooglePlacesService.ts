import { Injectable } from '@nestjs/common';
import { HttpServiceWrapper } from './HttpServiceWrapper';

@Injectable()
export class GooglePlacesService {
  private readonly BASE_URL = 'https://maps.googleapis.com/maps/api/place';
  private readonly apiKey = process.env.GOOGLE_MAPS_API_KEY!;

  constructor(private readonly httpService: HttpServiceWrapper) {}

  async searchPlaces(query: string) {
    const url = `${this.BASE_URL}/textsearch/json?query=${encodeURIComponent(query)}&key=${this.apiKey}`;

    const res = await this.httpService.get(url);
    return res.data.results;
  }

  async getPlaceDetails(placeId: string) {
    const url = `${this.BASE_URL}/details/json?place_id=${placeId}&key=${this.apiKey}`;

    const res = await this.httpService.get(url);
    return res.data.result;
  }
}
