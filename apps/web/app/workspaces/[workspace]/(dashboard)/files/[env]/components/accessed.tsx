import { RequestResponse } from "@/middlewares/type";
import { redisClient } from "@/store/redis";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { Badge } from "@ui/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { cn } from "@ui/lib/utils";

export type AccessType = "read" | "write";
export type AccessProps = {
  userId: string;
  workspaceId: string;
  accessType: AccessType;
  envFileId: number;
};

// async function letsGetTheLogsAndSeeWhoHasDoneWhat<Tdata>(
//   envId: string
// ): Promise<RequestResponse<Tdata[]>> {
//   try {
//     const response = await redisClient.zrange<Tdata[]>(
//       `recentLogs:${envId}`,
//       0,
//       -1,
//       { rev: true }
//     );

//     return {
//       status: "success",
//       result: response,
//     };
//   } catch (error) {
//     return {
//       status: "error",
//       error: error instanceof Error ? error.message : "An Error Occured.",
//     };
//   }
// }

export async function Accessed({ envId }: { envId: string }) {
  // const response = await letsGetTheLogsAndSeeWhoHasDoneWhat<RedisFileAccess>(
  envId;
  // );

  // return response.status === "success" ? (
  //   <Card>
  //     <CardHeader>
  //       <CardTitle>Previously Accessed</CardTitle>
  //       <CardDescription>
  //         The Variable is accessed by the following members.
  //       </CardDescription>
  //     </CardHeader>
  //     <CardContent>
  //       <ScrollArea
  //         className={cn(
  //           "w-full",
  //           response.result.length >= 5 && "overflow-hidden h-[400px]"
  //         )}
  //       >
  //         <div className="grid gap-6">
  //           {response.result.map((access) => (
  //             <div
  //               key={access.timestamp}
  //               className="flex items-center justify-between space-x-4"
  //             >
  //               <div className="flex items-center space-x-4">
  //                 <Avatar>
  //                   <AvatarImage src={access.user.avatar} />
  //                   <AvatarFallback>
  //                     {access.user.firstName[0].toUpperCase() +
  //                       access.user.lastName[0].toUpperCase()}
  //                   </AvatarFallback>
  //                 </Avatar>
  //                 <div>
  //                   <p className="text-sm font-medium leading-none">
  //                     {access.user.email}
  //                   </p>
  //                   <p className="text-sm text-muted-foreground">
  //                     {new Date(access.timestamp).toLocaleString()}
  //                   </p>
  //                 </div>
  //               </div>
  //               <Badge>{access.access}</Badge>
  //             </div>
  //           ))}
  //         </div>
  //       </ScrollArea>
  //     </CardContent>
  //   </Card>
  // ) : (
  //   <div className="p-4 flex items-center justify-center">
  //     <Badge>{response.error}</Badge>
  //   </div>
  // );

  return <></>;
}
