import { loginRpc } from '@/apis/auth/rpc'
import { loginSchema } from '@/apis/auth/schemas/login.schema'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { setServerTokenFn } from '../../../../.tanstack/deprecated/functions/auth.function'

import { LogIn } from 'lucide-react'
import { useState, type SubmitEventHandler } from 'react'
import { toast } from 'sonner'

const LoginForm = () => {
  const [isPending, setIsPending] = useState(false)
  const loginFn = useServerFn(loginRpc)
  const setToken = useServerFn(setServerTokenFn)
  const router = useRouter()

  const { Field: FormField, handleSubmit } = useForm({
    defaultValues: { username: '', password: '' },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      try {
        const { accessToken } = await loginFn({ data: value })
        // await setToken({ data: accessToken })
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
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field>
              <FieldLabel htmlFor={field.name}>Tài khoản</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value as string}
                placeholder="example@gmail.com"
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.currentTarget.value)}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </FormField>
      <FormField name="password">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field>
              <FieldLabel htmlFor={field.name}>Mật khẩu</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value as string}
                placeholder="******"
                type="password"
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.currentTarget.value)}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
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
