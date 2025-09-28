import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiXTrackingSourceHeader() {
  return applyDecorators(
    ApiHeader({
      name: 'x-tracking-source',
      description: 'Source of the tracking',
      required: false,
    }),
  );
}
