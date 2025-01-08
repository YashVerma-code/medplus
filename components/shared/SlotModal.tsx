"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThreeDots } from "react-loader-spinner";
import { useToast } from "../ui/use-toast";


export function SlotModal({ docId,onUpdate }: 
  {docId:string;
    onUpdate: () => void;
  }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [day, setDay] = useState("");
  const [status,setStatus]=useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch("/api/appointments/add-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, start, end, status,docId}),
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to add slot.");
      }
  
      toast({
        variant: "success",
        title: "Slot successfully added !",
        description: "Available slots are updated.",
        duration: 3000,
      });
      setOpen(false);
      setStart("");
      setEnd("");
      setDay("");
      setStatus("");
      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:error.message || "Failed to load doctors. Please try again.",
        duration: 2000,
      });
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };
  

  return (
    <Dialog  open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-5">
          {loading ? (
            <ThreeDots
              visible={true}
              height="50"
              width="50"
              color="#99a2a3"
              radius="9"
              ariaLabel="three-dots-loading"
            />
          ) : (
            <span >Add new Slot</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] bg-black">
        <DialogHeader>
          <DialogTitle>Edit Slots</DialogTitle>
          <DialogDescription>
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
      <form onSubmit={handleSubmit}>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 mr-2">
              <Label htmlFor="start" className="text-right">
                Start at
              </Label>
              <Input
                id="start"
                value={start}
                onChange={(e)=>setStart(e.target.value)}
                className="col-span-3 bg-black"
                placeholder="Format : NN:NN"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mr-2">
              <Label htmlFor="end" className="text-right">
                End at
              </Label>
              <Input
                id="end"
                value={end}
                onChange={(e)=>setEnd(e.target.value)}
                className="col-span-3 bg-black"
                placeholder="Format : NN:NN"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mr-2">
              <Label htmlFor="day" className="text-right">
                Day
              </Label>
              <select
                id="day"
                name="day"
                value={day}
                onChange={(e)=>setDay(e.target.value)}
                className="col-span-3 p-2 border rounded-md bg-black"
              >
                <option value="" disabled>
                    Select a day
                  </option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mr-2">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={status}
                onChange={(e)=>setStatus(e.target.value)}
                className="col-span-3 p-2 border rounded-md bg-black"
              >
                <option value="unavailable">Not Available</option>
                <option value="available" selected>Available</option>
                <option value="booked">Booked</option>
              </select>
            </div>
          </div>
        </ScrollArea>

         {/* Submit Button */}
         <DialogFooter className="mt-2 md:mr-6">
            <Button type="submit" onSubmit={handleSubmit}>
            {loading ? (
            <ThreeDots
            visible={true}
            height="50"
            width="50"
            color="#99a2a3"
            radius="9"
            ariaLabel="three-dots-loading"
          />
          ):(
            <span>Save Changes</span> 
          )} 
            </Button>
          </DialogFooter>
      </form>
      </DialogContent>
    </Dialog>
  );
}
