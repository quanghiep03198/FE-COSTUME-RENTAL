import { axiosClient } from '@/configs/axios.config'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

export const updateUserStatusFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number(), is_active: z.boolean() }))
  .handler(async ({ data }) => {
    await axiosClient.patch(`/users/update/${data.id}`, {
      is_active: data.is_active,
      updated_at: new Date(),
    })
    return Response.json({ message: 'User status updated successfully' })
  })
