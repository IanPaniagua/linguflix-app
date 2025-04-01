import TopicForm from './TopicForm'

// Indicamos explícitamente que esto es una página de servidor
export const dynamic = 'force-dynamic' 
export const fetchCache = 'default-no-store'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  // Asegurarnos de resolver el Promise de params
  const params = await props.params
  const id = params.id
  
  return <TopicForm id={id} />
} 