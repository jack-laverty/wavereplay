
export default async function Avatar() {
  return null
  const imageUrl =  null
  if (!imageUrl)
    return null;
  return <img 
    src={imageUrl} 
    alt="User Avatar" 
    className="w-10 h-10 md:w-16 md:h-16 rounded-full border-2 md:border-4" 
    style={{ borderColor: '#d3d3d3' }} 
  />
}