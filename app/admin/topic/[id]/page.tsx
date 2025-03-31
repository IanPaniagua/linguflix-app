import { use } from 'react'
import TopicForm from './TopicForm'

// Indicamos explícitamente que esto es una página de servidor
export const dynamic = 'force-dynamic' 
export const fetchCache = 'default-no-store'

// Seguimos la forma exacta de la documentación oficial
export default function Page(props: {
  params: Promise<{ id: string }>
}) {
  // Usamos el hook 'use' para componentes síncronos
  const params = use(props.params)
  const id = params.id
  
  return <TopicForm id={id} />
} 