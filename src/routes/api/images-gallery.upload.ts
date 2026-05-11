import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/images-gallery/upload')({
  server: {
    // middleware: [authMiddleware],
    handlers: {
      POST: async ({ request: req, context }) => {
        // console.log('context.accessToken', context.accessToken)
        // const accessToken = getCookie('accessToken')

        const body = await req.json()
        console.log(body)

        // console.log('formData :>>', formData.get('data'), '\n\n')
        // const backendResponse = await fetch('http://localhost:8000/api/images-gallery/upload', {
        //   method: 'POST',
        //   body: formData,
        //   headers: {

        //     'content-type': 'multipart/form-data',
        //   },
        // }).catch((err) => console.error(err))
        // // const response = await context.request({

        // })

        return new Response(JSON.stringify({ message: 'ok' }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      },
    },
  },
})
