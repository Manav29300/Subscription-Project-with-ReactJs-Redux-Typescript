import { lazy, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
// import { RequireAuth } from '@shared/ui/RequireAuth'
import { getModuleRoutes, registerModules } from '@app/modules/moduleLoader'

const HomePage = lazy(() => import('@pages/home/HomePage'))
const NotFoundPage = lazy(() => import('@pages/not-found/NotFoundPage'))
// const LoginPage = lazy(() => import('@modules/auth/pages/LoginPage.tsx'))
// const AccountPage = lazy(() => import('@modules/auth/pages/AccountPage.tsx'))

export function AppRouter() {
  const [dynamicRoutes, setDynamicRoutes] = useState<Array<{ path: string; element: React.ReactNode }>>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ;(async () => {
      await registerModules()
      const r = await getModuleRoutes()
      setDynamicRoutes(r)
      setReady(true)
    })()
  }, [])
  console.log(dynamicRoutes,'dynamicRoutes')
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* dynamic module routes */}
      {dynamicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      <Route path="/404" element={<NotFoundPage />} />
      {ready && <Route path="*" element={<NotFoundPage />} />}
    </Routes>
  )
}


