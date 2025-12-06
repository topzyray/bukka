import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  IPlaceProvider,
  PlaceDetail,
  PlaceProviderSearchOptions,
  PlaceSearchResult,
} from 'src/DataLayer/Abstracts/Interfaces/IPlaceProvider';
import { PlaceProviderEnum } from 'src/DomainLayer/Enums/PlaceProviderEnum';
import { BUSINESS_TYPE_TO_PROVIDER_MAP } from 'src/MiddlewareLayer/Mappings/BusinessTypeProviderMap';
import { AppConfigurationService } from 'src/UtilityLayer/Configuration/AppConfiguration.service';
import { PlaceCategoryResolver } from '../PlaceCategoryResolver';

@Injectable()
export class GeoapifyPlaceProvider implements IPlaceProvider {
  readonly name = PlaceProviderEnum.GEOAPIFY;
  private readonly logger = new Logger(GeoapifyPlaceProvider.name);
  private readonly BASE = 'https://api.geoapify.com/v2/places';
  private readonly DETAILS_BASE = 'https://api.geoapify.com/v2/place-details';
  private readonly KEY: string;

  constructor(private readonly configService: AppConfigurationService) {
    this.KEY = this.configService.geoApiFy;
  }

  private async get<T = any>(url: string, params: Record<string, any>) {
    const res = await axios.get<T>(url, { params });
    return res.data;
  }

  async search(opts: PlaceProviderSearchOptions): Promise<PlaceSearchResult[]> {
    if (!opts.category) {
      throw new Error(
        'Geoapify: categories (category) param required for search',
      );
    }

    // const mappedCategory =
    //   BUSINESS_TYPE_TO_PROVIDER_MAP[opts.category.toUpperCase()]?.geoapify;

    const mappedCategory = PlaceCategoryResolver.resolve(
      PlaceProviderEnum.GEOAPIFY,
      opts.category,
    );

    if (!mappedCategory) {
      throw new Error(
        `Geoapify: category "${opts.category}" is not supported. Please use a valid category.`,
      );
    }

    // build params
    const params: any = {
      apiKey: this.KEY,
      categories: mappedCategory,
      limit: opts.limit ?? 20,
    };

    if (opts.lat && opts.lng && opts.radius) {
      const r = this.radiusToRect(opts.lat, opts.lng, opts.radius);

      params.filter = `rect:${r.minLon},${r.minLat},${r.maxLon},${r.maxLat}`;
      params.bias = `proximity:${opts.lng},${opts.lat}`;
    }

    try {
      const data = await this.get(this.BASE, params);

      const features = data.features || [];
      return features.map((f: any) => ({
        externalId: f.properties.place_id,
        name: f.properties.name,
        address: f.properties.formatted,
        lat: f.properties.lat,
        lng: f.properties.lon,
        types: Array.isArray(f.properties.categories)
          ? f.properties.categories
          : typeof f.properties.categories === 'string'
            ? f.properties.categories.split(',')
            : [],
        raw: f,
      }));
    } catch (err) {
      this.logger.error({ err, opts }, 'Geoapify search error');
      return [];
    }
  }

  async getDetails(externalId: string): Promise<PlaceDetail | null> {
    if (!externalId) return null;
    const params = {
      apiKey: this.KEY,
      place_id: externalId,
    };
    try {
      const data = await this.get(this.DETAILS_BASE, params);
      const f = data.features?.[0];
      if (!f) return null;
      const p = f.properties;
      return {
        externalId,
        name: p.name,
        address: p.formatted,
        lat: p.lat,
        lng: p.lon,
        phone: p.tel ?? null,
        website: p.website ?? null,
        rating: p.rate ?? null, // may not exist
        openingHours: null, // Geoapify may not provide opening_hours consistently
        photos: [], // Geoapify does not provide photos by default
        types: Array.isArray(f.properties.categories)
          ? f.properties.categories
          : typeof f.properties.categories === 'string'
            ? f.properties.categories.split(',')
            : [],
        raw: f,
      };
    } catch (err) {
      this.logger.error({ err, externalId }, 'Geoapify getDetails error');
      return null;
    }
  }

  private radiusToRect(lat: number, lng: number, radius: number) {
    const earthRadius = 111000; // meters

    const latOffset = radius / earthRadius;
    const lonOffset = radius / (earthRadius * Math.cos((lat * Math.PI) / 180));

    return {
      minLon: lng - lonOffset,
      minLat: lat - latOffset,
      maxLon: lng + lonOffset,
      maxLat: lat + latOffset,
    };
  }
}

// export const GEOAPIFY_CATEGORY_MAP: Record<string, string> = {
//   RESTAURANT: 'catering.restaurant',
//   FAST_FOOD: 'catering.fast_food',
//   CAFE: 'catering.cafe',
//   BAR: 'catering.bar',
//   BAKERY: 'commercial.food_and_drink.bakery',
//   DESSERT_SHOP: 'catering.cafe', // no dessert-only category
//   ICE_CREAM_SHOP: 'catering.cafe', // no dedicated category
//   PIZZA: 'catering.restaurant.pizza',
//   SEAFOOD: 'catering.restaurant.seafood',
//   STEAK_HOUSE: 'catering.restaurant.steak_house',
//   SUSHI: 'catering.restaurant.sushi',
//   VEGETARIAN: 'catering.restaurant', // fallback
//   VEGAN: 'catering.restaurant', // fallback
//   GROCERY: 'commercial.food_and_drink',
//   SUPERMARKET: 'commercial.supermarket',
//   CONVENIENCE_STORE: 'commercial.convenience',
//   FOOD_TRUCK: 'catering.fast_food',
//   MEAL_TAKEAWAY: 'catering.fast_food',
//   MEAL_DELIVERY: 'catering.fast_food',
//   CATERING: 'catering',
//   OTHER: 'catering',
// };
