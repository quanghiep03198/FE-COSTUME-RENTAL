import { loginRpc } from '@/apis/auth/rpc'
import { loginSchema } from '@/apis/auth/schemas/login.schema'
import InputFieldControl from '@/components/forms/input-field-control'
import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'

import { LogIn } from 'lucide-react'
import { useState, type SubmitEventHandler } from 'react'
import { toast } from 'sonner'

const LoginForm = () => {
  const [isPending, setIsPending] = useState(false)
  const loginFn = useServerFn(loginRpc)
  const router = useRouter()

  const { Field: FormField, handleSubmit } = useForm({
    defaultValues: { username: '', password: '' },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      try {
        await loginFn({ data: value })
        toast.success('Đăng nhập thành công')
        router.navigate({ to: '/statistics' })
      } catch {
        toast.error('Tài khoản hoặc mật khẩu không chính xác')
      } finally {
        setIsPending(false)
      }
    },
  })

  const onSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    handleSubmit()
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormField name="username">
        {(field) => {
          return <InputFieldControl field={field} type="text" placeholder="example@gmail.com" />
        }}
      </FormField>
      <FormField name="password">
        {(field) => {
          return <InputFieldControl field={field} type="password" placeholder="******" />
        }}
      </FormField>
      <Button className="w-full" type="submit" disabled={isPending}>
        <LogIn />
        {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>
    </form>
  )
}

export default LoginForm
