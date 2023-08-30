import NavBar from "@/components/navigationBar";

export default function Home() {
  return (
    <main>
      <div className="bg-[url('/plant.jpg')] h-80 bg-center bg-no-repeat bg-cover md:h-80 max-sm:h-[40%] flex items-center justify-center rounded-br-2xl rounded-bl-2xl">
        <NavBar />
      </div>
    </main>
  );
}
