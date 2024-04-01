import { Injectable, Signal, inject, signal } from '@angular/core';
import { FinancialTransaction } from './interfaces/financial-transaction.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { CalendarEvent as FinantialTransaction } from '../shared/events/calendar.event.interface';

@Injectable( {
  providedIn: 'root'
} )
export class FinancialTransactionsService {

  private http = inject( HttpClient );
  private baseUrl = environment.backend_base_url;
  private transactionsSignal = signal<FinancialTransaction[]>( [] );

  constructor() {
    this.ngOnInit();
  }

  get financialTransactions(): Signal<FinancialTransaction[]> {
    return this.transactionsSignal.asReadonly();
  }


  getTransactions(): Observable<FinancialTransaction[]> {
    const url = `${ this.baseUrl }/financial-transactions`;
    return this.http.get<FinancialTransaction[]>( url );
  }

  getTransaction( id: string ): Observable<FinancialTransaction> {
    const url = `${ this.baseUrl }/financial-transactions/${ id }`
    return this.http.get<FinancialTransaction>( url );
  }

  createTransaction( transaction: FinantialTransaction ): Observable<FinancialTransaction> {
    const url = `${ this.baseUrl }/financial-transactions`
    return this.http.post<FinancialTransaction>( url, transaction )
      .pipe(
        tap( newTransaction => {
          this.transactionsSignal.update( financialTransactions => [ ...financialTransactions, newTransaction ] );
        } )
      );
  }

  updateTransaction( transaction: FinantialTransaction ): Observable<FinancialTransaction> {
    const { _id, ...updateTransaction } = transaction;
    const url = `${ this.baseUrl }/financial-transactions/${ _id }`
    return this.http.patch<FinancialTransaction>( url, updateTransaction ).pipe(
      tap( updatedTransaction => {
        this.transactionsSignal.update( transactions =>
          transactions.map( element =>
            element._id === updatedTransaction._id ? updatedTransaction : element )
        );
      } )
    );
  }

  deleteTransaction( id: string ): Observable<FinancialTransaction> {
    const url = `${ this.baseUrl }/financial-transactions/${ id }`
    return this.http.delete<FinancialTransaction>( url ).pipe(
      tap( () => {
        this.transactionsSignal.update( transactions =>
          transactions.filter( element => element._id !== id ) );
      } )
    );
  }

  ngOnInit(): void {
    this.getTransactions()
      .subscribe( transactions => {
        this.transactionsSignal.set( transactions );
      } );
  }
}
