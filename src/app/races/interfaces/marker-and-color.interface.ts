import { Marker } from "mapbox-gl";
import { MapLocation } from "./map-location.interface";

export interface MarkerAndColor {
  marker: Marker,
  color: string,
  location: MapLocation
}
