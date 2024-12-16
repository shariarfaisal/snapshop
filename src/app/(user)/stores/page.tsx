import { Button } from "@/components";
import { Plus } from "lucide-react";
import Link from "next/link";

const Stores = () => {
  return (
    <div className="min-h-screen p-4">
      <Link href="/stores/new">
        <Button>
          <Plus />
          <span>New Store</span>
        </Button>
      </Link>
    </div>
  );
};

export default Stores;
