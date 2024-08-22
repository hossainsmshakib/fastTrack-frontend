import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { proposeSlot, ProposeSlots } from "@/services/apiServices";
import moment from "moment-timezone";
import { DatePickerForm } from "./DatePickerPropose";

interface Props {
  setProposeData: React.Dispatch<React.SetStateAction<ProposeSlots[]>>;
}

export interface SlotInterface {
  date?: Date;
  startTime?: string;
  endTime?: string;
}

export function ProposeButton({ setProposeData }: Props) {
  const timezones = moment.tz.names().map((tz) => {
    const offset = moment.tz(tz).format("Z");
    return {
      city: tz,
      gmt: `GMT ${offset}`,
    };
  });

  const times: string[] = [];
  for (let i = 0; i <= 30 * 22.5 * 2; i += 30) {
    times.push(moment().startOf("day").add(i, "minute").format("HH:mm"));
  }

  const [slots, setSlots] = useState<SlotInterface[]>([{}]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  // const [proposeData, setProposeData] = useState<ProposeSlots[]>([]);

  const handleSubmit = async () => {
    const data = {
      timezone: selectedTimezone,
      startTime: slots.map((el) => {
        const parsedStartTime = moment(el.startTime, "HH:mm");
        return moment(el.date)
          .set({
            hour: parsedStartTime.hour(),
            minute: parsedStartTime.minute(),
          })
          .toISOString();
      }),
    };
    const proposedData = await proposeSlot(data);

    setProposeData((prevData: ProposeSlots[]) => [...prevData, proposedData]);
    setIsOpen(false);
  };

  const addSlot = () => {
    setSlots([...slots, {}]);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((val, i) => i !== index));
  };

  const setSlotsValue = (value: Partial<SlotInterface>, index: number) => {
    setSlots((prevValue) => {
      const currVal = prevValue[index];
      return [...prevValue.toSpliced(index, 1, { ...currVal, ...value })];
    });
  };

  const shouldBeDisbaled = (index: number, startTimeValue: string) => {
    if (index > 0 && slots[index - 1] && slots[index - 1].endTime) {
      const parsedTime = moment(startTimeValue, "HH:mm");

      const prevParsedTime = moment(slots[index - 1].endTime, "HH:mm");
      let lastSlotEndTime = moment(slots[index - 1].date).set({
        hour: prevParsedTime.hour(),
        minute: prevParsedTime.minute(),
      });
      if (slots[index - 1].endTime === "00:00") {
        lastSlotEndTime = lastSlotEndTime.add(1, "day");
      }
      return moment(slots[index].date)
        .set({
          hour: parsedTime.hour(),
          minute: parsedTime.minute(),
        })
        .isBefore(lastSlotEndTime);
    }
    return false;
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSlots([{}]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="bg-[#3dd7a1] text-black rounded-lg p-6"
          variant="outline"
        >
          Propose new session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Propose Session</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-y-4 py-4">
          <div className="flex flex-col gap-y-4 ">
            <Label htmlFor="timezone">Timezone</Label>
            <Select onValueChange={(value) => setSelectedTimezone(value)}>
              <SelectTrigger className="">
                <SelectValue placeholder="Please select timezone by city" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((timezone, index) => (
                  <SelectItem key={index} value={timezone.city}>
                    {`${timezone.city} (${timezone.gmt})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-center">
            Each meeting slot is allocated a duration of 1.5 hours
          </p>

          {slots.map((slot, index) => (
            <div key={index} className="flex flex-col gap-y-4 py-4">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <Label className="flex justify-between items-center">
                    Add a date
                  </Label>
                  {index !== 0 && (
                    <Button onClick={() => removeSlot(index)} className="w-fit">
                      Remove
                    </Button>
                  )}
                </div>
                <DatePickerForm
                  minDate={moment(slots[index - 1]?.date)}
                  setDate={(date) => {
                    setSlotsValue({ date }, index);
                  }}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-4">
                  <Select
                    disabled={!slot.date}
                    onValueChange={(val) => {
                      const payload = {
                        startTime: val,
                        endTime: moment(val, "HH:mm")
                          .add(90, "minutes")
                          .format("HH:mm"),
                      };
                      setSlotsValue(payload, index);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Start Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {times.map((val, idx) => (
                        <SelectItem
                          disabled={shouldBeDisbaled(index, val)}
                          key={idx}
                          value={val}
                        >
                          {val}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-4">
                  <Input
                    disabled
                    placeholder="End Time"
                    value={slot.endTime || ""}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button onClick={addSlot}>Add another slot</Button>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
