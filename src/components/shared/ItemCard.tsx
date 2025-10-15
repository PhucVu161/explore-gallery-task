

export default function ItemCard({imageUrl, title} : { imageUrl : string; title : string}) {
  return (
    <div className="rounded-2xl bg-card text-card-foreground overflow-hidden hover:opacity-70">
        <img src={imageUrl} alt="" className="h-70 w-full object-cover" />
        <div className="p-4">{title}</div>
    </div>
  )
}
