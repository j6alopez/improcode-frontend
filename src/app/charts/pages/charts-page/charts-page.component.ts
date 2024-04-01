import { AfterContentInit, AfterViewInit, Component, OnInit, Signal, computed, effect, inject } from '@angular/core';
import { FinancialTransactionsService } from '../../../financial-transactions/financial-transactions.service';
import { FinancialTransaction } from '../../../financial-transactions/interfaces/financial-transaction.interface';
import { Chart, registerables } from 'chart.js';
import { TransactionType } from '../../../financial-transactions/interfaces/transaction-type.enum';
import { ChartUtils } from '../../utils/chart.utils';
import { CommonModule } from '@angular/common';

Chart.register( ...registerables );

@Component( {
  selector: 'app-charts-page',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './charts-page.component.html',
  styleUrl: './charts-page.component.scss'
} )


export class ChartsPageComponent {

  private transactionsService = inject( FinancialTransactionsService );
  public transactions!: Signal<FinancialTransaction[]>;

  private transactionsLoadedEffect = effect( () => {
    if ( this.transactions().length === 0 ) return;
    this.renderBarChart();
    this.renderLineChart();
  } );

  ngOnInit(): void {
    this.transactions = computed( () => {
      return this.transactionsService.financialTransactions();
    } )
  }

  renderBarChart() {
    const ctx = document.getElementById( 'transactions-bar-chart' ) as HTMLCanvasElement;
    const incomeTransactions: FinancialTransaction[] = [ ...this.transactions() ].map( t => {
      if ( t.type === TransactionType.EXPENSE ) {
        return { ...t, amount: 0 };
      }
      return t;
    } );
    const outocomeTransactions: FinancialTransaction[] = [ ...this.transactions() ].map( t => {
      if ( t.type === TransactionType.INCOME ) {
        return { ...t, amount: 0 };
      }
      return t;
    } );

    const incomeColor = ChartUtils.transparentize( 'blue', 0.5 );
    const expenseColor = ChartUtils.transparentize( 'red', 0.5 );
    new Chart( ctx, {
      type: 'bar',
      data: {
        labels: this.transactions().map( ( { date } ) => date ),
        datasets: [
          {
            label: 'Income',
            data: [ ...incomeTransactions ].map( ( { amount } ) => amount ),
            backgroundColor: incomeTransactions.map( () => incomeColor ),
            borderWidth: 1,
            stack: 'one'
          },
          {
            label: 'Expense',
            data: [ ...outocomeTransactions ].map( ( { amount } ) => -amount ),
            backgroundColor: outocomeTransactions.map( () => expenseColor ),
            borderWidth: 1,
            stack: 'one'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
        },
      }
    } );
  }

  renderLineChart() {
    const ctx = document.getElementById( 'transactions-line-chart' ) as HTMLCanvasElement;
    const incomeColor = ChartUtils.transparentize( 'blue', 0.5 );
    const expenseColor = ChartUtils.transparentize( 'red', 0.5 );

    new Chart( ctx, {
      type: 'line',
      data: {
        labels: this.transactions().map( t => t.date ),
        datasets: [ {
          label: 'Amount',
          data: this.transactions().map( t => t.amount ),
          borderColor: this.transactions().map( ( { type } ) => type === TransactionType.INCOME ? incomeColor : expenseColor ),
          backgroundColor: 'transparent',
          borderWidth: 2,
          // pointBackgroundColor: this.salesData.map( sale => sale.colorcode ),
          // pointBorderColor: this.salesData.map( sale => sale.colorcode ),
          // pointHoverBackgroundColor: this.salesData.map( sale => sale.colorcode ),
          // pointHoverBorderColor: '#fff',
          // pointRadius: 4,
          // pointHoverRadius: 6,
          // pointHitRadius: 10,
          // pointBorderWidth: 2,
        } ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    } );
  }

}

