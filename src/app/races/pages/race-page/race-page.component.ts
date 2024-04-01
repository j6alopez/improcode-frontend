import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, Signal, ViewChild, computed, inject } from '@angular/core';

import { LngLat, Map, Marker } from 'mapbox-gl';

import { LocationMarker } from '../../interfaces/location-marker.interface'
import { MapLocationService } from '../../services/map-location.service';
import { MapLocation } from '../../interfaces/map-location.interface';

@Component( {
  selector: 'races-race-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './race-page.component.html',
  styleUrl: './race-page.component.scss'
} )
export class RacePageComponent implements OnInit, AfterViewInit {

  private mapLocationService = inject( MapLocationService );
  public mapLocations!: Signal<MapLocation[]>;

  @ViewChild( 'map' )
  public divMap?: ElementRef;

  public markers: LocationMarker[] = [];
  public map?: Map;
  public currentLngLat: LngLat = new LngLat( 2.4443313638995505, 41.55070089439985 );
  public zoom: number = 10;

  ngOnInit(): void {
    this.mapLocations = computed( () => {
      return this.mapLocationService.mapLocations();
    } )
    this.mapLocationService.getLocations().subscribe( locations =>
      locations.forEach( location => {
        this.toMarker( location );
      } ) );
  }

  ngAfterViewInit(): void {

    if ( !this.divMap ) {
      throw new Error( 'Map element was not found' );
    }

    this.map = new Map( {
      accessToken: 'pk.eyJ1IjoiajZhbG9wZXoiLCJhIjoiY2x0cHk0Y2hoMDBjdDJucDVhZHZtdjlkaiJ9.pGR72nD2VdxKD9FY4T89Qg',
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    } );

    this.mapListeners();

  }

  toMarker( location: MapLocation ) {
    if ( !location ) return;
    const color = location.color;
    const lngLat: LngLat = new LngLat( location.lng, location.lat );

    this.addMarker( lngLat, color );
  }

  createMarker() {
    if ( !this.map ) return;
    const color = '#xxxxxx'.replace( /x/g, y => ( Math.random() * 16 | 0 ).toString( 16 ) );
    const lngLat = this.map.getCenter();

    this.addMarker( lngLat, color, true );
  }

  addMarker( lngLat: LngLat, color: string, persistMarker: boolean = false ) {
    if ( !this.map ) return;
    const marker = new Marker( {
      color: color,
      draggable: true
    } )
      .setLngLat( lngLat )
      .addTo( this.map );

    const location: MapLocation = {
      ...lngLat,
      color,
      zoom: this.map.getZoom()
    }

    if ( persistMarker ) {
      this.mapLocationService.createLocation( location )
        .subscribe( ( location ) => {
          this.markers.push( { location, marker } );
        } );
    }

    marker.on( 'dragend', () => {
      const markerOnList: LocationMarker | undefined = this.markers.find( element => element.marker === marker );
      if ( !markerOnList ) {
        return;
      }

      const { location: { _id }, marker: currentMarker } = markerOnList;
      if ( !_id ) {
        return;
      }

      const { lng, lat } = currentMarker.getLngLat();
      const updateLocation: MapLocation = {
        _id, zoom: this.map!.getZoom(), lng, lat, color
      }

      this.mapLocationService.updateLocation( updateLocation ).subscribe();
    } )
  }

  deleteMarker( index: number ) {
    const { location: { _id } } = this.markers[ index ];
    if ( !_id ) return;
    this.mapLocationService.deleteLocation( _id ).subscribe(
      () => {
        this.markers[ index ].marker.remove();
        this.markers.splice( index, 1 );
      }
    );
  }

  flyTo( marker: Marker ) {
    this.map?.flyTo( {
      zoom: 14,
      center: marker.getLngLat(),
    } )
  }

  mapListeners() {
    if ( !this.map ) {
      throw 'Map not initialized';
    }

    this.map.on( 'zoom', ( ev ) => {
      this.zoom = this.map!.getZoom();
    } );

    this.map.on( 'zoomend', ( ev ) => {
      if ( this.map!.getZoom() < 18 ) return;
      this.map!.zoomTo( 18 );
    } );

    this.map.on( 'move', () => {
      this.currentLngLat = this.map!.getCenter();
      const { lng, lat } = this.currentLngLat;
    } );

  }

  zoomIn() {
    this.map?.zoomIn();
  }

  zoomOut() {
    this.map?.zoomOut();
  }

  zoomChanged( value: string ) {
    this.zoom = Number( value );
    this.map?.zoomTo( this.zoom );
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

}
