import { Suspense } from 'react'
import { AppRouter } from '@app/routes/AppRouter'
import { AppLayout } from '@shared/layouts/AppLayout'

export default function App() {
  return (
    <AppLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRouter />
      </Suspense>
    </AppLayout>
  )
}


