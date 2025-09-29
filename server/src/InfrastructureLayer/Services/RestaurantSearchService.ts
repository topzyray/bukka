import { Injectable } from '@nestjs/common';
import { HttpServiceWrapper } from './HttpServiceWrapper';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';

@Injectable()
export class RestaurantSearchService {
  private readonly PLACES_API_URL =
    'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  private readonly PLACE_DETAILS_URL =
    'https://maps.googleapis.com/maps/api/place/details/json';

  constructor(
    private readonly _configService: AppConfigurationService,
    private readonly httpService: HttpServiceWrapper,
  ) {}

  /**
   * Search for nearby restaurants
   * @param lat Latitude
   * @param lng Longitude
   * @param keyword Optional keyword (pizza, cafe, etc.)
   */
  async searchRestaurants(lat: number, lng: number, keyword?: string) {
    const params: any = {
      location: `${lat},${lng}`,
      radius: 3000, // 3km radius
      type: 'restaurant',
      key: this._configService.googleMapApiKey,
    };

    if (keyword) params.keyword = keyword;

    const { data } = await this.httpService.get(this.PLACES_API_URL, {
      params,
    });
    return data.results;
  }

  async getRestaurantDetails(placeId: string) {
    const params = {
      place_id: placeId,
      fields:
        'name,rating,formatted_phone_number,geometry,opening_hours,website,formatted_address',
      key: this._configService.googleMapApiKey,
    };

    const { data } = await this.httpService.get(this.PLACE_DETAILS_URL, {
      params,
    });
    return data.result;
  }
}
