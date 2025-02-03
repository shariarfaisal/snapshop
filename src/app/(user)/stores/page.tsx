import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components";
import StoreList from "@/components/stores/store-list";
import { Plus } from "lucide-react";
import Link from "next/link";

const Stores = () => {
  return (
    <div className="min-h-screen container p-4">
      <Card className="shadow-md">
        <CardHeader className="w-full flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Stores</CardTitle>
          <Link href="/stores/new">
            <Button>
              <Plus />
              <span>New Store</span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <StoreList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Stores;
