import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';
import { MarkerAndColor } from '../../interfaces/marker-and-color.interface'
import { MapLocationService } from '../../services/map-location.service';
import { CommonModule } from '@angular/common';
import { MapLocation } from '../../interfaces/map-location.interface';

@Component({
  selector: 'races-race-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './race-page.component.html',
  styleUrl: './race-page.component.scss'
})
export class RacePageComponent {

  private mapLocationService = inject(MapLocationService);

  @ViewChild('map')
  public divMap?: ElementRef;

  public markers: MarkerAndColor [] = [];
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(2.4443313638995505, 41.55070089439985);
  public zoom: number = 10;

  ngAfterViewInit (): void {

    if( !this.divMap ) {
      throw new Error('Map element was not found');
    }

    this.map = new Map({
      accessToken: 'pk.eyJ1IjoiajZhbG9wZXoiLCJhIjoiY2x0cHk0Y2hoMDBjdDJucDVhZHZtdjlkaiJ9.pGR72nD2VdxKD9FY4T89Qg',
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });

    this.mapListeners();

  }

  createMarker() {
    if( ! this.map) return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map.getCenter();

    this.addMarker( lngLat, color );
  }

  addMarker( lngLat : LngLat, color: string) {
    if( !this.map) return;
    const marker = new Marker( {
      color: color,
      draggable: true
    })
    .setLngLat(lngLat)
    .addTo(this.map);

    const location: MapLocation = {
      ...lngLat,
      zoom: this.map.getZoom()
    }

    this.mapLocationService.createLocation(location)
    .subscribe( (location) => {
        this.markers.push( { location, marker, color } );
      }
    );

    marker.on('dragend', () => {
      const markerOnList: MarkerAndColor | undefined = this.markers.find( element => element.marker === marker);
      if( !markerOnList) {
        return;
      }

      const { location: { _id }, marker: currentMarker  } = markerOnList;
      if(!_id) {
        return;
      }

      const { lng , lat } = currentMarker.getLngLat();
      const updateLocation : MapLocation = {
        _id, zoom: this.map!.getZoom(), lng, lat,
      }

      this.mapLocationService.updateLocation(updateLocation).subscribe();
    })
  }

  deleteMarker(index: number) {
    const { location: {_id } } = this.markers[index];
    if( !_id ) return;
    this.mapLocationService.deleteLocation(_id).subscribe(
      () => {
        this.markers[index].marker.remove();
        this.markers.splice( index, 1);
      }
    );
  }

  flyTo( marker: Marker) {
    this.map?.flyTo( {
      zoom: 14,
      center: marker.getLngLat(),
    })
  }

  mapListeners() {
    if( !this.map ) {
      throw 'Map not initialized';
    }

    this.map.on('zoom', (ev) => {
      this.zoom = this.map!.getZoom();
    });

    this.map.on('zoomend', (ev) => {
      if( this.map!.getZoom() < 18) return;
      this.map!.zoomTo(18);
    });

    this.map.on('move', () => {
      this.currentLngLat = this.map!.getCenter();
      const {lng, lat} = this.currentLngLat;
    });

  }

  zoomIn() {
    this.map?.zoomIn();
  }

  zoomOut() {
    this.map?.zoomOut();
  }

  zoomChanged( value: string ) {
    this.zoom = Number(value);
    this.map?.zoomTo( this.zoom );
  }

  ngOnDestroy(): void {
   this.map?.remove();
  }

}
