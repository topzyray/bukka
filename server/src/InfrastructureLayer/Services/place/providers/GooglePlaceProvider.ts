import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  IPlaceProvider,
  PlaceDetail,
  PlaceProviderSearchOptions,
  PlaceSearchResult,
} from 'src/DataLayer/Abstracts/Interfaces/IPlaceProvider';
import { PlaceProviderEnum } from 'src/DomainLayer/Enums/PlaceProviderEnum';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';

@Injectable()
export class GooglePlaceProvider implements IPlaceProvider {
  readonly name = PlaceProviderEnum.GOOGLE;
  private readonly logger = new Logger(GooglePlaceProvider.name);
  private readonly BASE = 'https://maps.googleapis.com/maps/api/place';
  private readonly KEY: string;

  constructor(private readonly configService: AppConfigurationService) {
    this.KEY = this.configService.googleMapApiKey;
  }

  private async get<T = any>(url: string, params: Record<string, any>) {
    const res = await axios.get<T>(url, { params });
    return res.data;
  }

  async search(opts: PlaceProviderSearchOptions): Promise<PlaceSearchResult[]> {
    // prefer textsearch when query provided, nearby when lat/lng provided
    if (opts.query) {
      const url = `${this.BASE}/textsearch/json`;
      const data = await this.get(url, {
        query: opts.query,
        key: this.KEY,
      });

      return (data.results || []).slice(0, opts.limit || 20).map((r: any) => ({
        externalId: r.place_id,
        name: r.name,
        address: r.formatted_address,
        lat: r.geometry?.location?.lat,
        lng: r.geometry?.location?.lng,
        types: r.types,
        raw: r,
      }));
    }

    if (opts.lat !== undefined && opts.lng !== undefined) {
      const url = `${this.BASE}/nearbysearch/json`;
      const data = await this.get(url, {
        location: `${opts.lat},${opts.lng}`,
        radius: opts.radius ?? 3000,
        type: opts.category ?? 'restaurant',
        key: this.KEY,
      });
      return (data.results || []).slice(0, opts.limit || 20).map((r: any) => ({
        externalId: r.place_id,
        name: r.name,
        address: r.vicinity || r.formatted_address,
        lat: r.geometry?.location?.lat,
        lng: r.geometry?.location?.lng,
        types: r.types,
        raw: r,
      }));
    }

    return [];
  }

  async getDetails(externalId: string): Promise<PlaceDetail | null> {
    if (!externalId) return null;
    const url = `${this.BASE}/details/json`;
    const fields = [
      'name',
      'formatted_address',
      'geometry',
      'formatted_phone_number',
      'website',
      'opening_hours',
      'rating',
      'place_id',
      'types',
      'photos',
      'address_components',
    ].join(',');
    const data = await this.get(url, {
      place_id: externalId,
      fields,
      key: this.KEY,
    });
    const r = data.result;
    if (!r) return null;

    const photos = (r.photos || []).map((p: any) => p.photo_reference);

    return {
      externalId: r.place_id,
      name: r.name,
      address: r.formatted_address,
      lat: r.geometry?.location?.lat,
      lng: r.geometry?.location?.lng,
      phone: r.formatted_phone_number,
      website: r.website,
      rating: r.rating,
      openingHours: r.opening_hours?.weekday_text || null,
      photos,
      types: r.types,
      raw: r,
    };
  }
}
