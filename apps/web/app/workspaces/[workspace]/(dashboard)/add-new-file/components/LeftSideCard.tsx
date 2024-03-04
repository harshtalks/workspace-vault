import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/card";

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
    </Card>
  );
}
