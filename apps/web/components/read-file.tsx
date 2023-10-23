"use client";

import { Button } from "@ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/dialog";
import { Input } from "@ui/components/input";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { SetterOrUpdater } from "recoil";
import { AddNewEnvProps } from "./Form";

export function ReadFile({
  setState,
  setHideEnvs,
  canAddOrEditFile,
}: {
  setState: SetterOrUpdater<AddNewEnvProps>;
  setHideEnvs: Dispatch<SetStateAction<boolean>>;
  canAddOrEditFile: boolean;
}) {
  const [fileText, setFileText] = useState("");
  const [saved, setSaved] = useState(false);

  const readFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFileText("");
    setSaved(false);
    setState((current) => ({
      ...current,
      envariables: "",
    }));
    const file = e.target.files![0];
    const reader = new FileReader();
    reader.onload = (fileReader) => {
      const targetResult = fileReader.target.result;
      if (typeof targetResult !== "string") {
        return;
      }
      setFileText(targetResult);
      setHideEnvs(true);
    };
    reader.readAsText(file);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!canAddOrEditFile} variant="outline">
          Upload .env
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription className="leading-relaxed">
            Provide your env file and we will get all the envs for you. make
            sure all your entries are in `key=value` pair.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              onChange={readFile}
              type="file"
              id="name"
              className="col-span-4"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={saved}
            onClick={() => {
              if (fileText !== "") {
                setState((current) => ({
                  ...current,
                  envariables: fileText,
                }));
                setSaved(true);
              }
            }}
            type="submit"
          >
            {saved ? "Changes Saved" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
