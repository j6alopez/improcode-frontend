import { Observable } from "rxjs";

export interface Modal<T, V> {
  openDialog ( element?: T ): void;
  closeDialog (): Observable<V>;
}
