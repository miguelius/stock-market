import React from 'react';
import { Link } from 'react-router';

export const StockListRow = ({stock, onDelete}) => {
  return (
    <tr key={stock.symbol}>
      <td>{stock.symbol}</td>
      <td>{stock.type}</td>
      <td>{stock.lastDividend}</td>
      <td>{stock.fixedDividend}</td>
      <td>{stock.parValue}</td>
      <td>{stock.price}</td>
    </tr>
  )
};
