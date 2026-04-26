import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import { Tooltip } from '@/components/shared/tooltip'
import { useEditorContext } from '../../context/editor-context'
import { AlignmentDropdownMenu } from './toolbar-alignment-dropdown'
import ToolbarColorPicker from './toolbar-color-picker'
import FontSizeInput from './toolbar-font-size-input'
import ImageDropdown from './toolbar-image-dropdown'
import { LinkPopover } from './toolbar-link-popover'
import { SearchAndReplaceToolbar } from './toolbar-search-replace'
import { StyleDropdownMenu } from './toolbar-style-dropdown'
import TableDropdownMenu from './toolbar-table-dropdown'

const Toolbar: React.FC = () => {
  const { editor } = useEditorContext()

  return (
    <nav>
      <div className="flex h-full items-center gap-x-1 overflow-y-hidden p-1.5">
        <SearchAndReplaceToolbar />

        <Separator orientation="vertical" className="mx-3 h-6 w-0.5 min-w-0.5 basis-0.5" />

        {/* Undo */}
        <Tooltip message="Hoàn tác">
          <Button
            className="aspect-square size-8"
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Icon name="Undo2" />
          </Button>
        </Tooltip>
        {/* Redo */}
        <Tooltip message="Trở lại">
          <Button
            className="aspect-square size-8"
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Icon name="Redo2" />
          </Button>
        </Tooltip>

        <Separator orientation="vertical" className="mx-3 h-6 w-0.5 min-w-0.5 basis-0.5" />

        {/* Change style */}
        <StyleDropdownMenu />

        {/* Change font size */}
        <Tooltip message="Kích thước chữ">
          <FontSizeInput />
        </Tooltip>

        <Separator orientation="vertical" className="mx-3 h-6 w-0.5 min-w-0.5 basis-0.5" />

        <AlignmentDropdownMenu />

        {/* Toggle bold */}
        <Tooltip message="In đậm">
          <Button
            variant="ghost"
            type="button"
            size="icon"
            className={cn('aspect-square size-8', editor.isActive('bold') && 'bg-accent text-accent-foreground')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Icon name="Bold" />
          </Button>
        </Tooltip>

        {/* Toggle italic */}
        <Tooltip message="In nghiêng">
          <Button
            variant="ghost"
            type="button"
            size="icon"
            className={cn('aspect-square size-8', {
              'bg-accent text-accent-foreground': editor.isActive('italic'),
            })}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Icon name="Italic" />
          </Button>
        </Tooltip>

        {/* Toggle quote */}
        <Tooltip message="Blockquote">
          <Button
            variant="ghost"
            type="button"
            size="icon"
            className={cn('aspect-square size-8', {
              'bg-accent text-accent-foreground': editor.isActive('blockquote'),
            })}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Icon name="Quote" size={14} />
          </Button>
        </Tooltip>

        {/* Toggle underline */}
        <Tooltip message="Gạch chân">
          <Button
            variant="ghost"
            type="button"
            size="icon"
            className={cn('aspect-square size-8', {
              'bg-accent text-accent-foreground': editor.isActive('underline'),
            })}
            onClick={() => editor.commands.toggleUnderline()}
          >
            <Icon name="Underline" />
          </Button>
        </Tooltip>

        {/* Toggle underline */}
        <Tooltip message="Đoạn mã">
          <Button
            variant="ghost"
            type="button"
            size="icon"
            className={cn('aspect-square size-8', {
              'bg-accent text-accent-foreground': editor.isActive('underline'),
            })}
            onClick={() => editor.commands.toggleCodeBlock()}
          >
            <Icon name="Code" />
          </Button>
        </Tooltip>

        {/* Toggle strike linethough */}
        <Tooltip message="Gạch ngang">
          <Button
            variant="ghost"
            type="button"
            size="icon"
            className={cn('aspect-square size-8', {
              'bg-accent text-accent-foreground': editor.isActive('strike'),
            })}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Icon name="Strikethrough" className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Separator orientation="vertical" className="mx-3 h-6 w-0.5 min-w-0.5 basis-0.5" />

        {/* Text color and highlight */}
        <ToolbarColorPicker label="Màu chữ" icon="Baseline" type="textStyle" />
        <ToolbarColorPicker label="Highlight" icon="Highlighter" type="highlight" />

        <Separator orientation="vertical" className="mx-3 h-6 w-0.5 min-w-0.5 basis-0.5" />

        {/* Toggle ordered list */}
        <Tooltip message="Danh sách có thứ tự">
          <Button
            variant="ghost"
            type="button"
            size="icon"
            className={cn('aspect-square size-8', {
              'bg-accent text-accent-foreground': editor.isActive('orderedList'),
            })}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <Icon name="ListOrdered" size={20} />
          </Button>
        </Tooltip>

        {/* Toggle bullet list */}
        <Tooltip message="Danh sách không thứ tự">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className={cn('aspect-square size-8', {
              'bg-accent text-accent-foreground': editor.isActive('bulletList'),
            })}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <Icon name="List" size={18} />
          </Button>
        </Tooltip>
        {/* Toggle task list */}
        <Tooltip message="Danh sách công việc">
          <Button
            variant="ghost"
            type="button"
            size="icon"
            className={cn('aspect-square size-8', {
              'bg-accent text-accent-foreground': editor.isActive('taskList'),
            })}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <Icon name="ListTodo" size={18} />
          </Button>
        </Tooltip>

        {/* Horizontal ruler */}
        <Tooltip message="Chèn đường kẻ ngang">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="aspect-square size-8"
            onClick={() => editor.commands.setHorizontalRule()}
          >
            <Icon name="PencilLine" />
          </Button>
        </Tooltip>
        <LinkPopover />
        <ImageDropdown />
        <TableDropdownMenu />
      </div>
    </nav>
  )
}

export default Toolbar
