import TopicForm from './TopicForm'

// Definimos que params es una promesa según la documentación oficial
type Params = Promise<{ id: string }>

// Usamos un componente async para poder usar await
export default async function Page({
  params,
}: {
  params: Params
}) {
  // Esperamos a que se resuelva la promesa de params
  const resolvedParams = await params
  const id = resolvedParams.id
  
  return <TopicForm id={id} />
} 