import { Marker } from "mapbox-gl";
import { MapLocation } from "./map-location.interface";

export interface LocationMarker {
  marker: Marker,
  location: MapLocation
}
