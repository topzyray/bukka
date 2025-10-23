/**
 * Utility class for working with geographic coordinates.
 *
 * This helper provides three key utilities:
 * 1. `coordsDiffer()` — compares two coordinates with a configurable tolerance (epsilon).
 * 2. `haversineDistance()` — calculates real-world distance (in meters) between two points.
 * 3. `isWithinRadius()` — determines whether one coordinate lies within a specified radius of another.
 *
 * Use these in any geospatial features like:
 * - Restaurant or business location deduplication
 * - Nearby search
 * - Movement detection (e.g., checking if a pin moved)
 * - Coordinate comparison with tolerance
 * - Haversine distance calculation
 * - Bearing and destination point
 * - Midpoint computation
 * - Bounding box generator
 * - Unit conversions
 *
 * All coordinates are expressed in **degrees**, and distances in **meters**.
 */

export type LatLng = { lat: number; lng: number };

export class LocationCoordsHelper {
  /** Default tolerance (epsilon) in degrees ≈ 1 meter */
  private static readonly DEFAULT_EPSILON = 1e-5;
  /** Earth's mean radius in meters */
  private static readonly EARTH_RADIUS = 6371000;

  /**
   * Converts degrees to radians.
   */
  static toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Converts radians to degrees.
   */
  static toDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
  }

  /**
   * Checks whether two sets of coordinates differ by more than a given tolerance (epsilon).
   *
   * Useful for ignoring tiny floating-point differences in coordinates that
   * represent the same physical location.
   *
   * @example
   * ```ts
   * const a = { lat: 6.5244, lng: 3.3792 };
   * const b = { lat: 6.52440001, lng: 3.37919999 };
   *
   * LocationCoordsHelper.coordsDiffer(a, b); // false → same location (within tolerance)
   *
   * const c = { lat: 6.5250, lng: 3.3800 };
   * LocationCoordsHelper.coordsDiffer(a, c); // true → different location
   * ```
   *
   * @param a - The first coordinate pair (latitude and longitude).
   * @param b - The second coordinate pair (latitude and longitude).
   * @param eps - The tolerance threshold in degrees (default: `1e-5`, roughly 1 m).
   * @returns `true` if coordinates differ by more than `eps`, otherwise `false`.
   */
  static coordsDiffer(
    a: { lat: number; lng: number },
    b: { lat: number; lng: number },
    eps = 1e-5
  ): boolean {
    return Math.abs(a.lat - b.lat) > eps || Math.abs(a.lng - b.lng) > eps;
  }

  /**
   * Calculates the great-circle distance (in meters) between two points on Earth
   * using the **Haversine formula**.
   *
   * This accounts for Earth's curvature and gives accurate results across latitudes.
   *
   * @example
   * ```ts
   * const distance = LocationCoordsHelper.haversineDistance({
   *   lat1: 6.5244, lon1: 3.3792,
   *   lat2: 6.5250, lon2: 3.3800,
   * });
   *
   * console.log(distance); // ≈ 91 m
   * ```
   *
   * @param coordinates - Object containing the latitude and longitude of both points.
   * @param coordinates.lat1 - Latitude of the first point in degrees.
   * @param coordinates.lon1 - Longitude of the first point in degrees.
   * @param coordinates.lat2 - Latitude of the second point in degrees.
   * @param coordinates.lon2 - Longitude of the second point in degrees.
   * @returns The distance between the two coordinates, in **meters**.
   */
  static haversineDistance(coordinates: {
    lat1: number;
    lon1: number;
    lat2: number;
    lon2: number;
  }): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (coordinates.lat1 * Math.PI) / 180;
    const φ2 = (coordinates.lat2 * Math.PI) / 180;
    const Δφ = ((coordinates.lat2 - coordinates.lat1) * Math.PI) / 180;
    const Δλ = ((coordinates.lon2 - coordinates.lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  /**
   * Determines whether a target coordinate lies within a specified radius (in meters)
   * of a reference coordinate. Uses the Haversine formula internally.
   *
   * This is useful for "nearby" or "within X km" queries in
   * restaurant/business finder systems.
   *
   * @example
   * ```ts
   * const reference = { lat: 6.5244, lng: 3.3792 };
   * const target = { lat: 6.5250, lng: 3.3800 };
   *
   * LocationCoordsHelper.isWithinRadius(reference, target, 100); // true (≈ 91 m away)
   * LocationCoordsHelper.isWithinRadius(reference, target, 50);  // false
   * ```
   *
   * @param center - The central coordinate (reference point).
   * @param target - The coordinate to test.
   * @param radiusMeters - The radius distance in meters.
   * @returns `true` if the target lies within the specified radius, otherwise `false`.
   */
  static isWithinRadius(
    center: { lat: number; lng: number },
    target: { lat: number; lng: number },
    radiusMeters: number
  ): boolean {
    const distance = LocationCoordsHelper.haversineDistance({
      lat1: center.lat,
      lon1: center.lng,
      lat2: target.lat,
      lon2: target.lng,
    });
    return distance <= radiusMeters;
  }
}
