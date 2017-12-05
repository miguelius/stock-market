import React from 'react';
import { StockListRow } from './StockListRow';

export const StockList = ({stocks, onDelete}) => {
  return (
    <table className="table table-hover">
      <thead>
      <tr>
        <th>Stock Symbol</th>
        <th>Type</th>
        <th>Last Dividend</th>
        <th>Fixed Dividend</th>
        <th>Par Value</th>
        <th>Price*</th>
      </tr>
      </thead>
      <tbody>
      {stocks.map(stock => StockListRow({stock, onDelete}))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={6} ><i>* Price column is computed as the Volume Weight Price of the last 5 minutes trades.</i></td>
        </tr>
      </tfoot>
    </table>
  )
};
