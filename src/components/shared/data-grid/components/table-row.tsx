import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { flexRender, type Row } from '@tanstack/react-table'
import { useMemoizedFn } from 'ahooks'
import { Fragment, memo } from 'react'
import { useTableContext } from '../context/table.context'
import { getStickyOffsetPosition } from '../utils/table.util'
import { type TableBodyProps } from './table-body'

type VirtualTableRowProps = Pick<TableBodyProps, 'renderSubComponent'> & {
  isScrolling?: boolean
  row: Row<any>
  index: number
}

const VirtualTableRow: React.FC<VirtualTableRowProps> = ({
  row,
  isScrolling,
  index,
  renderSubComponent,
}) => {
  const { table } = useTableContext('table')
  const computeStickyOffsetPosition = useMemoizedFn(getStickyOffsetPosition)

  const isSelected = row.getIsSelected()
  const isExpanded = row.getIsExpanded()

  return (
    <Fragment>
      <TableRow
        data-index={index}
        data-role="data-grid-row"
        aria-selected={isSelected}
        aria-expanded={isExpanded}
        className={cn(
          'group h-(--row-height,40px)',
          isScrolling && 'will-change-scroll'
        )}
      >
        {row.getVisibleCells().map((cell) => {
          return (
            <TableCell
              key={cell.id}
              data-role="data-grid-cell"
              className="has-[input]:p-0"
              align={cell.column.columnDef.meta?.align}
              style={{
                width: `var(--column-${cell.column.id}-size)`,
                ...computeStickyOffsetPosition(cell.column),
              }}
              {...cell.column.columnDef?.meta?.tableCellProps}
            >
              <div
                {...({
                  align: cell.column.columnDef.meta?.align,
                } as React.ComponentProps<'div'>)}
                className="line-clamp-1"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            </TableCell>
          )
        })}
      </TableRow>
      {/* Sub-component */}
      {typeof renderSubComponent === 'function' && (
        <TableRow data-role="expandable-row" className="w-full">
          <TableCell
            colSpan={row.getVisibleCells().length}
            aria-expanded={isExpanded}
            className="border-none p-0 aria-expanded:border-b aria-expanded:shadow-[inset_0_0px_4px_#17171725]"
          >
            <Collapsible open={isExpanded}>
              <CollapsibleContent className="group/detail bg-secondary/50 sticky left-0 w-[100cqw] overflow-auto [scrollbar-gutter:stable]">
                <div className="p-3">{renderSubComponent({ table, row })}</div>
              </CollapsibleContent>
            </Collapsible>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  )
}

const VirtualPlaceholderRow: React.FC<React.ComponentProps<'td'>> = memo(
  (props) => {
    return (
      <tr role="placeholder-row" style={props.style}>
        <td colSpan={props.colSpan} />
      </tr>
    )
  }
)

VirtualPlaceholderRow.displayName = 'VirtualPlaceholderRow'

const MemoizedVirtualTableRow = memo(
  VirtualTableRow,
  (_, nextProps) => nextProps.isScrolling
)

export { MemoizedVirtualTableRow, VirtualPlaceholderRow }
