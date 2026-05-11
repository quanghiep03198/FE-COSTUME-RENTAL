import { COLOR_PALETTE } from '@/common/constants/const'
import { buttonVariants } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import React from 'react'

type CostumeColorPlateProps = {
  value: string
  onValueChange: (color: string) => void
  isInvalid?: boolean
}

const CostumeColorPlate: React.FC<CostumeColorPlateProps> = ({ value, onValueChange, isInvalid }) => {
  return (
    <Popover>
      <PopoverTrigger
        id="color"
        aria-invalid={isInvalid}
        style={{ backgroundColor: value }}
        className={buttonVariants({
          variant: 'outline',
          className: 'aria-invalid:border-destructive ring-1 ring-offset-2 ml-2',
          size: 'icon',
        })}
      />
      <PopoverContent>
        <div className="grid grid-cols-10 gap-2 p-2 transition-allow-discrete animate-in fade-in-0 slide-in-from-right-2">
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              style={{
                border: 'none',
                backgroundColor: color,
                width: 18,
                height: 18,
                aspectRatio: '1 / 1',
                borderRadius: 2,
                ...(value === color && {
                  outlineColor: color,
                  outlineOffset: 2,
                  outlineWidth: 1,
                  outlineStyle: 'solid',
                }),
              }}
              onClick={() => onValueChange(color)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default CostumeColorPlate
