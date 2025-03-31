import TopicForm from './TopicForm'

// Indicamos explícitamente que esto es una página de servidor
export const dynamic = 'force-dynamic' 
export const fetchCache = 'default-no-store'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ params }: PageProps) {
  // Asegurarnos de resolver el Promise de params
  const resolvedParams = await params
  const id = resolvedParams.id
  
  return <TopicForm id={id} />
} 