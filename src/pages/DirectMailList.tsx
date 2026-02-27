import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getPaginationRowModel, getFilteredRowModel,
  createColumnHelper, flexRender,
  type SortingState,
} from '@tanstack/react-table';
import { Search, SlidersHorizontal, LayoutGrid, Plus, ArrowUpDown } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Tabs from '../components/ui/Tabs';
import StatusDot from '../components/ui/StatusDot';
import { campaigns } from '../data/mockData';
import { formatCurrency } from '../utils';
import type { Campaign } from '../types';

const columnHelper = createColumnHelper<Campaign>();

const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        className="accent-primary"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        className="accent-primary"
      />
    ),
    size: 40,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: info => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => <StatusDot status={info.getValue()} />,
  }),
  columnHelper.accessor('postageType', {
    header: 'Postage Type',
  }),
  columnHelper.accessor('audience', {
    header: 'Audience',
  }),
  columnHelper.accessor('postageCost', {
    header: 'Postage Cost',
    cell: info => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor('printingCost', {
    header: 'Printing Cost',
    cell: info => formatCurrency(info.getValue()),
  }),
];

export default function DirectMailList({ initialTab = 'direct-mail' }: { initialTab?: string }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(initialTab);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: campaigns,
    columns,
    state: { sorting, globalFilter, rowSelection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  const pageInfo = useMemo(() => {
    const { pageIndex, pageSize } = table.getState().pagination;
    const total = table.getFilteredRowModel().rows.length;
    const start = pageIndex * pageSize + 1;
    const end = Math.min(start + pageSize - 1, total);
    return `${start}-${end} of ${total}`;
  }, [table.getState().pagination, table.getFilteredRowModel().rows.length]);

  return (
    <div>
      <Tabs
        tabs={[
          { value: 'direct-mail', label: 'Direct Mail' },
          { value: 'templates', label: 'Mail Templates' },
        ]}
        value={tab}
        onChange={(v) => {
          setTab(v);
          if (v === 'templates') navigate('/templates');
          else navigate('/');
        }}
      />

      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h1 className="text-headline-sm font-bold text-text-primary">
            {tab === 'direct-mail' ? 'Direct Mail' : 'Mail Templates'}
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button className="p-2 hover:bg-gray-100 rounded-[8px] text-text-secondary cursor-pointer hidden sm:block">
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-[8px] text-text-secondary cursor-pointer hidden sm:block">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <Input
              placeholder="Search..."
              icon={<Search className="w-4 h-4" />}
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              className="w-40 sm:w-56"
            />
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/campaigns/new')}
            >
              New Direct Mail
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-[12px] border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id} className="border-b border-border">
                  {hg.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-label-md font-semibold text-table-header uppercase tracking-wider"
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={header.column.getCanSort() ? 'flex items-center gap-1 cursor-pointer select-none' : ''}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <ArrowUpDown className="w-3.5 h-3.5 text-text-secondary" />
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-border last:border-b-0 hover:bg-gray-50/60 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 text-body-md">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-body-sm text-text-secondary">{pageInfo}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
