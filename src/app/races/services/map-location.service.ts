import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MapLocation } from '../interfaces/map-location.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapLocationService implements OnInit {

  private http = inject(HttpClient);
  private baseUrl = environment.backend_base_url;
  private locationsSignal = signal<MapLocation[]>([]);

  constructor() {
    this.ngOnInit();
  }

  getLocations(): Observable<MapLocation[]> {
    const url = `${this.baseUrl}/map-locations`
    return this.http.get<MapLocation[]>(url);
  }

  createLocation(location: MapLocation): Observable<MapLocation> {
    const url = `${this.baseUrl}/map-locations`
    return this.http.post<MapLocation>(url, location)
    .pipe(
      tap( participant => {
          this.locationsSignal.update(locations => [...locations, location]);
        }
      )
    );
  }

  updateLocation(location: MapLocation): Observable<MapLocation> {
    const { _id, ...updateLocation } = location;
    console.log(location)
    const url = `${this.baseUrl}/map-locations/${_id}`
    return this.http.patch<MapLocation>(url, updateLocation).pipe(
      tap(participant => {
        this.locationsSignal.update(locations =>
          locations.map(element =>
            element._id === location._id ? location : element)
        );
      }),
    );
  }

  deleteLocation(id: string): Observable<MapLocation> {
    const url = `${this.baseUrl}/map-locations/${id}`
    return this.http.delete<MapLocation>(url)
      .pipe(
        tap( () => {
          this.locationsSignal.update( locations =>
            locations.filter(element => element._id !== id ));
        })
      )
    ;
  }

  ngOnInit(): void {
    this.getLocations()
      .subscribe(locations => {
        this.locationsSignal.set(locations);
      })
  }
}
