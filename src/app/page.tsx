import ItemCard from "@/components/shared/item-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ITEMS = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1759778276191-eb29001c738d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1175",
    title: "making a sand castle on a beach",
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1758747376759-454112cd108d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=686",
    title: "Lemons",
  },
  {
    id: 3,
    imageUrl: "https://plus.unsplash.com/premium_photo-1760344795428-6692befdfe93?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    title: "Abstract shape",
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1759780763396-505ccfe121ac?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    title: "The moon",
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1760301269447-fbc82b5a8d14?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1150",
    title: "Mount Blum",
  },
]

export default function Home() {
  return (
    <>
      <div className="flex items-center gap-4 my-4">
        <div className="px-3 py-2 rounded-2xl border-2 border-muted grow">Search</div>
        <Link href="/create"><Button variant={"default"} className="h-10">Create item</Button></Link>
      </div>
      <div className="flex justify-end items-center gap-4 my-4">
        <div className="p-2 rounded-md bg-muted">Category: All</div>
        <div className="p-2 rounded-md bg-muted">Sort: Trending</div>        
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {
          ITEMS.map((item)=>(<Link href={`/item/${item.id}`} key={item.id}><ItemCard imageUrl={item.imageUrl} title={item.title} /></Link>))
        }
      </div>    
    </>
  );
}
