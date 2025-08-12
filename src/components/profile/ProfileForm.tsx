"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
  PixelCrop
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { UploadCloud } from "lucide-react";
import api from "@/utils/api";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  avatarUrl: z.string().optional() // Optional since it’s handled via FormData
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  initialData: {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
  };
}

function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return Promise.reject(new Error("Canvas context not found"));

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("Image crop failed");
      }
      resolve(blob);
    }, "image/png");
  });
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
    mode: "onChange"
  });

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setIsCropModalOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current) {
      try {
        const blob = await getCroppedImg(imgRef.current, completedCrop);
        const previewUrl = URL.createObjectURL(blob);
        form.setValue("avatarUrl", previewUrl);
        setCroppedImageBlob(blob);
        setIsCropModalOpen(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Cropping Error",
          description: "Could not crop the image"
        });
      }
    }
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, 1, width, height),
      width,
      height
    );
    setCrop(crop);
  }

  async function onSubmit(data: ProfileFormValues) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    // formData.append("role", ); // Optional, static for now

    if (croppedImageBlob) {
      formData.append("avatar", croppedImageBlob, "avatar.png");
    }

    try {
      await api.put(`/auth/users/${initialData.id}`, formData); // Replace `1` with dynamic user ID if available
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved."
      });
      router.push("/profile");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was a problem saving your changes."
      });
    }
  }

  // const BASE_URL = "http://localhost:5000";

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Alex Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="e.g., alex@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Image
                          // src={field.value || "/fallback-image.jpg"}
                          src={
                              field.value?.startsWith("/assets")
                                ? `${process.env.NEXT_PUBLIC_BASE_URL}${field.value}`
                                : field.value || "https://placehold.co/128x128?text=User"
                              }
                          alt="Avatar"
                          width={80}
                          height={80}
                          className="rounded-full"
                        />
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <UploadCloud className="mr-2" />
                          Upload new photo
                        </Button>
                        <Input
                          type="file"
                          ref={fileInputRef}
                          onChange={onSelectFile}
                          className="hidden"
                          accept="image/*"
                        />
                        <Input type="hidden" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>

      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crop your new photo</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                minWidth={128}
                minHeight={128}
              >
                <img
                  ref={imgRef}
                  alt="Crop"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  className="w-full"
                />
              </ReactCrop>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button variant="ghost" onClick={() => setIsCropModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCropComplete}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
