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
/*
      <td>
        <div className="btn-toolbar pull-right">
          <Link to={`/posts/${post.id}`} className="btn btn-primary">Edit</Link>
          <a onClick={onDelete.bind(this, post)} className="btn btn-danger">Delete</a>
        </div>
      </td>
*/
    </tr>
  )
};
