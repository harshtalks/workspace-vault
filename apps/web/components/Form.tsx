"use client";
import * as React from "react";

// import { Button } from "@ui/components/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@ui/components/card";
// import { Textarea } from "@ui/components/ui/textarea";
// import { Label } from "@ui/components/ui/label";
// import { Input } from "ui/components/ui/input";
// import Link from "next/link";
// import {
//   EyeOpenIcon,
//   EyeNoneIcon,
//   ReloadIcon,
//   ListBulletIcon,
// } from "@radix-ui/react-icons";
// import { ReadFile } from "./read-file";
// import { atom, useRecoilState } from "recoil";
// import { localKeyForBrowser, secretDB } from "@/utils/local-store";
// import {
//   decryptTextWithAESGCM,
//   encryptTextWithAESGCM,
//   generateMasterKey,
//   getSalt,
// } from "cryptography";
// import { EnvAPIRequestBody } from "@/app/api/envs/route";
// import { RequestResponse } from "@/middlewares/type";
// import { EnvironmentVariables } from "database";
// import { toast } from "sonner";
// import {
//   AccessProps,
//   RedisFileAccess,
// } from "@/app/api/workspaces/access/route";
// import { useAuth } from "@clerk/nextjs";
// import { getName } from "@/utils/random-name-generator";
// import { Badge } from "@ui/components/ui/badge";
// import { GetEnvDataFromServer } from "@/services/env";
// import { variables } from "database";

export type AddNewEnvProps = {
  readLimits?: number;
  name: string;
  envariables: string;
  type: "input";
};

// {
//   workspace,
//   resultFromServer,
//   canAddOrEditFile,
// }: {
//   workspace: string;
//   canAddOrEditFile: boolean;
//   resultFromServer: GetEnvDataFromServer | null;
// }

