"use client";

// imports
import { FiUpload } from "react-icons/fi";
import { SquareStack } from 'lucide-react';
import { TbDragDrop2 } from "react-icons/tb";
import ReactDropzone from "react-dropzone";
import bytesToSize from "@/utils/bytes-to-size";
import fileToIcon from "@/utils/file-to-icon";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import compressFileName from "@/utils/compress-file-name";
import { Skeleton } from "@/components/ui/skeleton";
import convertFile from "@/utils/convert";
import { Spinner } from "@phosphor-icons/react"; 
import { MdDone } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { BiError } from "react-icons/bi";
import { IoBackspace } from "react-icons/io5";
import { BorderBeam } from '@/components/ui/border-beam'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import loadFfmpeg from "@/utils/load-ffmpeg";
import type { Action } from "@/types";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { LinkPreview } from "@/components/ui/thumbnail";
import { X } from "lucide-react";

// Preset file extensions
const extensions = {
  image: [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "ico",
    "tif",
    "tiff",
    "svg",
    "raw",
    "tga",
  ],
  video: [
    "mp4",
    "m4v",
    "mp4v",
    "3gp",
    "3g2",
    "avi",
    "mov",
    "wmv",
    "mkv",
    "flv",
    "ogv",
    "webm",
    "h264",
    "264",
    "hevc",
    "265",
  ],
  audio: ["mp3", "wav", "ogg", "aac", "wma", "flac", "m4a"],
  pdf: ["pdf"],
  ppt: ["ppt", "pptx"],
};

const getPossibleExtensions = (fileType: string) => {
  if (fileType.includes("image")) return extensions.image;
  if (fileType.includes("video")) return extensions.video;
  if (fileType.includes("audio")) return extensions.audio;
  return [];
};

