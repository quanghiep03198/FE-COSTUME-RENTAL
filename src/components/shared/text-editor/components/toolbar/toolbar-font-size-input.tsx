import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useDebounce } from 'ahooks'
import React, { useEffect, useState } from 'react'
import { useEditorContext } from '../../context/editor-context'

const FONT_SIZE_MIN = 14
const FONT_SIZE_DEFAULT = 16
const FONT_SIZE_MAX = 96

const extractFontSizeValue = (attributes: Record<string, any>) => {
  const fontSize = attributes?.fontSize
  if (!fontSize) return FONT_SIZE_DEFAULT
  return Number(fontSize.replace('px', ''))
}

const FontSizeInput: React.FC = () => {
  const { editor } = useEditorContext()
  const [fontSize, setFontSize] = useState<number>(extractFontSizeValue(editor.getAttributes('textStyle')))
  const debouncedFontSize = useDebounce(fontSize, { wait: 500 })

  const handleChangeFontSize = (step: number) => {
    if (fontSize + step < FONT_SIZE_MIN) {
      setFontSize(FONT_SIZE_MIN)
    } else if (fontSize + step > FONT_SIZE_MAX) {
      setFontSize(FONT_SIZE_MAX)
    } else {
      setFontSize((prev) => prev + step)
    }
  }

  useEffect(() => {
    setFontSize(debouncedFontSize)
    switch (true) {
      case debouncedFontSize < FONT_SIZE_MIN:
        setFontSize(FONT_SIZE_MIN)
        break
      case debouncedFontSize > FONT_SIZE_MAX:
        setFontSize(FONT_SIZE_MAX)
        break
      default:
        setFontSize(debouncedFontSize)
        break
    }
  }, [debouncedFontSize])

  useEffect(() => {
    editor.commands.setFontSize(fontSize.toString())
  }, [fontSize])

  editor.on('focus', () => {
    setFontSize(extractFontSizeValue(editor.getAttributes('textStyle')))
  })

  return (
    <div className="flex h-8 items-stretch overflow-hidden rounded-md border *:rounded-none [&>*]:p-0 [&_button]:aspect-square [&_button]:!size-8 [&_button]:place-content-center">
      <Button
        type="button"
        variant="ghost"
        onClick={() => handleChangeFontSize(-1)}
        disabled={fontSize <= FONT_SIZE_MIN}
      >
        <Icon name="Minus" size={14} />
      </Button>
      <Separator orientation="vertical" className="h-8 w-px" />
      <Input
        type="number"
        className="focus:boder-none h-full w-12 rounded-none border-0 text-center outline-none focus-within:ring-0 focus-within:ring-offset-0"
        min={FONT_SIZE_MIN}
        max={FONT_SIZE_MAX}
        value={fontSize}
        onChange={(e) => setFontSize(+e.target.value)}
      />
      <Separator orientation="vertical" className="h-8 w-px" />
      <Button type="button" size="icon" variant="ghost" onClick={() => handleChangeFontSize(1)}>
        <Icon name="Plus" size={14} />
      </Button>
    </div>
  )
}

export default FontSizeInput
