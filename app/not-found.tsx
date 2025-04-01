import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="fixed inset-0 bg-[url('/image/bg-universe.png')] bg-cover bg-center opacity-20" />
      <div className="relative max-w-md mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold">404 - Página no encontrada</h1>
        <p className="text-xl">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
} 