"use client";
import { Button } from "@/components/ui/button";
import { getAllProposedSlots, ProposeSlots } from "@/services/apiServices";
import { getCurrentUser } from "@/services/authServices";
import moment from "moment-timezone";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CiBookmark, CiBookmarkCheck } from "react-icons/ci";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { LuArrowDownUp } from "react-icons/lu";
import { MdDeleteForever, MdOutlineEventNote } from "react-icons/md";
import { Edit } from "../propeseSession/Edit";
import { ProposeButton } from "../propeseSession/ProposeButton";
import { User } from "../signup/SignUpTab";
import DashBoardCard from "./DashBoardCard";
import Filter from "./Filter";
import ProposeSession from "./ProposeSession";

function Dashboard() {
  const currentPath = usePathname();
  const [currentUser, setCurrentUser] = useState<User>();
  const [proposeButton, setProposeButton] = useState(false);
  const [proposeData, setProposeData] = useState<ProposeSlots[]>([]);
  const [getPropossedData, setGetPropossedData] = useState<ProposeSlots[]>([]);
  const [startTimeArray, setStartTimeArray] = useState<string[]>([]);

  const getAllProposedSession = async () => {
    try {
      const result: ProposeSlots[] = await getAllProposedSlots();
      setGetPropossedData(result);

      setStartTimeArray(result.map((el) => el.startTime).flat());
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = () => {};

  useEffect(() => {
    getAllProposedSession();
  }, [proposeData]);

  useEffect(() => {
    const currentUserFn = async () => {
      try {
        const curUser = await getCurrentUser();
        setCurrentUser(curUser);
      } catch (error) {
        console.log(error);
      }
    };
    currentUserFn();
  }, []);

  return (
    <div className="h-[100vh] bg-[#1a1c1f] ">
      <nav className=" bg-[#1a1c1f]">
        <ul className="flex justify-center text-white p-4 border-b-2 border-solid border-[#3f4146] space-x-14  ">
          <li
            className={
              currentPath === "/interviewdashboard/dashboard"
                ? "bg-[#1b2626] text-[#28c9a1] flex justify-center items-center p-2 rounded-xl"
                : "flex justify-center items-center  hover:bg-[#222726]   p-2 rounded-xl"
            }
          >
            <CiBookmarkCheck className="mr-2" />
            <Link href="/interviewdashboard/dashboard"> Book sessions</Link>
          </li>
          <li className="flex justify-center items-center  hover:bg-[#222726]   p-2 rounded-xl">
            <CiBookmark className="mr-2" /> <Link href="#"> My sessions </Link>
          </li>
          <li className="flex justify-center items-center  hover:bg-[#222726]   p-2 rounded-xl">
            <MdOutlineEventNote className="mr-2" />
            <Link href="#"> Interview guides </Link>
          </li>
          <li className="flex justify-center items-center  hover:bg-[#222726]   p-2 rounded-xl">
            <LuArrowDownUp className="mr-2" />
            <Link href="#"> My performance </Link>
          </li>
        </ul>
      </nav>

      {!proposeButton ? (
        <div>
          <div className="m-8 flex flex-col space-y-6 ">
            <div className="text-white text-2xl font-semibold ">
              Welcome {currentUser?.firstName}
              <p className="text-sm font-extralight">
                {" "}
                a brief summary before you book your next session
              </p>
            </div>
            <DashBoardCard />
          </div>

          <div className="flex m-8 bg-[#1a1c1f]  border-t-2 border-solid border-[#3f4146]  text-white">
            <div className="w-[25%] border-r-2 border-[#3f4146]  pr-2">
              <div className="p-2">
                <Filter />
              </div>
            </div>

            <div className="w-[100%] flex flex-col gap-4 ">
              <ProposeSession setProposeButton={setProposeButton} />
              <div className="p-2 flex justify-between border-b-2 border-[#3f4146]">
                <p>Book Session</p>
                <p>0 Available sessions</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className=" bg-[#1a1c1f] ">
          <div className="text-white m-20 flex flex-col gap-y-20">
            <Link
              onClick={() => setProposeButton(false)}
              className="flex items-center border-b-2 border-solid border-[#3f4146] pb-4"
              href="/interviewdashboard/dashboard"
            >
              <FaLongArrowAltLeft className="mr-2 text-green-400" /> Back to
              book sessions
            </Link>
          </div>

          <div className="w-full flex justify-center">
            <div className="text-centern pb-5 flex flex-col gap-8 w-[50%] ">
              <ProposeButton setProposeData={setProposeData} />
              <div className="text-white flex justify-between">
                <p>Availabilities ({getPropossedData.length})</p>
                <p>
                  {getPropossedData.length > 0
                    ? getPropossedData[0].timezone
                    : ""}
                </p>
              </div>

              {startTimeArray.map((el, index) => {
                const startTime = moment(el);
                const endTime = moment(startTime)
                  .add(1, "hour")
                  .add(30, "minutes");
                return (
                  <div
                    key={index}
                    className="text-white bg-[#292b2e] rounded-lg flex justify-between p-4 items-center"
                  >
                    <div>{`${startTime.format("HH:mm")} - ${endTime.format(
                      "HH:mm"
                    )} , ${startTime.format("MMMM DD, YYYY")}`}</div>

                    <div className="w-fit flex items-center">
                      <Edit />
                      <Button
                        className="bg-[[#3f4146]] text-lg"
                        variant="default"
                      >
                        <MdDeleteForever className="w-8 h-5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
