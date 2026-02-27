import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, createColumnHelper, flexRender,
  type SortingState,
} from '@tanstack/react-table';
import { Search, SlidersHorizontal, Plus, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { audienceLists } from '../data/mockData';
import { formatNumber } from '../utils';
import type { AudienceList } from '../types';

const columnHelper = createColumnHelper<AudienceList>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: info => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor('audienceCount', {
    header: 'Audience Count',
    cell: info => formatNumber(info.getValue()),
  }),
  columnHelper.accessor('createdOn', {
    header: 'Created On',
    cell: info => new Date(info.getValue()).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    }),
  }),
  columnHelper.accessor('activeCampaigns', {
    header: 'Active Campaigns',
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: () => (
      <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
        <MoreHorizontal className="w-4 h-4 text-text-secondary" />
      </button>
    ),
    size: 40,
  }),
];

export default function AudienceListPage() {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data: audienceLists,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-headline-sm font-bold text-text-primary">Audience Lists</h1>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-[8px] text-text-secondary cursor-pointer">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <Input
            placeholder="Search..."
            icon={<Search className="w-4 h-4" />}
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-56"
          />
          <Button
            variant="accent"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/audiences/upload')}
          >
            Upload New List
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[12px] border border-border overflow-hidden">
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
      </div>
    </div>
  );
}
