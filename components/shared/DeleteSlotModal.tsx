"use client";
import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThreeDots } from "react-loader-spinner";
import { useToast } from "../ui/use-toast";

export function DeleteSlotModal({ docId ,onUpdate}: { docId: string; onUpdate: () => void;}) {
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState<Slot | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState<Slot[]>([]);
  const [isSlotUpdating, setSlotUpdating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Slot: ", slot);
      const { start, end } = slot || {};
      console.log("Sending values : ", start, end, docId, day);
      const response = await fetch("/api/appointments/remove-slot", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, start, end, docId }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to add slot.");
      }

      toast({
        variant: "success",
        title: "Slot successfully removed !",
        description: "Slot has been removed from the database.",
        duration: 3000,
      });
      setOpen(false);
      setSlot(null);
      setDay("");
      onUpdate(); 
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to load doctors. Please try again.",
        duration: 2000,
      });
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  // Fetching available slots
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!docId || !day) {
        return;
      }

      try {
        setSlotUpdating(true);
        const response = await fetch(
          `/api/appointments/get-available-slots?id=${docId}&day=${day}`
        );
        // console.log("Response : ", r.error);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch available slots."
          );
        }
        const { availableSlots } = await response.json();
        setTimeSlots(availableSlots || []);
      } catch (error: any) {
        console.log("Error fetching slots:", error.error);
        toast({
          variant: "destructive",
          title: error.message || "Error in loading slots",
          description: "Failed to load available slots. Please try again.",
          duration: 3000,
        });
        setTimeSlots([]);
      } finally {
        setSlotUpdating(false);
      }
    };

    fetchAvailableSlots();
  }, [docId, day]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-5" disabled={loading}>
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
            <span>Remove Slot</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] bg-black">
        <DialogHeader>
          <DialogTitle>Remove Slots</DialogTitle>
          <DialogDescription>
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4 mr-2">
                <Label htmlFor="day" className="text-right">
                  Day:
                </Label>
                <select
                  id="day"
                  name="day"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
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
                <Label htmlFor="slot" className="text-right">
                  Select slot:
                </Label>
                {isSlotUpdating ? (
                  <ThreeDots
                    visible={true}
                    height="50"
                    width="50"
                    color="#2fe0d8"
                  />
                ) : (
                  <select
                    id="slot"
                    name="slot"
                    value={slot ? JSON.stringify(slot) : ""}
                    onChange={(e) => setSlot(JSON.parse(e.target.value))}
                    className="col-span-3 p-2 border rounded-md bg-black"
                  >
                    <option value="" disabled>
                      {docId && day ? "Select a slot" : "Select a day first"}
                    </option>
                    {timeSlots
                      .sort((a, b) => a.start.localeCompare(b.start)) // Sort by start time
                      .map((timeSlot, index) => (
                        <option
                          key={index}
                          value={JSON.stringify({
                            start: timeSlot.start,
                            end: timeSlot.end,
                          })}
                        >
                          {timeSlot.start} - {timeSlot.end}
                        </option>
                      ))}
                  </select>
                )}
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
              ) : (
                <span>Cancel Slot</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
