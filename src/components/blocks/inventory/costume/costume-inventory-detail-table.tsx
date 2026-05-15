import type { CostumeSize } from '@/apis/costume/constants'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const CostumeInventoryDetailTable: React.FC<{ data: Array<{ size: CostumeSize; qty: number }> }> = ({ data }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Size</TableHead>
          {data.map((item) => (
            <TableHead key={item.size} className="bg-table-head">
              {item.size}
            </TableHead>
          ))}
          <TableHead>Tổng</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableHead className="border-b-0!">Số lượng</TableHead>
          {data.map((item) => (
            <TableCell align="center" key={item.size}>
              {item.qty}
            </TableCell>
          ))}
          <TableHead className="border-b-0!">{data.reduce((acc, curr) => acc + curr.qty, 0)}</TableHead>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default CostumeInventoryDetailTable
