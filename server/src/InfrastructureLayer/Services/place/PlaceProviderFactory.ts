import { BadRequestException, Injectable } from '@nestjs/common';
import { GooglePlaceProvider } from './providers/GooglePlaceProvider';
import { GeoapifyPlaceProvider } from './providers/GeoapifyPlaceProvider';
import { PlaceProviderEnum } from 'src/DomainLayer/Enums/PlaceProviderEnum';
import { IPlaceProvider } from 'src/DataLayer/Abstracts/Interfaces/IPlaceProvider';

@Injectable()
export class PlaceProviderFactory {
  constructor(
    private readonly google: GooglePlaceProvider,
    private readonly geoapify: GeoapifyPlaceProvider,
  ) {}

  getProvider(name?: PlaceProviderEnum): IPlaceProvider {
    switch (name) {
      case PlaceProviderEnum.GOOGLE:
        return this.google;
      case PlaceProviderEnum.GEOAPIFY:
        return this.geoapify;
      default:
        throw new BadRequestException('Invalid place provider');
    }
  }
}
