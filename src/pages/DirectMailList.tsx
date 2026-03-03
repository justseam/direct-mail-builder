import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getPaginationRowModel, getFilteredRowModel,
  createColumnHelper, flexRender,
  type SortingState,
} from '@tanstack/react-table';
import { Search, Plus, ArrowUpDown, MoreHorizontal, Pencil, Copy, Archive } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Tabs from '../components/ui/Tabs';
import StatusDot from '../components/ui/StatusDot';
import Dialog from '../components/ui/Dialog';
import AudienceListPage from './AudienceList';
import { useCampaign } from '../stores/CampaignStore';
import { formatCurrency } from '../utils';
import type { Campaign } from '../types';

/* ── Row Actions Dropdown ─────────────────────── */
function RowActions({ campaign, onEdit, onClone, onArchive }: {
  campaign: Campaign;
  onEdit: () => void;
  onClone: () => void;
  onArchive: () => void;
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
            onClick={() => { setOpen(false); onArchive(); }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-body-sm text-text-primary hover:bg-gray-50 cursor-pointer text-left"
          >
            <Archive className="w-3.5 h-3.5 text-text-secondary" />
            Archive
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
  const { campaignList } = useCampaign();
  const [tab, setTab] = useState(initialTab);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Campaign[]>(() => [...campaignList]);
  const [archiveTarget, setArchiveTarget] = useState<Campaign | null>(null);

  // Sync data when campaignList changes (e.g. after launching a campaign)
  useEffect(() => {
    setData([...campaignList]);
  }, [campaignList]);

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

  const handleArchive = useCallback((target?: Campaign) => {
    const t = target || archiveTarget;
    if (!t) return;
    setData(prev => prev.map(c => c.id === t.id ? { ...c, status: 'inactive' as const } : c));
    setArchiveTarget(null);
  }, [archiveTarget]);

  const handleBulkArchive = useCallback(() => {
    const selectedIds = Object.keys(rowSelection).map(idx => data[+idx]?.id).filter(Boolean);
    setData(prev => prev.map(c => selectedIds.includes(c.id) ? { ...c, status: 'inactive' as const } : c));
    setRowSelection({});
  }, [rowSelection, data]);

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
          onArchive={() => setArchiveTarget(row.original)}
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
          { value: 'audiences', label: 'Audiences' },
        ]}
        value={tab}
        onChange={(v) => {
          setTab(v);
          if (v === 'audiences') navigate('/audiences');
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

        {/* Bulk action bar */}
        {Object.keys(rowSelection).length > 0 && (
          <div className="flex items-center gap-3 mb-3 p-3 bg-primary/5 border border-primary/20 rounded-[12px]">
            <span className="text-body-sm font-medium text-text-primary">
              {Object.keys(rowSelection).length} selected
            </span>
            <Button
              variant="secondary"
              size="sm"
              icon={<Archive className="w-3.5 h-3.5" />}
              onClick={handleBulkArchive}
            >
              Archive
            </Button>
          </div>
        )}

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

      {/* Archive confirmation dialog */}
      <Dialog
        open={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        title="Archive Campaign"
      >
        <p className="text-body-md text-text-secondary mb-1">
          Are you sure you want to archive <span className="font-medium text-text-primary">{archiveTarget?.name}</span>?
        </p>
        <p className="text-body-sm text-text-secondary mb-6">The campaign will be moved to inactive status.</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setArchiveTarget(null)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => handleArchive()}
          >
            Archive
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
