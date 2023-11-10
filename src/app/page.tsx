import Link from "next/link"

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-[200px] h-[60px] text-center flex items-center justify-center bg-indigo-500 text-white rounded cursor-pointer">
        <Link href="/mention" className="text-white">
          点这里看 DEMO
        </Link>
      </div>
    </div>
  )
}
