import TopicForm from './TopicForm'

// Indicamos explícitamente que esto es una página de servidor
export const dynamic = 'force-dynamic' 
export const fetchCache = 'default-no-store'

// Seguimos exactamente la documentación oficial de Next.js 15
export default async function Page({
  params,
}: {
  params: { id: string }
}) {
  return <TopicForm id={params.id} />
} 