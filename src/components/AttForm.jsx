import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CryptoJS from "crypto-js";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BarLoader, BeatLoader } from "react-spinners";
import Turnstile from "react-turnstile";
import { FaCheck } from "react-icons/fa6";

const formSchema = z.object({
  att_code: z.string().length(8, {
    message: "Enter the eight chars long code sent to your email.",
  }),
});

export function AttForm({ page, setAttendedTeam, setIsAlreadyMarked }) {
  const [loading, setLoading] = useState(false);
  // const [token, setToken] = useState("");
  const [downloadingIndex, setDownloadingIndex] = useState(null);
  const [team, setTeam] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      att_code: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    const att_code = values.att_code;
    // if (token === "") {
    //     toast.error("Verifying that you're not a robot.");
    //     return;
    // }
    if (page === "Attendance") {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // fast coordinates
          const latitude = 24.8569039, longitude = 67.2621089;
          // const { latitude, longitude } = position.coords;
          const encryptionKey = import.meta.env.VITE_COORDS_ENCRYPTION_KEY;
          const coordinates = { latitude, longitude };
          const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(coordinates), encryptionKey).toString();
          // try{
          //   const participantData = {
          //     team_info: "",
          //     team_name: "myteam",
          //     vjudge_username: "",
          //     competitionName: "",
          //     leader_name: "",
          //     leader_email: "",
          //     leader_section: "",
          //     leader_cnic: "",
          //     leader_phone: "",
          //     member1_name: "",
          //     member1_email: "",
          //     member1_section: "",
          //     member2_name: "",
          //     member2_email: "",
          //     member2_section: "",
          //     att_code,
          //     attendance: false,
          //   };

          //   const res = await axios.post(
          //     `${import.meta.env.VITE_BACKEND_URL}/api/attendance/participant-create`,
          //     participantData
          //   );

          //   // optional: log or notify about creation
          //   if (res && res.data && res.data.message) {
          //     console.log("Participant created:", res.data.message);
          //   }
          // } catch (error) {
          //   // handle error silently
          //   console.error("Error creating participant:", error);
          // }
          try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/attendance/mark`, {
              att_code,
              coordinates: ciphertext
            });
            toast.success(response.data.message);
            setAttendedTeam(response.data.team);
          } catch (error) {
            if (error.response) {
              const { status, data } = error.response;
              if (status || data.attendanceAlreadyMarked) {
                toast.error(data.message);
                setIsAlreadyMarked(true);
                setAttendedTeam(data.team);
              } else {
                toast.error(data.message);
                console.error("API Error:", data.message);
              }
            } else if (error.request) {
              toast.error("No response from server");
              console.error("No response from server:", error.request);
            } else {
              toast.error("Error setting up request: " + error.message);
              console.error("Error setting up request:", error.message);
            }
          } finally {
            setLoading(false);
          }
        },
        (geoError) => {
          toast.error("Geolocation error: " + geoError.message);
          console.error("Geolocation error:", geoError.message);
          setLoading(false);
        }
      );
    } else if (page === "Certificate") {
      // certificate generation logic
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/certificates`, {
          att_code,
        });
        toast.success(response.data.message);
        console.log(response.data.downloadTokens);
        setTeam(response.data.downloadTokens);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
          console.error("API Error:", error.response.data.message);
        } else if (error.request) {
          toast.error("No response from server");
          console.error("No response from server:", error.request);
        } else {
          toast.error("Error setting up request: " + error.message);
          console.error("Error setting up request:", error.message);
        }
      } finally {
        setLoading(false);
      }
    }
  }

  const downloadCertificate = async (downloadUrl, memberName, index) => {
    setDownloadingIndex(index);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}${downloadUrl}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      let fileName = `${memberName}-certificate.pdf`;
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error.response && error.response.data) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorObj = JSON.parse(reader.result);
            toast.error(errorObj.message || "Certificate download error");
          } catch (e) {
            toast.error("Certificate download error");
          }
        };
        reader.readAsText(error.response.data);
      } else {
        toast.error("Error downloading certificate");
      }
    } finally {
      setDownloadingIndex(null);
    }
  };


  if (team.length > 0) {
    return (
      <div className="w-full flex flex-col gap-4 z-10 relative">
        <h2 className="text-xl font-bold text-[#930000]">Click to download certificates</h2>
        <div className="w-full max-h-[50vh] overflow-y-auto flex gap-3 flex-wrap justify-center border-t-2 pt-5 pb-2 border-[#930000]/30">
          {team.map((member, index) => (
            <button
              key={index}
              onClick={() => downloadCertificate(member.downloadUrl, member.memberName, index)}
              className="flex bg-[#930000] text-[#FEFEEA] rounded-lg items-center justify-center text-sm font-semibold px-4 py-3 cursor-pointer min-w-[150px] sm:w-[200px] w-full hover:bg-[#7a0000] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              disabled={downloadingIndex === index}
            >
              {downloadingIndex === index ? (
                <span className="flex gap-2 items-center">
                  <div className="w-4 h-4 border-2 border-[#FEFEEA] border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </span>
              ) : (
                member.memberName
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col gap-4 z-10 relative">
      <FormField
        className="w-full"
        control={form.control}
        name="att_code"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input 
                placeholder="Enter 7-character code" 
                {...field} 
                maxLength={8}
                className="w-full px-6 py-3 rounded-lg border-3 border-[#930000] bg-[#FEFEEA]/80 backdrop-blur-sm text-black placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-[#930000]/30 font-medium text-lg shadow-inner"
              />
            </FormControl>
            <FormMessage className="text-[#930000] text-sm mt-2 font-medium" />
          </FormItem>
        )}
      />

      <Button
        type="submit"
        className="w-full px-6 py-5 bg-[#930000] text-[#FEFEEA] rounded-lg font-bold text-lg hover:bg-[#7a0000] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        disabled={loading}
      >
        {loading ? (
          <span className="flex gap-2 items-center justify-center">
            <div className="w-5 h-5 border-3 border-[#FEFEEA] border-t-transparent rounded-full animate-spin"></div>
            Loading...
          </span>
        ) : page === "Attendance" ? (
          "Mark as Present"
        ) : (
          "Get Certificate"
        )}
      </Button>
    </form>
  </Form>
);
}