export function Form() {
  // const [hideEnvs, setHideEnvs] = React.useState(false);
  // const [isClient, setIsClient] = React.useState(false);
  // const [showError, setError] = React.useState(false);
  // const { userId } = useAuth();
  // const [state, setState] = useRecoilState(
  //   atom<AddNewEnvProps>({
  //     key: "AddNewFile",
  //     default: {
  //       readLimits: -1,
  //       type: "key",
  //     },
  //   })
  // );
  // React.useEffect(() => {
  //   setIsClient(true);
  // }, []);
  // React.useEffect(() => {
  //   const decryptIt = async () => {
  //     try {
  //       await secretDB.open();
  //       const getSecret = await secretDB.secrets.get(workspace);
  //       if (!getSecret) {
  //         throw new Error("No key available to decrypt it.");
  //       }
  //       const localKey = await localKeyForBrowser();
  //       const decryptedSecret = await decryptTextWithAESGCM(
  //         getSecret.key,
  //         localKey
  //       );
  //       const response = await fetch("/api/secret/verify-secret", {
  //         method: "POST",
  //         body: JSON.stringify({
  //           workspace: workspace,
  //           secretValue: decryptedSecret,
  //         }),
  //       });
  //       const responseJson: RequestResponse<boolean> = await response.json();
  //       if (responseJson.status === "error") {
  //         throw new Error(responseJson.error);
  //       }
  //       if (!process.env.NEXT_PUBLIC_SECRET_FOR_GENERATING_KEY) {
  //         throw new Error("Error ocurred while generating the master key.");
  //       }
  //       const key = await generateMasterKey(
  //         decryptedSecret,
  //         getSalt(process.env.NEXT_PUBLIC_SECRET_FOR_GENERATING_KEY)
  //       );
  //       // encrypting..
  //       const decryptedText =
  //         resultFromServer.status === "success" &&
  //         (await decryptTextWithAESGCM(resultFromServer.result.variables, key));
  //       setState((current) => ({
  //         ...current,
  //         envariables: decryptedText,
  //       }));
  //     } catch (error) {
  //       error instanceof Error && toast.error(error.message);
  //     }
  //   };
  //   // Immediately Invoked Function Expression (IIFE)
  //   resultFromServer &&
  //     (resultFromServer.status === "success"
  //       ? (async () => {
  //           await decryptIt();
  //         })()
  //       : setError(true));
  // }, []);
  // React.useEffect(() => {
  //   showError &&
  //     toast.error(
  //       "Sorry, we could not find the environment variables file attached with the given id."
  //     );
  // }, [showError]);
  // const [isLoading, setIsLoading] = React.useState(false);
  // // fake value
  // const length = 8;
  // const fakeValue = Array.from({ length: length })
  //   .map((_, index) => "*".repeat(80) + (index === length - 1 ? "" : "\n"))
  //   .join("");
  // // handler
  // const handler = async () => {
  //   try {
  //     const validationError = state.envariables === "" || state.name === "";
  //     if (validationError) {
  //       throw new Error("Invalid value for the name, and env variables.");
  //     }
  //     setIsLoading(true);
  //     // getting the master key
  //     await secretDB.open();
  //     const getSecret = await secretDB.secrets.get(workspace);
  //     if (!getSecret) {
  //       throw new Error("No keys were found with this workspace locally.");
  //     }
  //     const localKey = await localKeyForBrowser();
  //     const decryptedSecret = await decryptTextWithAESGCM(
  //       getSecret.key,
  //       localKey
  //     );
  //     if (!process.env.NEXT_PUBLIC_SECRET_FOR_GENERATING_KEY) {
  //       throw new Error("Error ocurred while generating the master key.");
  //     }
  //     const masterKey = await generateMasterKey(
  //       decryptedSecret,
  //       getSalt(process.env.NEXT_PUBLIC_SECRET_FOR_GENERATING_KEY)
  //     );
  //     // crypto work.
  //     const encryptedEnvs = await encryptTextWithAESGCM(
  //       state.envariables,
  //       masterKey
  //     );
  //     // hitting the database here:
  //     const hittingTheDatabase = await fetch("/api/envs", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         envs: {
  //           envariables: encryptedEnvs,
  //           name: state.name,
  //           readLimits: state.readLimits,
  //         },
  //         workspace: workspace,
  //         ...(resultFromServer &&
  //           resultFromServer.status === "success" && {
  //             envId: resultFromServer.result.id,
  //           }),
  //       } as EnvAPIRequestBody),
  //     });
  //     const responseWhenDatabaseResponded: RequestResponse<EnvironmentVariables> =
  //       await hittingTheDatabase.json();
  //     if (responseWhenDatabaseResponded.status === "error") {
  //       throw new Error(responseWhenDatabaseResponded.error);
  //     }
  //     const redisAccessLog: AccessProps = {
  //       userId,
  //       workspaceId: workspace,
  //       envFileId: responseWhenDatabaseResponded.result.id,
  //       accessType: "write",
  //     };
  //     const givingServerTheData = await fetch("/api/workspaces/access", {
  //       method: "POST",
  //       body: JSON.stringify(redisAccessLog),
  //     });
  //     const whatTheHellServerSaid: RequestResponse<RedisFileAccess> =
  //       await givingServerTheData.json();
  //     if (whatTheHellServerSaid.status === "error") {
  //       throw new Error(whatTheHellServerSaid.error);
  //     }
  //     return responseWhenDatabaseResponded;
  //   } catch (error) {
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // return isClient ? (
  //   <Card className="w-full">
  //     <CardHeader>
  //       <CardTitle>Share Variables</CardTitle>
  //     </CardHeader>
  //     <CardContent>
  //       <form>
  //         <div className="grid w-full items-center gap-4">
  //           <div className="flex flex-col space-y-1.5">
  //             {!canAddOrEditFile && (
  //               <Badge className="w-fit" variant="destructive">
  //                 You do not have write access for this workspace.
  //               </Badge>
  //             )}
  //             <Label htmlFor="name">Environment Variables</Label>
  //             <div className="relative h-[200px] w-full">
  //               <div className="flex absolute w-full text-zinc-500 font-mono py-2 space-x-2 border outline-2 focus-visible:ring-2 focus-visible:ring-ring rounded-sm overflow-auto max-h-[200px]">
  //                 <div className="pl-2 p-0 h-full text-zinc-500 border-zinc-700">
  //                   {Array.from({
  //                     length: (hideEnvs
  //                       ? fakeValue
  //                       : state.envariables || ""
  //                     ).split("\n").length,
  //                   }).map((_, _index) => (
  //                     <React.Fragment key={_index}>
  //                       <p className="text-sm pr-2 border-r-2 font-normal text-zinc-500">
  //                         {(_index + 1).toString().padStart(2, "0")}
  //                       </p>
  //                     </React.Fragment>
  //                   ))}
  //                 </div>
  //                 <Textarea
  //                   className="w-full h-full appearance-none resize-none m-0 text-sm focus-visible:ring-0 rounded-0 outline-0 p-0 ring-0 border-0"
  //                   rows={Math.max(
  //                     9,
  //                     (state.envariables || "").split("\n").length
  //                   )}
  //                   value={hideEnvs ? fakeValue : state.envariables || ""}
  //                   onChange={(e) => {
  //                     setState((state) => ({
  //                       ...state,
  //                       envariables: e.target.value,
  //                     }));
  //                   }}
  //                   placeholder="Enter Input as ENV_KEY=ENV_VALUE"
  //                   disabled={!canAddOrEditFile || hideEnvs}
  //                 />
  //               </div>
  //             </div>
  //             <div className="flex items-center gap-1">
  //               <Button
  //                 onClick={(e) => {
  //                   e.preventDefault();
  //                   setHideEnvs((current) => !current);
  //                 }}
  //                 className="w-fit text-xs"
  //                 variant="ghost"
  //               >
  //                 {hideEnvs ? (
  //                   <>
  //                     <EyeOpenIcon className="mr-2 h-4 w-4" /> visible
  //                   </>
  //                 ) : (
  //                   <>
  //                     <EyeNoneIcon className="mr-2 h-4 w-4" /> hide
  //                   </>
  //                 )}
  //               </Button>
  //               <Button variant="ghost">
  //                 <ListBulletIcon className="mr-2 h-4 w-4" /> List View
  //               </Button>
  //             </div>
  //           </div>
  //           <div className="grid grid-cols-2 gap-4">
  //             <div className="flex flex-col space-y-1.5">
  //               <Label htmlFor="name">Name of the file</Label>
  //               <div className="flex border rounded-md overflow-hidden">
  //                 <Input
  //                   type="text"
  //                   min={0}
  //                   value={state.name}
  //                   onChange={(e) =>
  //                     setState((state) => ({
  //                       ...state,
  //                       name: e.target.value,
  //                     }))
  //                   }
  //                   disabled={!canAddOrEditFile}
  //                   readOnly={!canAddOrEditFile}
  //                   className="border-0 focus:ring-0 focus-visible:ring-0 appearance-none"
  //                   id="name"
  //                   placeholder="Enter Name"
  //                   required
  //                 />
  //               </div>
  //               <div
  //                 onClick={() =>
  //                   setState((state) => ({ ...state, name: getName() }))
  //                 }
  //                 className="text-xs select-none text-muted-foreground cursor-pointer hover:underline focus:underline"
  //               >
  //                 Generate random name by clicking here.
  //               </div>
  //             </div>
  //             <div className="flex flex-col space-y-1.5">
  //               <Label htmlFor="number_of_reads">
  //                 Number of Reads{" "}
  //                 <span className="px-2 py-1 text-xs rounded-xs bg-foreground text-background dark:bg-background dark:text-foreground">
  //                   Coming Soon
  //                 </span>
  //               </Label>
  //               <Input
  //                 type="number"
  //                 min={0}
  //                 value={state.readLimits}
  //                 onChange={(e) =>
  //                   setState((state) => ({
  //                     ...state,
  //                     readLimits: +e.target.value,
  //                   }))
  //                 }
  //                 id="number_of_reads"
  //                 className="appearance-none"
  //                 placeholder="Enter number of reads"
  //                 disabled
  //                 readOnly
  //               />
  //               <p className="text-xs text-zinc-400 ">
  //                 The number of times this variable can be read, it will expire
  //                 once it reaches zero. leave it empty for limitless reads
  //                 within TTL
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //       </form>
  //     </CardContent>
  //     <CardFooter className="flex gap-4">
  //       <Button
  //         onClick={() => {
  //           toast.promise(handler, {
  //             loading: "Loading...",
  //             success: (env) => {
  //               return `new file "${env.result.name}" with id ${env.result.id} has been created and you have been added to the logs.`;
  //             },
  //             error: (errorState) =>
  //               `Error: ${errorState instanceof Error && errorState.message}`,
  //           });
  //         }}
  //         disabled={!canAddOrEditFile || isLoading}
  //       >
  //         {isLoading ? (
  //           <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
  //         ) : (
  //           <></>
  //         )}
  //         Save File
  //       </Button>
  //       <ReadFile
  //         canAddOrEditFile={canAddOrEditFile}
  //         setHideEnvs={setHideEnvs}
  //         setState={setState}
  //       />
  //     </CardFooter>
  //   </Card>
  // ) : (
  //   <></>
  // );

  return <div></div>;
}
