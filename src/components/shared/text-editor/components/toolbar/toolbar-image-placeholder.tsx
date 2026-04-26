import { cn } from '@/common/utils/cn'
import { Button, Icon, Tooltip, type ButtonProps } from '@/components/ui'
import '@/components/ui/@tiptap/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useEditorContext } from '../../context/editor-context'

const ImagePlaceholderToolbar: React.FC<ButtonProps> = ({ className, onClick, children, ...props }) => {
	const { editor } = useEditorContext()
	const { t } = useTranslation()

	return (
		<Tooltip message={t('ns_common:editor.image')} triggerProps={{ asChild: true }}>
			<Button
				variant='ghost'
				size='icon'
				type='button'
				className={cn('aspect-square size-8 p-0', editor?.isActive('image-placeholder') && 'bg-accent', className)}
				onClick={(e) => {
					e.preventDefault()
					editor?.chain().focus().insertImagePlaceholder().run()
					onClick?.(e)
				}}
				{...props}>
				{children ?? <Icon name='Image' className='h-4 w-4' />}
			</Button>
		</Tooltip>
	)
}

ImagePlaceholderToolbar.displayName = 'ImagePlaceholderToolbar'

export { ImagePlaceholderToolbar }
