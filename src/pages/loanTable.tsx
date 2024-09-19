import React from 'react';
import { useTable, Column, TableInstance } from 'react-table';  
import { Loan } from '../type/loan';
import { useNavigate } from 'react-router-dom';

interface LoanTableProps {
  data: Loan[];
}

const LoanTable: React.FC<LoanTableProps> = ({ data }) => {
  const navigate = useNavigate(); 
  const handleRowClick = (id: string) => {
    const formattedId = id.replace(/\s+/g, '_');  
    navigate(`/personal-loan/${formattedId}`);
  };
  

  const columns: Column<Loan>[] = React.useMemo(
    () => [
      { 
        Header: 'Name', 
        accessor: 'name',
        Cell: ({ value }) => (
          <p 
            onClick={() => handleRowClick(value as string)} 
            style={{ cursor: 'pointer', color:'blue', textDecoration:'underLine' }}  
          >
            {value}
          </p>
        )
      },
      { 
        Header: 'Loan Financing Amount', 
        accessor: 'loan_financing_amount' 
      },
      { 
        Header: 'Loan Financing Period', 
        accessor: 'loan_financing_period' 
      },
      { 
        Header: 'Income Requirement', 
        accessor: 'your_income' 
      }, 
      { 
        Header: 'Can Government GLC Apply', 
        accessor: 'can_government_glc_apply' 
      }, 
      { 
        Header: 'Bank', 
        accessor: 'bank' 
      },
    ],
    []  
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow }: TableInstance<Loan> = useTable({ columns, data });

  return (
    <table {...getTableProps()} className='table-container'>
      <thead>
        {headerGroups.map((headerGroup, index) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={index}>
            {headerGroup.headers.map((column, index) => (
              <th {...column.getHeaderProps()} key={index}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()} key={cell.column.id}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default LoanTable;
