export default function Header() {
  return (
    <div className="fixed top-0 w-full h-16 backdrop-blur-[2px] bg-black/20 flex justify-between items-center lg:px-36 md:px-16 px-4">
      <div className="font-bold text-2xl">Explore Gallery</div>
      <div className="flex items-center gap-2 hover:bg-muted hover:cursor-pointer px-3 py-1 rounded-lg">
        <img
          src="https://reqres.in/img/faces/1-image.jpg"
          alt=""
          className="w-9 rounded-full"
        />
          <div className="font-semibold">George</div>
        {/* <div>
          <div className="text-sm text-muted-foreground">george.bluth@reqres.in</div>
        </div> */}
      </div>
    </div>
  );
}
