import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, Signal, ViewChild, computed, inject } from '@angular/core';

import { LngLat, Map, Marker } from 'mapbox-gl';

import { LocationMarker } from '../../interfaces/location-marker.interface'
import { MapLocationService } from '../../services/map-location.service';
import { MapLocation } from '../../interfaces/map-location.interface';
import { environment } from '../../../../environments/environment';
import { catchError, filter, of } from 'rxjs';

@Component( {
  selector: 'places-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './places-page.component.html',
  styleUrl: './places-page.component.scss'
} )
export class PlacesPageComponent implements OnInit, AfterViewInit {

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
      accessToken: environment.mapbox_key,
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
    const { _id } = location;
    this.addMarker( lngLat, color, false, _id );
  }

  createMarker() {
    if ( !this.map ) return;
    const color = '#xxxxxx'.replace( /x/g, y => ( Math.random() * 16 | 0 ).toString( 16 ) );
    const lngLat = this.map.getCenter();

    const markerOnList: LocationMarker | undefined = this.markers.find( ( { marker } ) => {
      marker.getLngLat() === lngLat
    } );
    if ( markerOnList ) return;

    this.addMarker( lngLat, color, true );
  }

  addMarker( lngLat: LngLat, color: string, persistMarker: boolean = false, id:string = "" ) {

    if ( !this.map ) return;
    const marker = new Marker( {
      color: color,
      draggable: true
    } )
      .setLngLat( lngLat );

    const location: MapLocation = {
      ...lngLat,
      color,
      zoom: this.map.getZoom(),
    }

    if ( !persistMarker ) {
      location._id = id;
      this.markers.push( { location, marker } );
      marker.on( 'dragend', () => {
        this.handleMarkerDragEnd( marker, color );
      } )
      marker.addTo( this.map! );
      return;
    }

    this.mapLocationService.createLocation( location )
      .pipe(
        catchError( ( error: any ) => {
          return of();
        } ),
        filter( ( location ) => !!location )
      ).subscribe( ( location ) => {
        this.markers.push( { location, marker } );
        marker.addTo( this.map! );
      } );

    marker.on( 'dragend', () => {
      this.handleMarkerDragEnd( marker, color );
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

  private handleMarkerDragEnd( marker: Marker, color: string ): void {
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
