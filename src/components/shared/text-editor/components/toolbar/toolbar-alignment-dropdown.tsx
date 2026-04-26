import { cn } from '@/common/utils/cn'
import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { IconProps } from '../../..'
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
	Icon,
	Tooltip
} from '../../..'
import { useEditorContext } from '../../context/editor-context'

type AlignmentOption = {
	icon: IconProps['name']
	value: 'left' | 'right' | 'center' | 'justify'
	label: string
}

export const AlignmentDropdownMenu: React.FC = () => {
	const { editor } = useEditorContext()
	const { t, i18n } = useTranslation()
	const presetAlignments: Array<AlignmentOption> = useMemo(
		() => [
			{
				icon: 'AlignLeft',
				value: 'left',
				label: String(t('ns_common:editor.align_left'))
			},
			{
				icon: 'AlignRight',
				value: 'right',
				label: String(t('ns_common:editor.align_right'))
			},
			{
				icon: 'AlignCenter',
				value: 'center',
				label: String(t('ns_common:editor.align_center'))
			},
			{
				icon: 'AlignJustify',
				value: 'justify',
				label: String(t('ns_common:editor.align_justify'))
			}
		],
		[i18n.language]
	)
	const getCurrentAlignment = useCallback((): Omit<AlignmentOption, 'label'> => {
		switch (true) {
			case editor.isActive({ textAlign: 'left' }):
				return {
					icon: 'AlignLeft',
					value: 'left'
				}
			case editor.isActive({ textAlign: 'right' }):
				return {
					icon: 'AlignRight',
					value: 'right'
				}
			case editor.isActive({ textAlign: 'center' }):
				return {
					icon: 'AlignCenter',
					value: 'center'
				}
			case editor.isActive({ textAlign: 'justify' }):
				return {
					icon: 'AlignJustify',
					value: 'justify'
				}

			default:
				return {
					icon: 'AlignLeft',
					value: 'left'
				}
		}
	}, [
		editor.isActive({ textAlign: 'left' }),
		editor.isActive({ textAlign: 'right' }),
		editor.isActive({ textAlign: 'center' }),
		editor.isActive({ textAlign: 'justify' })
	])

	const [alignmentState, setAlignmentState] = useState<Omit<AlignmentOption, 'label'>>(getCurrentAlignment())

	useLayoutEffect(() => {
		setAlignmentState(getCurrentAlignment())
	}, [])

	editor.on('focus', () => {
		setAlignmentState(getCurrentAlignment())
	})

	return (
		<DropdownMenu>
			<Tooltip message={t('ns_common:editor.alignment')}>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' size='icon' className='aspect-square h-8 w-8' type='button'>
						<Icon name={alignmentState?.icon} />
					</Button>
				</DropdownMenuTrigger>
			</Tooltip>
			<DropdownMenuContent>
				<DropdownMenuRadioGroup
					className='flex list-none !flex-row gap-x-2'
					value={alignmentState?.value}
					onValueChange={(value) => {
						editor.commands.setTextAlign(value)
						setAlignmentState(getCurrentAlignment())
					}}>
					{presetAlignments.map((option) => (
						<Tooltip message={option.label} key={option.value}>
							<DropdownMenuRadioItem
								key={option.value}
								value={option.value}
								className={cn('p-2 hover:bg-accent hover:text-accent-foreground [&>span]:hidden', {
									'bg-secondary': alignmentState?.value === option.value
								})}>
								<Icon name={option.icon} size={16} />
							</DropdownMenuRadioItem>
						</Tooltip>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