export default function Dropzone() {
  // variables & hooks
  const { toast } = useToast();
  const [is_hover, setIsHover] = useState<boolean>(false);
  const [actions, setActions] = useState<Action[]>([]);
  const [is_ready, setIsReady] = useState<boolean>(false);
  const [files, setFiles] = useState<Array<any>>([]);
  const [is_loaded, setIsLoaded] = useState<boolean>(false);
  const [is_converting, setIsConverting] = useState<boolean>(false);
  const [is_done, setIsDone] = useState<boolean>(false);
  const ffmpegRef = useRef<any>(null);
  const [defaultValues, setDefaultValues] = useState<string>("video");
  const [selected, setSelected] = useState<string>("...");
  const [isSameFormat, setIsSameFormat] = useState<boolean>(true);
  const accepted_files = {
    "image/*": [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
      ".ico",
      ".tif",
      ".tiff",
      ".raw",
      ".tga",
    ],
    "audio/*": [],
    "video/*": [],
    "application/pdf": [".pdf"],
    "application/vnd.ms-powerpoint": [".ppt", ".pptx"],
  };

  const disabledExtensions = ["ico", "tif", "tiff", "bmp", "tga", "raw"];

  // functions
  const reset = () => {
    setIsDone(false);
    setActions([]);
    setFiles([]);
    setIsReady(false);
    setIsConverting(false);
  };

  const downloadAll = (): void => {
    for (const action of actions) {
      !action.is_error && download(action);
    }
  };

  const download = (action: Action) => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = action.url;
    a.download = action.output;

    document.body.appendChild(a);
    a.click();

    // Clean up after download
    URL.revokeObjectURL(action.url);
    document.body.removeChild(a);
  };

  const convert = async (): Promise<any> => {
    let tmp_actions = actions.map((elt) => ({
      ...elt,
      is_converting: true,
    }));
    setActions(tmp_actions);
    setIsConverting(true);
    let allConverted = true;
    for (const action of tmp_actions) {
      try {
        const { url, output } = await convertFile(ffmpegRef.current, action);
        tmp_actions = tmp_actions.map((elt) =>
          elt === action
            ? {
                ...elt,
                is_converted: true,
                is_converting: false,
                url,
                output,
              }
            : elt
        );
        setActions(tmp_actions);
      } catch (err) {
        allConverted = false;
        tmp_actions = tmp_actions.map((elt) =>
          elt === action
            ? {
                ...elt,
                is_converted: false,
                is_converting: false,
                is_error: true,
              }
            : elt
        );
        setActions(tmp_actions);
      }
    }
    setIsDone(allConverted);
    setIsConverting(false);
  };

  const handleUpload = (data: Array<any>): void => {
    handleExitHover();
    setFiles(data);
    const tmp: Action[] = [];
    const fileTypes = new Set(data.map((file: any) => file.type.split('/')[0]));
    setIsSameFormat(fileTypes.size === 1);
    data.forEach((file: any) => {
      const formData = new FormData();
      tmp.push({
        file_name: file.name,
        file_size: file.size,
        from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
        to: null,
        file_type: file.type,
        file,
        is_converted: false,
        is_converting: false,
        is_error: false,
      });
    });
    setActions(tmp);
  };

  const handleHover = (): void => setIsHover(true);
  const handleExitHover = (): void => setIsHover(false);

  const updateAction = (file_name: string, to: string) => {
    setActions((prevActions) =>
      prevActions.map((action) =>
        action.file_name === file_name
          ? { ...action, to }
          : action
      )
    );
  };
  

  const checkIsReady = (): void => {
    let tmp_is_ready = true;
    actions.forEach((action: Action) => {
      if (!action.to) tmp_is_ready = false;
    });
    setIsReady(tmp_is_ready);
  };

  const deleteAction = (action: Action): void => {
    setActions(actions.filter((elt) => elt !== action));
    setFiles(files.filter((elt) => elt.name !== action.file_name));
  };

  useEffect(() => {
    if (!actions.length) {
      setIsDone(false);
      setFiles([]);
      setIsReady(false);
      setIsConverting(false);
    } else checkIsReady();
  }, [actions]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const ffmpeg_response: FFmpeg = await loadFfmpeg();
    ffmpegRef.current = ffmpeg_response;
    setIsLoaded(true);
  };

  const convertAllTo = (format: string) => {
    setActions((prevActions) =>
      prevActions.map((action) => ({ ...action, to: format }))
    );
  };

  // returns
  if (actions.length) {
    return (
      <div className="space-y-4">
        {actions.map((action: Action, i: any) => (
          <div
            key={i}
            className="gap-2 px-5 w-full py-4 lg:py-0 rounded-3xl border border-white/10 bg-white bg-opacity-[0.01] relative cursor-pointer rounded-xl border h-fit lg:h-20 lg:px-10 flex flex-wrap lg:flex-nowrap items-center justify-between"
          >
            {!is_loaded && (
              <Skeleton className="h-full w-full -ml-10 cursor-progress absolute rounded-xl" />
            )}
      <div className="flex gap-4 items-center">
  <span className="text-2xl text-orange-600">
    {fileToIcon(action.file_type)}
  </span>
  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 w-full">
    {action.file_type.startsWith("image/") && !disabledExtensions.some(ext => action.file_name.endsWith(ext)) ? (
      <LinkPreview url={action.file_name} imageSrc={URL.createObjectURL(action.file)} isStatic={true}>
        <span className="text-md font-medium overflow-hidden text-ellipsis whitespace-nowrap sm:max-w-full lg:overflow-visible lg:whitespace-nowrap lg:text-ellipsis max-w-[12ch] sm:pr-1">
          {compressFileName(action.file_name)}
        </span>
      </LinkPreview>
    ) : (
      <span className="text-md font-medium overflow-hidden text-ellipsis whitespace-nowrap sm:max-w-full lg:overflow-visible lg:whitespace-nowrap lg:text-ellipsis max-w-[12ch] sm:pr-4">
        {compressFileName(action.file_name)}
      </span>
    )}
    <span className="text-xs text-gray-400 font-medium mt-2 overflow-hidden text-ellipsis whitespace-nowrap sm:w-full sm:mt-1 lg:max-w-full text-left">
      ({bytesToSize(action.file_size)})
    </span>
  </div>


            </div>
            {action.is_error ? (
              <Badge variant="destructive" className="flex gap-2">
                <span>Error Converting File</span>
                <BiError />
              </Badge>
            ) : action.is_converted ? (
              <Badge variant="default" className="flex gap-2 bg-green-500">
                <span>Done</span>
                <MdDone />
              </Badge>
            ) : action.is_converting ? (
              <Badge variant="default" className="flex gap-2">
                <span>Converting</span>
                <span className="animate-spin">
                  <Spinner />
                </span>
              </Badge>
            ) : (
                <div className="text-muted-foreground text-md flex items-center gap-4">
                    <div className="hidden md:block lg:block">
                    <span>Convert to</span>
                    </div>
                <Select
                  onValueChange={(value) => {
                    if (extensions.audio.includes(value)) {
                      setDefaultValues("audio");
                    } else if (extensions.video.includes(value)) {
                      setDefaultValues("video");
                    }
                    setSelected(value);
                    updateAction(action.file_name, value);
                  }}
                  value={selected}
                >
                  <SelectTrigger className="w-32 outline-none focus:outline-none focus:ring-0 text-center text-muted-foreground bg-background text-md font-medium">
                    <SelectValue placeholder="..." />
                  </SelectTrigger>
                  <SelectContent className="h-fit">
                    {action.file_type.includes("image") && (
                      <div className="grid grid-cols-2 gap-2 w-fit">
                        {extensions.image.map((elt, i) => (
                          <div key={i} className="col-span-1 text-center">
                            <SelectItem value={elt} className="mx-auto">
                              {elt}
                            </SelectItem>
                          </div>
                        ))}
                      </div>
                    )}
                    {action.file_type.includes("video") && (
                      <Tabs defaultValue={defaultValues} className="w-full">
                        <TabsList className="w-full mb-1">
                          <TabsTrigger value="video" className="w-full">
                            Video
                          </TabsTrigger>
                          <TabsTrigger value="audio" className="w-full">
                            Audio
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="video">
                          <div className="grid grid-cols-3 gap-2 w-fit">
                            {extensions.video.map((elt, i) => (
                              <div key={i} className="col-span-1 text-center">
                                <SelectItem value={elt} className="mx-auto">
                                  {elt}
                                </SelectItem>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                        <TabsContent value="audio">
                          <div className="grid grid-cols-3 gap-2 w-fit">
                            {extensions.audio.map((elt, i) => (
                              <div key={i} className="col-span-1 text-center">
                                <SelectItem value={elt} className="mx-auto">
                                  {elt}
                                </SelectItem>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                    {action.file_type.includes("audio") && (
                      <div className="grid grid-cols-2 gap-2 w-fit">
                        {extensions.audio.map((elt, i) => (
                          <div key={i} className="col-span-1 text-center">
                            <SelectItem value={elt} className="mx-auto">
                              {elt}
                            </SelectItem>
                          </div>
                        ))}
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        ))}
        <div className="space-x-1 mt-4 flex flex-wrap justify-between">
          <Select
            onValueChange={(value) => convertAllTo(value)}
            disabled={!isSameFormat}
          >
            <SelectTrigger className="w-38 outline-none focus:outline-none focus:ring-0 text-center text-muted-foreground bg-background text-md font-medium">
              <SquareStack className="inline-block mr-2" />
              <SelectValue placeholder="All To..." />
            </SelectTrigger>
            <SelectContent className="h-fit">
              {actions.length > 0 && (
              <>
                {actions[0].file_type.includes("image") && (
                <div className="grid grid-cols-2 gap-2 w-fit">
                  {extensions.image.map((elt, i) => (
                  <div key={i} className="col-span-1 text-center">
                    <SelectItem value={elt} className="mx-auto">
                    {elt}
                    </SelectItem>
                  </div>
                  ))}
                </div>
                )}
                {actions[0].file_type.includes("video") && (
                <Tabs defaultValue={defaultValues} className="w-full">
                  <TabsList className="w-full mb-1">
                  <TabsTrigger value="video" className="w-full">
                    Video
                  </TabsTrigger>
                  <TabsTrigger value="audio" className="w-full">
                    Audio
                  </TabsTrigger>
                  </TabsList>
                  <TabsContent value="video">
                  <div className="grid grid-cols-3 gap-2 w-fit">
                    {extensions.video.map((elt, i) => (
                    <div key={i} className="col-span-1 text-center">
                      <SelectItem value={elt} className="mx-auto">
                      {elt}
                      </SelectItem>
                    </div>
                    ))}
                  </div>
                  </TabsContent>
                  <TabsContent value="audio">
                  <div className="grid grid-cols-3 gap-2 w-fit">
                    {extensions.audio.map((elt, i) => (
                    <div key={i} className="col-span-1 text-center">
                      <SelectItem value={elt} className="mx-auto">
                      {elt}
                      </SelectItem>
                    </div>
                    ))}
                  </div>
                  </TabsContent>
                </Tabs>
                )}
                {actions[0].file_type.includes("audio") && (
                <div className="grid grid-cols-2 gap-2 w-fit">
                  {extensions.audio.map((elt, i) => (
                  <div key={i} className="col-span-1 text-center">
                    <SelectItem value={elt} className="mx-auto">
                    {elt}
                    </SelectItem>
                  </div>
                  ))}
                </div>
                )}
              </>
              )}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap space-x-3 lg:mt-0">
          <Button
  variant="secondary"
  className="sm:py-3 py-0 w-auto text-md flex items-center"
  onClick={() => reset()}
>
  <IoBackspace className="opacity-60" size={28} strokeWidth={2} aria-hidden="true" />
  <span className="hidden sm:inline">
    {is_done ? "Convert More file(s)" : "Reset"}
  </span>
</Button>


            <Button
              effect="shineHover"
              variant="secondary"
              disabled={is_converting || !is_ready}
              className="py-3 w-28 sm:w-18 md:w-48 text-md"
              onClick={is_done ? downloadAll : convert}
            >
              {is_converting ? (
                <>
                  <span className="animate-spin">
                    <Spinner />
                  </span>
                  Converting
                </>
              ) : is_done ? (
                "Download All"
              ) : (
                "Convert"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <ReactDropzone
          onDrop={(acceptedFiles) => handleUpload(acceptedFiles)}
          onDragEnter={handleHover}
          onDragLeave={handleExitHover}
          accept={accepted_files}
          onDropRejected={() => {
            handleExitHover();
            toast({
              variant: "destructive",
              title: "Error uploading your file(s)",
              description: "Allowed Files: Audio, Video, and Images.",
              duration: 5000,
            });
          }}
          onError={() => {
            handleExitHover();
            toast({
              variant: "destructive",
              title: "Error uploading your file(s)",
              description: "Allowed Files: Audio, Video, and Images.",
              duration: 5000,
            });
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="lg:py-5 h-80 relative rounded-3xl border border-white/10 bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:size-full before:opacity-0 before:[background-image:linear-gradient(to_bottom,var(--color-one),var(--color-one),transparent_40%)] before:[filter:blur(180px)] bg-background shadow-sm border-secondary border-1 cursor-pointer flex items-center justify-center"
            >
              <input {...getInputProps()} />
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <BorderBeam
                  size={200}
                  duration={12}
                  delay={11}
                  colorFrom="var(--color-one)"
                  colorTo="var(--color-two)"
                />
              </div>
              <div className="py-16 space-y-4 text-foreground relative text-center">
                {is_hover ? (
                  <>
                    <div className="text-balance tracking-tight text-gray-400 justify-center flex text-5xl">
                      <TbDragDrop2 />
                    </div>
                    <h3 className="animate-fade-up text-balance text-lg tracking-tight text-gray-400 opacity-0 [--animation-delay:80ms] pt-2 text-center font-medium md:text-2xl sm:text-1xl">
                      Drop your files here
                    </h3>
                  </>
                ) : (
                  <>
                    <div className="text-balance tracking-tight text-gray-400 justify-center flex text-5xl">
                      <FiUpload />
                    </div>
                    <h6 className="animate-fade-up text-balance text-lg tracking-tight text-gray-400 opacity-0 [--animation-delay:200ms] pt-2 text-center font-medium md:text-2xl sm:text-1xl hidden md:block">
                      Drag & Drop to Upload Files or Click here
                    </h6>
                    <h6 className="animate-fade-up text-balance text-lg tracking-tight text-gray-400 opacity-0 [--animation-delay:200ms] pt-2 text-center font-medium md:text-2xl sm:text-1xl block md:hidden">
                      Select Files
                    </h6>
                  </>
                )}
              </div>
            </div>
          )}
        </ReactDropzone>
      </div>
    </div>
  );
}
