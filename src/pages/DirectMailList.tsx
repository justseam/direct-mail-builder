import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getPaginationRowModel, getFilteredRowModel,
  createColumnHelper, flexRender,
  type SortingState,
} from '@tanstack/react-table';
import { Search, SlidersHorizontal, LayoutGrid, Plus, ArrowUpDown, MoreHorizontal, Pencil, Copy, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Tabs from '../components/ui/Tabs';
import StatusDot from '../components/ui/StatusDot';
import Dialog from '../components/ui/Dialog';
import AudienceListPage from './AudienceList';
import { campaigns as initialCampaigns } from '../data/mockData';
import { formatCurrency } from '../utils';
import type { Campaign } from '../types';

/* ── Row Actions Dropdown ─────────────────────── */
function RowActions({ campaign, onEdit, onClone, onDelete }: {
  campaign: Campaign;
  onEdit: () => void;
  onClone: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const isDraft = campaign.status === 'draft';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
        className="p-1.5 hover:bg-gray-100 rounded cursor-pointer text-text-secondary"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 bg-white rounded-[8px] border border-border shadow-lg py-1 min-w-[160px]">
          {isDraft && (
            <button
              onClick={() => { setOpen(false); onEdit(); }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-body-sm text-text-primary hover:bg-gray-50 cursor-pointer text-left"
            >
              <Pencil className="w-3.5 h-3.5 text-text-secondary" />
              Edit
            </button>
          )}
          <button
            onClick={() => { setOpen(false); onClone(); }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-body-sm text-text-primary hover:bg-gray-50 cursor-pointer text-left"
          >
            <Copy className="w-3.5 h-3.5 text-text-secondary" />
            Clone
          </button>
          <button
            onClick={() => { setOpen(false); onDelete(); }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-body-sm text-red-600 hover:bg-red-50 cursor-pointer text-left"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Column Definitions (actions added dynamically below) ─── */
const columnHelper = createColumnHelper<Campaign>();

const baseColumns = [
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
  const [data, setData] = useState<Campaign[]>(() => [...initialCampaigns]);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);

  const handleEdit = useCallback((campaign: Campaign) => {
    navigate('/campaigns/new', { state: { editId: campaign.id } });
  }, [navigate]);

  const handleClone = useCallback((campaign: Campaign) => {
    const cloned: Campaign = {
      ...campaign,
      id: `${campaign.id}-clone-${Date.now()}`,
      name: `${campaign.name} (Copy)`,
      status: 'draft',
      postageCost: 0,
      printingCost: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setData(prev => [cloned, ...prev]);
  }, []);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    setData(prev => prev.filter(c => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  }, [deleteTarget]);

  const columns = useMemo(() => [
    ...baseColumns,
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <RowActions
          campaign={row.original}
          onEdit={() => handleEdit(row.original)}
          onClone={() => handleClone(row.original)}
          onDelete={() => setDeleteTarget(row.original)}
        />
      ),
      size: 50,
    }),
  ], [handleEdit, handleClone]);

  const table = useReactTable({
    data,
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
          { value: 'audiences', label: 'Audiences' },
        ]}
        value={tab}
        onChange={(v) => {
          setTab(v);
          if (v === 'templates') navigate('/templates');
          else if (v === 'audiences') navigate('/audiences');
          else navigate('/');
        }}
      />

      {tab === 'audiences' ? (
        <div className="mt-6">
          <AudienceListPage />
        </div>
      ) : (
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

      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Campaign"
      >
        <p className="text-body-md text-text-secondary mb-1">
          Are you sure you want to delete <span className="font-medium text-text-primary">{deleteTarget?.name}</span>?
        </p>
        <p className="text-body-sm text-text-secondary mb-6">This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleDelete}
            className="!bg-red-600 hover:!bg-red-700"
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
