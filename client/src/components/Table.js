import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import moment from 'moment';

const flatten = (obj) => {
  const flatten = (o, prefix='') => Object.entries(o).flatMap(([k,v])=>v instanceof Object ? flatten(v, `${prefix}${k}_`) : [[`${prefix}${k}`,v]])
  const findFork = o => Array.isArray(o) ? o.length : o instanceof Object && Object.values(o).map(findFork).find(i=>i)
  const getFork = (o,i,h={s:0}) => o instanceof Object ? (Array.isArray(o) ? h.s ? o : (h.s=1) && o[i] : Object.fromEntries(Object.entries(o).map(([k,v])=>[k, getFork(v, i, h)]))) : o
  const recurse = (o,n) => (n = findFork(o)) ? Array(n).fill(0).map((_,i)=>getFork(o, i)).flatMap(recurse) : o
  const process = o => recurse(o).map(i=>Object.fromEntries(flatten(i)))

  const result = process(obj)

  result.forEach(item => {
    const months = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12'
    };

  const parts = item.time.split(/[/:]/);
  const month = months[parts[1]];
  const formattedDate = `${parts[2]}-${month}-${parts[0]}T${parts[3]}:${parts[4]}:${parts[5]}Z`;
  item.time = formattedDate;
  });

  return result
}


const Table = () => {
  const [ data, setData ] = useState([]);

  function uploadFile(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      // The file's text will be printed here
      try{
      setData(flatten(JSON.parse(e.target.result)))
      } catch(e){
        console.log(e)
      }
    };
    try{
    reader.readAsText(file);
    }
    catch(e){
      console.log(e)
    }
  }

  const columns = useMemo(
    () => [

      {
        accessorKey: 'time',
        header: 'Time',
      },

      // {
      //   // 06/Mar/2024:00:02:46 +0300
      //   accessorFn: (row) => { return new Date(Date.parse(row.time)) } , //convert to Date for sorting and filtering
      //   id: 'time',
      //   header: 'Time',
      //   filterVariant: 'date',
      //   filterFn: 'lessThan',
      //   sortingFn: 'datetime',
      //   Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
      //   Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
      //   muiFilterTextFieldProps: {
      //     sx: {
      //       minWidth: '250px',
      //     },
      //   },
      // },
      {
        accessorKey: 'totalRequests',
        header: 'Total Requests',
      },
      {
        accessorKey: 'requests_ip',
        header: 'Ip',
      },
      {
        accessorKey: 'requests_totalIPRequests',
        header: 'Total IP Requests',
      },
      {
        accessorKey: 'requests_ipRequests_httpMethod',
        header: 'Http Method',
      },
      {
        accessorKey: 'requests_ipRequests_url',
        header: 'Url',
      },
      {
        accessorKey: 'requests_ipRequests_protocol',
        header: 'Protocol',
      },
      {
        accessorKey: 'requests_ipRequests_statusCode',
        header: 'Status Code',
      },
      {
        accessorKey: 'requests_ipRequests_userAgent',
        header: 'User Agent',
      }
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        right: ['mrt-row-actions'],
      },
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    muiSearchTextFieldProps: {
      size: 'small',
      variant: 'outlined',
    }
  });

  return <span>
            <input type="file"
            name="myFile"
            onChange={uploadFile} />
            <MaterialReactTable table={table} />
        </span>;
};

export default Table;