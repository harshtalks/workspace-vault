import {
  ChevronDownIcon,
  CircleIcon,
  PlusIcon,
  StarIcon,
} from "@radix-ui/react-icons";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/card";

import { Separator } from "@ui/components/separator";
import { Button } from "@ui/components/ui/button";

export function LeftSideInformationCard() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>How it works</CardTitle>
          <CardDescription>
            After creating your new file, you will be redirected to the file
            page where you can have multiple environment modes and each mode
            will have your environments. While creating new environments you can
            decide which other mode such as DEV, PROD etc should have that
            environment.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            TypeScript
          </div>
          <div className="flex items-center">
            <StarIcon className="mr-1 h-3 w-3" />
            20k
          </div>
          <div>Updated April 2023</div>
        </div>
      </CardContent>
    </Card>
  );
}
