import TopicForm from './TopicForm'

// Indicamos explícitamente que esto es una página de servidor
export const dynamic = 'force-dynamic' 
export const fetchCache = 'default-no-store'

interface PageProps {
  params: {
    id: string
  }
}

export default async function Page({ params }: PageProps) {
  // Ya no necesitamos await params porque no es un Promise en la interfaz
  const id = params.id
  
  return <TopicForm id={id} />
} 