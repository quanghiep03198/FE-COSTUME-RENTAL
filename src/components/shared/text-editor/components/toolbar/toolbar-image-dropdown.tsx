import React, { Fragment, useId, useState } from 'react'
import tw from 'tailwind-styled-components'
import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Form,
	Icon,
	InputFieldControl,
	Label,
	Tooltip
} from '../../..'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { object, url, type infer as Infer } from 'zod'
import { useEditorContext } from '../../context/editor-context'

const uploadSchema = object({
	url: url('Invalid image URL').optional()
})

const ImageDropdown: React.FC = () => {
	const { editor } = useEditorContext()
	const dialogTriggerId = useId()
	const { t } = useTranslation()
	const form = useForm<Infer<typeof uploadSchema>>({
		resolver: zodResolver(uploadSchema)
	})
	const [dialogOpen, setDialogOpen] = useState<boolean>(false)

	return (
		<Fragment>
			<DropdownMenu>
				<Tooltip message='Chèn ảnh'>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon' className='aspect-square h-8 w-8'>
							<Icon name='ImagePlus' />
						</Button>
					</DropdownMenuTrigger>
				</Tooltip>
				<DropdownMenuContent align='end'>
					<DropdownMenuItem asChild>
						<Label
							htmlFor='image-upload'
							className='flex items-center gap-x-2 font-normal'
							onClick={() => {
								editor?.chain().focus().insertImagePlaceholder().run()
							}}>
							<Icon name='Upload' /> {t('ns_common:editor.choose_image_from_device')}
						</Label>
					</DropdownMenuItem>
					<DropdownMenuItem className='gap-x-2' asChild>
						<label htmlFor={dialogTriggerId}>
							<Icon name='Link2' /> {t('ns_common:editor.choose_from_url')}
						</label>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogTrigger id={dialogTriggerId} className='hidden' />
				<DialogContent className='items-stretch'>
					<DialogHeader className='text-left'>{t('ns_common:editor.add_image')}</DialogHeader>
					<Form {...form}>
						<FormDialog
							onSubmit={(e) => {
								e.stopPropagation()
								form.handleSubmit((value) => {
									editor.commands.setImage({ src: value.url, alt: 'Image' })
									form.reset()
									setDialogOpen(false)
								})(e)
							}}>
							<InputFieldControl
								type='url'
								name='url'
								className='w-full'
								placeholder={t('ns_common:form_placeholder.fill', { object: 'URL', defaultValue: null })}
							/>
							<Button type='submit' onClick={(e) => e.stopPropagation()}>
								{t('ns_common:actions.apply')}
							</Button>
						</FormDialog>
					</Form>
				</DialogContent>
			</Dialog>
		</Fragment>
	)
}

const FormDialog = tw.form`flex flex-col items-stretch gap-y-6 w-full`

export default ImageDropdown
