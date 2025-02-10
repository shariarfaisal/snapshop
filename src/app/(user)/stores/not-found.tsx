import { Button } from "@/components";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center">
        <div className="text-5xl text-red-500 font-bold">404</div>
        <div className="text-lg my-4">
          Oops! The page you are looking for does not exist.
        </div>
        <Link href="/stores">
          <Button variant="outline" className="mt-6">
            Go Back to Store
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
