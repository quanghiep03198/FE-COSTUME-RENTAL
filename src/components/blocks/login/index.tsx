import AuthBackgroundShape from '@/assets/svg/auth-background-shape'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Gem } from 'lucide-react'
import LoginForm from './login-form'

const Login: React.FC = () => {
  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute">
        <AuthBackgroundShape />
      </div>

      <Card className="z-1 w-full border-none shadow-md sm:max-w-lg">
        <CardHeader className="gap-6">
          <CardTitle className="mb-1.5 inline-flex items-center gap-x-2 text-2xl">
            <Gem strokeWidth={1} /> Diamond Studio
          </CardTitle>
          <CardDescription className="text-base"></CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
